-- Phase 3: addresses, business accounts, location, push tokens
-- Run in Supabase SQL Editor after schema-phase2.sql

alter table profiles add column if not exists account_type text not null default 'home';

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  label text not null default 'Home',
  address text not null,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create index if not exists addresses_profile_id_idx on addresses (profile_id);

alter table pickups add column if not exists lat double precision;
alter table pickups add column if not exists lng double precision;

create table if not exists push_tokens (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  token text not null,
  platform text not null default 'android',
  created_at timestamptz not null default now(),
  unique (profile_id, token)
);

alter table addresses enable row level security;
alter table push_tokens enable row level security;
