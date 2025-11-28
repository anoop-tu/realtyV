export interface Media {
  id: string; // uuid
  property_id: string; // uuid
  url: string;
  type: 'image' | 'video' | 'doc';
}
