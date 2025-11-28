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
    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
        <label className="font-medium md:mb-0 md:mr-2 whitespace-nowrap">Property Type</label>
        <Select
          onChange={handleTypeChange}
          value={searchParams.get('type') || ''}
          className="w-32 md:w-36"
        >
          {propertyTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
        <label className="font-medium md:mb-0 md:mr-2 whitespace-nowrap">Max Price</label>
        <Input
          type="number"
          onChange={handlePriceChange}
          value={searchParams.get('price') || ''}
          placeholder="Any"
          className="w-28 md:w-32"
        />
      </div>
    </div>
  );
};

export default Filters;
