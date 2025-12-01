// Search Page for RealtyView
// Implements property search, filtering, sorting, and map/list/grid views for users
"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Filters from '../../components/Filters';
import ListingGrid from '../../components/ListingGrid';
import { Select } from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';

import type { Property } from '../../types/Property';
import { createBrowserClient } from '@supabase/auth-helpers-react';
const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

export default function SearchPage() {
  // Pagination state (must be inside the component)
  const [currentPage, setCurrentPage] = useState(1);
  const PROPERTIES_PER_PAGE = 4;

  // Fetch properties from Supabase
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      // Fetch properties with broker profile (join)
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*, profiles:broker_id(id, email, name)')
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
      // Attach images array and broker_name to each property
      const propertiesWithImages = (propertiesData || []).map((p: any) => ({
        ...p,
        images: imagesByProperty[p.id] || [],
        broker_name: p.profiles?.name || p.profiles?.email || '',
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
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc'>('price-asc');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter properties based on search params
  const typeParam = searchParams.get('type') || '';
  const minPriceParam = searchParams.get('min_price');
  const maxPriceParam = searchParams.get('max_price');
  const minPrice = minPriceParam ? Number(minPriceParam) : null;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : null;
  let filteredProperties = properties.filter((p) => {
    const typeMatch = !typeParam || p.type === typeParam;
    const minMatch = minPrice === null || p.price >= minPrice;
    const maxMatch = maxPrice === null || p.price <= maxPrice;
    return typeMatch && minMatch && maxMatch;
  });
  // Keyword search logic
  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = keyword.trim().toLowerCase();
    if (!kw) {
      setSearchResults(null);
      return;
    }
    // Search by property title, address, or broker name
    const results = filteredProperties.filter((p: any) => {
      const titleMatch = p.title?.toLowerCase().includes(kw);
      const addressMatch = p.address?.toLowerCase().includes(kw);
      const brokerMatch = p.broker_name?.toLowerCase().includes(kw);
      return titleMatch || addressMatch || brokerMatch;
    });
    setSearchResults(results);
  };
  // Sort by price
  filteredProperties = [...filteredProperties].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    return 0;
  });
  // Reset to page 1 when filters, sort, or searchResults change
  useEffect(() => { setCurrentPage(1); }, [sortOrder, typeParam, minPriceParam, maxPriceParam, searchResults]);

  const displayProperties = searchResults !== null ? searchResults : filteredProperties;
  const totalPages = Math.ceil(displayProperties.length / PROPERTIES_PER_PAGE);
  const paginatedProperties = displayProperties.slice((currentPage - 1) * PROPERTIES_PER_PAGE, currentPage * PROPERTIES_PER_PAGE);

  // Responsive: show tabs on mobile, split view on desktop
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 py-6">
      <div className="container mx-auto max-w-7xl">

        {/* Keyword Search Card */}
        <div className="w-full mb-4">
          <form onSubmit={handleKeywordSearch} className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-blue-100 flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-2 md:mb-0">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              Keyword Search
            </h2>
            <input
              type="text"
              placeholder="Search by property name, address, or broker name..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="flex-1 border border-blue-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Search
            </button>
            {searchResults !== null && (
              <button
                type="button"
                className="px-3 py-2 rounded bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition border border-gray-200"
                onClick={() => { setKeyword(""); setSearchResults(null); }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  Listings
                </h2>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-600 font-medium">Sort by:</label>
                  <div className="w-44">
                    <Select
                      id="sort"
                      value={sortOrder}
                      onChange={e => setSortOrder(e.target.value as 'price-asc' | 'price-desc')}
                      className="bg-white border-blue-200 focus-visible:ring-blue-400 shadow-sm"
                    >
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </Select>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading properties...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : displayProperties.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No results found for your search.</div>
              ) : (
                <>
                  <ListingGrid properties={paginatedProperties} activePropertyId={activePropertyId} favoriteIds={favoriteIds} grid={viewType === 'grid'} />
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 disabled:opacity-50"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          className={`px-3 py-1 rounded text-sm font-medium border border-gray-200 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                          onClick={() => setCurrentPage(i + 1)}
                          aria-label={`Page ${i + 1}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 disabled:opacity-50"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
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
