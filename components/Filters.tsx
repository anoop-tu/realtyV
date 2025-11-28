import React from 'react';
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRouter, useSearchParams } from 'next/navigation';

const propertyTypes = [
  { label: 'All', value: '' },
  { label: 'Rent', value: 'rent' },
  { label: 'Sale', value: 'sale' },
];

const Filters: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', e.target.value);
    router.push(`/search?${params.toString()}`);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('price', e.target.value);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block mb-1 font-medium">Property Type</label>
        <Select onChange={handleTypeChange} value={searchParams.get('type') || ''}>
          {propertyTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Max Price</label>
  <Input type="number" onChange={handlePriceChange} value={searchParams.get('price') || ''} placeholder="Any" />
      </div>
    </div>
  );
};

export default Filters;
