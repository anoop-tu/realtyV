// Main Header Component for RealtyView
// Renders the top navigation bar, user profile, and role-based links
"use client";

import React, { useEffect, useState } from "react";
import { UserCircle2 } from "lucide-react";
import EditProfileModal from "@/components/EditProfileModal";
import Link from "next/link";
import { createBrowserClient } from '@supabase/auth-helpers-react';
import type { Profile } from "@/types/profiles";

export default function MainHeader() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
        <div className="flex items-center gap-4 relative">
          {loading ? null : user ? (
            <>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-100 focus:outline-none"
                onClick={() => setShowDropdown((v) => !v)}
                aria-label="User menu"
              >
                <UserCircle2 className="w-7 h-7 text-blue-700" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg min-w-[220px] z-50 p-4">
                  <div className="mb-2">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium text-gray-800 break-all">{user.email}</div>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs text-gray-500">Name</div>
                    <div className="font-medium text-gray-800 break-all">{profile?.name || '-'}</div>
                  </div>
                  <button
                    className="w-full text-left px-2 py-1 rounded hover:bg-blue-50 text-blue-700 font-medium text-sm mb-2"
                    onClick={() => { setShowEditModal(true); setShowDropdown(false); }}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-1 rounded hover:bg-blue-50 text-red-600 font-medium text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
              <EditProfileModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                profile={profile}
                onProfileUpdate={p => setProfile(p)}
              />
            </>
          ) : (
            <Link href="/admin/login" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
