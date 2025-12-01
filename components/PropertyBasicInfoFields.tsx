// PropertyBasicInfoFields.tsx
// Extracted basic info fields for RealtyView property form
import React from 'react';
import { Input } from '@/components/ui/input';

interface PropertyBasicInfoFieldsProps {
  register: any;
  errors: any;
}

const PropertyBasicInfoFields: React.FC<PropertyBasicInfoFieldsProps> = ({ register, errors }) => (
  <>
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
    <div>
      <Input {...register('address')} placeholder="Address" />
      {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
    </div>
  </>
);

export default PropertyBasicInfoFields;
