import type { Property } from "@/types/Property";
import React, { useState, useEffect } from 'react';
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams } from 'next/navigation';

const propertyTypes = [
  { label: 'All', value: '' },
  { label: 'Rent', value: 'rent' },
  { label: 'Sale', value: 'sale' },
];

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 10000000;
const DEFAULT_STEP = 1000;

interface FiltersProps {
  properties?: Property[];
}

const Filters: React.FC<FiltersProps> = ({ properties = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dynamically determine max price from properties
  const dynamicMax = properties.length > 0 ? Math.max(...properties.map((p: Property) => p.price)) : DEFAULT_MAX;

  // Parse min/max from URL or use defaults
  const minParam = Number(searchParams.get('min_price'));
  const maxParam = Number(searchParams.get('max_price'));
  const [minPrice, setMinPrice] = useState(Number.isFinite(minParam) && minParam >= 0 ? minParam : DEFAULT_MIN);
  const [maxPrice, setMaxPrice] = useState(Number.isFinite(maxParam) && maxParam > 0 ? maxParam : dynamicMax);

  useEffect(() => {
    // If max price in URL is out of new range, reset to dynamicMax
    setMinPrice(Number.isFinite(minParam) && minParam >= 0 ? Math.min(minParam, dynamicMax) : DEFAULT_MIN);
    setMaxPrice(Number.isFinite(maxParam) && maxParam > 0 ? Math.max(Math.min(maxParam, dynamicMax), DEFAULT_MIN) : dynamicMax);
    // eslint-disable-next-line
  }, [searchParams.get('min_price'), searchParams.get('max_price'), dynamicMax]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', e.target.value);
    router.push(`/search?${params.toString()}`);
  };

  const handleSliderChange = (which: 'min' | 'max', value: number) => {
    let newMin = minPrice;
    let newMax = maxPrice;
    if (which === 'min') {
      newMin = Math.min(value, dynamicMax);
      // Prevent min > max
      if (newMin > newMax) newMax = newMin;
    } else {
      newMax = Math.max(value, DEFAULT_MIN);
      // Prevent max < min
      if (newMax < newMin) newMin = newMax;
    }
    setMinPrice(newMin);
    setMaxPrice(newMax);
    const params = new URLSearchParams(searchParams.toString());
    params.set('min_price', String(newMin));
    params.set('max_price', String(newMax));
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
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 w-full max-w-md">
        <label className="font-medium md:mb-0 md:mr-2 whitespace-nowrap">Price Range</label>
        <div className="flex flex-col md:flex-row items-center gap-2 w-full">
          <span className="text-xs text-gray-500">₹{minPrice.toLocaleString('en-IN')}</span>
          <Slider
            min={DEFAULT_MIN}
            max={dynamicMax}
            step={DEFAULT_STEP}
            value={minPrice}
            onChange={e => handleSliderChange('min', Number(e.target.value))}
            className="w-32 md:w-40"
          />
          <span className="text-xs text-gray-500">to</span>
          <Slider
            min={DEFAULT_MIN}
            max={dynamicMax}
            step={DEFAULT_STEP}
            value={maxPrice}
            onChange={e => handleSliderChange('max', Number(e.target.value))}
            className="w-32 md:w-40"
          />
          <span className="text-xs text-gray-500">₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
