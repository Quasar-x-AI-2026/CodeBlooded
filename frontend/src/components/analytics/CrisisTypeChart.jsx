import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { crisisTypeData } from "@/data/analytics/crisisTypes";

export default function CrisisTypeChart() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Crisis Type Distribution
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Number of active crises by category
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={crisisTypeData}
            layout="vertical"
            margin={{ left: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
            />

            <XAxis
              type="number"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              dataKey="type"
              type="category"
              tick={{ fill: "var(--foreground)", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "var(--accent-cyan-lighter)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            />

            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              fill="var(--accent-cyan)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
