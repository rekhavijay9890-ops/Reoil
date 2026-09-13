-- Phase 4: negotiable pricing per litre
-- Run in Supabase SQL Editor after schema-phase3.sql

alter table pickups add column if not exists proposed_rate_per_litre numeric;
alter table pickups add column if not exists agreed_rate_per_litre numeric;
alter table pickups add column if not exists negotiable boolean not null default false;
