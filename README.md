
# RealtyView

RealtyView is a modern, full-stack real estate MVP inspired by platforms like 99acres and Zillow. It is designed for both public users and admins, featuring interactive maps, advanced filtering, favorites, broker contact, and a robust admin portal. The app is built with a focus on clean UI/UX, security, and scalability.

---

## 🏗️ Architecture Overview

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI (component library)
- Lucide React (icons)
- Zustand (state management)
- React Hook Form + Zod (forms/validation)
- React-Leaflet (OpenStreetMap integration)

**Backend:**
- Supabase (PostgreSQL, Auth, Storage for images, RLS)

**Integration:**
- The frontend communicates directly with Supabase using the official JS client. All data (properties, profiles, media, inquiries) is fetched or mutated via Supabase APIs. Auth state is managed via Supabase Auth Helpers, and RLS policies enforce security on the backend.

**High-Level Diagram:**
```
[User] ⇄ [Next.js Frontend] ⇄ [Supabase Backend (DB, Auth, Storage)]
                                 ⇅
                             [OpenStreetMap via React-Leaflet]
```

---

## 🛠️ Tools, Languages, and Technologies

- **Next.js 14+**: Modern React framework with App Router, SSR/ISR, and API routes.
- **TypeScript**: Type safety across the stack.
- **Tailwind CSS**: Utility-first styling for rapid, consistent UI.
- **Shadcn/UI**: Accessible, modern UI components.
- **Lucide React**: Icon set for a clean, modern look.
- **Supabase**: Managed PostgreSQL, Auth, Storage, and RLS for security.
- **React-Leaflet**: Interactive maps using OpenStreetMap.
- **Zustand**: Lightweight state management.
- **React Hook Form + Zod**: Robust form validation.
- **PapaParse**: CSV parsing for admin bulk upload.

---

## 🎨 Design Considerations

- **Clean, whitespace-heavy, mobile-responsive UI**
- **Royal Blue (#2563EB)** as the primary color
- **Card-based layouts, gradients, glassmorphism**
- **Consistent look** across admin and public pages
- **Performance**: SSR/ISR for fast loads and SEO
- **Accessibility**: Shadcn/UI and semantic HTML
- **Scalability**: Modular code, scalable DB schema

---

## 🔒 Authentication & Security

- **Supabase Auth**: Email/password authentication, session management via Supabase Auth Helpers.
- **Role-Based Access (RBAC)**: User roles (admin, user, broker) are enforced via the `profiles` table and RLS policies.
- **Row Level Security (RLS)**: All sensitive DB operations (CRUD on properties, etc.) are protected by RLS and role checks. Only admins can insert, update, or delete properties.
- **No secrets or tokens** are exposed in the frontend. Only public anon keys are used client-side.
- **Favorites**: Per-user favorites are stored in localStorage, keyed by user ID. No sensitive data is stored in localStorage.
- **No XSS/CSRF/Open Redirects**: No use of `dangerouslySetInnerHTML`, `eval`, or unsafe DOM APIs. Navigation is handled safely via Next.js router.

---

## 💡 Why Next.js?

- **App Router**: Modern, flexible routing and layouts.
- **SSR/ISR**: SEO and performance out of the box.
- **API Routes**: Serverless functions for backend logic if needed.
- **Developer Experience**: Fast refresh, TypeScript support, and a rich ecosystem.

---

## � Why Supabase?

- **Managed PostgreSQL**: No server maintenance required.
- **Auth & RLS**: Secure, role-based access and row-level security.
- **Storage**: Easy image/file uploads for property media.
- **Realtime**: Live updates possible.
- **Open Source**: No vendor lock-in.

---

## 🌐 Features

- **Interactive Map**: Split-screen view with map and listings, powered by React-Leaflet and OpenStreetMap.
- **Admin Portal**: Role-based access for admins to CRUD listings, bulk upload via CSV, and view analytics.
- **Public View**: Advanced filtering, favorites (per-user, localStorage), and broker contact forms.
- **SEO**: Dynamic metadata generation for every property page.
- **Favorites**: Per-user, persistent, and private.
- **Share Button**: Copy property URLs directly from listing cards.
- **Sticky Header**: Main navigation remains visible while scrolling.
- **Grid/List/Map View Toggle**: Flexible browsing on the search page.
- **Preview Images**: Listings and favorites display property images; fallback to emoji if missing.
- **Modern UI/UX**: Fluid popups, feedback, and responsive design.
- **Analytics**: Admin dashboard with property and user analytics.

---

## �️ Backend Integration

- **Supabase as the backend**: All data (properties, profiles, media, inquiries) is managed in Supabase tables.
- **API Integration**: The frontend uses the Supabase JS client to fetch and mutate data. Auth state is synced via Supabase Auth Helpers.
- **RLS Policies**: Enforced on the backend to ensure only authorized users can perform sensitive actions.
- **Media Storage**: Property images are stored in Supabase Storage and linked via the `media` table.

---

## 🚀 Getting Started (Fresh Setup)

1. **Clone the repository**
   ```sh
   git clone https://github.com/anoop-tu/realtyV.git
   cd realtyV/realtyV
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local` (or create `.env.local`)
   - Add your Supabase project URL and anon key:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```
4. **Set up your Supabase project**
   - Create the tables as described in `supabase_schema.sql` (profiles, properties, media, inquiries)
   - Enable RLS and set up policies as shown in the schema file
   - Configure Storage bucket for property images
5. **Run the development server**
   ```sh
   npm run dev
   ```
6. **Open the app**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - UI and logic components
- `lib/` - Utility functions and Supabase client
- `types/` - TypeScript types
- `supabase_schema.sql` - Database schema

---

## 📣 Disclaimer
 - 100% vibe coded !!!
 - It just works !!!
