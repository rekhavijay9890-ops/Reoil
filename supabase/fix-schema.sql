-- Run this in Supabase SQL Editor if pickups table is missing columns

alter table pickups add column if not exists type text not null default 'home';
alter table pickups add column if not exists quantity text not null default '5-10';
alter table pickups add column if not exists notes text default '';
alter table pickups add column if not exists received_at timestamptz not null default now();
