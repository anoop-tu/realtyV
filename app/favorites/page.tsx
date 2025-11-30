// Favorites Page for RealtyView
// Displays user's favorite properties with images, using localStorage and Supabase
"use client";


import React, { useEffect, useState } from "react";
import ListingGrid from "../../components/ListingGrid";
import { createBrowserClient } from '@supabase/auth-helpers-react';
import type { Property } from "../../types/Property";

function getFavoritesKey() {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('sb-user') || 'null');
    if (user && user.id) {
      return `favorites_${user.id}`;
    }
  }
  return 'favorites';
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = getFavoritesKey();
    const favs = localStorage.getItem(key);
    setFavorites(favs ? JSON.parse(favs) : []);
    const fetchProperties = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      // Fetch all active properties
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active');
      if (error) {
        setProperties([]);
        setLoading(false);
        return;
      }
      // Fetch images for all favorite properties
      const favIds = (favs ? JSON.parse(favs) : []);
      const favProperties = (propertiesData || []).filter((p: any) => favIds.includes(p.id));
      let imagesByProperty: Record<string, string[]> = {};
      if (favProperties.length > 0) {
        const { data: media } = await supabase
          .from('media')
          .select('property_id, url')
          .in('property_id', favProperties.map((p: any) => p.id))
          .eq('type', 'image');
        if (media && Array.isArray(media)) {
          for (const m of media) {
            if (!imagesByProperty[m.property_id]) imagesByProperty[m.property_id] = [];
            imagesByProperty[m.property_id].push(m.url);
          }
        }
      }
      // Attach images array to each property
      const favPropertiesWithImages = favProperties.map((p: any) => ({
        ...p,
        images: imagesByProperty[p.id] || [],
      }));
      setProperties(favPropertiesWithImages);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  if (loading) return <div className="container mx-auto py-8">Loading...</div>;

  if (!favorites.length) {
    return <div className="container mx-auto py-8 text-gray-500">No favorites yet. Add properties to your favorites!</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      <ListingGrid properties={properties} favoriteIds={favorites} onlyFavorites />
    </div>
  );
}
