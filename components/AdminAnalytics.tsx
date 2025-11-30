// Admin Analytics Component for RealtyView
// Displays property/user stats and recent activity for the admin dashboard
"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatNumber = (n: number) => n.toLocaleString();

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      // Properties
      const { count: totalProperties } = await supabase
        .from("properties")
        .select("id", { count: "exact", head: true });
      const { count: propertiesThisMonth } = await supabase
        .from("properties")
        .select("id", {
          count: "exact",
          head: true,
        })
        .gte("created_at",
          new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        );
      // Supabase JS client does not support .group(), so aggregate in JS
      const { data: allTypes } = await supabase
        .from("properties")
        .select("type");
      const byType: { type: string, count: number }[] = [];
      if (allTypes) {
        const typeMap: Record<string, number> = {};
        for (const row of allTypes) {
          if (row.type) typeMap[row.type] = (typeMap[row.type] || 0) + 1;
        }
        for (const type in typeMap) {
          byType.push({ type, count: typeMap[type] });
        }
      }
      // Users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      const { count: usersThisMonth } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      // Recent properties
      const { data: recentProperties } = await supabase
        .from("properties")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      setStats({
        totalProperties,
        propertiesThisMonth,
        byType,
        totalUsers,
        usersThisMonth,
        recentProperties,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div className="py-8 text-center">Loading analytics...</div>;
  if (!stats) return <div className="py-8 text-center text-red-500">Failed to load analytics.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <Card>
        <h3 className="text-lg font-bold mb-2">Property Analytics</h3>
        <div className="mb-2">Total Properties: <b>{formatNumber(stats.totalProperties ?? 0)}</b></div>
        <div className="mb-2">Properties Added This Month: <b>{formatNumber(stats.propertiesThisMonth ?? 0)}</b></div>
        <div className="mb-2">By Type:</div>
        <ul className="ml-4 list-disc">
          {stats.byType?.map((t: any) => (
            <li key={t.type}>{t.type}: {formatNumber(t.count)}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h3 className="text-lg font-bold mb-2">User Analytics</h3>
        <div className="mb-2">Total Users: <b>{formatNumber(stats.totalUsers ?? 0)}</b></div>
        <div className="mb-2">New Users This Month: <b>{formatNumber(stats.usersThisMonth ?? 0)}</b></div>
      </Card>
      <Card className="md:col-span-2">
        <h3 className="text-lg font-bold mb-2">Recent Property Additions</h3>
        <ul>
          {stats.recentProperties?.map((p: any) => (
            <li key={p.id} className="mb-1">
              <span className="font-medium">{p.title}</span> <span className="text-xs text-gray-500">({new Date(p.created_at).toLocaleDateString()})</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
