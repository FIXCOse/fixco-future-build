-- Create function to create or update customer from booking data
CREATE OR REPLACE FUNCTION public.ensure_customer_from_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_customer_id uuid;
  v_email text;
  v_name text;
  v_phone text;
  v_address text;
  v_postal_code text;
  v_city text;
BEGIN
  -- Extract contact info from booking payload
  v_email := COALESCE(NEW.payload->>'contact_email', NEW.payload->>'email', 'unknown@example.com');
  v_name := COALESCE(NEW.payload->>'contact_name', NEW.payload->>'name', 'Okänd kund');
  v_phone := NEW.payload->>'contact_phone';
  v_address := NEW.payload->>'address';
  v_postal_code := NEW.payload->>'postal_code';
  v_city := NEW.payload->>'city';

  -- If customer_id is already set and customer exists, update their info
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE public.customers
    SET 
      email = COALESCE(v_email, email),
      name = COALESCE(v_name, name),
      phone = COALESCE(v_phone, phone),
      address = COALESCE(v_address, address),
      postal_code = COALESCE(v_postal_code, postal_code),
      city = COALESCE(v_city, city)
    WHERE id = NEW.customer_id;
    
    RETURN NEW;
  END IF;

  -- Try to find existing customer by email
  SELECT id INTO v_customer_id
  FROM public.customers
  WHERE email = v_email
  LIMIT 1;

  -- If customer doesn't exist, create one
  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (
      name,
      email,
      phone,
      address,
      postal_code,
      city
    ) VALUES (
      v_name,
      v_email,
      v_phone,
      v_address,
      v_postal_code,
      v_city
    )
    RETURNING id INTO v_customer_id;
  ELSE
    -- Update existing customer with new info if provided
    UPDATE public.customers
    SET 
      phone = COALESCE(v_phone, phone),
      address = COALESCE(v_address, address),
      postal_code = COALESCE(v_postal_code, postal_code),
      city = COALESCE(v_city, city)
    WHERE id = v_customer_id;
  END IF;

  -- Link booking to customer
  NEW.customer_id := v_customer_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create customers from bookings
DROP TRIGGER IF EXISTS trigger_ensure_customer_from_booking ON public.bookings;
CREATE TRIGGER trigger_ensure_customer_from_booking
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_customer_from_booking();

-- Add booking_count and last_booking_at to customers for quick stats
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_booking_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Function to update customer stats
CREATE OR REPLACE FUNCTION public.update_customer_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE public.customers
    SET 
      booking_count = (
        SELECT COUNT(*) 
        FROM public.bookings 
        WHERE customer_id = NEW.customer_id
      ),
      last_booking_at = (
        SELECT MAX(created_at) 
        FROM public.bookings 
        WHERE customer_id = NEW.customer_id
      ),
      total_spent = (
        SELECT COALESCE(SUM(COALESCE(
          (payload->>'final_price')::numeric,
          (payload->>'base_price')::numeric,
          0
        )), 0)
        FROM public.bookings 
        WHERE customer_id = NEW.customer_id
      )
    WHERE id = NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to update customer stats after booking changes
DROP TRIGGER IF EXISTS trigger_update_customer_stats ON public.bookings;
CREATE TRIGGER trigger_update_customer_stats
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_customer_stats();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_new_customer_id ON public.quotes_new(customer_id);

COMMENT ON COLUMN public.customers.booking_count IS 'Total number of bookings made by this customer';
COMMENT ON COLUMN public.customers.last_booking_at IS 'Timestamp of the most recent booking';
COMMENT ON COLUMN public.customers.total_spent IS 'Total amount spent by this customer';
COMMENT ON COLUMN public.customers.notes IS 'Internal notes about the customer';