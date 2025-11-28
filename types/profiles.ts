export interface Profile {
  id: string; // uuid
  role: 'admin' | 'user' | 'broker';
  email: string;
}
