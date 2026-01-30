import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { responseTimeData } from "@/data/analytics/responseTime";

export default function ResponseTimeChart() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Response Time Improvement
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Average response time reduced across recent crises
        </p>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={responseTimeData}>
            <defs>
              <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--accent-green)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--accent-green)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
            />

            <XAxis
              dataKey="week"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              unit="h"
            />

            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="hours"
              stroke="var(--accent-green)"
              strokeWidth={2.5}
              fill="url(#responseGradient)"
              dot={{ r: 4, fill: "var(--accent-green)" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insight footer */}
      <div className="mt-4 text-sm text-[var(--muted-foreground)]">
        ⏱️ Faster response times directly increase survival and relief effectiveness.
      </div>
    </div>
  );
}
