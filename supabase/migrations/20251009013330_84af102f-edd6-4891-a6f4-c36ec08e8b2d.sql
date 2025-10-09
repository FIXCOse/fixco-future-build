-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Create quotes table with all required fields
CREATE TABLE IF NOT EXISTS public.quotes_new (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  request_id uuid,
  title text NOT NULL,
  items jsonb DEFAULT '[]'::jsonb,
  subtotal_work_sek integer DEFAULT 0,
  subtotal_mat_sek integer DEFAULT 0,
  vat_sek integer DEFAULT 0,
  rot_deduction_sek integer DEFAULT 0,
  total_sek integer NOT NULL,
  pdf_url text,
  status text CHECK (status IN ('draft','sent','viewed','change_requested','accepted','declined','expired')) DEFAULT 'draft',
  valid_until date,
  public_token text UNIQUE NOT NULL,
  sent_at timestamptz,
  viewed_at timestamptz,
  accepted_at timestamptz,
  change_req_at timestamptz,
  declined_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create quote_messages table
CREATE TABLE IF NOT EXISTS public.quote_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES public.quotes_new(id) ON DELETE CASCADE NOT NULL,
  author text CHECK (author IN ('customer','admin')) NOT NULL,
  message text NOT NULL,
  files text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quotes_new_public_token ON public.quotes_new(public_token);
CREATE INDEX IF NOT EXISTS idx_quotes_new_status ON public.quotes_new(status);
CREATE INDEX IF NOT EXISTS idx_quotes_new_customer_id ON public.quotes_new(customer_id);
CREATE INDEX IF NOT EXISTS idx_quote_messages_quote_id ON public.quote_messages(quote_id);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Admin can manage customers"
  ON public.customers
  FOR ALL
  USING (is_admin_or_owner());

CREATE POLICY "Public can view customers by token"
  ON public.customers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes_new 
      WHERE quotes_new.customer_id = customers.id
    )
  );

-- RLS Policies for quotes_new
CREATE POLICY "Admin can manage quotes"
  ON public.quotes_new
  FOR ALL
  USING (is_admin_or_owner());

CREATE POLICY "Public can view quotes by token"
  ON public.quotes_new
  FOR SELECT
  USING (public_token IS NOT NULL);

CREATE POLICY "Public can update viewed status"
  ON public.quotes_new
  FOR UPDATE
  USING (public_token IS NOT NULL)
  WITH CHECK (public_token IS NOT NULL);

-- RLS Policies for quote_messages
CREATE POLICY "Admin can manage messages"
  ON public.quote_messages
  FOR ALL
  USING (is_admin_or_owner());

CREATE POLICY "Public can view messages for their quote"
  ON public.quote_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes_new 
      WHERE quotes_new.id = quote_messages.quote_id
    )
  );

CREATE POLICY "Public can create messages"
  ON public.quote_messages
  FOR INSERT
  WITH CHECK (author = 'customer');

-- Function to generate quote number
CREATE OR REPLACE FUNCTION generate_quote_number_new()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_str text;
  max_num integer;
  next_num text;
BEGIN
  year_str := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(number FROM 'Q-\d{4}-(\d+)') AS integer)), 0)
  INTO max_num
  FROM quotes_new
  WHERE number LIKE 'Q-' || year_str || '-%';
  
  next_num := LPAD((max_num + 1)::text, 3, '0');
  RETURN 'Q-' || year_str || '-' || next_num;
END;
$$;

-- Function to generate secure public token
CREATE OR REPLACE FUNCTION generate_public_token()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  token text;
  exists_token boolean;
BEGIN
  LOOP
    token := encode(gen_random_bytes(24), 'base64');
    token := replace(replace(replace(token, '+', ''), '/', ''), '=', '');
    
    SELECT EXISTS(SELECT 1 FROM quotes_new WHERE public_token = token) INTO exists_token;
    
    IF NOT exists_token THEN
      RETURN token;
    END IF;
  END LOOP;
END;
$$;