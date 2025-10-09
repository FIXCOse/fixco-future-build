-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Drop and recreate bookings table with correct structure
DROP TABLE IF EXISTS public.bookings CASCADE;

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  service_slug text,
  mode text CHECK (mode IN ('book','quote')) DEFAULT 'quote',
  status text CHECK (status IN ('new','in_review','quoted','scheduled','done','canceled')) DEFAULT 'new',
  payload jsonb DEFAULT '{}'::jsonb,
  file_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admin can manage bookings" ON public.bookings
  FOR ALL USING (is_admin_or_owner());

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (customer_id = auth.uid());

-- Drop and recreate the RPC function
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
  quote_number text;
  quote_token text;
BEGIN
  SELECT * INTO b FROM public.bookings WHERE id = booking_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found: %', booking_id;
  END IF;

  -- Generate quote number and token
  quote_number := public.generate_quote_number_new();
  quote_token := public.generate_public_token();
  quote_title := COALESCE('Offert – ' || b.service_slug, 'Offert');

  INSERT INTO public.quotes_new(
    customer_id,
    request_id,
    number,
    public_token,
    title,
    status,
    line_items,
    subtotal,
    tax_rate,
    tax_amount,
    total_amount,
    created_at
  )
  VALUES (
    b.customer_id,
    booking_id,
    quote_number,
    quote_token,
    quote_title,
    'draft',
    '[]'::jsonb,
    0,
    0.25,
    0,
    0,
    now()
  )
  RETURNING id INTO qid;

  RETURN qid;
END;
$$;