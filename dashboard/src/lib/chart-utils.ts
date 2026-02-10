import type { Snapshot } from "./supabase";

export interface CreatorShareRow {
  date: string;
  [creator: string]: string | number;
}

export interface ChartData {
  rows: CreatorShareRow[];
  creators: string[];
}

function normalizeCreator(creator: string | null): string {
  if (!creator) return "Unknown";
  const trimmed = creator.trim();
  return trimmed || "Unknown";
}

/**
 * Compute creator share % for each date.
 * - For each day, take Top N models (N = min(20, model_count))
 * - Compute creator share % (e.g. Google has 2 of 20 = 10%)
 * - Keep top 15 creators globally, bucket rest into "Other"
 */
export function computeCreatorShares(snapshots: Snapshot[]): ChartData {
  // Group snapshots by date
  const byDate = new Map<string, Snapshot[]>();
  for (const snap of snapshots) {
    const date = snap.fetched_at.slice(0, 10); // YYYY-MM-DD
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date)!.push(snap);
  }

  // Sort dates chronologically
  const dates = [...byDate.keys()].sort();

  // Track global creator totals to determine top 15
  const globalCounts = new Map<string, number>();

  // For each date, compute creator counts from top N models
  const dailyShares = new Map<string, Map<string, number>>();

  for (const date of dates) {
    const models = byDate.get(date)!.sort((a, b) => a.rank - b.rank);
    const topN = Math.min(20, models.length);
    const topModels = models.slice(0, topN);

    const creatorCounts = new Map<string, number>();
    for (const model of topModels) {
      const creator = normalizeCreator(model.creator);
      creatorCounts.set(creator, (creatorCounts.get(creator) || 0) + 1);
      globalCounts.set(creator, (globalCounts.get(creator) || 0) + 1);
    }

    // Convert counts to percentages
    const creatorPcts = new Map<string, number>();
    for (const [creator, count] of creatorCounts) {
      creatorPcts.set(creator, Math.round((count / topN) * 100 * 10) / 10);
    }
    dailyShares.set(date, creatorPcts);
  }

  // Determine top 15 creators globally
  const sortedCreators = [...globalCounts.entries()]
    .sort((a, b) => b[1] - a[1]);
  const top15 = new Set(sortedCreators.slice(0, 15).map(([name]) => name));

  // Build rows with top 15 creators + "Other"
  const creators = [...top15].sort();
  const allCreators = [...creators, "Other"];

  const rows: CreatorShareRow[] = dates.map((date) => {
    const pcts = dailyShares.get(date)!;
    const row: CreatorShareRow = { date };

    let otherTotal = 0;
    for (const [creator, pct] of pcts) {
      if (top15.has(creator)) {
        row[creator] = pct;
      } else {
        otherTotal += pct;
      }
    }

    // Fill in zeros for missing creators
    for (const creator of creators) {
      if (row[creator] === undefined) row[creator] = 0;
    }

    row["Other"] = Math.round(otherTotal * 10) / 10;
    return row;
  });

  return { rows, creators: allCreators };
}

/**
 * Convert chart data to CSV string for export.
 */
export function chartDataToCsv(data: ChartData): string {
  const header = ["Date", ...data.creators].join(",");
  const lines = data.rows.map((row) => {
    const values = [row.date, ...data.creators.map((c) => row[c] ?? 0)];
    return values.join(",");
  });
  return [header, ...lines].join("\n");
}
