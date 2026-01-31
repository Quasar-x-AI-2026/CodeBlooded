import { useState, useEffect } from "react";
import KPICard from "./KPICard";
import Stagger from "./Stagger";

export default function KPISection() {
  const [stats, setStats] = useState({
    ngoCount: 0,
    activeCrisisCount: 0,
    fundsMobilized: 0,
    estimatedPeopleImpacted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/analytics/dashboard`
        );
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setStats({
              ngoCount: json.data.ngoCount || 0,
              activeCrisisCount: json.data.activeCrisisCount || 0,
              fundsMobilized: json.data.fundsMobilized || 0,
              estimatedPeopleImpacted: json.data.estimatedPeopleImpacted || 0,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="grid grid-cols-4 gap-5 px-6 mt-6">
      <Stagger baseDelay={0.5}>
        <KPICard
          label="NGOs Connected"
          value={loading ? "..." : stats.ngoCount}
          variant="cyan"
        />

        <KPICard
          label="Active Crisis Zones"
          value={loading ? "..." : stats.activeCrisisCount}
          variant="blue"
        />

        <KPICard
          label="Funds Mobilized"
          value={loading ? "..." : Math.round(stats.fundsMobilized)}
          prefix="₹"
          variant="green"
        />

        <KPICard
          label="People Potentially Impacted"
          value={loading ? "..." : stats.estimatedPeopleImpacted}
          variant="indigo"
        />
      </Stagger>
    </section>
  );
}
