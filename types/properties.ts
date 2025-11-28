export interface Property {
  id: string; // uuid
  title: string;
  description?: string;
  price: number;
  type: 'rent' | 'sale';
  lat: number;
  lng: number;
  address: string;
  broker_id?: string; // uuid
  features?: Record<string, any>;
  status?: string;
}
