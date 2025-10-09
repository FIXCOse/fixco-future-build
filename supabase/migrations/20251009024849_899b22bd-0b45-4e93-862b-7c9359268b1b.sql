-- STEG 2: Lägg till kolumner och skapa funktioner (nu när enum-värdena finns)

-- Lägg till kolumner i bookings
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS service_slug text,
ADD COLUMN IF NOT EXISTS mode text DEFAULT 'book' CHECK (mode IN ('book','quote')),
ADD COLUMN IF NOT EXISTS payload jsonb DEFAULT '{}'::jsonb;

-- Lägg till request_id i quotes_new
ALTER TABLE public.quotes_new 
ADD COLUMN IF NOT EXISTS request_id uuid REFERENCES public.bookings(id);

-- Skapa funktion för att auto-generera draft quote
CREATE OR REPLACE FUNCTION public.create_draft_quote_for_booking(p_booking_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_quote_id uuid;
  v_booking record;
  v_customer_id uuid;
  v_quote_number text;
  v_public_token text;
BEGIN
  -- Hämta booking-data
  SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found: %', p_booking_id;
  END IF;

  -- Använd customer_id från booking
  v_customer_id := v_booking.customer_id;

  -- Generera quote number och public token
  v_quote_number := generate_quote_number_new();
  v_public_token := generate_public_token();

  -- Skapa draft quote
  INSERT INTO public.quotes_new (
    customer_id,
    request_id,
    number,
    public_token,
    title,
    description,
    status,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    valid_until,
    line_items,
    subtotal,
    tax_rate,
    tax_amount,
    total_amount
  ) VALUES (
    v_customer_id,
    p_booking_id,
    v_quote_number,
    v_public_token,
    COALESCE(v_booking.service_name, 'Offert'),
    v_booking.description,
    'draft',
    v_booking.contact_name,
    v_booking.contact_email,
    v_booking.contact_phone,
    v_booking.address,
    CURRENT_DATE + INTERVAL '30 days',
    '[]'::jsonb,
    0,
    0.25,
    0,
    0
  )
  RETURNING id INTO v_quote_id;

  RETURN v_quote_id;
END;
$function$;

-- Skapa trigger för auto-generering av draft quotes
CREATE OR REPLACE FUNCTION public.trigger_create_draft_quote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_quote_id uuid;
BEGIN
  -- Skapa endast för mode='quote'
  IF NEW.mode = 'quote' THEN
    v_quote_id := create_draft_quote_for_booking(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_booking_create_draft_quote ON public.bookings;
CREATE TRIGGER on_booking_create_draft_quote
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_draft_quote();

-- Ta bort quote_requests om den finns
DROP TABLE IF EXISTS public.quote_requests CASCADE;