// Property Form Component for RealtyView
// Handles add/edit property form, validation, image upload, and submission logic
"use client";
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBrowserClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

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
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const router = useRouter();

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

  // When property changes, reset form and fetch images for editing
  useEffect(() => {
    if (property) {
      reset({
        ...property,
        price: property?.price ?? 0,
        lat: property?.lat ?? 0,
        lng: property?.lng ?? 0,
        featured: property?.featured ?? false,
      });
      // Fetch images for this property from Supabase
      const fetchImages = async () => {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
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
    }
  }, [property, reset]);
  // Remove image handler
  // Remove an image from Supabase storage and media table
  const handleRemoveImage = async (imageId: string, imageUrl: string) => {
    if (!property?.id) return;
    if (!confirm('Remove this image?')) return;
    setRemovingImageId(imageId);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
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
  const onSubmit = async (data: PropertyFormValues) => {
    setUploading(true);
    setMessage(null);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    try {
      // Upload images to Supabase Storage if provided
      const imageFiles = data.images as FileList;
      const uploadedUrls: string[] = [];

      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${i}.${fileExt}`;
          const filePath = `properties/${fileName}`;

          // Upload each image to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Image upload error:', uploadError);
            continue;
          }

          // Get public URL for uploaded image
          const { data: publicUrlData } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      let propertyData;
      if (property && property.id) {
        // Update existing property in Supabase
        const { data: updated, error: updateError } = await supabase
          .from('properties')
          .update({
            title: data.title,
            description: data.description || '',
            price: data.price,
            type: data.type,
            lat: data.lat,
            lng: data.lng,
            address: data.address,
            features: data.features || {},
            status: 'active',
            featured: data.featured ?? false,
          })
          .eq('id', property.id)
          .select()
          .single();
        if (updateError) throw updateError;
        propertyData = updated;
      } else {
        // Insert new property in Supabase
        const { data: inserted, error: insertError } = await supabase
          .from('properties')
          .insert({
            title: data.title,
            description: data.description || '',
            price: data.price,
            type: data.type,
            lat: data.lat,
            lng: data.lng,
            address: data.address,
            features: data.features || {},
            status: 'active',
            featured: data.featured ?? false,
          })
          .select()
          .single();
        if (insertError) throw insertError;
        propertyData = inserted;
      }

      // Insert media records if images were uploaded
      if (uploadedUrls.length > 0 && propertyData) {
        const mediaRecords = uploadedUrls.map(url => ({
          property_id: propertyData.id,
          url,
          type: 'image' as const,
        }));

        // Insert image URLs into media table
        const { error: mediaError } = await supabase
          .from('media')
          .insert(mediaRecords);

        if (mediaError) console.error('Media insert error:', mediaError);
      }

      setMessage({ type: 'success', text: property && property.id ? 'Property updated successfully!' : 'Property added successfully!' });
      reset();
      router.refresh();
      if (onDone) onDone();
    } catch (error: any) {
      console.error('Error submitting property:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to add property' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div>
        <Input {...register('title')} placeholder="Title" />
        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
      </div>
      
      <div>
        <textarea 
          {...register('description')} 
          placeholder="Description" 
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" 
        />
      </div>
      
      <div>
        <Input {...register('price', { valueAsNumber: true })} placeholder="Price" type="number" step="0.01" />
        {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
      </div>
      
      <div>
        <select {...register('type')} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>
        {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input {...register('lat', { valueAsNumber: true })} placeholder="Latitude" type="number" step="any" />
          {errors.lat && <span className="text-red-500 text-sm">{errors.lat.message}</span>}
        </div>
        <div>
          <Input {...register('lng', { valueAsNumber: true })} placeholder="Longitude" type="number" step="any" />
          {errors.lng && <span className="text-red-500 text-sm">{errors.lng.message}</span>}
        </div>
      </div>
      
      <div>
        <Input {...register('address')} placeholder="Address" />
        {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
      </div>
      
      <div>
        <label className="text-sm font-medium mb-2 block">Property Images</label>
        <Input type="file" multiple accept="image/*" {...register('images')} />
        {property?.id && images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group border rounded overflow-hidden">
                <img src={img.url} alt="Property" className="w-full h-28 object-cover" />
                <Button
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 opacity-80 group-hover:opacity-100"
                  onClick={() => handleRemoveImage(img.id, img.url)}
                  disabled={removingImageId === img.id}
                >
                  {removingImageId === img.id ? 'Removing...' : 'Remove'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
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
