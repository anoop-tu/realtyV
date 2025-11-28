
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-blue-200 via-blue-50 to-blue-300 opacity-90" />
      {/* Futuristic Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-400 bg-opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] bg-blue-600 bg-opacity-20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-300 bg-opacity-20 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2" />

      <div className="z-10 text-center px-8 py-16 rounded-3xl bg-white/30 backdrop-blur-2xl shadow-2xl border border-blue-100 max-w-2xl mx-auto mt-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg text-blue-900">
          Realty<span className="text-blue-600">View</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 font-light max-w-2xl mx-auto text-blue-900/80">
          Discover, compare, and manage properties with a <span className="text-blue-600 font-semibold">futuristic</span> real estate platform.<br />
          <span className="text-blue-700">Interactive maps</span>, <span className="text-blue-700">AI-powered search</span>, and seamless admin tools—all in one place.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link href="/search" className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-xl transition-all duration-200 border-2 border-blue-700/20">
            <span className="mr-2">🔍</span> Start Exploring
          </Link>
          <Link href="/admin/dashboard" className="px-8 py-4 rounded-full bg-white/40 hover:bg-white/70 text-blue-700 text-lg font-semibold border border-blue-200 shadow-xl transition-all duration-200">
            <span className="mr-2">🛠️</span> Admin Portal
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-4 w-full text-center text-blue-900/60 text-xs tracking-wide z-10">
        &copy; {new Date().getFullYear()} RealtyView. All rights reserved.
      </footer>
      {/* Gradient animation CSS moved to global styles or Tailwind config. */}
    </main>
  );
}
