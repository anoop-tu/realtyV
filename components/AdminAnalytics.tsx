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
      // Users by type
      const { data: allUsers } = await supabase
        .from("profiles")
        .select("id, role, name, email");
      let totalUsers = 0, brokers = 0, admins = 0, users = 0;
      let brokerList: any[] = [];
      if (allUsers) {
        totalUsers = allUsers.length;
        for (const u of allUsers) {
          if (u.role === 'broker') brokers++;
          else if (u.role === 'admin') admins++;
          else users++;
        }
        brokerList = allUsers.filter((u: any) => u.role === 'broker');
      }
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
      // Properties per broker
      let brokerPropertyCounts: { broker_id: string, broker_name: string, broker_email: string, count: number }[] = [];
      if (brokerList.length > 0) {
        // Fetch all properties with broker_id
        const { data: allProperties } = await supabase
          .from("properties")
          .select("id, broker_id");
        if (allProperties) {
          const countMap: Record<string, number> = {};
          for (const p of allProperties) {
            if (p.broker_id) countMap[p.broker_id] = (countMap[p.broker_id] || 0) + 1;
          }
          brokerPropertyCounts = brokerList.map(b => ({
            broker_id: b.id,
            broker_name: b.name || b.email,
            broker_email: b.email,
            count: countMap[b.id] || 0
          }));
        }
      }
      setStats({
        totalProperties,
        propertiesThisMonth,
        byType,
        totalUsers,
        usersThisMonth,
        recentProperties,
        brokers,
        admins,
        users,
        brokerPropertyCounts,
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
        <div className="mb-2">Brokers: <b>{formatNumber(stats.brokers ?? 0)}</b></div>
        <div className="mb-2">Admins: <b>{formatNumber(stats.admins ?? 0)}</b></div>
        <div className="mb-2">Users: <b>{formatNumber(stats.users ?? 0)}</b></div>
      </Card>
      <Card>
        <h3 className="text-lg font-bold mb-2">Properties per Broker</h3>
        <ul>
          {stats.brokerPropertyCounts?.length > 0 ? stats.brokerPropertyCounts.map((b: any) => (
            <li key={b.broker_id} className="mb-1">
              <span className="font-medium">{b.broker_name}</span> <span className="text-xs text-gray-500">({b.broker_email})</span>: <b>{formatNumber(b.count)}</b>
            </li>
          )) : <li>No brokers found.</li>}
        </ul>
      </Card>
      <Card>
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
