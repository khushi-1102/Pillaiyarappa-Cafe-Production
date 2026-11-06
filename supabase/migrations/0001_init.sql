-- 0001_init.sql — Core Schema, Tables, Enums, Indexes and Triggers
create extension if not exists pgcrypto;

create type enquiry_type   as enum ('catering','contact','callback');
create type enquiry_status as enum ('new','contacted','confirmed','completed','cancelled','spam');
create type media_kind     as enum ('food','restaurant');
create type banner_place   as enum ('hero','promo','announcement');

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('owner','admin','editor')),
  created_at timestamptz not null default now()
);

create table site_settings (
  id int primary key default 1 check (id = 1),
  brand_name text not null default 'Pillaiyarappa South Indian Corner',
  phone_primary text,
  phone_secondary text,
  whatsapp_number text,
  whatsapp_default_text text,
  zomato_url text,
  swiggy_url text,
  instagram_url text,
  facebook_url text,
  email text,
  delivery_text text,
  delivery_min_order_inr int,
  catering_text text,
  about_title text,
  about_body text,
  seo_title text,
  seo_description text,
  og_image_url text,
  announcement_text text,
  announcement_active boolean not null default false,
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 120),
  description text check (description is null or char_length(description) <= 400),
  price_inr numeric(8,2) check (price_inr is null or price_inr >= 0),
  is_veg boolean not null default true,
  is_bestseller boolean not null default false,
  is_available boolean not null default true,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on menu_items (category_id, sort_order) where is_active;

create table branches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  address text not null,
  phone text,
  maps_url text,
  embed_url text,
  lat numeric(9,6),
  lng numeric(9,6),
  opening_hours jsonb,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text not null,
  kind media_kind not null default 'food',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index on gallery_images (kind, sort_order) where is_active;

create table banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  image_url text,
  link_url text,
  placement banner_place not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) <= 500),
  source text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  type enquiry_type not null default 'catering',
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email text check (email is null or char_length(email) <= 120),
  event_type text,
  guests int check (guests is null or guests between 1 and 5000),
  event_date date,
  branch_id uuid references branches(id) on delete set null,
  message text check (message is null or char_length(message) <= 1000),
  status enquiry_status not null default 'new',
  admin_notes text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on enquiries (status, created_at desc);
create index on enquiries (phone, created_at desc);

create table audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  diff jsonb,
  created_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['site_settings','categories','menu_items','branches','banners','enquiries'] loop
    execute format('create trigger trg_%I_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;
