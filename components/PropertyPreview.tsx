// Property Preview Card Component for RealtyView
// Displays a compact property card with image, title, price, and favorite toggle

import type { Property } from '../types/Property';
import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface PropertyPreviewProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const PropertyPreview: React.FC<PropertyPreviewProps> = ({ property, isFavorite, onToggleFavorite }) => {
  // Use the first image if available, else fallback
  let previewImg: string | null = null;
  // Try to use property.images if it exists and is an array
  if (typeof property === 'object' && property !== null && 'images' in property) {
    const images = (property as any).images;
    if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string') {
      previewImg = images[0];
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center hover:shadow-lg transition cursor-pointer">
      <Link href={`/property/${property.id}`} className="w-full flex flex-col items-center">
        {previewImg ? (
          <img
            src={previewImg}
            alt={property.title}
            className="w-full h-32 object-cover rounded-lg mb-2 bg-gray-100"
            style={{ maxWidth: 180 }}
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center rounded-lg mb-2 bg-gray-100 text-4xl select-none" style={{ maxWidth: 180 }}>
            🏠
          </div>
        )}
        <div className="w-full flex justify-between items-center">
          <h3 className="font-semibold text-base truncate max-w-[120px]">{property.title}</h3>
          <button
            type="button"
            aria-label="Save to Favorites"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
          >
            <Heart className={`w-5 h-5 transition ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>
        <div className="text-xs text-gray-500 truncate w-full">{property.address}</div>
        <div className="text-blue-700 font-bold text-sm mt-1">₹{property.price.toLocaleString('en-IN')}</div>
      </Link>
    </div>
  );
};

export default PropertyPreview;
