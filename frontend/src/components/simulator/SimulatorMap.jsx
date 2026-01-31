import {MapContainer, TileLayer, CircleMarker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Get color based on severity (0-1 scale) - Refined palette
const getSeverityColor = (severity) => {
    const percent = severity * 100;
    if (percent >= 80) return '#dc2626'; // deep red - critical
    if (percent >= 60) return '#ea580c'; // burnt orange - high
    if (percent >= 40) return '#d97706'; // amber - moderate
    if (percent >= 20) return '#059669'; // emerald - low
    return '#0891b2'; // teal - minimal
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

export default function SimulatorMap({disasters = []}) {
    // Default India center
    const indiaCenter = [22.5937, 78.9629];

    return (
        <div
            className="
                h-[calc(100vh-160px)]
                rounded-2xl
                border border-[var(--border)]
                overflow-hidden
                bg-[var(--card)]
            "
        >
            <MapContainer
                center={indiaCenter}
                zoom={4.8}
                scrollWheelZoom={false}
                style={{height: '100%', width: '100%'}}
            >
                {/* Neutral, professional tiles */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution="© OpenStreetMap © CARTO"
                />

                {/* Interactive Circle Markers based on severity and area */}
                {disasters.map((issue) => {
                    // Extract coordinates from the API response structure
                    let lat, lon;

                    // Primary: check GeoJSON coordinates array
                    if (
                        issue?.coordinates?.coordinates &&
                        Array.isArray(issue.coordinates.coordinates)
                    ) {
                        const coords = issue.coordinates.coordinates;
                        lon = coords[0];
                        lat = coords[1];
                    }
                    // Fallback: check aiAnalysis location
                    else if (issue?.aiAnalysis?.location?.coordinates) {
                        const coords = issue.aiAnalysis.location.coordinates;
                        lat = coords.lat;
                        lon = coords.lon;
                    }

                    // Skip if no valid coordinates
                    if (!lat || !lon || isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) {
                        console.warn('Invalid coordinates for issue:', issue._id);
                        return null;
                    }

                    const severity = issue?.aiAnalysis?.severity?.overall ?? issue.severity ?? 0.5;
                    const color = getSeverityColor(severity);
                    const radius = getCircleRadius(issue);

                    return (
                        <CircleMarker
                            key={issue._id || issue.createdAt}
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
                                        📍 {issue.aiAnalysis?.location?.name || 'Unknown Location'}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        <span 
                                            className="px-2 py-0.5 rounded text-xs font-medium"
                                            style={{ backgroundColor: color + '30', color: color }}
                                        >
                                            {issue.type || 'Unknown'}
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
            </MapContainer>
        </div>
    );
}
