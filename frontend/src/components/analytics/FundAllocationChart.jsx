import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { fundAllocationData } from "@/data/analytics/fundAllocation";

export default function FundAllocationChart() {
  const total = fundAllocationData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Fund Allocation
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Distribution of funds across relief categories
        </p>
      </div>

      {/* Chart */}
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={fundAllocationData}
              dataKey="value"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={3}
              stroke="none"
            >
              {fundAllocationData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>

            {/* Center label */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <tspan
                x="50%"
                dy="-4"
                className="fill-[var(--foreground)] text-xl font-semibold"
              >
                {total}%
              </tspan>
              <tspan
                x="50%"
                dy="18"
                className="fill-[var(--muted-foreground)] text-xs"
              >
                Utilized
              </tspan>
            </text>

            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-3">
        {fundAllocationData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[var(--foreground)]">
                {item.name}
              </span>
            </div>
            <span className="text-[var(--muted-foreground)]">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
