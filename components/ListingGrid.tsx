
import type { Property } from '../types/Property';
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

interface ListingGridProps {
  properties: Property[];
  activePropertyId?: string;
}

const ListingGrid: React.FC<ListingGridProps> = ({ properties, activePropertyId }) => {
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (activePropertyId && cardRefs.current[activePropertyId]) {
      cardRefs.current[activePropertyId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activePropertyId]);

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {properties.map((property) => (
        <Link
          key={property.id}
          href={`/property/${property.id}`}
          passHref
        >
          <div
            ref={el => { cardRefs.current[property.id] = el; }}
            className={`card bg-base-100 shadow p-4 transition hover:bg-blue-50 cursor-pointer ${activePropertyId === property.id ? 'ring-2 ring-blue-600' : ''}`}
          >
            <h3 className="font-bold text-lg">{property.title}</h3>
            <div className="text-gray-600">{property.address}</div>
            <div className="text-blue-600 font-semibold">${property.price}</div>
            <div className="text-xs uppercase mt-2">{property.type}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ListingGrid;
