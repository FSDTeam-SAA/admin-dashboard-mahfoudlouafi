"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Props {
  labels: string[];
  values: number[];
}

export function StudentGrowthChart({ labels, values }: Props) {
  const data = labels.map((label, index) => ({
    label,
    value: values[index] ?? 0
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="4 8" stroke="#f0d9be" />
          <XAxis dataKey="label" stroke="#9aa3b2" fontSize={12} />
          <YAxis stroke="#9aa3b2" fontSize={12} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#f3a74a"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, stroke: "#f3a74a", fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
