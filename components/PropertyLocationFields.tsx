// PropertyLocationFields.tsx
// Extracted location fields for RealtyView property form
import React from 'react';
import { Input } from '@/components/ui/input';

interface PropertyLocationFieldsProps {
  register: any;
  errors: any;
}

const PropertyLocationFields: React.FC<PropertyLocationFieldsProps> = ({ register, errors }) => (
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
);

export default PropertyLocationFields;
