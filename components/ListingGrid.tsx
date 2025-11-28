
import type { Property } from '../types/Property';
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

interface ListingGridProps {
  properties?: Property[];
  activePropertyId?: string;
  favoriteIds?: string[];
  onlyFavorites?: boolean;
}


import { Heart } from "lucide-react";

const ListingGrid: React.FC<ListingGridProps> = ({ properties = [], activePropertyId, favoriteIds, onlyFavorites }) => {
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [favs, setFavs] = React.useState<string[]>(favoriteIds || []);

  useEffect(() => {
    if (activePropertyId && cardRefs.current[activePropertyId]) {
      cardRefs.current[activePropertyId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activePropertyId]);

  useEffect(() => {
    if (favoriteIds) setFavs(favoriteIds);
  }, [favoriteIds]);

  const toggleFavorite = (id: string) => {
    let updated: string[];
    if (favs.includes(id)) {
      updated = favs.filter(fid => fid !== id);
    } else {
      updated = [...favs, id];
    }
    setFavs(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const displayProperties = onlyFavorites
    ? (properties || []).filter((p) => favs.includes(p.id))
    : properties;

  if (!displayProperties.length) {
    return <div className="p-4 text-gray-500">No properties found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {displayProperties.map((property) => (
        <div key={property.id} className="relative group">
          <Link
            href={`/property/${property.id}`}
            passHref
          >
            <div
              ref={el => { cardRefs.current[property.id] = el; }}
              className={`card bg-base-100 shadow p-4 transition hover:bg-blue-50 cursor-pointer ${activePropertyId === property.id ? 'ring-2 ring-blue-600' : ''}`}
            >
              <h3 className="font-bold text-lg flex items-center gap-2">
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
              <div className="text-gray-600">{property.address}</div>
              <div className="text-blue-600 font-semibold">${property.price}</div>
              <div className="text-xs uppercase mt-2">{property.type}</div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;
