// CSV Upload Component for RealtyView
// Handles bulk property upload via CSV parsing and Supabase integration
"use client";
import React, { useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Papa from 'papaparse';
import { createBrowserClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

interface CSVProperty {
  title: string;
  description?: string;
  price: string | number;
  type: 'rent' | 'sale';
  lat: string | number;
  lng: string | number;
  address: string;
  features?: string;
  status?: string;
}

const CSVUpload: React.FC = () => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    // Create a per-session Supabase client
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user || userError) {
      setMessage({ type: 'error', text: 'You must be logged in to upload properties.' });
      setUploading(false);
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const properties = results.data
            .filter((row: any) => row.title && row.price && row.address)
            .map((row: any) => ({
              title: row.title,
              description: row.description || '',
              price: parseFloat(row.price),
              type: row.type === 'rent' ? 'rent' : 'sale',
              lat: parseFloat(row.lat),
              lng: parseFloat(row.lng),
              address: row.address,
              features: row.features ? JSON.parse(row.features) : {},
              status: row.status || 'active',
              broker_id: user.id, // Attach broker_id for RLS
            }));

          if (properties.length === 0) {
            setMessage({ type: 'error', text: 'No valid properties found in CSV' });
            setUploading(false);
            return;
          }

          // Batch insert into Supabase with user_id
          const { data, error } = await supabase
            .from('properties')
            .insert(properties)
            .select();

          if (error) throw error;

          setMessage({
            type: 'success',
            text: `Successfully uploaded ${data?.length || 0} properties!`
          });

          // Force reload to update listings
          if (typeof window !== 'undefined') {
            window.location.reload();
          } else {
            router.refresh();
          }

        } catch (error: any) {
          console.error('CSV upload error:', error);
          setMessage({
            type: 'error',
            text: error.message || 'Error processing CSV file'
          });
        } finally {
          setUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      error: (error) => {
        console.error('Parse error:', error);
        setUploading(false);
        setMessage({ type: 'error', text: 'Error parsing CSV file' });
      }
    });
  };

  return (
    <div className="space-y-2">
      {message && (
        <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <Input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="cursor-pointer"
      />
      
      <Button 
        className="w-full" 
        onClick={() => fileInputRef.current?.click()} 
        disabled={uploading} 
        type="button"
      >
        {uploading ? 'Processing CSV...' : 'Upload CSV'}
      </Button>
      
      <div className="text-xs text-gray-500 mt-2">
        <p>CSV should have columns: title, description, price, type (rent/sale), lat, lng, address</p>
      </div>
    </div>
  );
};

export default CSVUpload;
