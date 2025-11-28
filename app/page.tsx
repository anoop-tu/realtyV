
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="opacity-20 blur-2xl">
          <circle cx="80%" cy="20%" r="200" fill="#2563EB" />
          <circle cx="20%" cy="80%" r="150" fill="#60A5FA" />
        </svg>
      </div>
      <div className="z-10 text-center px-6 py-12 rounded-xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
          Welcome to <span className="text-blue-300">RealtyView</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 font-light max-w-2xl mx-auto">
          Discover, compare, and manage properties with a futuristic real estate platform. Experience interactive maps, advanced search, and seamless admin tools—all in one place. Welcome to RealtyView.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link href="/search" className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold shadow-lg transition-all duration-200">
            🔍 Start Exploring
          </Link>
          <Link href="/admin/dashboard" className="px-8 py-4 rounded-full bg-white/20 hover:bg-white/40 text-white text-lg font-semibold border border-white/30 shadow-lg transition-all duration-200">
            🛠️ Admin Portal
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-4 w-full text-center text-white/60 text-xs tracking-wide z-10">
  &copy; {new Date().getFullYear()} RealtyView. All rights reserved.
      </footer>
    </main>
  );
}
