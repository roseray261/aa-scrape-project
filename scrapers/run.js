// -------------------------------------------------------
// Leaderboard Scraper — fetches all configured leaderboards
// Run with:  node run.js
// -------------------------------------------------------

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load .env from the project root (one level above scrapers/).
// In GitHub Actions there's no .env file — the key comes from a
// GitHub Secret instead, so we don't fail if the file is missing.
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const apiKey = process.env.AA_API_KEY;

if (!apiKey || apiKey === "paste-your-actual-key-here") {
  console.error("ERROR: Please set your API key in the .env file.");
  process.exit(1);
}

// ---- SUPABASE ----
// Connect to Supabase so we can store snapshots in a database.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("ERROR: Please set SUPABASE_URL and SUPABASE_KEY in the .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---- LEADERBOARD REGISTRY ----
// To add a new leaderboard, just add a new { slug, apiUrl } entry here.
// The slug controls the filename and the "leaderboard" field in the JSON.
const LEADERBOARDS = [
  {
    slug: "text-to-image",
    apiUrl: "https://artificialanalysis.ai/api/v2/data/media/text-to-image",
  },
  {
    slug: "image-editing",
    apiUrl: "https://artificialanalysis.ai/api/v2/data/media/image-editing",
  },
  {
    slug: "text-to-video",
    apiUrl: "https://artificialanalysis.ai/api/v2/data/media/text-to-video",
  },
  {
    slug: "image-to-video",
    apiUrl: "https://artificialanalysis.ai/api/v2/data/media/image-to-video",
  },
  {
    slug: "text-to-speech",
    apiUrl: "https://artificialanalysis.ai/api/v2/data/media/text-to-speech",
  },
];

// Fetch one leaderboard from the API
async function fetchLeaderboard(apiUrl) {
  const response = await fetch(apiUrl, {
    headers: { "x-api-key": apiKey },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

// Build the snapshot object (same shape for every leaderboard)
function buildSnapshot(slug, models) {
  return {
    leaderboard: slug,
    fetched_at: new Date().toISOString(),
    model_count: models.length,
    models: models.map((m) => ({
      rank: m.rank,
      name: m.name,
      creator: m.model_creator?.name || "Unknown",
      elo: m.elo,
      ci95: m.ci95 ?? null,
      samples: m.appearances ?? null,
      release_date: m.release_date ?? null,
    })),
  };
}

// Save snapshot to data/<slug>_YYYY-MM-DD.json
function saveSnapshot(slug, snapshot) {
  const today = new Date().toISOString().slice(0, 10);
  const dataDir = path.join(__dirname, "..", "data");
  const filename = `${slug}_${today}.json`;
  const filepath = path.join(dataDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(snapshot, null, 2));
  return filename;
}

// Upload snapshot rows to Supabase
async function uploadToSupabase(slug, snapshot) {
  const today = new Date().toISOString().slice(0, 10);

  // Convert each model into a row for the "snapshots" table
  const rows = snapshot.models.map((m) => ({
    leaderboard: slug,
    fetched_at: today,
    rank: m.rank,
    name: m.name,
    creator: m.creator,
    elo: m.elo,
    ci95: m.ci95,
    samples: m.samples,
    release_date: m.release_date,
  }));

  // upsert = insert new rows, skip if they already exist (based on UNIQUE constraint)
  const { error } = await supabase
    .from("snapshots")
    .upsert(rows, { onConflict: "leaderboard,fetched_at,name" });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  return rows.length;
}

// Print a short summary: model count + top 5 by ELO
function printSummary(slug, snapshot) {
  console.log(`--- ${slug} ---`);
  console.log(`  Models: ${snapshot.model_count}`);
  console.log(`  Top 5:`);
  snapshot.models.slice(0, 5).forEach((m) => {
    console.log(`    #${m.rank}  ${m.name} (ELO: ${m.elo}) — ${m.creator}`);
  });
  console.log();
}

// Run all leaderboards
async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`Fetching ${LEADERBOARDS.length} leaderboards (${today})...\n`);

  for (const { slug, apiUrl } of LEADERBOARDS) {
    const data = await fetchLeaderboard(apiUrl);
    const models = (Array.isArray(data) ? data : data.data || [])
      .filter((m) => m.rank != null)
      .sort((a, b) => a.rank - b.rank);

    const snapshot = buildSnapshot(slug, models);
    const filename = saveSnapshot(slug, snapshot);
    const rowCount = await uploadToSupabase(slug, snapshot);

    printSummary(slug, snapshot);
    console.log(`  Saved to data/${filename}`);
    console.log(`  Uploaded ${rowCount} rows to Supabase\n`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Something went wrong:", err.message);
  process.exit(1);
});
