-- Fixco Worker System - Complete Database Schema
-- 1. Worker profiles and roles
create table if not exists public.worker_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text null,
  skills text[] null,
  regions text[] null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Jobs table (core of the worker system)
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_type text not null check (source_type in ('booking','quote')),
  source_id uuid not null,
  customer_id uuid null,
  property_id uuid null,

  title text,
  description text,
  address text,
  postal_code text,
  city text,

  pricing_mode text not null check (pricing_mode in ('hourly','fixed')),
  hourly_rate numeric null,
  fixed_price numeric null,
  rot_rut jsonb not null default '{}'::jsonb,

  status text not null default 'pool' check (
    status in ('pool','assigned','in_progress','paused','completed','approved','invoiced','cancelled')
  ),
  pool_enabled boolean not null default true,

  assigned_worker_id uuid null references auth.users(id),
  assigned_at timestamptz null,
  start_scheduled_at timestamptz null,
  due_date timestamptz null
);

-- 3. Worker assignments (history)
create table if not exists public.worker_assignments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid null,
  assigned_at timestamptz not null default now()
);

-- 4. Time tracking
create table if not exists public.time_logs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz null,
  ended_at timestamptz null,
  break_min integer not null default 0,
  hours numeric generated always as (
    case
      when started_at is not null and ended_at is not null
      then greatest(0, extract(epoch from (ended_at - started_at))/3600.0 - break_min/60.0)
      else null
    end
  ) stored,
  manual_hours numeric null,
  note text null,
  created_at timestamptz not null default now()
);

-- 5. Material tracking
create table if not exists public.material_logs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_id uuid not null references auth.users(id) on delete cascade,
  sku text null,
  name text not null,
  qty numeric not null default 1,
  unit_price numeric null,
  supplier text null,
  created_at timestamptz not null default now()
);

-- 6. Expense tracking
create table if not exists public.expense_logs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_id uuid not null references auth.users(id) on delete cascade,
  category text null,
  amount numeric not null,
  receipt_url text null,
  note text null,
  created_at timestamptz not null default now()
);

-- 7. Job photos
create table if not exists public.job_photos (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_id uuid not null references auth.users(id) on delete cascade,
  file_path text not null,
  caption text null,
  created_at timestamptz not null default now()
);

-- 8. Job signatures
create table if not exists public.job_signatures (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  signed_by_name text not null,
  role text not null check (role in ('customer','worker')),
  file_path text not null,
  signed_at timestamptz not null default now()
);

-- 9. Job events (audit trail)
create table if not exists public.job_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  actor uuid null,
  event text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 10. Helper functions for role checking
create or replace function public.is_worker() returns boolean
language sql stable security definer as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'worker');
$$;

-- 11. Enable RLS on all tables
alter table public.worker_profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.time_logs enable row level security;
alter table public.material_logs enable row level security;
alter table public.expense_logs enable row level security;
alter table public.job_photos enable row level security;
alter table public.job_signatures enable row level security;
alter table public.worker_assignments enable row level security;
alter table public.job_events enable row level security;

-- 12. RLS Policies for Jobs
create policy jobs_select_worker on public.jobs
for select to authenticated
using (
  is_admin_or_owner()
  or assigned_worker_id = auth.uid()
  or (pool_enabled = true and status = 'pool' and is_worker())
);

create policy jobs_update_worker on public.jobs
for update to authenticated
using (
  is_admin_or_owner()
  or assigned_worker_id = auth.uid()
)
with check (
  is_admin_or_owner()
  or (
    assigned_worker_id = auth.uid()
    and status in ('assigned','in_progress','paused','completed')
  )
);

create policy jobs_insert_admin on public.jobs
for insert to authenticated
with check (is_admin_or_owner());

-- 13. RLS Policies for Time Logs
create policy tl_worker_ins on public.time_logs
for insert to authenticated
with check (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

create policy tl_worker_sel on public.time_logs
for select to authenticated
using (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

-- 14. RLS Policies for Material Logs
create policy ml_worker_ins on public.material_logs
for insert to authenticated
with check (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

create policy ml_worker_sel on public.material_logs
for select to authenticated
using (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

-- 15. Similar policies for other tables
create policy el_worker_ins on public.expense_logs
for insert to authenticated
with check (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

create policy el_worker_sel on public.expense_logs
for select to authenticated
using (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

create policy jp_worker_ins on public.job_photos
for insert to authenticated
with check (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

create policy jp_worker_sel on public.job_photos
for select to authenticated
using (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

create policy js_worker_ins on public.job_signatures
for insert to authenticated
with check (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

create policy js_worker_sel on public.job_signatures
for select to authenticated
using (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

create policy wa_worker_ins on public.worker_assignments
for insert to authenticated
with check (
  is_admin_or_owner()
  or worker_id = auth.uid()
);

create policy wa_worker_sel on public.worker_assignments
for select to authenticated
using (
  is_admin_or_owner()
  or worker_id = auth.uid()
);

create policy je_worker_ins on public.job_events
for insert to authenticated
with check (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

create policy je_worker_sel on public.job_events
for select to authenticated
using (
  is_admin_or_owner()
  or exists (select 1 from public.jobs j where j.id = job_id and j.assigned_worker_id = auth.uid())
);

-- Worker profiles policies
create policy wp_select_all on public.worker_profiles
for select to authenticated
using (is_admin_or_owner() or user_id = auth.uid());

create policy wp_insert_own on public.worker_profiles
for insert to authenticated
with check (user_id = auth.uid());

create policy wp_update_own on public.worker_profiles
for update to authenticated
using (user_id = auth.uid());

-- 16. Storage buckets for job assets
insert into storage.buckets (id, name, public) 
values ('job-photos', 'job-photos', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('job-signatures', 'job-signatures', false) 
on conflict (id) do nothing;

-- Storage policies for job photos
create policy "Job photos access for assigned workers" on storage.objects
for select to authenticated
using (
  bucket_id = 'job-photos' and (
    is_admin_or_owner()
    or exists (
      select 1 from public.job_photos jp
      join public.jobs j on j.id = jp.job_id
      where jp.file_path = name and j.assigned_worker_id = auth.uid()
    )
  )
);

create policy "Job photos upload for assigned workers" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'job-photos' and (
    is_admin_or_owner()
    or auth.uid() is not null
  )
);

-- Storage policies for job signatures
create policy "Job signatures access for assigned workers" on storage.objects
for select to authenticated
using (
  bucket_id = 'job-signatures' and (
    is_admin_or_owner()
    or exists (
      select 1 from public.job_signatures js
      join public.jobs j on j.id = js.job_id
      where js.file_path = name and j.assigned_worker_id = auth.uid()
    )
  )
);

create policy "Job signatures upload for assigned workers" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'job-signatures' and (
    is_admin_or_owner()
    or auth.uid() is not null
  )
);

-- Enable realtime
alter publication supabase_realtime add table public.jobs;
alter publication supabase_realtime add table public.time_logs;
alter publication supabase_realtime add table public.material_logs;
alter publication supabase_realtime add table public.expense_logs;
alter publication supabase_realtime add table public.job_events;
alter publication supabase_realtime add table public.worker_assignments;