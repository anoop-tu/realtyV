"use client";
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { createBrowserClient } from '@supabase/auth-helpers-react';
import { Trash2, Edit } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  type: 'rent' | 'sale';
  address: string;
  status: string;
}


interface ListingsTableProps {
  onEdit?: (property: Property) => void;
  refreshKey?: number;
}

const ListingsTable: React.FC<ListingsTableProps> = ({ onEdit, refreshKey }) => {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    // Use authenticated client for RLS
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    setDeleting(id);
    // Use authenticated client for RLS
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    try {
      // Optionally, check user is admin here if needed
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setListings(listings.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  if (loading) {
    return <div className="text-center py-8">Loading properties...</div>;
  }

  if (listings.length === 0) {
    return <div className="text-center py-8 text-gray-500">No properties found. Add your first property above!</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-semibold">Title</th>
            <th className="px-4 py-2 text-left font-semibold">Price</th>
            <th className="px-4 py-2 text-left font-semibold">Type</th>
            <th className="px-4 py-2 text-left font-semibold">Address</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
            <th className="px-4 py-2 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="bg-white rounded-lg shadow-sm">
              <td className="px-4 py-2 align-middle">
                <Link href={`/property/${listing.id}`} className="text-blue-700 hover:underline">
                  {listing.title}
                </Link>
              </td>
              <td className="px-4 py-2 align-middle">
                ${listing.price.toLocaleString()}
              </td>
              <td className="px-4 py-2 align-middle capitalize">{listing.type}</td>
              <td className="px-4 py-2 align-middle">{listing.address}</td>
              <td className="px-4 py-2 align-middle">
                <span className={`px-2 py-1 rounded-full text-xs ${listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {listing.status}
                </span>
              </td>
              <td className="px-4 py-2 align-middle">
                <div className="flex gap-2">
                  <Button 
                    className="flex items-center gap-1 text-sm px-3 py-1 border border-gray-300 hover:bg-gray-100"
                    onClick={() => onEdit && onEdit(listing)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button 
                    className="flex items-center gap-1 text-sm px-3 py-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDelete(listing.id)}
                    disabled={deleting === listing.id}
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleting === listing.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListingsTable;
