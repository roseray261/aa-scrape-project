import type { Snapshot } from "@/lib/supabase";

interface Props {
  models: Snapshot[];
}

export default function LeaderboardTable({ models }: Props) {
  if (models.length === 0) {
    return <p className="text-gray-600">No models found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Rank</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Model</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Creator</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">ELO</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">95% CI</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Samples</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Released</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {models.map((model) => (
            <tr key={`${model.rank}-${model.name}`} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-900 font-medium">{model.rank}</td>
              <td className="px-4 py-2 text-gray-900">{model.name}</td>
              <td className="px-4 py-2 text-gray-600">{model.creator ?? "Unknown"}</td>
              <td className="px-4 py-2 text-right text-gray-900 font-mono">{model.elo}</td>
              <td className="px-4 py-2 text-right text-gray-500 font-mono">{model.ci95}</td>
              <td className="px-4 py-2 text-right text-gray-600 font-mono">
                {model.samples?.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-gray-500">{model.release_date ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
