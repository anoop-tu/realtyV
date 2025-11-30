"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';


export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      // Fetch featured properties
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (!properties || properties.length === 0) {
        setFeatured([]);
        setLoading(false);
        return;
      }
      // For each property, fetch its first image from media table
      const withImages = await Promise.all(properties.map(async (property: any) => {
        const { data: media } = await supabase
          .from('media')
          .select('url')
          .eq('property_id', property.id)
          .eq('type', 'image')
          .order('id', { ascending: true })
          .limit(1);
        return {
          ...property,
          previewImg: media && media.length > 0 ? media[0].url : null,
        };
      }));
      setFeatured(withImages);
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  return (
    <main className="min-h-screen relative">
      {/* Background image and overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/80 via-white/80 to-blue-400/80" />
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
          alt="Background city skyline"
          className="w-full h-full object-cover object-center fixed inset-0 -z-20 opacity-60"
          style={{ minHeight: '100vh' }}
        />
      </div>
      {/* Hero Section */}
  <section className="relative py-20 px-4 flex flex-col items-center text-center bg-white/70 backdrop-blur-md rounded-t-3xl rounded-b-3xl shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-6 leading-tight">
            Find Your Next <span className="text-blue-600">Home</span> in India
          </h1>
          <p className="text-lg md:text-2xl text-blue-800 mb-8 font-light">
            Search, compare, and discover the best properties in top Indian cities. Explore listings, view on map, and connect with trusted brokers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/search" className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-lg transition-all duration-200">
              <span className="mr-2">🔍</span> Start Your Search
            </Link>
            <Link href="/admin/dashboard" className="px-8 py-4 rounded-full bg-white border border-blue-200 text-blue-700 text-lg font-bold shadow-lg hover:bg-blue-50 transition-all duration-200">
              <span className="mr-2">🛠️</span> Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
  <section className="max-w-6xl mx-auto py-16 px-4 bg-white/80 rounded-3xl shadow-lg mt-10">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Featured Properties</h2>
        {loading ? (
          <div className="text-center py-8 text-blue-600">Loading featured properties...</div>
        ) : featured.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No featured properties at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featured.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {property.previewImg ? (
                    <img src={property.previewImg} alt={property.title} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-5xl">🏠</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">{property.title}</h3>
                  <div className="text-blue-600 font-bold text-lg mb-1">₹{property.price?.toLocaleString('en-IN')}</div>
                  <div className="text-gray-600 mb-4 flex-1">{property.address}</div>
                  <Link href={`/property/${property.id}`} className="mt-auto inline-block px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Editorial/Content Section */}
  <section className="bg-blue-50/80 py-16 px-4 rounded-3xl shadow-lg mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Why RealtyView?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
            <div>
              <h3 className="text-lg font-bold text-blue-700 mb-2">Verified Listings</h3>
              <p className="text-blue-900/80">All properties are verified for accuracy and updated regularly for your peace of mind.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-700 mb-2">Interactive Map Search</h3>
              <p className="text-blue-900/80">Explore properties visually with our advanced map interface and location-based filters.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-700 mb-2">Expert Support</h3>
              <p className="text-blue-900/80">Our team and partner brokers are here to help you at every step of your real estate journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
  <footer className="py-8 text-center text-blue-900/60 text-xs tracking-wide border-t border-blue-100 bg-white/80 rounded-t-3xl rounded-b-3xl shadow-lg mt-10">
        &copy; {new Date().getFullYear()} RealtyView. All rights reserved.
      </footer>
    </main>
  );
}
