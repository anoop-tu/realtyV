"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from '@supabase/auth-helpers-react';
import type { Profile } from "@/types/profiles";

export default function MainHeader() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data?.user || null);
      if (data?.user) {
        // Save user id in localStorage for per-user favorites
        localStorage.setItem('sb-user', JSON.stringify({ id: data.user.id, email: data.user.email }));
        // Fetch profile from Supabase
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        setProfile(profileData || null);
      } else {
        setProfile(null);
        localStorage.removeItem('sb-user');
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
  setUser(null);
  localStorage.removeItem('sb-user');
  window.location.href = "/";
  };

  return (
    <header className="w-full bg-white border-b shadow-sm mb-6 sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-blue-700">RealtyView</Link>
          <Link href="/search" className="text-gray-700 hover:text-blue-700">Search</Link>
          <Link href="/favorites" className="text-gray-700 hover:text-blue-700">Favorites</Link>
          {profile?.role === 'admin' && (
            <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-700">Admin</Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <span className="text-gray-700 text-sm">{user.email}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/admin/login" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
