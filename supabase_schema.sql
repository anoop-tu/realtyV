-- 1. PROFILES
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('admin', 'user', 'broker')) not null,
  email text unique not null
);

-- 2. PROPERTIES
create table properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null,
  type text check (type in ('rent', 'sale')) not null,
  lat double precision not null,
  lng double precision not null,
  address text not null,
  broker_id uuid references profiles(id),
  features jsonb,
  status text default 'active'
);

-- 3. MEDIA
create table media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  url text not null,
  type text check (type in ('image', 'video', 'doc')) not null
);

-- 4. INQUIRIES
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  user_name text not null,
  user_contact text not null,
  message text
);

-- Enable RLS
alter table properties enable row level security;

-- RLS Policy: Anyone can SELECT
create policy "Public can read properties"
  on properties
  for select
  using (true);

-- RLS Policy: Only admins can INSERT/UPDATE
create policy "Only admins can modify properties"
  on properties
  for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
