-- Add new columns to customers table for extended customer information

-- Add personnummer column
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS personnummer TEXT;

-- Add postal_code column
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Add city column
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS city TEXT;

-- Add comment to document the columns
COMMENT ON COLUMN public.customers.personnummer IS 'Swedish personal identity number (personnummer)';
COMMENT ON COLUMN public.customers.postal_code IS 'Postal code for customer address';
COMMENT ON COLUMN public.customers.city IS 'City for customer address';