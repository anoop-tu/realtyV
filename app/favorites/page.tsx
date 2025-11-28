"use client";

import React, { useEffect, useState } from "react";
import ListingGrid from "../../components/ListingGrid";
import { createBrowserClient } from '@supabase/auth-helpers-react';
import type { Property } from "../../types/Property";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favs = localStorage.getItem("favorites");
    setFavorites(favs ? JSON.parse(favs) : []);
    const fetchProperties = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active');
      setProperties(data || []);
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
