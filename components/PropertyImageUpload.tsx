// Handles property image upload, display, and removal for RealtyView property form
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PropertyImageUploadProps {
  images: { id: string; url: string }[];
  propertyId?: string;
  removingImageId: string | null;
  onRemoveImage: (imageId: string, imageUrl: string) => void;
  register: any;
}

const PropertyImageUpload: React.FC<PropertyImageUploadProps> = ({ images, propertyId, removingImageId, onRemoveImage, register }) => (
  <div>
    <label className="text-sm font-medium mb-2 block">Property Images</label>
    <Input type="file" multiple accept="image/*" {...register('images')} />
    {propertyId && images.length > 0 && (
      <div className="mt-3 grid grid-cols-2 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative group border rounded overflow-hidden">
            <img src={img.url} alt="Property" className="w-full h-28 object-cover" />
            <Button
              type="button"
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 opacity-80 group-hover:opacity-100"
              onClick={() => onRemoveImage(img.id, img.url)}
              disabled={removingImageId === img.id}
            >
              {removingImageId === img.id ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default PropertyImageUpload;
