# RealtyView

A modern real estate MVP inspired by platforms like 99acres and Zillow. RealtyView is built for both public users and admins, featuring interactive maps, advanced filtering, favorites, broker contact, and a robust admin portal.

---

## � Recent Features & Improvements (2025)

- **Per-user Favorites:** Favorites are now stored per user (using localStorage and Supabase Auth), ensuring each user's favorites are private and persistent.
- **Share Button:** Each property listing card includes a share button that copies the direct property URL to the clipboard and displays a fluid popup for user feedback.
- **Sticky Header:** The main navigation header is now sticky for improved usability.
- **Grid/List/Map View Toggle:** Users can switch between grid, list, and map views on the search page for flexible browsing.
- **Preview Images:** Listings and favorites now display preview images for a richer browsing experience.
- **Enhanced Role-based Navigation:** Navigation and access are dynamically tailored to user roles, with improved login/logout redirects.
- **Modern UI/UX Enhancements:** Fluid popups, improved feedback, and consistent, responsive design throughout the app.

---

## �🏗️ Architecture Overview

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Lucide React
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Maps:** React-Leaflet (OpenStreetMap)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Design:** Clean, whitespace-heavy, mobile-responsive, Royal Blue (#2563EB) as primary color

### High-Level Diagram
```
[User] ⇄ [Next.js Frontend] ⇄ [Supabase Backend (DB, Auth, Storage)]
                                 ⇅
                             [OpenStreetMap via React-Leaflet]
```

---

## 🎨 Design Considerations
- **Modern UI:** Card-based layouts, glassmorphism, gradients, and responsive design
 - **Modern UI/UX:** Fluid popups, sticky header, and responsive feedback for actions like sharing and favoriting
- **Consistency:** Uniform look across admin and public pages
- **Performance:** SSR/ISR with Next.js for fast loads and SEO
- **Security:** Supabase RLS for data protection, role-based access
- **Scalability:** Modular code, scalable DB schema

---

## 🛠️ Tools & Libraries
- **Next.js 14+**: App Router, SSR/ISR, API routes
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Accessible, modern UI components
- **Lucide React**: Icon set
- **Supabase**: Managed PostgreSQL, Auth, Storage, RLS
- **React-Leaflet**: Interactive maps
- **Zustand**: Lightweight state management
- **React Hook Form + Zod**: Form validation

---

## 🖥️ Frontend Details
- **App Router**: All pages use Next.js App Router for routing and layouts
- **Global Styles**: Tailwind CSS with custom animation utilities
- **Component Library**: Shadcn/UI for consistent, accessible UI
- **Map Integration**: React-Leaflet for property locations and search
- **State**: Zustand for favorites and UI state

---

## 🗄️ Backend Details (Supabase)
- **Database**: PostgreSQL with tables for profiles, properties, media, inquiries
- **Auth**: Supabase Auth (email/password, RLS)
- **Storage**: For property images
- **RLS**: Row Level Security for data protection
- **API**: All data fetching via Supabase client

---

## 📄 Page & Feature Descriptions

### `/` (Home)
- Futuristic hero section, call-to-action buttons for search and admin
- Animated gradient background, glassmorphic card

### `/search`
- Split view: Filters (top bar), Listings (left), Map (right)
- Advanced filtering (type, price), favorites, responsive design
- Interactive map with property markers
 - **Grid/List/Map toggle:** Easily switch between grid, list, and map views
 - **Share button:** Copy property links directly from each listing card
 - **Sticky header:** Navigation remains visible while scrolling
 - **Preview images:** Listings show property images for quick browsing

### `/property/[id]`
- Property details, gallery, map, features
- Contact broker form (inquiry saved to backend)
- Favorite toggle
 - **Share button:** Copy the property URL to clipboard
 - **Preview images:** Prominent display of property images

### `/favorites`
- List of favorited properties (localStorage for public users)
 - **Per-user favorites:** Favorites are now private to each user (requires login)
 - **Preview images:** Favorites list shows property images

### `/admin/dashboard`
- Admin-only: Add/edit properties, bulk CSV upload, listings table
- Card-based layout, analytics-ready

---

## 💡 Why Supabase?
- **Managed PostgreSQL**: No server maintenance
- **Auth & RLS**: Secure, role-based access
- **Storage**: Easy image/file uploads
- **Realtime**: Live updates possible
- **Open Source**: No vendor lock-in

## 💡 Why Next.js?
- **App Router**: Modern, flexible routing
- **SSR/ISR**: SEO and performance
- **API Routes**: Serverless functions
- **Developer Experience**: Fast refresh, TypeScript support

---

## 🚀 Local Setup Instructions

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
4. **Run the development server**
   ```sh
   npm run dev
   ```
5. **Open the app**
   - Visit [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - UI and logic components
- `lib/` - Utility functions and Supabase client
- `types/` - TypeScript types
- `supabase_schema.sql` - Database schema

---

## 📣 Contact
For questions or contributions, open an issue or pull request on GitHub.
