"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ChartDataPoint } from "@/types/database";

interface HoursBarChartProps {
  data: ChartDataPoint[];
  onBarClick: (date: string) => void;
}

export function HoursBarChart({ data, onBarClick }: HoursBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="displayDate"
          tick={{ fontSize: 12, fill: "var(--muted)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--muted)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          label={{
            value: "Hours",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: "var(--muted)" },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "14px",
          }}
          formatter={(value) => [`${Number(value).toFixed(1)} hrs`, "Hours"]}
          labelFormatter={(label) => String(label)}
        />
        <Bar
          dataKey="hours"
          radius={[4, 4, 0, 0]}
          cursor="pointer"
          onClick={(_data, index) => {
            if (index !== undefined && data[index]) {
              onBarClick(data[index].date);
            }
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.hours > 0 ? "var(--primary)" : "var(--border)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
