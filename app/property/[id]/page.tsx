// Property Detail Page (server) for RealtyView
// Fetches property data for SEO metadata and renders the client detail component
import { Metadata } from 'next';
import { supabase } from '@/lib/supabaseClient';
import PropertyDetailClient from './PropertyDetailClient';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: property } = await supabase
    .from('properties')
    .select('title, description')
    .eq('id', params.id)
    .single();
  if (!property) {
    return {
      title: 'Property Not Found | RealtyView',
      description: 'This property could not be found on RealtyView.'
    };
  }
  return {
    title: `${property.title} | RealtyView`,
    description: property.description || 'View details, price, and location for this property.',
  };
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <PropertyDetailClient id={params.id} />;
}
