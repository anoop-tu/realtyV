"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Filters from '../../components/Filters';
import ListingGrid from '../../components/ListingGrid';
import { useSearchParams, useRouter } from 'next/navigation';

import type { Property } from '../../types/Property';
import { createBrowserClient } from '@supabase/auth-helpers-react';
const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

export default function SearchPage() {
  // Fetch properties from Supabase
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      // Fetch properties
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
        setProperties([]);
        setLoading(false);
        return;
      }
      // Fetch images for all properties
      const propertyIds = (propertiesData || []).map((p: any) => p.id);
      let imagesByProperty: Record<string, string[]> = {};
      if (propertyIds.length > 0) {
        const { data: media } = await supabase
          .from('media')
          .select('property_id, url')
          .in('property_id', propertyIds)
          .eq('type', 'image');
        if (media && Array.isArray(media)) {
          for (const m of media) {
            if (!imagesByProperty[m.property_id]) imagesByProperty[m.property_id] = [];
            imagesByProperty[m.property_id].push(m.url);
          }
        }
      }
      // Attach images array to each property
      const propertiesWithImages = (propertiesData || []).map((p: any) => ({
        ...p,
        images: imagesByProperty[p.id] || [],
      }));
      setProperties(propertiesWithImages);
      setLoading(false);
    };
    fetchProperties();
    // Load favorites from localStorage
    function getFavoritesKey() {
      const user = JSON.parse(localStorage.getItem('sb-user') || 'null');
      if (user && user.id) {
        return `favorites_${user.id}`;
      }
      return 'favorites';
    }
    const key = getFavoritesKey();
    const favs = localStorage.getItem(key);
    setFavoriteIds(favs ? JSON.parse(favs) : []);
  }, []);
  const [viewType, setViewType] = useState<'list' | 'grid' | 'map'>('list');
  const [activePropertyId, setActivePropertyId] = useState<string | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter properties based on search params
  const typeParam = searchParams.get('type') || '';
  const minPriceParam = searchParams.get('min_price');
  const maxPriceParam = searchParams.get('max_price');
  const minPrice = minPriceParam ? Number(minPriceParam) : null;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : null;
  const filteredProperties = properties.filter((p) => {
    const typeMatch = !typeParam || p.type === typeParam;
    const minMatch = minPrice === null || p.price >= minPrice;
    const maxMatch = maxPrice === null || p.price <= maxPrice;
    return typeMatch && minMatch && maxMatch;
  });

  // Responsive: show tabs on mobile, split view on desktop
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 py-6">
      <div className="container mx-auto max-w-7xl">

        {/* Filters Bar */}
        <div className="w-full mb-8">
          <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-blue-100 flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-2 md:mb-0">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              Filters
            </h2>
            <div className="flex-1">
              <Filters properties={properties} />
            </div>
            {/* View selection */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500">View:</span>
              <button
                className={`px-2 py-1 rounded ${viewType === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} text-xs font-medium`}
                onClick={() => setViewType('list')}
                aria-label="List view"
              >
                List
              </button>
              <button
                className={`px-2 py-1 rounded ${viewType === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} text-xs font-medium`}
                onClick={() => setViewType('grid')}
                aria-label="Grid view"
              >
                Grid
              </button>
              <button
                className={`px-2 py-1 rounded ${viewType === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} text-xs font-medium`}
                onClick={() => setViewType('map')}
                aria-label="Map view"
              >
                Map
              </button>
            </div>
          </div>
        </div>
        {/* View Switcher: Only one view at a time */}
        <div className="w-full min-h-[400px]">
          {viewType === 'list' || viewType === 'grid' ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 h-full flex flex-col min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                Listings
              </h2>
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading properties...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : (
                <ListingGrid properties={filteredProperties} activePropertyId={activePropertyId} favoriteIds={favoriteIds} grid={viewType === 'grid'} />
              )}
            </div>
          ) : null}
          {viewType === 'map' ? (
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-blue-100 h-full flex flex-col min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                Map
              </h2>
              <div className="w-full" style={{ height: 400 }}>
                <MapComponent properties={filteredProperties} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
