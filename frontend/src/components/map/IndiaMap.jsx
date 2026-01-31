import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, LayerGroup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./map.css";

// Get color based on severity (0-1 scale) - Refined palette
const getSeverityColor = (severity) => {
  const percent = severity * 100;
  if (percent >= 80) return "#dc2626"; // deep red - critical
  if (percent >= 60) return "#ea580c"; // burnt orange - high
  if (percent >= 40) return "#d97706"; // amber - moderate  
  if (percent >= 20) return "#059669"; // emerald - low
  return "#0891b2"; // teal - minimal
};

// Get radius based on geographic scale (area affected)
const getCircleRadius = (issue) => {
  // Use geographic_scale from AI analysis if available
  const geoScale = issue?.aiAnalysis?.severity?.dimensions?.geographic_scale || 0.5;
  // Base radius 8, max 30 based on geographic impact
  const baseRadius = 8;
  const maxRadius = 30;
  return baseRadius + (geoScale * (maxRadius - baseRadius));
};

export default function IndiaMap() {
  const [activeLayers, setActiveLayers] = useState({
    disaster: true,
    disease: true,
  });

  const [geoData, setGeoData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load GeoJSON for India states
  useEffect(() => {
    fetch("")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      })
      .catch((err) => console.error("Failed to load GeoJSON:", err));
  }, []);

  // Fetch real issues from backend
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/crisis/issues`
        );
        if (!res.ok) throw new Error("Failed to fetch issues");
        
        const json = await res.json();
        if (json?.data?.issues) {
          setIssues(json.data.issues);
        }
      } catch (err) {
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchIssues, 30000);
    return () => clearInterval(interval);
  }, []);

  // Aggregate issues by state for GeoJSON styling
  const stateRiskMap = {};
  issues.forEach((issue) => {
    const stateName = issue.aiAnalysis?.location?.name;
    if (stateName) {
      const normalizedName = stateName.toLowerCase();
      if (!stateRiskMap[normalizedName]) {
        stateRiskMap[normalizedName] = { count: 0, totalSeverity: 0, crisisType: issue.type };
      }
      stateRiskMap[normalizedName].count += 1;
      stateRiskMap[normalizedName].totalSeverity += issue.severity || 0;
    }
  });

  // Get state risk level based on issues
  const getStateRisk = (stateName) => {
    if (!stateName) return 0;
    const normalized = stateName.toLowerCase();
    
    for (const [key, data] of Object.entries(stateRiskMap)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return Math.round((data.totalSeverity / data.count) * 100);
      }
    }
    return 0;
  };

  const getColor = (risk) => {
    if (risk > 80) return "#dc2626"; // deep red
    if (risk > 60) return "#ea580c"; // burnt orange
    if (risk > 40) return "#d97706"; // amber
    if (risk > 20) return "#059669"; // emerald
    return "#1e3a5f"; // deep navy blue
  };

  const stateStyle = (feature) => {
    const stateName = feature.properties.NAME_1 || feature.properties.state;
    const risk = getStateRisk(stateName);
    
    return {
      fillColor: getColor(risk),
      weight: 0.5,
      opacity: 1,
      color: "#ffffff",
      fillOpacity: risk > 0 ? 0.75 : 0.3,
    };
  };

  const onEachState = (feature, layer) => {
    const stateName = feature.properties.NAME_1 || feature.properties.state || "Unknown";
    const risk = getStateRisk(stateName);
    
    // Find issues for this state
    const stateIssues = issues.filter((issue) => {
      const loc = issue.aiAnalysis?.location?.name?.toLowerCase() || "";
      return loc.includes(stateName.toLowerCase()) || stateName.toLowerCase().includes(loc);
    });

    layer.on({
      click: () => {
        setSelected({
          name: stateName,
          risk: risk,
          confidence: Math.floor(80 + Math.random() * 15),
          crisis: stateIssues[0]?.type || "None",
          population: stateIssues.length > 0 
            ? `${stateIssues.length} active issue(s)` 
            : "No active issues",
          issues: stateIssues,
        });
      },
    });
  };

  const getRiskBadgeStyle = (risk) => {
    if (risk > 80) {
      return {
        backgroundColor: 'var(--accent-red-lighter)',
        color: 'var(--accent-red-foreground)',
      };
    } else if (risk > 60) {
      return {
        backgroundColor: 'var(--accent-yellow-lighter)',
        color: 'var(--accent-yellow-foreground)',
      };
    } else {
      return {
        backgroundColor: 'var(--accent-green-lighter)',
        color: 'var(--accent-green-foreground)',
      };
    }
  };

  return (
    <div 
      className="relative rounded-2xl shadow-sm border overflow-hidden w-[900px]"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 14px 35px -14px oklch(0.2 0.02 260 / 0.22)',
      }}
    >
      {/* FILTER BUTTONS */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        {["disaster", "disease"].map((type) => (
          <button
            key={type}
            onClick={() =>
              setActiveLayers((p) => ({ ...p, [type]: !p[type] }))
            }
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
              ${activeLayers[type]
                ? "bg-white text-black"
                : "bg-red-100 text-black border"}`}
          >
            {type.toUpperCase()}
          </button>
        ))}
        <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800">
          {loading ? "Loading..." : `${issues.length} Issues`}
        </span>
      </div>

      {/* MAP */}
      <div className="h-[800px] w-[900px] relative">
        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={4.5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="© OpenStreetMap © CARTO"
          />

          {geoData && (
            <GeoJSON
              key={JSON.stringify(stateRiskMap)} // Re-render when risk data changes
              data={geoData}
              style={stateStyle}
              onEachFeature={onEachState}
            />
          )}

          {/* Interactive Circle Markers based on severity and area */}
          {["disaster", "disease", "others"].map((type) =>
            activeLayers[type] !== false && (
              <LayerGroup key={type}>
                {issues
                  .filter((issue) => issue.type === type)
                  .map((issue) => {
                    // Get coordinates
                    let lat, lon;
                    
                    if (issue?.coordinates?.coordinates && Array.isArray(issue.coordinates.coordinates)) {
                      lon = issue.coordinates.coordinates[0];
                      lat = issue.coordinates.coordinates[1];
                    } else if (issue?.aiAnalysis?.location?.coordinates) {
                      lat = issue.aiAnalysis.location.coordinates.lat;
                      lon = issue.aiAnalysis.location.coordinates.lon;
                    }

                    if (!lat || !lon || isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) {
                      return null;
                    }

                    const severity = issue.severity || 0.5;
                    const color = getSeverityColor(severity);
                    const radius = getCircleRadius(issue);

                    return (
                      <CircleMarker
                        key={issue._id}
                        center={[lat, lon]}
                        radius={radius}
                        pathOptions={{
                          color: color,
                          fillColor: color,
                          fillOpacity: 0.5,
                          weight: 2,
                          opacity: 0.8,
                        }}
                        eventHandlers={{
                          click: () => {
                            setSelected({
                              name: issue.aiAnalysis?.location?.name || "Unknown Location",
                              risk: Math.round(severity * 100),
                              crisis: issue.type,
                              population: `Est. ${Math.round(severity * 50)}K impacted`,
                              issues: [issue],
                              title: issue.title,
                              description: issue.description,
                              status: issue.status,
                            });
                          },
                          mouseover: (e) => {
                            e.target.setStyle({
                              fillOpacity: 0.8,
                              weight: 3,
                            });
                          },
                          mouseout: (e) => {
                            e.target.setStyle({
                              fillOpacity: 0.5,
                              weight: 2,
                            });
                          },
                        }}
                      >
                        <Popup>
                          <div className="space-y-2 min-w-[200px]">
                            <p className="font-bold text-sm">{issue.title}</p>
                            <p className="text-xs text-gray-600">
                              📍 {issue.aiAnalysis?.location?.name || "Unknown Location"}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <span 
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ backgroundColor: color + '30', color: color }}
                              >
                                {issue.type}
                              </span>
                              <span 
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ backgroundColor: color + '30', color: color }}
                              >
                                Severity: {Math.round(severity * 100)}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              <p>🎯 Geographic Scale: {Math.round((issue.aiAnalysis?.severity?.dimensions?.geographic_scale || 0.5) * 100)}%</p>
                              <p>👥 Human Impact: {Math.round((issue.aiAnalysis?.severity?.dimensions?.human_impact || 0.5) * 100)}%</p>
                              <p>⏱️ Urgency: {issue.aiAnalysis?.urgency?.level || 'Unknown'}</p>
                            </div>
                            <p className="text-xs text-gray-400 border-t pt-1">
                              Status: {issue.status}
                            </p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
              </LayerGroup>
            )
          )}
        </MapContainer>

        {/* SOFT WHITE WASH OVERLAY */}
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[1px]" style={{ backgroundColor: 'oklch(1 0 0 / 0.3)' }} />
      </div>

      {/* FLOATING INFO CARD */}
      {selected && (
        <div 
          className="absolute right-6 top-16 w-[300px] rounded-xl shadow-lg p-4 border"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: '0 14px 35px -14px oklch(0.2 0.02 260 / 0.22)',
          }}
        >
          <h3 className="font-semibold" style={{ color: 'var(--card-foreground)' }}>
            {selected.name}
          </h3>
          {selected.title && (
            <p className="text-sm mt-1 font-medium" style={{ color: 'var(--card-foreground)' }}>
              {selected.title}
            </p>
          )}
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {selected.crisis} Crisis
          </p>

          <div className="flex justify-between items-center mt-3">
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Severity</span>
            <span
              className="px-2 py-1 rounded-md text-sm font-medium"
              style={getRiskBadgeStyle(selected.risk)}
            >
              {selected.risk}%
            </span>
          </div>

          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            {selected.population}
          </p>

          {selected.description && (
            <p className="text-xs mt-2 text-gray-500 line-clamp-3">
              {selected.description}
            </p>
          )}

          {selected.issues?.length > 0 && !selected.title && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold" style={{ color: 'var(--card-foreground)' }}>
                Active Issues:
              </p>
              {selected.issues.slice(0, 3).map((issue) => (
                <div key={issue._id} className="text-xs p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <p className="font-medium">{issue.title}</p>
                  <p className="text-gray-500">{issue.type} • Severity: {Math.round((issue.severity || 0) * 100)}%</p>
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={() => setSelected(null)}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600"
          >
            ✕ Close
          </button>
        </div>
      )}
    </div>
  );
}
