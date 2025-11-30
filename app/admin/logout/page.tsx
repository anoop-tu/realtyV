// Admin Logout Page for RealtyView
// Signs out the user and redirects to the admin login page
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LogoutPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: () => {}, // Not needed for logout
        remove: () => {}, // Not needed for logout
      },
    }
  );
  await supabase.auth.signOut();
  redirect('/admin/login');
}
