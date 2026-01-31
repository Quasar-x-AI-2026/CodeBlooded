import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import KPISection from "@/components/KPISection";
import PriorityPanel from "@/components/PriorityPanel";
import AISignals from "@/components/AISignals";
import IndiaMap from "@/components/map/IndiaMap";
import FeedsSection from "@/components/FeedsSection";
import SocialFeed from "@/components/SocialFeed";

export default function Dashboard() {
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentIssues = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/crisis/issues`
        );
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.issues) {
            setRecentIssues(json.data.issues.slice(0, 10));
          }
        }
      } catch (err) {
        console.error("Failed to fetch issues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentIssues();
  }, []);

  const getSeverityColor = (severity) => {
    const percent = (severity || 0) * 100;
    if (percent >= 80) return { bg: "#dc262620", text: "#dc2626", label: "Critical" };
    if (percent >= 60) return { bg: "#ea580c20", text: "#ea580c", label: "High" };
    if (percent >= 40) return { bg: "#d9770620", text: "#d97706", label: "Moderate" };
    return { bg: "#05966920", text: "#059669", label: "Low" };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Page Header */}
      <div className="px-6 pt-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Crisis Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Real-time monitoring and analytics for disaster response
        </p>
      </div>

      {/* KPI Cards */}
      <KPISection />

      {/* Feeds Section - Top NGOs & Donors */}
      <div className="px-6 py-4">
        <FeedsSection />
      </div>

      {/* Main Content Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Map and Issues Table */}
          <div className="col-span-8 space-y-6">
            {/* Map Section */}
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold" style={{ color: "var(--card-foreground)" }}>
                  Crisis Map
                </h2>
                <Link 
                  to="/simulator"
                  className="text-sm px-3 py-1.5 rounded-lg transition hover:opacity-80"
                  style={{ 
                    backgroundColor: "var(--primary)", 
                    color: "var(--primary-foreground)" 
                  }}
                >
                  Open Simulator →
                </Link>
              </div>
              <div className="h-[500px] overflow-hidden rounded-xl">
                <IndiaMap />
              </div>
            </div>

            {/* Recent Issues Table */}
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold" style={{ color: "var(--card-foreground)" }}>
                  Recent Crisis Reports
                </h2>
                <Link 
                  to="/ngo/report"
                  className="text-sm px-3 py-1.5 rounded-lg border transition hover:opacity-80"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  Submit Report
                </Link>
              </div>

              {loading ? (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  Loading...
                </p>
              ) : recentIssues.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No recent issues found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted-foreground)" }}>Title</th>
                        <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted-foreground)" }}>Location</th>
                        <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted-foreground)" }}>Type</th>
                        <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted-foreground)" }}>Severity</th>
                        <th className="text-left py-3 px-2 font-medium" style={{ color: "var(--muted-foreground)" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentIssues.map((issue) => {
                        const sevStyle = getSeverityColor(issue.severity);
                        return (
                          <tr 
                            key={issue._id} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            style={{ borderBottom: "1px solid var(--border)" }}
                          >
                            <td className="py-3 px-2 font-medium" style={{ color: "var(--foreground)" }}>
                              {issue.title?.slice(0, 40)}...
                            </td>
                            <td className="py-3 px-2" style={{ color: "var(--muted-foreground)" }}>
                              {issue.aiAnalysis?.location?.name || "Unknown"}
                            </td>
                            <td className="py-3 px-2">
                              <span 
                                className="px-2 py-1 rounded text-xs font-medium capitalize"
                                style={{ 
                                  backgroundColor: issue.type === "disaster" ? "#dc262620" : "#ea580c20",
                                  color: issue.type === "disaster" ? "#dc2626" : "#ea580c"
                                }}
                              >
                                {issue.type}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span 
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{ backgroundColor: sevStyle.bg, color: sevStyle.text }}
                              >
                                {Math.round((issue.severity || 0) * 100)}% {sevStyle.label}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span 
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{ 
                                  backgroundColor: issue.status === "OPEN" ? "#0891b220" : "#05966920",
                                  color: issue.status === "OPEN" ? "#0891b2" : "#059669"
                                }}
                              >
                                {issue.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Priority & AI Signals */}
          <div className="col-span-4 space-y-6">
            <PriorityPanel />
            <AISignals />
            <SocialFeed />

            {/* Quick Actions */}
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h3 className="font-semibold mb-4" style={{ color: "var(--card-foreground)" }}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  to="/ngo/report"
                  className="block w-full text-center py-2.5 rounded-lg font-medium transition hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  📝 Submit New Report
                </Link>
                <Link
                  to="/simulator"
                  className="block w-full text-center py-2.5 rounded-lg font-medium border transition hover:bg-gray-50 dark:hover:bg-gray-800"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  🎮 Open Simulator
                </Link>
                <Link
                  to="/ngos"
                  className="block w-full text-center py-2.5 rounded-lg font-medium border transition hover:bg-gray-50 dark:hover:bg-gray-800"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  🏢 View NGOs
                </Link>
                <Link
                  to="/donate"
                  className="block w-full text-center py-2.5 rounded-lg font-medium border transition hover:bg-gray-50 dark:hover:bg-gray-800"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  💰 Donate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
