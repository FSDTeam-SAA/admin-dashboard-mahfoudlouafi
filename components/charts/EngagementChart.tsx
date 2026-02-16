"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Props {
  labels: string[];
  totalTasks: number[];
  completedTasks: number[];
}

export function EngagementChart({ labels, totalTasks, completedTasks }: Props) {
  const data = labels.map((label, index) => ({
    label,
    total: totalTasks[index] ?? 0,
    completed: completedTasks[index] ?? 0
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="totalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7e99b" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#f7e99b" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c7d623" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#c7d623" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 8" stroke="#f0d9be" />
          <XAxis dataKey="label" stroke="#9aa3b2" fontSize={12} />
          <YAxis stroke="#9aa3b2" fontSize={12} />
          <Tooltip />
          <Area type="monotone" dataKey="total" stroke="#f2d35b" fill="url(#totalFill)" />
          <Area type="monotone" dataKey="completed" stroke="#b9cc1c" fill="url(#completedFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
