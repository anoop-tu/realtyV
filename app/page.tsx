
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Fluid Gradient Background (now the only main background) */}
      <div className="absolute inset-0 -z-20 animate-gradient bg-gradient-to-br from-blue-300 via-blue-50 to-blue-400 opacity-95" />
      {/* Floating Blobs & Sparkles */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-400 bg-opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-blue-600 bg-opacity-20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-blue-300 bg-opacity-20 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2" />
      {/* Sparkle effect */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {[...Array(18)].map((_, i) => (
          <div key={i} className={`absolute w-1.5 h-1.5 rounded-full bg-blue-200 opacity-70 animate-pulse`} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      {/* Main Card with Glassmorphism and Motion */}
      <div className="z-10 text-center px-8 py-16 rounded-[2.5rem] bg-white/30 backdrop-blur-2xl shadow-2xl border border-blue-100 max-w-3xl mx-auto mt-20 animate-fadein">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-lg text-blue-900 flex items-center justify-center gap-2">
          <span className="inline-block animate-bounce">🏙️</span>
          Realty<span className="text-blue-600">View</span>
        </h1>
        <p className="text-2xl md:text-3xl mb-12 font-light max-w-2xl mx-auto text-blue-900/80">
          Discover, compare, and manage properties with a <span className="text-blue-600 font-semibold">futuristic</span> real estate platform.<br />
          <span className="text-blue-700">Interactive maps</span>, <span className="text-blue-700">AI-powered search</span>, and seamless admin tools—all in one place.
        </p>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <Link href="/search" className="px-10 py-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold shadow-2xl transition-all duration-200 border-2 border-blue-700/20 animate-float">
            <span className="mr-2">🔍</span> Start Exploring
          </Link>
          <Link href="/admin/dashboard" className="px-10 py-5 rounded-full bg-white/40 hover:bg-white/70 text-blue-700 text-xl font-bold border border-blue-200 shadow-2xl transition-all duration-200 animate-float delay-150">
            <span className="mr-2">🛠️</span> Admin Portal
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-4 w-full text-center text-blue-900/60 text-xs tracking-wide z-10">
        &copy; {new Date().getFullYear()} RealtyView. All rights reserved.
      </footer>
    </main>
  );
}
