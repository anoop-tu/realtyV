
import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface MapComponentProps {
  properties: Property[];
  onMarkerClick?: (id: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ properties, onMarkerClick }) => {
  const mapRef = useRef<any>(null);

  // Calculate bounds from property locations
  useEffect(() => {
    if (!mapRef.current || !properties.length) return;
    const map = mapRef.current;
    const bounds = properties.map((p) => [p.lat, p.lng]);
    if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties]);


  // Default center if no properties
  const defaultCenter: [number, number] = properties.length
    ? [properties[0].lat, properties[0].lng]
    : [28.6139, 77.209];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      whenReady={() => {
        // Set mapRef only if not already set
        if (!mapRef.current) {
          // @ts-ignore: access Leaflet map instance
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mapRef.current = (window as any).L?.map?.instances?.[0] || undefined;
        }
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.lat, property.lng]}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(property.id),
          }}
        >
          <Popup>
            <div>
              <strong>{property.title}</strong>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
