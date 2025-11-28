export interface Inquiry {
  id: string; // uuid
  property_id: string; // uuid
  user_name: string;
  user_contact: string;
  message?: string;
}
