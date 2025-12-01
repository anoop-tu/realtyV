// Custom hook for handling property form submission logic in RealtyView
import { useState } from 'react';
import { createBrowserClient } from '@supabase/auth-helpers-react';

export function usePropertyFormSubmit(property: any, reset: any, router: any, onDone?: () => void) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const onSubmit = async (data: any) => {
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
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, file);
          if (uploadError) {
            console.error('Image upload error:', uploadError);
            continue;
          }
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

  return { onSubmit, uploading, message, setMessage };
}
