-- Add customer contact information columns to quotes table to preserve all customer data
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS customer_address text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS customer_postal_code text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS customer_city text;

-- Add original booking/quote_request reference
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS source_booking_id uuid;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS source_quote_request_id uuid;

-- Add foreign key constraints
ALTER TABLE public.quotes ADD CONSTRAINT fk_quotes_source_booking 
  FOREIGN KEY (source_booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

ALTER TABLE public.quotes ADD CONSTRAINT fk_quotes_source_quote_request 
  FOREIGN KEY (source_quote_request_id) REFERENCES quote_requests(id) ON DELETE SET NULL;