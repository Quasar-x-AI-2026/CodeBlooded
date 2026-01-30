import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";

import HeroTrendChart from "@/components/analytics/HeroTrendChart";
import CrisisRadarChart from "@/components/analytics/CrisisRadarChart";
import CrisisTypeChart from "@/components/analytics/CrisisTypeChart";
import ResponseTimeChart from "@/components/analytics/ResponseTimeChart";
import AIInsightsPanel from "@/components/analytics/AIInsightsPanel";

export default function Analytics() {
  return (
    /* Soft dashboard canvas */
    <div className="bg-gradient-to-b from-[var(--secondary)] to-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* HEADER */}
        <AnalyticsHeader />

        {/* HERO CHART */}
        <AnalyticsCard title="People Impacted Over Time">
          <ResponseTimeChart />
        </AnalyticsCard>

        {/* SECONDARY ROW */}
        <div className="grid md:grid-cols-2 gap-5">
          <AnalyticsCard title="Fund Distribution & Capability">
            <CrisisRadarChart />
          </AnalyticsCard>

          <AnalyticsCard title="Crisis Type Breakdown">
            <CrisisTypeChart />
          </AnalyticsCard>
        </div>

        {/* FINAL ROW */}
        <div className="grid md:grid-cols-2 gap-5">
          <AnalyticsCard title="Severity & Growth Trend">
            <HeroTrendChart />
          </AnalyticsCard>

          <AnalyticsCard title="AI-Generated Insights">
            <AIInsightsPanel />
          </AnalyticsCard>
        </div>
      </div>
    </div>
  );
}
