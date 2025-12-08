import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Alert } from "../../api/alerts/alerts.types";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Custom marker colors based on status
const createCustomIcon = (status: string) => {
  let color = "#3b82f6"; // blue par défaut

  if (status === "ouverte") {
    color = "#ef4444"; // red
  } else if (status === "en_cours") {
    color = "#f59e0b"; // orange
  } else if (status === "resolue") {
    color = "#10b981"; // green
  }

  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.5 12.5 28.5S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z"
            fill="${color}" stroke="#000" stroke-width="1"/>
      <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    className: "",
  });
};

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface AlertsMapProps {
  alerts: Alert[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (alert: Alert) => void;
}

export default function AlertsMap({
  alerts,
  center = [48.8566, 2.3522], // Paris par défaut
  zoom = 12,
  onMarkerClick,
}: AlertsMapProps) {
  // Si on a des alertes, centrer sur la première
  const mapCenter =
    alerts.length > 0
      ? ([alerts[0].location_lat, alerts[0].location_lon] as [number, number])
      : center;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ouverte":
        return "bg-red-100 text-red-800";
      case "en_cours":
        return "bg-orange-100 text-orange-800";
      case "resolue":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {alerts.map((alert) => (
          <Marker
            key={`${alert.id_alert}-${alert.user_id}`}
            position={[alert.location_lat, alert.location_lon]}
            icon={createCustomIcon(alert.status)}
            eventHandlers={{
              click: () => onMarkerClick?.(alert),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-sm mb-2">{alert.title}</h3>
                <div className="space-y-1">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(alert.status)}`}
                  >
                    {alert.status}
                  </span>
                  {alert.category && (
                    <p className="text-xs text-gray-600">
                      📁 {alert.category.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">
                    ⚡ Intensité: {alert.intensity}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {alert.description.substring(0, 100)}
                    {alert.description.length > 100 ? "..." : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
