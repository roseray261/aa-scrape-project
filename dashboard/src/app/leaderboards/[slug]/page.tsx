import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { getLeaderboardBySlug } from "@/lib/leaderboards";
import { computeCreatorShares, chartDataToCsv } from "@/lib/chart-utils";
import type { Snapshot } from "@/lib/supabase";
import LeaderboardTable from "@/components/LeaderboardTable";
import CreatorShareSection from "@/components/CreatorShareSection";

export const dynamic = "force-dynamic";

const TIMEFRAME_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ timeframe?: string }>;
}

export default async function LeaderboardPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { timeframe: timeframeParam } = await searchParams;

  const leaderboard = getLeaderboardBySlug(slug);
  if (!leaderboard) notFound();

  const timeframe = timeframeParam && timeframeParam in TIMEFRAME_DAYS
    ? timeframeParam
    : "30d";
  const days = TIMEFRAME_DAYS[timeframe];

  const supabase = getSupabase();

  // Fetch latest snapshot date for this leaderboard
  const { data: latestRow } = await supabase
    .from("snapshots")
    .select("fetched_at")
    .eq("leaderboard", slug)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .single();

  if (!latestRow) {
    return (
      <div>
        <Link href="/" className="text-blue-600 hover:underline text-sm">&larr; Back to leaderboards</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">{leaderboard.name}</h1>
        <p className="text-gray-600">No data available yet. Check back after the scraper has run.</p>
      </div>
    );
  }

  const latestDate = latestRow.fetched_at.slice(0, 10);

  // Fetch latest snapshot models
  const { data: latestModels } = await supabase
    .from("snapshots")
    .select("*")
    .eq("leaderboard", slug)
    .eq("fetched_at", latestDate)
    .order("rank", { ascending: true });

  // Fetch historical data for chart (within timeframe)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = cutoffDate.toISOString().slice(0, 10);

  const { data: historicalData } = await supabase
    .from("snapshots")
    .select("*")
    .eq("leaderboard", slug)
    .gte("fetched_at", cutoffStr)
    .order("fetched_at", { ascending: true })
    .order("rank", { ascending: true });

  const snapshots = (historicalData ?? []) as Snapshot[];

  // Count unique dates to decide whether to show chart
  const uniqueDates = new Set(snapshots.map((s) => s.fetched_at.slice(0, 10)));
  const hasEnoughData = uniqueDates.size >= 2;

  const chartData = hasEnoughData ? computeCreatorShares(snapshots) : null;
  const csvString = chartData ? chartDataToCsv(chartData) : null;

  return (
    <div>
      <Link href="/" className="text-blue-600 hover:underline text-sm">&larr; Back to leaderboards</Link>
      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">{leaderboard.name}</h1>
      <p className="text-gray-600 mb-6">Latest snapshot: {latestDate}</p>

      <LeaderboardTable models={(latestModels ?? []) as Snapshot[]} />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Creator Share Over Time</h2>

        {/* Timeframe buttons */}
        <div className="flex gap-2 mb-6">
          {Object.keys(TIMEFRAME_DAYS).map((tf) => (
            <Link
              key={tf}
              href={`/leaderboards/${slug}?timeframe=${tf}`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tf === timeframe
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tf}
            </Link>
          ))}
        </div>

        {hasEnoughData && chartData ? (
          <CreatorShareSection
            rows={chartData.rows}
            creators={chartData.creators}
            csvString={csvString!}
          />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600">
              Not enough data yet. The chart will appear once there are at least 2 days of snapshots.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Currently tracking {uniqueDates.size} day{uniqueDates.size !== 1 ? "s" : ""} of data.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
