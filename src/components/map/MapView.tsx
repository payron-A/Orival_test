import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect} from "react";

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  label: string;
  emphasized?: boolean;
}

interface MapViewProps {
  markers: MapMarkerData[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  userMarker?: boolean;
}

/* --------------------------------------------------
   Algeria map settings
-------------------------------------------------- */

const ALGERIA_CENTER: [number, number] = [28.0339, 1.6596];

const ALGERIA_BOUNDS: L.LatLngBoundsExpression = [
  [18.9, -8.7], // South-West
  [37.1, 12.0], // North-East
];

/* --------------------------------------------------
   Custom Orival marker
-------------------------------------------------- */

const createMarkerIcon = (active: boolean) =>
  L.divIcon({
    className: "",
    html: `
        <i
          class="fa-solid fa-location-pin ${active ? "animate-jump" : ""}"
          style="
            color: ${active ? "#f97316" : "#111827"};
            filter: ${
              active
                ? "drop-shadow(0 3px 5px #f97316)"
                : "drop-shadow(0 2px 3px rgba(0,0,0,0.25))"
            };
          "
        ></i>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

/* --------------------------------------------------
   Keep selected course visible
-------------------------------------------------- */

function SelectedMarkerController({
  markers,
  selectedId,
}: {
  markers: MapMarkerData[];
  selectedId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedId) return;

    const selectedMarker = markers.find(
      (marker) => marker.id === selectedId
    );

    if (!selectedMarker) return;

    map.panTo([selectedMarker.lat, selectedMarker.lng]);
  }, [selectedId, markers, map]);

  return null;
}

/* --------------------------------------------------
   MapView
-------------------------------------------------- */

export function MapView({
  markers,
  selectedId,
  onSelect,
  className = "",
}: MapViewProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl z-30 ${className}`}>
      <MapContainer
        center={ALGERIA_CENTER}
        zoom={1}
        minZoom={4.5}
        maxZoom={18}
        maxBounds={ALGERIA_BOUNDS}
        maxBoundsViscosity={1}
        scrollWheelZoom={true}
        className="h-full w-full overflow-hidden rounded-lg"
      >
        {/* Real OpenStreetMap map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Move map when selected course changes */}
        <SelectedMarkerController
          markers={markers}
          selectedId={selectedId}
        />

        {/* Course markers */}
        {markers.map((marker) => {
          const active = selectedId === marker.id;

          return (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={createMarkerIcon(active)}
              eventHandlers={{
                click: () => {
                  onSelect?.(marker.id);
                },
              }}
            >
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
} 