-- Reoil pickups table
-- Run this in Supabase → SQL Editor → New query → Run

create table if not exists pickups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  type text not null,
  quantity text not null,
  notes text default '',
  received_at timestamptz not null default now()
);

create index if not exists pickups_received_at_idx on pickups (received_at desc);

-- No public access — only your Next.js server uses the service role key
alter table pickups enable row level security;
