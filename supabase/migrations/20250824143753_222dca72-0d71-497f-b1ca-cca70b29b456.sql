-- Add missing columns to existing bookings table
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS service_id TEXT,
  ADD COLUMN IF NOT EXISTS price_type TEXT DEFAULT 'hourly',
  ADD COLUMN IF NOT EXISTS hours_estimated NUMERIC,
  ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC,
  ADD COLUMN IF NOT EXISTS materials NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vat_percent NUMERIC DEFAULT 25,
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS rot_rut_type TEXT,
  ADD COLUMN IF NOT EXISTS created_by UUID;

-- Create quote_requests table  
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  service_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  message TEXT,
  rot_rut_type TEXT,
  name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on quote_requests
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quote_requests
CREATE POLICY "Users can read own quote requests" ON public.quote_requests
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Admin/Owner can read all quote requests" ON public.quote_requests
  FOR SELECT USING (is_admin_or_owner());

CREATE POLICY "Users can create own quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admin/Owner can update all quote requests" ON public.quote_requests
  FOR UPDATE USING (is_admin_or_owner());

-- Create indexes
CREATE INDEX IF NOT EXISTS bookings_service_id_idx ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx ON public.quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS quote_requests_customer_id_idx ON public.quote_requests(customer_id);

-- Add trigger for quote_requests
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER TABLE public.quote_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quote_requests;