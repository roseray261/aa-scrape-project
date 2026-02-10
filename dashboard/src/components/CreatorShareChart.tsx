"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CreatorShareRow } from "@/lib/chart-utils";

// 20 distinct colors for stacked bars
const COLORS = [
  "#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea",
  "#0891b2", "#e11d48", "#65a30d", "#c026d3", "#ea580c",
  "#4f46e5", "#059669", "#d97706", "#7c3aed", "#0284c7",
  "#94a3b8",
];

interface Props {
  rows: CreatorShareRow[];
  creators: string[];
}

export default function CreatorShareChart({ rows, creators }: Props) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {creators.map((creator, i) => (
            <Bar
              key={creator}
              dataKey={creator}
              stackId="share"
              fill={COLORS[i % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
