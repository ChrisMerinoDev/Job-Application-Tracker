-- ============================================
-- Run this in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- ============================================

-- 1. Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  goal text default '',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  company text not null,
  position text not null,
  work_type text not null check (work_type in ('Remote', 'On-site', 'Hybrid')),
  location text default '',
  status text not null default 'pending' check (status in ('pending', 'rejected', 'accepted')),
  created_at timestamptz default now()
);

alter table public.jobs enable row level security;

create policy "Users can read own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on public.jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on public.jobs for delete
  using (auth.uid() = user_id);


create index idx_jobs_user_id on public.jobs (user_id);
