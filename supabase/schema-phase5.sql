-- Phase 5: delivery collectors
-- Run in Supabase SQL Editor after schema-phase4.sql

create table if not exists collectors (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text not null,
  password_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table pickups add column if not exists collector_id uuid references collectors(id);
alter table pickups add column if not exists liters_collected integer;

create index if not exists pickups_collector_id_idx on pickups (collector_id);

alter table collectors enable row level security;
