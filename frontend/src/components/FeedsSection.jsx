import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FeedsSection() {
  const [topNGOs, setTopNGOs] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const [ngosRes, donorsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/analytics/top-ngos`),
          fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/analytics/top-donors`),
        ]);

        if (ngosRes.ok) {
          const json = await ngosRes.json();
          setTopNGOs(json.data?.ngos || []);
        }
        if (donorsRes.ok) {
          const json = await donorsRes.json();
          setTopDonors(json.data?.donors || []);
        }
      } catch (err) {
        console.error("Failed to fetch feeds:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeds();
  }, []);

  const formatAmount = (paise) => {
    const rupees = (paise || 0) / 100;
    if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
    if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}K`;
    return `₹${rupees.toFixed(0)}`;
  };

  const getNGOTypeColor = (type) => {
    const colors = {
      Health: { bg: "#dc262615", text: "#dc2626" },
      Education: { bg: "#0891b215", text: "#0891b2" },
      Disaster: { bg: "#ea580c15", text: "#ea580c" },
      Environment: { bg: "#05966915", text: "#059669" },
      Other: { bg: "#6b728015", text: "#6b7280" },
    };
    return colors[type] || colors.Other;
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--card-foreground)" }}>
        🌟 Highlights
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Top NGOs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
              🏆 Top Working NGOs
            </h3>
            <Link 
              to="/ngos" 
              className="text-xs hover:underline"
              style={{ color: "var(--primary)" }}
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading...</p>
          ) : topNGOs.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No NGO data available.</p>
          ) : (
            <div className="space-y-2">
              {topNGOs.map((ngo, index) => {
                const typeColors = getNGOTypeColor(ngo.type);
                return (
                  <div
                    key={ngo._id}
                    className="flex items-center gap-3 p-3 rounded-xl transition hover:scale-[1.01]"
                    style={{ backgroundColor: "var(--background)" }}
                  >
                    {/* Rank badge */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: index === 0 
                          ? "linear-gradient(135deg, #fbbf24, #f59e0b)" 
                          : index === 1 
                          ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                          : index === 2
                          ? "linear-gradient(135deg, #d97706, #b45309)"
                          : "var(--muted)",
                        color: index < 3 ? "white" : "var(--muted-foreground)",
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* NGO Info */}
                    <div className="flex-1 min-w-0">
                      <p 
                        className="font-medium text-sm truncate"
                        style={{ color: "var(--foreground)" }}
                      >
                        {ngo.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: typeColors.bg, color: typeColors.text }}
                        >
                          {ngo.type}
                        </span>
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {ngo.donationCount || 0} donations
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p 
                        className="font-semibold text-sm"
                        style={{ color: "#059669" }}
                      >
                        {formatAmount(ngo.totalReceived)}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                        received
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Donors */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
              💎 Top Donors
            </h3>
          </div>

          {loading ? (
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading...</p>
          ) : topDonors.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No donation data available yet.</p>
          ) : (
            <div className="space-y-2">
              {topDonors.map((donor, index) => (
                <div
                  key={donor._id}
                  className="flex items-center gap-3 p-3 rounded-xl transition hover:scale-[1.01]"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  {/* Rank badge */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: index === 0 
                        ? "linear-gradient(135deg, #fbbf24, #f59e0b)" 
                        : index === 1 
                        ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                        : index === 2
                        ? "linear-gradient(135deg, #d97706, #b45309)"
                        : "var(--muted)",
                      color: index < 3 ? "white" : "var(--muted-foreground)",
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Donor Info */}
                  <div className="flex-1 min-w-0">
                    <p 
                      className="font-medium text-sm truncate"
                      style={{ color: "var(--foreground)" }}
                    >
                      {donor.name || "Anonymous Donor"}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {donor.donationCount || 0} contribution{(donor.donationCount || 0) !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p 
                      className="font-semibold text-sm"
                      style={{ color: "#0891b2" }}
                    >
                      {formatAmount(donor.totalDonated)}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                      donated
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
