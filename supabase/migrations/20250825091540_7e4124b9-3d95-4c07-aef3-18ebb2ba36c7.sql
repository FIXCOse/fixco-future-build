-- RPC Functions for Worker System with proper security
-- Create jobs from bookings
create or replace function public.create_job_from_booking(p_booking_id uuid)
returns uuid 
language plpgsql 
security definer
set search_path = public
as $$
declare 
  jid uuid;
begin
  -- Check permission
  if not is_admin_or_owner() then
    raise exception 'Access denied';
  end if;

  insert into public.jobs (
    source_type, source_id, customer_id, property_id,
    title, description, address, postal_code, city,
    pricing_mode, hourly_rate, fixed_price, rot_rut,
    status, pool_enabled, start_scheduled_at, due_date
  )
  select
    'booking', b.id, b.customer_id, b.property_id,
    coalesce(b.service_name, 'Arbetsorder'), coalesce(b.description, ''), 
    b.address, b.postal_code, b.city,
    case when b.price_type = 'fixed' then 'fixed' else 'hourly' end,
    b.hourly_rate, b.final_price, 
    jsonb_build_object('type', b.rot_rut_type, 'eligible', true),
    'pool', true, b.scheduled_date::timestamptz, null
  from public.bookings b 
  where b.id = p_booking_id
  returning id into jid;

  if jid is null then
    raise exception 'Failed to create job from booking';
  end if;

  insert into public.job_events(job_id, actor, event, meta) 
  values (jid, auth.uid(), 'job.created', jsonb_build_object('source','booking'));
  
  return jid;
end $$;

-- Create jobs from quotes
create or replace function public.create_job_from_quote(p_quote_id uuid)
returns uuid 
language plpgsql 
security definer
set search_path = public
as $$
declare 
  jid uuid;
begin
  -- Check permission
  if not is_admin_or_owner() then
    raise exception 'Access denied';
  end if;

  insert into public.jobs(
    source_type, source_id, customer_id, property_id,
    title, description, address, postal_code, city,
    pricing_mode, hourly_rate, fixed_price, rot_rut,
    status, pool_enabled, start_scheduled_at, due_date
  )
  select
    'quote', q.id, q.customer_id, q.property_id,
    q.title, q.description, q.customer_address, q.customer_postal_code, q.customer_city,
    'fixed', null, q.total_amount, 
    jsonb_build_object('rot_amount', q.rot_amount, 'rut_amount', q.rut_amount),
    'pool', true, null, q.valid_until::timestamptz
  from public.quotes q 
  where q.id = p_quote_id
  returning id into jid;

  if jid is null then
    raise exception 'Failed to create job from quote';
  end if;

  insert into public.job_events(job_id, actor, event, meta) 
  values (jid, auth.uid(), 'job.created', jsonb_build_object('source','quote'));
  
  return jid;
end $$;

-- Claim job atomically
create or replace function public.claim_job(p_job_id uuid)
returns boolean 
language plpgsql 
security definer
set search_path = public
as $$
declare 
  ok boolean := false;
begin
  -- Check if user is worker
  if not is_worker() then
    raise exception 'Only workers can claim jobs';
  end if;

  update public.jobs
     set assigned_worker_id = auth.uid(),
         assigned_at = now(),
         status = 'assigned',
         pool_enabled = false
   where id = p_job_id
     and status = 'pool'
     and pool_enabled = true
     and assigned_worker_id is null
  returning true into ok;

  if ok then
    insert into public.worker_assignments(job_id, worker_id, assigned_by)
    values (p_job_id, auth.uid(), null);

    insert into public.job_events(job_id, actor, event) 
    values (p_job_id, auth.uid(), 'job.claimed');
  end if;
  
  return coalesce(ok, false);
end $$;

-- Create time entry
create or replace function public.create_time_entry(p jsonb)
returns uuid 
language plpgsql 
security definer
set search_path = public
as $$
declare 
  time_id uuid;
  job_worker_id uuid;
begin
  -- Verify worker has access to this job
  select assigned_worker_id into job_worker_id 
  from public.jobs 
  where id = (p->>'job_id')::uuid;
  
  if job_worker_id != auth.uid() and not is_admin_or_owner() then
    raise exception 'Access denied to this job';
  end if;

  insert into public.time_logs(job_id, worker_id, started_at, ended_at, break_min, manual_hours, note)
  values(
    (p->>'job_id')::uuid, 
    coalesce((p->>'worker_id')::uuid, auth.uid()),
    (p->>'started_at')::timestamptz, 
    (p->>'ended_at')::timestamptz,
    coalesce((p->>'break_min')::int, 0), 
    (p->>'manual_hours')::numeric, 
    p->>'note'
  )
  returning id into time_id;

  insert into public.job_events(job_id, actor, event, meta)
  values ((p->>'job_id')::uuid, auth.uid(), 'time.added', p);

  return time_id;
end $$;

-- Create material entry
create or replace function public.create_material_entry(p jsonb)
returns uuid 
language plpgsql 
security definer
set search_path = public
as $$
declare 
  material_id uuid;
  job_worker_id uuid;
begin
  -- Verify worker has access to this job
  select assigned_worker_id into job_worker_id 
  from public.jobs 
  where id = (p->>'job_id')::uuid;
  
  if job_worker_id != auth.uid() and not is_admin_or_owner() then
    raise exception 'Access denied to this job';
  end if;

  insert into public.material_logs(job_id, worker_id, sku, name, qty, unit_price, supplier)
  values(
    (p->>'job_id')::uuid, 
    coalesce((p->>'worker_id')::uuid, auth.uid()),
    nullif(p->>'sku',''), 
    p->>'name',
    coalesce((p->>'qty')::numeric, 1), 
    (p->>'unit_price')::numeric, 
    p->>'supplier'
  )
  returning id into material_id;

  insert into public.job_events(job_id, actor, event, meta)
  values ((p->>'job_id')::uuid, auth.uid(), 'material.added', p);

  return material_id;
