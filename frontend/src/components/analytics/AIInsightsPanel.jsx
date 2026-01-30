import { aiInsights } from "@/data/analytics/aiInsights";
import { AlertTriangle, TrendingUp, Activity } from "lucide-react";

const iconMap = {
  high: AlertTriangle,
  medium: Activity,
  positive: TrendingUp,
};

const colorMap = {
  high: {
    bg: "var(--accent-red-light)",
    text: "var(--accent-red-foreground)",
  },
  medium: {
    bg: "var(--accent-yellow-light)",
    text: "var(--accent-yellow-foreground)",
  },
  positive: {
    bg: "var(--accent-green-light)",
    text: "var(--accent-green-foreground)",
  },
};

export default function AIInsightsPanel() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          AI Insights
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Actionable intelligence generated from real-time data
        </p>
      </div>

      {/* Insights */}
      <div className="space-y-4">
        {aiInsights.map((insight, index) => {
          const Icon = iconMap[insight.severity];
          const colors = colorMap[insight.severity];

          return (
            <div
              key={index}
              className="flex gap-4 rounded-xl p-4 border border-[var(--border)]"
              style={{ backgroundColor: colors.bg }}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ color: colors.text }}
              >
                <Icon size={20} />
              </div>

              <div className="space-y-1">
                <p
                  className="font-medium"
                  style={{ color: colors.text }}
                >
                  {insight.title}
                </p>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
