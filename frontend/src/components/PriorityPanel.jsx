import { useState, useEffect } from "react";

export default function PriorityPanel() {
  const [crises, setCrises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriorityCrises = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/analytics/priority-crises`
        );
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.crises) {
            setCrises(json.data.crises);
          }
        }
      } catch (err) {
        console.error("Failed to fetch priority crises:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPriorityCrises();
  }, []);

  const getColorStyles = (color) => {
    if (color === "red") {
      return {
        bg: 'var(--accent-red-light)',
        border: 'var(--accent-red-lighter)',
        indicator: 'var(--accent-red)',
        badgeBg: 'var(--accent-red-lighter)',
        badgeText: 'var(--accent-red-foreground)',
      };
    } else if (color === "yellow") {
      return {
        bg: 'var(--accent-yellow-light)',
        border: 'var(--accent-yellow-lighter)',
        indicator: 'var(--accent-yellow)',
        badgeBg: 'var(--accent-yellow-lighter)',
        badgeText: 'var(--accent-yellow-foreground)',
      };
    } else {
      return {
        bg: 'var(--accent-orange-light)',
        border: 'var(--accent-orange-lighter)',
        indicator: 'var(--accent-orange)',
        badgeBg: 'var(--accent-orange-lighter)',
        badgeText: 'var(--accent-orange-foreground)',
      };
    }
  };

  return (
    <div 
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 14px 35px -14px oklch(0.2 0.02 260 / 0.22)',
      }}
    >
      <h3 className="font-semibold mb-4" style={{ color: 'var(--card-foreground)' }}>
        Crises in Priority
      </h3>

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Loading...
        </p>
      ) : crises.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          No active crises at the moment.
        </p>
      ) : (
        <div className="space-y-3">
          {crises.map((c) => {
            const colors = getColorStyles(c.color);
            return (
              <div
                key={c._id}
                className="flex items-start gap-3 p-4 rounded-xl border"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                }}
              >
                {/* Indicator */}
                <div
                  className="w-3 h-3 rounded-full mt-2"
                  style={{ backgroundColor: colors.indicator }}
                />

                {/* Info */}
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--card-foreground)' }}>{c.state}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{c.type}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    {c.population}
                  </p>
                </div>

                {/* Risk Badge */}
                <span
                  className="px-2 py-1 rounded-md text-xs font-medium"
                  style={{
                    backgroundColor: colors.badgeBg,
                    color: colors.badgeText,
                  }}
                >
                  {c.score} {c.level}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
