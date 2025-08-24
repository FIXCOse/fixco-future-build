-- Add missing columns to existing bookings table if they don't exist
DO $$ 
BEGIN
    -- Add service_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'service_id') THEN
        ALTER TABLE public.bookings ADD COLUMN service_id TEXT;
    END IF;
    
    -- Add price_type if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'price_type') THEN
        ALTER TABLE public.bookings ADD COLUMN price_type TEXT DEFAULT 'hourly';
    END IF;
    
    -- Add hours_estimated if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'hours_estimated') THEN
        ALTER TABLE public.bookings ADD COLUMN hours_estimated NUMERIC;
    END IF;
    
    -- Add hourly_rate if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'hourly_rate') THEN
        ALTER TABLE public.bookings ADD COLUMN hourly_rate NUMERIC;
    END IF;
    
    -- Add materials if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'materials') THEN
        ALTER TABLE public.bookings ADD COLUMN materials NUMERIC DEFAULT 0;
    END IF;
    
    -- Add vat_percent if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'vat_percent') THEN
        ALTER TABLE public.bookings ADD COLUMN vat_percent NUMERIC DEFAULT 25;
    END IF;
    
    -- Add name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'name') THEN
        ALTER TABLE public.bookings ADD COLUMN name TEXT;
    END IF;
    
    -- Add phone if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'phone') THEN
        ALTER TABLE public.bookings ADD COLUMN phone TEXT;
    END IF;
    
    -- Add email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'email') THEN
        ALTER TABLE public.bookings ADD COLUMN email TEXT;
    END IF;
    
    -- Add address if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'address') THEN
        ALTER TABLE public.bookings ADD COLUMN address TEXT;
    END IF;
    
    -- Add city if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'city') THEN
        ALTER TABLE public.bookings ADD COLUMN city TEXT;
    END IF;
    
    -- Add rot_rut_type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'rot_rut_type') THEN
        ALTER TABLE public.bookings ADD COLUMN rot_rut_type TEXT;
    END IF;
END $$;

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS bookings_service_id_idx ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS bookings_price_type_idx ON public.bookings(price_type);
CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx ON public.quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS quote_requests_status_idx ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS quote_requests_customer_id_idx ON public.quote_requests(customer_id);
CREATE INDEX IF NOT EXISTS quote_requests_service_id_idx ON public.quote_requests(service_id);

-- Enable RLS on quote_requests
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Add new RLS policies for enhanced bookings functionality
CREATE POLICY "Users can create bookings with service info" ON public.bookings
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() AND 
    (created_by = auth.uid() OR created_by IS NULL)
  );

-- RLS Policies for quote_requests
CREATE POLICY "Users can read own quote requests" ON public.quote_requests
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Admin/Owner can read all quote requests" ON public.quote_requests
  FOR SELECT USING (is_admin_or_owner());

CREATE POLICY "Users can create own quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() AND 
    (created_by = auth.uid() OR created_by IS NULL)
  );

CREATE POLICY "Admin/Owner can update all quote requests" ON public.quote_requests
  FOR UPDATE USING (is_admin_or_owner());

-- Add trigger for quote_requests updated_at
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for quote_requests
ALTER TABLE public.quote_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quote_requests;