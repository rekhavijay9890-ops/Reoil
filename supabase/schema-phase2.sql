-- Phase 2: customer profiles, pickup status, earnings
-- Run in Supabase → SQL Editor after schema.sql

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text not null,
  email text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table pickups add column if not exists profile_id uuid references profiles(id);
alter table pickups add column if not exists status text not null default 'pending';
alter table pickups add column if not exists preferred_date text;
alter table pickups add column if not exists preferred_time text;
alter table pickups add column if not exists liters_estimated integer not null default 0;
alter table pickups add column if not exists earnings_inr integer not null default 0;

create index if not exists pickups_profile_id_idx on pickups (profile_id);
create index if not exists pickups_status_idx on pickups (status);

alter table profiles enable row level security;
