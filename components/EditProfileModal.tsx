// EditProfileModal.tsx
// Modal for editing the logged-in user's profile
"use client";
import React, { useState } from "react";
import { createBrowserClient } from '@supabase/auth-helpers-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditProfileModal({ open, onClose, profile, onProfileUpdate }: {
  open: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdate: (profile: any) => void;
}) {
  const [name, setName] = useState(profile?.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', profile.id);
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      onProfileUpdate({ ...profile, name });
      onClose();
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="p-2 bg-gray-100 rounded text-gray-700 text-sm">{profile.email}</div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex justify-end gap-2">
          <Button type="button" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="button" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}