end $$;

-- Create expense entry
create or replace function public.create_expense_entry(p jsonb)
returns uuid 
language plpgsql 
security definer
set search_path = public
as $$
declare 
  expense_id uuid;
  job_worker_id uuid;
begin
  -- Verify worker has access to this job
  select assigned_worker_id into job_worker_id 
  from public.jobs 
  where id = (p->>'job_id')::uuid;
  
  if job_worker_id != auth.uid() and not is_admin_or_owner() then
    raise exception 'Access denied to this job';
  end if;

  insert into public.expense_logs(job_id, worker_id, category, amount, receipt_url, note)
  values(
    (p->>'job_id')::uuid, 
    coalesce((p->>'worker_id')::uuid, auth.uid()),
    p->>'category',
    (p->>'amount')::numeric,
    p->>'receipt_url',
    p->>'note'
  )
  returning id into expense_id;

  insert into public.job_events(job_id, actor, event, meta)
  values ((p->>'job_id')::uuid, auth.uid(), 'expense.added', p);

  return expense_id;
end $$;

-- Complete job
create or replace function public.complete_job(p_job_id uuid)
returns boolean 
language plpgsql 
security definer
set search_path = public
as $$
declare
  job_worker_id uuid;
begin
  -- Verify worker has access to this job
  select assigned_worker_id into job_worker_id 
  from public.jobs 
  where id = p_job_id;
  
  if job_worker_id != auth.uid() and not is_admin_or_owner() then
    raise exception 'Access denied to this job';
  end if;

  update public.jobs
     set status = 'completed'
   where id = p_job_id;

  insert into public.job_events(job_id, actor, event)
  values (p_job_id, auth.uid(), 'job.completed');

  return true;
end $$;

-- Prepare invoice from job data
create or replace function public.prepare_invoice_from_job(p_job_id uuid)
returns jsonb 
language sql 
stable 
security definer
set search_path = public
as $$
  with t as (
    select coalesce(sum(coalesce(hours, manual_hours)), 0) as total_hours
    from public.time_logs where job_id = p_job_id
  ),
  m as (
    select coalesce(sum(qty * coalesce(unit_price, 0)), 0) as mat_total
    from public.material_logs where job_id = p_job_id
  ),
  e as (
    select coalesce(sum(amount), 0) as exp_total
    from public.expense_logs where job_id = p_job_id
  ),
  j as (
    select * from public.jobs where id = p_job_id
  )
  select jsonb_build_object(
    'job_id', p_job_id,
    'pricing_mode', j.pricing_mode,
    'hourly_rate', j.hourly_rate,
    'fixed_price', j.fixed_price,
    'rot_rut', j.rot_rut,
    'hours', coalesce(t.total_hours, 0),
    'materials', coalesce(m.mat_total, 0),
    'expenses', coalesce(e.exp_total, 0),
    'subtotal', case 
      when j.pricing_mode = 'hourly' then 
        coalesce(t.total_hours, 0) * coalesce(j.hourly_rate, 0) + coalesce(m.mat_total, 0) + coalesce(e.exp_total, 0)
      else 
        coalesce(j.fixed_price, 0) + coalesce(m.mat_total, 0) + coalesce(e.exp_total, 0)
    end
  )
  from j 
  cross join t 
  cross join m 
  cross join e;
$$;

-- Assign job to worker (admin only)
create or replace function public.assign_job_to_worker(p_job_id uuid, p_worker_id uuid)
returns boolean 
language plpgsql 
security definer
set search_path = public
as $$
begin
  -- Check permission
  if not is_admin_or_owner() then
    raise exception 'Access denied';
  end if;

  update public.jobs
     set assigned_worker_id = p_worker_id,
         assigned_at = now(),
         status = 'assigned',
         pool_enabled = false
   where id = p_job_id
     and status in ('pool', 'assigned');

  insert into public.worker_assignments(job_id, worker_id, assigned_by)
  values (p_job_id, p_worker_id, auth.uid());

  insert into public.job_events(job_id, actor, event, meta)
  values (p_job_id, auth.uid(), 'job.assigned', jsonb_build_object('worker_id', p_worker_id));

  return true;
end $$;

-- Update job status (admin only for certain statuses)
create or replace function public.update_job_status(p_job_id uuid, p_status text)
returns boolean 
language plpgsql 
security definer
set search_path = public
as $$
declare
  job_worker_id uuid;
  current_status text;
begin
  -- Get current job info
  select assigned_worker_id, status into job_worker_id, current_status
  from public.jobs 
  where id = p_job_id;

  -- Check permissions based on status change
  if p_status in ('approved', 'invoiced', 'cancelled') then
    if not is_admin_or_owner() then
      raise exception 'Only admin can set status to %', p_status;
    end if;
  elsif job_worker_id != auth.uid() and not is_admin_or_owner() then
    raise exception 'Access denied to this job';
  end if;

  update public.jobs
     set status = p_status
   where id = p_job_id;

  insert into public.job_events(job_id, actor, event, meta)
  values (p_job_id, auth.uid(), 'job.status_changed', 
          jsonb_build_object('old_status', current_status, 'new_status', p_status));

  return true;
end $$;