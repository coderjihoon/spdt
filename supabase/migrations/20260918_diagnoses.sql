create extension if not exists pgcrypto;

create table if not exists public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  access_token uuid not null unique default gen_random_uuid(),
  email text not null,
  name text,
  product_url text,
  input_paths text[] not null default '{}',
  status text not null check (status in ('uploading', 'ready', 'processing', 'complete', 'failed')),
  report jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  expires_at timestamptz not null default now() + interval '30 days'
);

create table if not exists public.diagnosis_daily_limits (
  email text not null,
  day date not null,
  primary key (email, day)
);

alter table public.diagnoses enable row level security;
alter table public.diagnosis_daily_limits enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('diagnosis-inputs', 'diagnosis-inputs', false, 15728640, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
