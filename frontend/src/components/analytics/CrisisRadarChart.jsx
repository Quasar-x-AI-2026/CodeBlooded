import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { crisisRadarData } from "@/data/analytics/crisisRadar";

export default function CrisisRadarChart() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Crisis Intelligence Overview
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Multi-dimensional performance assessment
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={crisisRadarData}>
            <PolarGrid
              stroke="var(--border)"
              radialLines
            />

            <PolarAngleAxis
              dataKey="metric"
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 10,
              }}
            />

            <Radar
              dataKey="value"
              stroke="var(--accent-cyan)"
              fill="var(--accent-cyan)"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
