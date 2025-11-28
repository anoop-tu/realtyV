"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Filters from '../../components/Filters';
import ListingGrid from '../../components/ListingGrid';
import { useSearchParams, useRouter } from 'next/navigation';

import type { Property } from '../../types/Property';
import { createBrowserClient } from '@supabase/auth-helpers-react';
type MapComponentProps = {
  properties: Property[];
  onMarkerClick?: (id: string) => void;
};
const MapComponent = dynamic<MapComponentProps>(
  () => import('../../components/MapComponent'),
  { ssr: false }
);

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
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
        setProperties([]);
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    };
    fetchProperties();
    // Load favorites from localStorage
    const favs = localStorage.getItem('favorites');
    setFavoriteIds(favs ? JSON.parse(favs) : []);
  }, []);
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [activePropertyId, setActivePropertyId] = useState<string | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter properties based on search params
  const typeParam = searchParams.get('type') || '';
  const priceParam = searchParams.get('price') || '';
  const filteredProperties = properties.filter((p) => {
    const typeMatch = !typeParam || p.type === typeParam;
    const priceMatch = !priceParam || p.price <= Number(priceParam);
    return typeMatch && priceMatch;
  });

  // Responsive: show tabs on mobile, split view on desktop
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 py-6">
      <div className="container mx-auto max-w-7xl">
        {/* Mobile Tabs */}
        <div className="md:hidden flex border-b mb-4">
          <button className={`flex-1 py-2 ${activeTab === 'list' ? 'border-b-2 border-blue-600 font-bold' : ''}`} onClick={() => setActiveTab('list')}>List</button>
          <button className={`flex-1 py-2 ${activeTab === 'map' ? 'border-b-2 border-blue-600 font-bold' : ''}`} onClick={() => setActiveTab('map')}>Map</button>
        </div>
        {/* Filters Bar */}
        <div className="w-full mb-8">
          <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-blue-100 flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-2 md:mb-0">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              Filters
            </h2>
            <div className="flex-1">
              <Filters />
            </div>
          </div>
        </div>
        {/* Listings and Map side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Listing Card */}
          <div className={`w-full ${activeTab === 'list' ? '' : 'hidden'} md:block`}>
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
                <ListingGrid properties={filteredProperties} activePropertyId={activePropertyId} favoriteIds={favoriteIds} />
              )}
            </div>
          </div>
          {/* Map Card */}
          <div className={`w-full ${activeTab === 'map' ? '' : 'hidden'} md:block`}>
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-blue-100 h-full flex flex-col min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                Map
              </h2>
              <div className="flex-1 min-h-[300px]">
                <MapComponent properties={filteredProperties} onMarkerClick={(id: string) => {
                  setActivePropertyId(id);
                  setActiveTab('list'); // On mobile, switch to list tab
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
