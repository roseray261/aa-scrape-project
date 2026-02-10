import type { Snapshot } from "@/lib/supabase";

interface Props {
  models: Snapshot[];
}

export default function LeaderboardTable({ models }: Props) {
  if (models.length === 0) {
    return <p className="text-text-secondary">No models found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default">
      <table className="min-w-full divide-y divide-border-default text-sm">
        <thead className="bg-[var(--table-header-bg)]">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-text-secondary">Rank</th>
            <th className="px-4 py-3 text-left font-semibold text-text-secondary">Model</th>
            <th className="px-4 py-3 text-left font-semibold text-text-secondary">Creator</th>
            <th className="px-4 py-3 text-right font-semibold text-text-secondary">ELO</th>
            <th className="px-4 py-3 text-right font-semibold text-text-secondary">95% CI</th>
            <th className="px-4 py-3 text-right font-semibold text-text-secondary">Samples</th>
            <th className="px-4 py-3 text-left font-semibold text-text-secondary">Released</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default bg-bg-surface">
          {models.map((model, i) => (
              <tr
                key={`${model.rank}-${model.name}`}
                className={`hover:bg-bg-elevated ${i % 2 === 1 ? "bg-[var(--table-row-alt)]" : ""}`}
              >
                <td className="px-4 py-2 font-medium text-text-primary">
                  {model.rank}
                </td>
                <td className="px-4 py-2 text-text-primary">{model.name}</td>
                <td className="px-4 py-2 text-text-secondary">{model.creator ?? "Unknown"}</td>
                <td className="px-4 py-2 text-right text-text-primary font-mono">{model.elo}</td>
                <td className="px-4 py-2 text-right text-text-muted font-mono">{model.ci95}</td>
                <td className="px-4 py-2 text-right text-text-secondary font-mono">
                  {model.samples?.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-text-muted">{model.release_date ?? "—"}</td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
