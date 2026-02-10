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

// Grafana categorical palette
const COLORS = [
  "#7eb26d", "#eab839", "#6ed0e0", "#ef843c", "#e24d42",
  "#1f78c1", "#ba43a9", "#705da0", "#508642", "#cca300",
  "#447ebc", "#c15c17", "#890f02", "#0a437c", "#6d1f62",
  "#584477",
];

interface Props {
  rows: CreatorShareRow[];
  creators: string[];
}

export default function CreatorShareChart({ rows, creators }: Props) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-4 shadow-[var(--shadow-card)]">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#8e8ea0" }}
              stroke="rgba(255,255,255,0.08)"
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12, fill: "#8e8ea0" }}
              stroke="rgba(255,255,255,0.08)"
            />
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                backgroundColor: "#212134",
                border: "1px solid #2e2e42",
                borderRadius: "6px",
                color: "#e0e0e0",
              }}
              labelStyle={{ color: "#8e8ea0" }}
              itemStyle={{ color: "#e0e0e0" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#8e8ea0" }} />
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
    </div>
  );
}
