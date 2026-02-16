"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  files: number;
  links: number;
  notes: number;
}

export function ContentPieChart({ files, links, notes }: Props) {
  const data = [
    { name: "Files.Image.Video", value: files, color: "#f28c28" },
    { name: "Links", value: links, color: "#f8b446" },
    { name: "Notes", value: notes, color: "#f2de4d" }
  ];

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={0} outerRadius={70} label>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
