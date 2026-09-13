-- Phase 6: collector location verification at pickup
-- Run in Supabase SQL Editor after schema-phase5.sql

alter table pickups add column if not exists collector_verified_at timestamptz;
alter table pickups add column if not exists collector_check_lat double precision;
alter table pickups add column if not exists collector_check_lng double precision;
alter table pickups add column if not exists proximity_meters integer;
