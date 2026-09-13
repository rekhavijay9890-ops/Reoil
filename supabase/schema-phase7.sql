-- Phase 7: delivery boy self-onboarding + admin approval
-- Run in Supabase SQL Editor after schema-phase6.sql

alter table collectors add column if not exists onboarding_status text not null default 'approved';
alter table collectors add column if not exists city text;
alter table collectors add column if not exists vehicle_type text;
alter table collectors add column if not exists approved_at timestamptz;

-- Existing collectors created before this migration stay approved
