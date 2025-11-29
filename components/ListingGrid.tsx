


import type { Property } from '../types/Property';
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from "lucide-react";
import PropertyPreview from './PropertyPreview';

// Utility to get the correct favorites key
function getFavoritesKey() {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('sb-user') || 'null');
    if (user && user.id) {
      return `favorites_${user.id}`;
    }
  }
  return 'favorites';
}

interface ListingGridProps {
  properties?: Property[];
  activePropertyId?: string;
  favoriteIds?: string[];
  onlyFavorites?: boolean;
  grid?: boolean;
}

const ListingGrid: React.FC<ListingGridProps> = ({ properties = [], activePropertyId, favoriteIds, onlyFavorites, grid }) => {
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [favs, setFavs] = React.useState<string[]>(favoriteIds || []);

  useEffect(() => {
    if (activePropertyId && cardRefs.current[activePropertyId]) {
      cardRefs.current[activePropertyId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activePropertyId]);


  useEffect(() => {
    // Always sync with the correct key
    const key = getFavoritesKey();
    const favsFromStorage = localStorage.getItem(key);
    if (favsFromStorage) setFavs(JSON.parse(favsFromStorage));
    else if (favoriteIds) setFavs(favoriteIds);
  }, [favoriteIds]);


  const toggleFavorite = (id: string) => {
    const key = getFavoritesKey();
    let updated: string[];
    if (favs.includes(id)) {
      updated = favs.filter(fid => fid !== id);
    } else {
      updated = [...favs, id];
    }
    setFavs(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const displayProperties = onlyFavorites
    ? (properties || []).filter((p) => favs.includes(p.id))
    : properties;

  if (!displayProperties.length) {
    return <div className="p-4 text-gray-500">No properties found.</div>;
  }

  if (grid) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
        {displayProperties.map((property) => (
          <div key={property.id} ref={el => { cardRefs.current[property.id] = el; }}>
            <PropertyPreview
              property={property}
              isFavorite={favs.includes(property.id)}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        ))}
      </div>
    );
  }

  // List view with preview image
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {displayProperties.map((property) => {
        let previewImg = '/placeholder.jpg';
        if (typeof property === 'object' && property !== null && 'images' in property) {
          const images = (property as any).images;
          if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string') {
            previewImg = images[0];
          }
        }
        return (
          <div key={property.id} className="relative group">
            <Link
              href={`/property/${property.id}`}
              passHref
            >
              <div
                ref={el => { cardRefs.current[property.id] = el; }}
                className={`card bg-base-100 shadow p-4 transition hover:bg-blue-50 cursor-pointer flex gap-4 items-center ${activePropertyId === property.id ? 'ring-2 ring-blue-600' : ''}`}
              >
                <img
                  src={previewImg}
                  alt={property.title}
                  className="w-24 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                  style={{ maxWidth: 96 }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg flex items-center gap-2 truncate">
                    {property.title}
                    <button
                      type="button"
                      aria-label="Save to Favorites"
                      className="ml-2"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
                    >
                      <Heart className={`w-5 h-5 transition ${favs.includes(property.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    </button>
                  </h3>
                  <div className="text-gray-600 truncate">{property.address}</div>
                  <div className="text-blue-600 font-semibold">₹{property.price.toLocaleString('en-IN')}</div>
                  <div className="text-xs uppercase mt-2">{property.type}</div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ListingGrid;
