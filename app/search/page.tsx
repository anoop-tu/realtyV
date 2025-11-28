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
    <div className="h-screen w-full flex flex-col md:flex-row">
      {/* Mobile Tabs */}
      <div className="md:hidden flex border-b">
        <button className={`flex-1 py-2 ${activeTab === 'list' ? 'border-b-2 border-blue-600 font-bold' : ''}`} onClick={() => setActiveTab('list')}>List</button>
        <button className={`flex-1 py-2 ${activeTab === 'map' ? 'border-b-2 border-blue-600 font-bold' : ''}`} onClick={() => setActiveTab('map')}>Map</button>
      </div>
      {/* Left: Listing Grid + Filters */}
      <div className={`md:w-1/2 w-full h-full overflow-y-auto ${activeTab === 'list' ? '' : 'hidden'} md:block bg-white`}>
        <div className="p-4">
          <Filters />
        </div>
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading properties...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <ListingGrid properties={filteredProperties} activePropertyId={activePropertyId} />
        )}
      </div>
      {/* Right: Map */}
      <div className={`md:w-1/2 w-full h-full ${activeTab === 'map' ? '' : 'hidden'} md:block`}>
        <MapComponent properties={filteredProperties} onMarkerClick={(id: string) => {
          setActivePropertyId(id);
          setActiveTab('list'); // On mobile, switch to list tab
        }} />
      </div>
    </div>
  );
}
