-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  service_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  price_type TEXT NOT NULL DEFAULT 'hourly',
  hours_estimated NUMERIC,
  hourly_rate NUMERIC,
  materials NUMERIC DEFAULT 0,
  discount_percent NUMERIC DEFAULT 0,
  vat_percent NUMERIC DEFAULT 25,
  rot_rut_type TEXT,
  name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create quote_requests table  
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
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
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS quote_requests_status_idx ON quote_requests(status);
CREATE INDEX IF NOT EXISTS quote_requests_user_id_idx ON quote_requests(user_id);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Users can read own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin/Owner can read all bookings" ON public.bookings
  FOR SELECT USING (is_admin_or_owner());

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (user_id = auth.uid() AND created_by = auth.uid());

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admin/Owner can update all bookings" ON public.bookings
  FOR UPDATE USING (is_admin_or_owner());

-- RLS Policies for quote_requests
CREATE POLICY "Users can read own quote requests" ON public.quote_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin/Owner can read all quote requests" ON public.quote_requests
  FOR SELECT USING (is_admin_or_owner());

CREATE POLICY "Users can create own quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (user_id = auth.uid() AND created_by = auth.uid());

CREATE POLICY "Admin/Owner can update all quote requests" ON public.quote_requests
  FOR UPDATE USING (is_admin_or_owner());

-- Add triggers for updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.quote_requests REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quote_requests;