// Layout for Admin Dashboard in RealtyView
// Handles server-side authentication and RBAC for admin-only access
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

  // Use getUser for secure user verification
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user || userError) {
    redirect('/admin/login');
  }

  // Fetch user profile to check role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile || profile.role !== 'admin') {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
