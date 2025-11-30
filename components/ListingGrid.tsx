


import type { Property } from '../types/Property';
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Share2 } from "lucide-react";
import { useState } from 'react';

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

  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!displayProperties.length) {
    return <div className="p-4 text-gray-500">No properties found.</div>;
  }

  if (grid) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
        {displayProperties.map((property) => {
          const propertyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/property/${property.id}`;
          return (
            <div key={property.id} ref={el => { cardRefs.current[property.id] = el; }} className="relative">
              <PropertyPreview
                property={property}
                isFavorite={favs.includes(property.id)}
                onToggleFavorite={toggleFavorite}
              />
              {/* Share button overlay */}
              <button
                type="button"
                aria-label="Share property"
                className="absolute top-2 right-2 z-20 bg-white/80 rounded-full p-1 shadow hover:bg-blue-100 transition"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard.writeText(propertyUrl);
                  setCopiedId(property.id);
                  setTimeout(() => setCopiedId(null), 1500);
                }}
              >
                <Share2 className="w-5 h-5 text-blue-500 hover:text-blue-700 transition" />
              </button>
              {/* Link copied popup */}
              {copiedId === property.id && (
                <div className="absolute top-10 right-2 bg-blue-600 text-white px-3 py-1 rounded shadow-lg text-xs animate-fade-in-out z-30">
                  Link copied to clipboard
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // List view with preview image and share button
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
        const propertyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/property/${property.id}`;
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
                    <button
                      type="button"
                      aria-label="Share property"
                      className="ml-2"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText(propertyUrl);
                        setCopiedId(property.id);
                        setTimeout(() => setCopiedId(null), 1500);
                      }}
                    >
                      <Share2 className="w-5 h-5 text-blue-500 hover:text-blue-700 transition" />
                    </button>
                  </h3>
                  <div className="text-gray-600 truncate">{property.address}</div>
                  <div className="text-blue-600 font-semibold">₹{property.price.toLocaleString('en-IN')}</div>
                  <div className="text-xs uppercase mt-2">{property.type}</div>
                </div>
                {/* Link copied popup */}
                {copiedId === property.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded shadow-lg text-xs animate-fade-in-out z-20">
                    Link copied to clipboard
                  </div>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ListingGrid;
