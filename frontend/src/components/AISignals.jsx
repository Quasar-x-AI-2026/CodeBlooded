import { useState, useEffect } from "react";

export default function AISignals() {
  const [signals, setSignals] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("just now");

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/crisis/issues`
        );
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.issues) {
            // Generate AI signals based on recent issues
            const issues = json.data.issues;
            const generatedSignals = [];

            // Count by type
            const typeCount = {};
            issues.forEach((issue) => {
              const type = issue.type || "unknown";
              typeCount[type] = (typeCount[type] || 0) + 1;
            });

            // Generate signals based on issue patterns
            if (typeCount.disaster > 0) {
              generatedSignals.push(
                `${typeCount.disaster} active disaster alert(s) detected`
              );
            }
            if (typeCount.disease > 0) {
              generatedSignals.push(
                `${typeCount.disease} disease outbreak(s) being monitored`
              );
            }
            if (typeCount.others > 0) {
              generatedSignals.push(
                `${typeCount.others} other crisis signal(s) flagged`
              );
            }

            // Add high severity warning if any
            const highSeverityCount = issues.filter(
              (i) => (i.severity || 0) >= 0.8
            ).length;
            if (highSeverityCount > 0) {
              generatedSignals.push(
                `⚠️ ${highSeverityCount} high-priority situation(s) requiring attention`
              );
            }

            if (generatedSignals.length === 0) {
              generatedSignals.push("No active crisis signals detected");
            }

            setSignals(generatedSignals);
            setLastUpdated("just now");
          }
        }
      } catch (err) {
        console.error("Failed to fetch AI signals:", err);
        setSignals(["Unable to fetch latest signals"]);
      }
    };

    fetchSignals();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchSignals, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="border rounded-2xl p-4"
      style={{
        backgroundColor: 'var(--accent-cyan-light)',
        borderColor: 'var(--accent-cyan-lighter)',
      }}
    >
      <h3 className="font-semibold mb-2" style={{ color: 'var(--accent-cyan-foreground)' }}>
        AI Signals Detected
      </h3>

      <ul className="text-sm space-y-1" style={{ color: 'var(--accent-cyan-foreground)' }}>
        {signals.map((signal, index) => (
          <li key={index}>• {signal}</li>
        ))}
      </ul>

      <p className="text-xs mt-3" style={{ color: 'var(--accent-cyan-foreground)' }}>
        Updated {lastUpdated}
      </p>
    </div>
  );
}
