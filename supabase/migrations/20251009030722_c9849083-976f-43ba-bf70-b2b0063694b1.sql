-- Fix create_draft_quote_for_booking to use correct column names
DROP FUNCTION IF EXISTS public.create_draft_quote_for_booking(uuid);

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
BEGIN
  SELECT * INTO b FROM public.bookings WHERE id = booking_id;
  IF NOT FOUND THEN 
    RAISE EXCEPTION 'Booking not found: %', booking_id; 
  END IF;

  -- Generate number and token
  quote_num := public.generate_quote_number_new();
  quote_tok := public.generate_public_token();
  quote_title := COALESCE('Offert – ' || b.service_slug, 'Offert');

  INSERT INTO public.quotes_new(
    id, 
    number, 
    public_token,
    customer_id, 
    request_id, 
    title, 
    items,  -- Correct column name!
    subtotal_work_sek, 
    subtotal_mat_sek,
    vat_sek, 
    rot_deduction_sek, 
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
    '[]'::jsonb,  -- items not line_items
    0, 
    0, 
    0, 
    0, 
    0, 
    NULL, 
    'draft', 
    NULL, 
    now()
  )
  RETURNING id INTO qid;

  RETURN qid;
END;
$$;