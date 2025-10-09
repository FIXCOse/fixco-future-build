-- Update create_job_from_quote to work with quotes_new table
CREATE OR REPLACE FUNCTION public.create_job_from_quote_new(p_quote_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE 
  jid uuid;
  q_rec record;
BEGIN
  -- Get quote details
  SELECT * INTO q_rec FROM public.quotes_new WHERE id = p_quote_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quote not found: %', p_quote_id;
  END IF;

  -- Create job from quote
  INSERT INTO public.jobs(
    source_type, 
    source_id, 
    customer_id, 
    property_id,
    title, 
    description, 
    address, 
    postal_code, 
    city,
    pricing_mode, 
    fixed_price, 
    rot_rut,
    status, 
    pool_enabled, 
    start_scheduled_at
  )
  VALUES (
    'quote',
    q_rec.id,
    q_rec.customer_id,
    NULL, -- property_id can be set later if needed
    COALESCE(q_rec.title, 'Jobb från offert'),
    'Jobb skapat automatiskt från accepterad offert #' || q_rec.number,
    NULL, -- address from customer if needed
    NULL, -- postal_code from customer if needed
    NULL, -- city from customer if needed
    'fixed',
    q_rec.total_sek,
    jsonb_build_object('rot_amount', COALESCE(q_rec.rot_deduction_sek, 0)),
    'pool',
    true,
    NULL
  )
  RETURNING id INTO jid;

  -- Log job creation event
  INSERT INTO public.job_events(job_id, actor, event, meta) 
  VALUES (
    jid, 
    NULL, -- system created
    'job.created', 
    jsonb_build_object('source', 'quote_auto_accept', 'quote_id', p_quote_id)
  );
  
  RETURN jid;
END;
$$;

-- Create trigger function for auto job creation on quote acceptance
CREATE OR REPLACE FUNCTION public.auto_create_job_on_quote_accept()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_job_id uuid;
BEGIN
  -- Only trigger when status changes to 'accepted'
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'accepted' THEN
    -- Create job automatically
    new_job_id := public.create_job_from_quote_new(NEW.id);
    
    -- Log activity
    INSERT INTO public.activity_log (
      event_type,
      actor_user,
      subject_type,
      subject_id,
      summary,
      metadata
    ) VALUES (
      'job_auto_created',
      NULL,
      'job',
      new_job_id,
      'Jobb automatiskt skapat från accepterad offert',
      jsonb_build_object('quote_id', NEW.id, 'quote_number', NEW.number)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on quotes_new table
DROP TRIGGER IF EXISTS trigger_auto_create_job_on_accept ON public.quotes_new;
CREATE TRIGGER trigger_auto_create_job_on_accept
  AFTER UPDATE ON public.quotes_new
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_job_on_quote_accept();