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
        <h3 className="text-lg font-semibold text-gray-900">
          Data Table <span className="text-sm font-normal text-gray-500">(copy-pasteable for Think-Cell / Excel)</span>
        </h3>
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Download CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm font-mono">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Date</th>
              {creators.map((creator) => (
                <th key={creator} className="px-3 py-2 text-right font-semibold text-gray-700">
                  {creator}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row) => (
              <tr key={row.date as string} className="hover:bg-gray-50">
                <td className="px-3 py-1.5 text-gray-900">{row.date as string}</td>
                {creators.map((creator) => (
                  <td key={creator} className="px-3 py-1.5 text-right text-gray-700">
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
