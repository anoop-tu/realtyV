"use client";

import BrokerSelectField from "./BrokerSelectField";
import { fetchAllBrokers } from "../lib/fetchAllBrokers";
// Property Form Component for RealtyView
// Handles add/edit property form, validation, image upload, and submission logic

import { createBrowserClient } from '@supabase/auth-helpers-react';
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import PropertyBasicInfoFields from "./PropertyBasicInfoFields";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import PropertyImageUpload from "./PropertyImageUpload";
import PropertyLocationFields from "./PropertyLocationFields";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { usePropertyFormSubmit } from '../hooks/usePropertyFormSubmit';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  type: z.enum(['rent', 'sale']),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().min(1, 'Address is required'),
  features: z.any().optional(),
  images: z.any().optional(),
  featured: z.boolean().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;


interface PropertyFormProps {
  property?: any;
  onDone?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onDone }) => {
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
  const [brokerError, setBrokerError] = useState<string>("");
  const router = useRouter();

  // Fetch brokers for admin dropdown
  useEffect(() => {
    fetchAllBrokers().then(setBrokers).catch(() => setBrokers([]));
  }, []);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: property ? {
      ...property,
      price: property?.price ?? 0,
      lat: property?.lat ?? 0,
      lng: property?.lng ?? 0,
      featured: property?.featured ?? false,
    } : { featured: false },
  });

  // When property changes, reset form, fetch images, and sync broker
  useEffect(() => {
    if (property) {
      reset({
        ...property,
        price: property?.price ?? 0,
        lat: property?.lat ?? 0,
        lng: property?.lng ?? 0,
        featured: property?.featured ?? false,
      });
      setSelectedBrokerId(property?.broker_id || "");
      // Fetch images for this property from Supabase
      const fetchImages = async () => {
        if (!property?.id) return;
        const { createBrowserClient } = await import('@supabase/auth-helpers-react');
        const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        const { data, error } = await supabase
          .from('media')
          .select('id, url')
          .eq('property_id', property.id)
          .eq('type', 'image');
        if (!error && data) setImages(data);
        else setImages([]);
      };
      fetchImages();
    } else {
      reset();
      setImages([]);
      setSelectedBrokerId("");
    }
  }, [property, reset]);
  // Remove image handler
  // Remove an image from Supabase storage and media table
  const handleRemoveImage = async (imageId: string, imageUrl: string) => {
    if (!property?.id) return;
    if (!confirm('Remove this image?')) return;
    setRemovingImageId(imageId);
      const { createBrowserClient } = await import('@supabase/auth-helpers-react');
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    // Remove from storage bucket
    const path = imageUrl.split('/property-images/')[1];
    if (path) {
      await supabase.storage.from('property-images').remove([`properties/${path}`]);
    }
    // Remove from media table
    await supabase.from('media').delete().eq('id', imageId);
    setImages((imgs) => imgs.filter((img) => img.id !== imageId));
    setRemovingImageId(null);
  };

  /**
   * Handles form submission for adding or updating a property.
   * - Uploads images to Supabase Storage if provided
   * - Inserts or updates property in Supabase
   * - Inserts media records for uploaded images
   */
  // Wrap the onSubmit to include broker_id
  const { onSubmit: baseOnSubmit, uploading, message, setMessage } = usePropertyFormSubmit(property, reset, router, onDone);
  const onSubmit = async (data: any) => {
    setBrokerError("");
    if (brokers.length > 0 && !selectedBrokerId) {
      setBrokerError("Please select a broker.");
      return;
    }
    const submitData = {
      ...data,
      broker_id: selectedBrokerId,
      price: Number(data.price),
      lat: Number(data.lat),
      lng: Number(data.lng),
    };
    await baseOnSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <PropertyBasicInfoFields register={register} errors={errors} />

      <PropertyLocationFields register={register} errors={errors} />
      
      <PropertyImageUpload
        images={images}
        propertyId={property?.id}
        removingImageId={removingImageId}
        onRemoveImage={handleRemoveImage}
        register={register}
      />

      {/* Broker select dropdown for admin edit */}
      {brokers.length > 0 && (
        <>
          <BrokerSelectField
            brokers={brokers}
            value={selectedBrokerId}
            onChange={setSelectedBrokerId}
          />
          {brokerError && <div className="text-red-500 text-sm mt-1">{brokerError}</div>}
        </>
      )}
      
      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4" />
        <label htmlFor="featured" className="text-sm font-medium">Featured Property</label>
      </div>
      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? 'Uploading...' : property && property.id ? 'Update Property' : 'Add Property'}
      </Button>
    </form>
  );
};

export default PropertyForm;