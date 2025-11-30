// Root layout for RealtyView app
// Sets up global metadata, header, and main container for all pages
export const metadata = {
  title: 'RealtyView | Find Your Next Home in India',
  description: 'Search, compare, and discover the best properties in top Indian cities. Explore listings, view on map, and connect with trusted brokers on RealtyView.',
  openGraph: {
    title: 'RealtyView | Find Your Next Home in India',
    description: 'Search, compare, and discover the best properties in top Indian cities. Explore listings, view on map, and connect with trusted brokers on RealtyView.',
    type: 'website',
    url: 'https://yourdomain.com/',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80',
        width: 1200,
        height: 630,
        alt: 'RealtyView Hero',
      },
    ],
  },
};


import './globals.css';
import MainHeader from '../components/MainHeader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <MainHeader />
        <div className="container mx-auto max-w-6xl py-8">
          {children}
        </div>
      </body>
    </html>
  )
}
