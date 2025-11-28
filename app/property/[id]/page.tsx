"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from '@supabase/auth-helpers-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Heart } from "lucide-react";


export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [favorite, setFavorite] = useState(false);
  const [contact, setContact] = useState({ name: "", contact: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      // Fetch property by id
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        setProperty(null);
      } else {
        // Fetch images from media table
        const { data: media } = await supabase
          .from('media')
          .select('url')
          .eq('property_id', id)
          .eq('type', 'image');
        setProperty({
          ...data,
          images: media && media.length > 0 ? media.map((m: any) => m.url) : [],
        });
      }
    };
    fetchProperty();
    // Check favorite
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorite(favs.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;
    if (favs.includes(id)) {
      updated = favs.filter((fid: string) => fid !== id);
      setFavorite(false);
    } else {
      updated = [...favs, id];
      setFavorite(true);
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.from('inquiries').insert([
      {
        property_id: id,
        user_name: contact.name,
        user_contact: contact.contact,
        message: contact.message,
      },
    ]);
    if (!error) {
      setSubmitted(true);
      setContact({ name: "", contact: "", message: "" });
    } else {
      alert('Failed to send inquiry: ' + error.message);
    }
  };

  if (!property) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Gallery */}
      <div className="md:col-span-2 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg overflow-hidden">
          {property.images.map((img: string, i: number) => (
            <img key={i} src={img} alt={property.title} className="object-cover w-full h-40 md:h-56 rounded-lg" />
          ))}
        </div>
        <h1 className="text-3xl font-bold flex items-center gap-4">
          {property.title}
          <button onClick={toggleFavorite} aria-label="Save to Favorites">
            <Heart className={`w-7 h-7 transition ${favorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </h1>
        <div className="text-xl text-blue-700 font-semibold">₹{property.price.toLocaleString()}</div>
        <div className="text-gray-600 mb-2">{property.address}</div>
        <div className="flex gap-6 text-sm text-gray-700 mb-4">
          <span>Type: <b>{property.type}</b></span>
          <span>Bedrooms: <b>{property.features.bedrooms}</b></span>
          <span>Bathrooms: <b>{property.features.bathrooms}</b></span>
          <span>Area: <b>{property.features.area}</b></span>
        </div>
        <div className="mb-6 text-gray-800 leading-relaxed">{property.description}</div>
        {/* Static Map */}
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <MapContainer center={[property.lat, property.lng]} zoom={15} style={{ height: 300, width: "100%" }} scrollWheelZoom={false} dragging={false} doubleClickZoom={false} zoomControl={false} attributionControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[property.lat, property.lng]} />
          </MapContainer>
        </div>
      </div>
      {/* Contact Form */}
      <aside className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
        <h2 className="text-xl font-bold mb-4">Contact Broker</h2>
        {submitted ? (
          <div className="text-green-600 font-semibold">Inquiry sent!</div>
        ) : (
          <form className="space-y-4" onSubmit={handleContactSubmit}>
            <Input name="name" placeholder="Your Name" value={contact.name} onChange={handleContactChange} required />
            <Input name="contact" placeholder="Email or Phone" value={contact.contact} onChange={handleContactChange} required />
            <textarea name="message" placeholder="Message" value={contact.message} onChange={handleContactChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={4} />
            <Button type="submit" className="w-full">Send Inquiry</Button>
          </form>
        )}
      </aside>
    </div>
  );
}
