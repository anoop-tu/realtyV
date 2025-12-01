// Admin Dashboard Page for RealtyView
// Implements admin analytics, property CRUD, CSV upload, and filter/sortable listings management
"use client";

import React, { useState } from 'react';

import PropertyForm from '@/components/PropertyForm';
import CSVUpload from '@/components/CSVUpload';
import ListingsTable from '@/components/ListingsTable';
import Filters from '@/components/Filters';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import AdminAnalytics from '@/components/AdminAnalytics';
import Tabs from '@/components/ui/Tabs';


export default function AdminDashboardPage() {
  const [editProperty, setEditProperty] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc'>('price-asc');
  const [typeFilter, setTypeFilter] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);

  // Fetch all listings for filtering/sorting
  React.useEffect(() => {
    async function fetchAll() {
      const supabase = (await import('@supabase/auth-helpers-react')).createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase.from('properties').select('*');
      setAllListings(data || []);
    }
    fetchAll();
  }, [refreshKey]);

  // Filter and sort listings
  React.useEffect(() => {
    let filtered = allListings.filter((p) => {
      const typeMatch = !typeFilter || p.type === typeFilter;
      const minMatch = p.price >= minPrice;
      const maxMatch = p.price <= maxPrice;
      return typeMatch && minMatch && maxMatch;
    });
    filtered = [...filtered].sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });
    setFilteredListings(filtered);
  }, [allListings, typeFilter, minPrice, maxPrice, sortOrder]);

  // Get dynamic max price
  const dynamicMax = allListings.length > 0 ? Math.max(...allListings.map((p) => p.price)) : 10000000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-10 tracking-tight flex items-center gap-3">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow-sm">Admin Dashboard</span>
        </h1>
        <Tabs
          tabs={[{
            label: 'Analytics',
            content: <AdminAnalytics />
          }, {
            label: 'Property Maintenance',
            content: (
              <>
                {/* Property Form and CSV Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      Add / Edit Property
                    </h2>
                    <PropertyForm
                      property={editProperty}
                      onDone={() => {
                        setEditProperty(null);
                        setRefreshKey((k) => k + 1);
                      }}
                    />
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      Bulk Upload (CSV)
                    </h2>
                    <CSVUpload />
                  </div>
                </div>
                {/* Listings Table with Filters and Sort */}
                <div className="relative">
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 opacity-30 rounded-full top-0" />
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 mt-12">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 gap-4 flex-wrap">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <label className="font-medium md:mb-0 md:mr-2 whitespace-nowrap">Property Type</label>
                        <Select
                          value={typeFilter}
                          onChange={e => setTypeFilter(e.target.value)}
                          className="w-32 md:w-36"
                        >
                          <option value="">All</option>
                          <option value="rent">Rent</option>
                          <option value="sale">Sale</option>
                        </Select>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 w-full max-w-2xl flex-shrink">
                        <label className="font-medium md:mb-0 md:mr-2 whitespace-nowrap">Price Range</label>
                        <div className="flex flex-col md:flex-row items-center gap-2 w-full flex-wrap">
                          <span className="text-xs text-gray-500">₹{minPrice.toLocaleString('en-IN')}</span>
                          <Slider
                            min={0}
                            max={dynamicMax}
                            step={1000}
                            value={minPrice}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setMinPrice(val);
                              if (val > maxPrice) setMaxPrice(val);
                            }}
                            className="w-32 md:w-40"
                          />
                          <span className="text-xs text-gray-500">to</span>
                          <Slider
                            min={0}
                            max={dynamicMax}
                            step={1000}
                            value={maxPrice}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setMaxPrice(val);
                              if (val < minPrice) setMinPrice(val);
                            }}
                            className="w-32 md:w-40"
                          />
                          <span className="text-xs text-gray-500">₹{maxPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0 md:ml-4 flex-shrink-0">
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
                    <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      Current Listings
                    </h2>
                    <ListingsTable onEdit={setEditProperty} refreshKey={refreshKey} listings={filteredListings} />
                  </div>
                </div>
              </>
            )
          }]}
        />
      </div>
    </div>
  );
}
