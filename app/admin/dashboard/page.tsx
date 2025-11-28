"use client";

import React, { useState } from 'react';
import PropertyForm from '@/components/PropertyForm';
import CSVUpload from '@/components/CSVUpload';
import ListingsTable from '@/components/ListingsTable';


export default function AdminDashboardPage() {
  const [editProperty, setEditProperty] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-10 tracking-tight flex items-center gap-3">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow-sm">Admin Dashboard</span>
        </h1>
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
        <div className="relative">
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 opacity-30 rounded-full top-0" />
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 mt-12">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              Current Listings
            </h2>
            <ListingsTable onEdit={setEditProperty} refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
