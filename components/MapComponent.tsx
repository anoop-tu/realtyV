// Map Component for RealtyView
// Renders interactive map with property markers using React-Leaflet and OpenStreetMap

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon path for Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});
import type { Property } from '../types/Property';
import { useRouter } from 'next/navigation';

interface MapComponentProps {
  properties: Property[];
}

const FitBounds: React.FC<{ properties: Property[] }> = ({ properties }) => {
  const map = useMap();
  useEffect(() => {
    if (!properties.length) return;
    const bounds: [number, number][] = properties.map((p) => [p.lat, p.lng] as [number, number]);
    if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ properties }) => {
  const router = useRouter();
  // Default center if no properties
  const defaultCenter: [number, number] = properties.length
    ? [properties[0].lat, properties[0].lng]
    : [28.6139, 77.209];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <FitBounds properties={properties} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.lat, property.lng]}
        >
          <Popup>
            <div
              className="cursor-pointer min-w-[120px]"
              onClick={() => router.push(`/property/${property.id}`)}
              style={{ userSelect: 'none' }}
            >
              <div className="font-semibold text-blue-700">{property.title}</div>
              <div className="text-sm text-gray-700">₹{property.price.toLocaleString('en-IN')}</div>
              <div className="text-xs text-gray-500 mt-1">{property.type}</div>
              <div className="text-xs text-blue-500 mt-2 underline">View Details</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
