import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Parking } from "../../api/parking/parking.types";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ParkingMapProps {
  parkings: Parking[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (parking: Parking) => void;
}

export default function ParkingMap({
  parkings,
  center = [48.8566, 2.3522],
  zoom = 13,
  onMarkerClick,
}: ParkingMapProps) {
  const mapCenter =
    parkings.length > 0
      ? ([parkings[0].latitude, parkings[0].longitude] as [number, number])
      : center;

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
        {parkings.map((parking) => (
          <Marker
            key={parking.id}
            position={[parking.latitude, parking.longitude]}
            eventHandlers={{
              click: () => onMarkerClick?.(parking),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">Parking #{parking.id}</h3>
                {parking.address && (
                  <p className="text-xs text-gray-600 mb-1">{parking.address}</p>
                )}
                {parking.note && (
                  <p className="text-xs text-gray-500 italic">{parking.note}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(parking.created_at).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
