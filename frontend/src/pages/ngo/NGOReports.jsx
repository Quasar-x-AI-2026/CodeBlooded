import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function NGOReports() {
  const { ngoId } = useParams();

  const [ngo, setNgo] = useState(null);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/ngo/report-submission/${ngoId}`
        );

        if (!res.ok) throw new Error();

        const json = await res.json();
        setNgo(json?.data?.ngo ?? null);
        setReports(json?.data?.reports ?? []);
      } catch {
        toast.error("Failed to load NGO reports");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ngoId]);

  const filteredReports = useMemo(() => {
    if (filter === "completed") {
      return reports.filter((r) => r.issueSolved);
    }
    if (filter === "ongoing") {
      return reports.filter((r) => !r.issueSolved);
    }
    return reports;
  }, [reports, filter]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-muted-foreground">
        Loading NGO reports…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* NGO HERO */}
      {ngo && (
        <Card className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div
            className="
              w-16 h-16 rounded-xl
              flex items-center justify-center
              text-2xl font-bold
              bg-[var(--accent-green-lighter)]
              text-[var(--accent-green-foreground)]
            "
          >
            {ngo.name?.[0]}
          </div>

          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold text-foreground">
              {ngo.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {ngo.about}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
              <MapPin className="h-4 w-4" />
              {ngo.address}
            </div>
          </div>

          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">
              Current Fund
            </p>
            <p className="text-xl font-semibold text-foreground">
              ₹ {ngo.currentFund.toLocaleString()}
            </p>
          </div>
        </Card>
      )}

      {/* FILTER BAR */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "All" },
          { key: "completed", label: "Completed" },
          { key: "ongoing", label: "Ongoing" },
        ].map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "secondary"}
            onClick={() => setFilter(f.key)}
            className="rounded-full"
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* REPORTS */}
      {filteredReports.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No reports available for this NGO.
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <Card
              key={report._id}
              className="
                p-6 space-y-4
                hover:shadow-lg hover:-translate-y-1
                transition-all duration-300
              "
            >
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-lg font-semibold text-foreground">
                  {report.title}
                </h3>

                <Badge
                  className={
                    report.issueSolved
                      ? "bg-[var(--accent-green-lighter)] text-[var(--accent-green-foreground)]"
                      : "bg-[var(--accent-yellow-lighter)] text-[var(--accent-yellow-foreground)]"
                  }
                >
                  {report.issueSolved ? "Completed" : "Ongoing"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {report.description}
              </p>

              <div className="flex justify-between text-sm pt-2">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  ₹ {report.capitalUtilised?.toLocaleString() ?? 0}
                </span>

                <span className="flex items-center gap-1 text-muted-foreground">
                  {report.issueSolved ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {new Date(
                    report.issueSolvedAt || report.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
