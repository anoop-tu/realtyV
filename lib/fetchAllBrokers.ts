// Utility to fetch all brokers from Supabase
import { createBrowserClient } from '@supabase/auth-helpers-react';

export async function fetchAllBrokers() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'broker');
  if (error) throw error;
  return data || [];
}
