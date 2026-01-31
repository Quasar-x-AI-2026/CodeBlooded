import { useState, useEffect } from "react";
import SocialFeed from "@/components/SocialFeed";

export default function Feed() {
  const [topNGOs, setTopNGOs] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
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
        console.error("Failed to fetch highlights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  const formatAmount = (paise) => {
    const rupees = (paise || 0) / 100;
    if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
    if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}K`;
    return `₹${rupees.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Page Header */}
      <div className="px-6 pt-24 pb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
          📰 Community Feed
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>
          Stories, highlights, and noble work from NGOs across India
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-10">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Social Feed */}
          <div className="col-span-8">
            <SocialFeed />
          </div>

          {/* Right Column - Leaderboards */}
          <div className="col-span-4">
            <div className="sticky top-24 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto pb-6">
            {/* Top NGOs */}
            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--card-foreground)" }}>
                🏆 Top NGOs
              </h2>

              {loading ? (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading...</p>
              ) : topNGOs.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No data yet.</p>
              ) : (
                <div className="space-y-3">
                  {topNGOs.slice(0, 5).map((ngo, index) => (
                    <div
                      key={ngo._id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "var(--background)" }}
                    >
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: "var(--foreground)" }}>
                          {ngo.name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {ngo.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm" style={{ color: "#059669" }}>
                          {formatAmount(ngo.totalReceived)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Donors */}
            <div
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--card-foreground)" }}>
                💎 Top Donors
              </h2>

              {loading ? (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading...</p>
              ) : topDonors.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No donations yet.</p>
              ) : (
                <div className="space-y-3">
                  {topDonors.slice(0, 5).map((donor, index) => (
                    <div
                      key={donor._id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "var(--background)" }}
                    >
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: "var(--foreground)" }}>
                          {donor.name || "Anonymous"}
                        </p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {donor.donationCount} donation{donor.donationCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm" style={{ color: "#0891b2" }}>
                          {formatAmount(donor.totalDonated)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Post CTA for NGOs */}
            <div
              className="rounded-2xl border p-5"
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                borderColor: "transparent",
              }}
            >
              <h3 className="text-lg font-semibold mb-2 text-white">
                Are you an NGO?
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Share your stories and impact with the community
              </p>
              <p className="text-xs text-white/60">
                Contact admin to get your posts featured on the feed!
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
