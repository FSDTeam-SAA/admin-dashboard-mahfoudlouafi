"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  percent: number;
}

export function PerformanceDonut({ percent }: Props) {
  const data = [
    { name: "Complete", value: percent },
    { name: "Remaining", value: 100 - percent }
  ];

  return (
    <div className="relative h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={55}
            outerRadius={70}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill="#e39c3f" />
            <Cell fill="#fde7c6" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-3xl font-semibold text-brand-600">{percent}%</div>
      </div>
    </div>
  );
}
