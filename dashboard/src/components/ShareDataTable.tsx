"use client";

import type { CreatorShareRow } from "@/lib/chart-utils";

interface Props {
  rows: CreatorShareRow[];
  creators: string[];
  csvString: string;
}

export default function ShareDataTable({ rows, creators, csvString }: Props) {
  function handleDownload() {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "creator-share.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Data Table <span className="text-sm font-normal text-text-muted">(copy-pasteable for Think-Cell / Excel)</span>
        </h3>
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-md bg-btn-primary-bg text-white text-sm font-medium hover:bg-btn-primary-hover transition-colors"
        >
          Download CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border-default">
        <table className="min-w-full divide-y divide-border-default text-sm font-mono">
          <thead className="bg-[var(--table-header-bg)]">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-text-secondary">Date</th>
              {creators.map((creator) => (
                <th key={creator} className="px-3 py-2 text-right font-semibold text-text-secondary">
                  {creator}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default bg-bg-surface">
            {rows.map((row, i) => (
              <tr
                key={row.date as string}
                className={`hover:bg-bg-elevated ${i % 2 === 1 ? "bg-[var(--table-row-alt)]" : ""}`}
              >
                <td className="px-3 py-1.5 text-text-primary">{row.date as string}</td>
                {creators.map((creator) => (
                  <td key={creator} className="px-3 py-1.5 text-right text-text-secondary">
                    {row[creator] ?? 0}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
