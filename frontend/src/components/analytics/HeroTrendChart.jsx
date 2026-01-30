import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { heroTrendData } from "@/data/analytics/heroTrend";

export default function HeroTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={heroTrendData}>
        {/* GRADIENT DEFINITION */}
        <defs>
          <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--primary)"
              stopOpacity={0.35}
            />
            <stop
              offset="100%"
              stopColor="var(--primary)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        {/* GRID */}
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "var(--foreground)" }}
        />

        {/* FADED AREA */}
        <Area
          type="monotone"
          dataKey="impacted"
          stroke="var(--primary)"
          strokeWidth={3}
          fill="url(#impactGradient)"
          dot={false}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
