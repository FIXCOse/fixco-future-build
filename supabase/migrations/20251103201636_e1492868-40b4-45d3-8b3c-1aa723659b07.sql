-- Improved create_draft_quote_for_booking RPC
-- This creates intelligent quotes with line items extracted from booking payload
CREATE OR REPLACE FUNCTION public.create_draft_quote_for_booking(booking_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  b RECORD;
  qid uuid;
  quote_title text;
  quote_num text;
  quote_tok text;
  service_record RECORD;
  default_items jsonb;
  estimated_hours numeric;
  hourly_rate numeric;
  base_price numeric;
  work_total numeric;
  mat_total numeric;
  subtotal numeric;
  vat numeric;
  rot_deduction numeric;
  total numeric;
BEGIN
  -- Fetch booking
  SELECT * INTO b FROM public.bookings WHERE id = booking_id;
  IF NOT FOUND THEN 
    RAISE EXCEPTION 'Booking not found: %', booking_id; 
  END IF;

  -- Fetch service info from services table
  SELECT * INTO service_record FROM public.services WHERE id = b.service_slug LIMIT 1;
  
  -- Set default values from booking payload or service record
  hourly_rate := COALESCE(
    (b.payload->>'hourly_rate')::numeric, 
    (b.payload->>'hourlyRate')::numeric,
    service_record.base_price,
    950  -- Fallback hourly rate
  );
  
  estimated_hours := COALESCE(
    (b.payload->>'hours_estimated')::numeric,
    (b.payload->>'hoursEstimated')::numeric,
    (b.payload->>'estimatedHours')::numeric,
    4  -- Fallback 4 hours
  );
  
  base_price := COALESCE(
    (b.payload->>'base_price')::numeric,
    (b.payload->>'final_price')::numeric,
    (b.payload->>'finalPrice')::numeric,
    hourly_rate * estimated_hours
  );

  -- Create intelligent line items from payload
  default_items := jsonb_build_array(
    jsonb_build_object(
      'type', 'work',
      'description', COALESCE(
        b.payload->>'service_name',
        b.payload->>'serviceName',
        service_record.title_sv,
        'Tjänst'
      ),
      'quantity', estimated_hours,
      'unit', 'tim',
      'price', hourly_rate
    )
  );

  -- Add material cost if present
  IF COALESCE((b.payload->>'material_cost')::numeric, (b.payload->>'materialCost')::numeric, 0) > 0 THEN
    default_items := default_items || jsonb_build_array(
      jsonb_build_object(
        'type', 'material',
        'description', 'Material',
        'quantity', 1,
        'unit', 'st',
        'price', COALESCE((b.payload->>'material_cost')::numeric, (b.payload->>'materialCost')::numeric)
      )
    );
  END IF;

  -- Generate quote number and token
  quote_num := public.generate_quote_number_new();
  quote_tok := public.generate_public_token();
  quote_title := COALESCE(
    'Offert – ' || (b.payload->>'service_name'),
    'Offert – ' || (b.payload->>'serviceName'),
    'Offert – ' || b.service_slug,
    'Offert'
  );

  -- Calculate totals
  work_total := hourly_rate * estimated_hours;
  mat_total := COALESCE((b.payload->>'material_cost')::numeric, (b.payload->>'materialCost')::numeric, 0);
  subtotal := work_total + mat_total;
  vat := subtotal * 0.25;  -- 25% VAT
  rot_deduction := 0;

  -- ROT deduction if service is ROT eligible
  IF COALESCE(service_record.rot_eligible, false) OR 
     COALESCE((b.payload->>'rot_eligible')::boolean, (b.payload->>'rotEligible')::boolean, false) THEN
    rot_deduction := work_total * 0.30;  -- 30% ROT on labor cost
  END IF;

  total := subtotal + vat - rot_deduction;

  -- Create the quote
  INSERT INTO public.quotes_new(
    id, 
    number, 
    public_token,
    customer_id, 
    request_id, 
    title, 
    items,
    subtotal_work_sek, 
    subtotal_mat_sek,
    vat_sek, 
    rot_deduction_sek,
    rot_percentage,
    total_sek, 
    pdf_url, 
    status, 
    valid_until, 
    created_at
  )
  VALUES (
    gen_random_uuid(),
    quote_num,
    quote_tok,
    b.customer_id,
    booking_id,
    quote_title,
    default_items,
    work_total::integer,
    mat_total::integer,
    vat::integer,
    rot_deduction::integer,
    CASE WHEN rot_deduction > 0 THEN 30 ELSE 0 END,
    total::integer,
    NULL, 
    'draft', 
    (CURRENT_DATE + INTERVAL '30 days')::date,  -- Valid for 30 days
    now()
  )
  RETURNING id INTO qid;

  RETURN qid;
END;
$$;