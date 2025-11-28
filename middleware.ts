import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => request.cookies.get(key)?.value,
        set: (key, value, options) => {
          response.cookies.set({ name: key, value, ...options });
        },
        remove: (key, options) => {
          response.cookies.set({ name: key, value: '', ...options });
        },
      },
    }
  );
  await supabase.auth.getSession();
  return response;
}

export const config = {
  matcher: [
    '/admin',
    '/admin/',
    '/admin/dashboard/:path*',
    '/admin/protected/:path*',
    // Add other protected admin routes here
  ],
};
