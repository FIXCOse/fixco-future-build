-- Fix create_job_from_quote function to handle missing property_id column
CREATE OR REPLACE FUNCTION create_job_from_quote(p_quote_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    'quote', 
    q.id, 
    q.customer_id, 
    NULL as property_id, -- Set to NULL since property_id doesn't exist in quotes_new
    q.title, 
    q.title as description,
    COALESCE(b.payload->>'address', q.customer_address) as address,
    COALESCE(b.payload->>'postal_code', q.customer_postal_code) as postal_code,
    COALESCE(b.payload->>'city', q.customer_city) as city,
    'fixed' as pricing_mode,
    null as hourly_rate,
    q.total_sek as fixed_price,
    jsonb_build_object('rot_amount', COALESCE(q.rot_deduction_sek, 0), 'rut_amount', 0) as rot_rut,
    'pool' as status,
    true as pool_enabled,
    null as start_scheduled_at,
    q.valid_until::timestamptz as due_date
  from public.quotes_new q 
  left join public.bookings b on q.request_id = b.id
  where q.id = p_quote_id
  returning id into jid;

  if jid is null then
    raise exception 'Failed to create job from quote';
  end if;

  insert into public.job_events(job_id, actor, event, meta) 
  values (jid, auth.uid(), 'job.created', jsonb_build_object('source', 'quote', 'quote_id', p_quote_id));
  
  return jid;
end 
$$;