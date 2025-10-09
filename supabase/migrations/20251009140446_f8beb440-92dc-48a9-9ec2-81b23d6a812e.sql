-- Update create_job_from_quote to fetch address from booking payload
CREATE OR REPLACE FUNCTION public.create_job_from_quote(p_quote_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    q.title, q.title as description,
    b.payload->>'address', 
    b.payload->>'postal_code', 
    b.payload->>'city',
    'fixed', null, q.total_sek, 
    jsonb_build_object('rot_amount', q.rot_deduction_sek, 'rut_amount', 0),
    'pool', true, null, q.valid_until::timestamptz
  from public.quotes_new q 
  left join public.bookings b on q.request_id = b.id
  where q.id = p_quote_id
  returning id into jid;

  if jid is null then
    raise exception 'Failed to create job from quote';
  end if;

  insert into public.job_events(job_id, actor, event, meta) 
  values (jid, auth.uid(), 'job.created', jsonb_build_object('source','quote'));
  
  return jid;
end 
$function$;