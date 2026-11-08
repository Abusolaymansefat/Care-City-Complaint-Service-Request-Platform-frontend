"use client";

import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect } from "react";

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onSelect: (latitude: number, longitude: number) => void;
}

const DEFAULT_CENTER: [number, number] = [23.8103, 90.4125];

function MapController({ latitude, longitude }: LocationPickerProps) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.setView([latitude, longitude], Math.max(map.getZoom(), 15));
    }
  }, [latitude, longitude, map]);

  return null;
}

function LocationMarker({ latitude, longitude, onSelect }: LocationPickerProps) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  if (latitude === null || longitude === null) return null;

  return (
    <CircleMarker
      center={[latitude, longitude]}
      radius={9}
      pathOptions={{ color: "#fff", fillColor: "#2563eb", fillOpacity: 1, weight: 3 }}
    />
  );
}

export default function LocationPicker(props: LocationPickerProps) {
  const center: [number, number] =
    props.latitude !== null && props.longitude !== null
      ? [props.latitude, props.longitude]
      : DEFAULT_CENTER;

  return (
    <div className="overflow-hidden rounded-xl border">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="h-72 w-full"
        aria-label="Map location picker"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController {...props} />
        <LocationMarker {...props} />
      </MapContainer>
    </div>
  );
}
