"use client";

import React, { useState } from 'react';
import PropertyForm from '@/components/PropertyForm';
import CSVUpload from '@/components/CSVUpload';
import ListingsTable from '@/components/ListingsTable';


export default function AdminDashboardPage() {
  const [editProperty, setEditProperty] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add / Edit Property</h2>
          <PropertyForm
            property={editProperty}
            onDone={() => {
              setEditProperty(null);
              setRefreshKey((k) => k + 1);
            }}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Bulk Upload (CSV)</h2>
          <CSVUpload />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Current Listings</h2>
        <ListingsTable onEdit={setEditProperty} refreshKey={refreshKey} />
      </div>
    </div>
  );
}
