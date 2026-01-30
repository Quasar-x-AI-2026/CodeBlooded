import CountUp from "@/components/CountNumber";
import { Card } from "@/components/ui/card";

export default function KpiRow({ data }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {data.map((kpi, idx) => (
        <Card
          key={idx}
          className="p-5 bg-[var(--card)] border-[var(--border)]"
        >
          <p className="text-sm text-[var(--muted-foreground)]">
            {kpi.label}
          </p>

          <div className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {kpi.prefix || ""}
            <CountUp to={kpi.value} separator="," />
            {kpi.suffix || ""}
          </div>
        </Card>
      ))}
    </div>
  );
}
