-- Tabell för avvisade offerter
CREATE TABLE IF NOT EXISTS public.quote_rejections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes_new(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('too_expensive', 'chose_other', 'changed_plans', 'other')),
  reason_text TEXT,
  rejected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  customer_name TEXT,
  customer_email TEXT
);

-- Index för bättre performance
CREATE INDEX idx_quote_rejections_quote_id ON public.quote_rejections(quote_id);

-- Tabell för offertfrågor
CREATE TABLE IF NOT EXISTS public.quote_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes_new(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  asked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  answered BOOLEAN DEFAULT false,
  answer TEXT,
  answered_at TIMESTAMP WITH TIME ZONE
);

-- Index för bättre performance
CREATE INDEX idx_quote_questions_quote_id ON public.quote_questions(quote_id);

-- Tabell för påminnelser
CREATE TABLE IF NOT EXISTS public.quote_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes_new(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index för påminnelser
CREATE INDEX idx_quote_reminders_remind_at ON public.quote_reminders(remind_at) WHERE sent = false;

-- Lägg till nya kolumner i quotes_new
ALTER TABLE public.quotes_new 
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS signature_name TEXT,
ADD COLUMN IF NOT EXISTS signature_date TIMESTAMP WITH TIME ZONE;

-- RLS policies för nya tabeller
ALTER TABLE public.quote_rejections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_reminders ENABLE ROW LEVEL SECURITY;

-- Admin kan se alla rejections
CREATE POLICY "Admin can view rejections"
  ON public.quote_rejections FOR SELECT
  USING (is_admin_or_owner());

-- Vem som helst kan skapa rejection (public access via token)
CREATE POLICY "Public can create rejections"
  ON public.quote_rejections FOR INSERT
  WITH CHECK (true);

-- Admin kan se alla frågor
CREATE POLICY "Admin can view questions"
  ON public.quote_questions FOR SELECT
  USING (is_admin_or_owner());

-- Vem som helst kan ställa frågor (public access via token)
CREATE POLICY "Public can create questions"
  ON public.quote_questions FOR INSERT
  WITH CHECK (true);

-- Admin kan uppdatera frågor (svara)
CREATE POLICY "Admin can update questions"
  ON public.quote_questions FOR UPDATE
  USING (is_admin_or_owner());

-- Admin kan se påminnelser
CREATE POLICY "Admin can view reminders"
  ON public.quote_reminders FOR SELECT
  USING (is_admin_or_owner());

-- Vem som helst kan skapa påminnelser (public access via token)
CREATE POLICY "Public can create reminders"
  ON public.quote_reminders FOR INSERT
  WITH CHECK (true);