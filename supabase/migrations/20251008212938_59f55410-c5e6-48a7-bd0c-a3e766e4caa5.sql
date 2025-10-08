-- Skapa leads tabell för AI concierge leads
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  address text,
  postal_code text,
  city text,
  message text,
  images jsonb DEFAULT '[]'::jsonb,
  service_interest text,
  estimated_quote jsonb,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
  source text DEFAULT 'ai_concierge',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index för snabbare sökning
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- RLS policies för leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can view all leads" ON public.leads;
CREATE POLICY "Admin can view all leads"
  ON public.leads FOR SELECT
  USING (is_admin_or_owner());

DROP POLICY IF EXISTS "Admin can update leads" ON public.leads;
CREATE POLICY "Admin can update leads"
  ON public.leads FOR UPDATE
  USING (is_admin_or_owner());

DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Trigger för updated_at
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();