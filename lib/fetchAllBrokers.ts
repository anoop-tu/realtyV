// Utility to fetch all brokers from Supabase
import { createBrowserClient } from '@supabase/auth-helpers-react';

export async function fetchAllBrokers(forceRefresh = false) {
  const cacheKey = 'broker-list-cache-v1';
  const cacheTTL = 5 * 60 * 1000; // 5 minutes
  if (!forceRefresh && typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < cacheTTL) {
        return data;
      }
    }
  }
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'broker');
  if (error) throw error;
  if (typeof window !== 'undefined') {
    localStorage.setItem(cacheKey, JSON.stringify({ data: data || [], ts: Date.now() }));
  }
  return data || [];
}
