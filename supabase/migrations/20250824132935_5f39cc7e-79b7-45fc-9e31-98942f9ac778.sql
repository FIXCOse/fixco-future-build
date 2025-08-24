-- Create events table for activity logging
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  organization_id UUID,
  actor UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  ref_table TEXT,
  ref_id UUID,
  summary TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  CONSTRAINT events_org_actor_check CHECK (
    (organization_id IS NULL AND actor IS NOT NULL) OR 
    (organization_id IS NOT NULL)
  )
);

-- Add index for performance
CREATE INDEX idx_events_org_time ON public.events (organization_id, created_at DESC);
CREATE INDEX idx_events_actor_time ON public.events (actor, created_at DESC);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS policies for events
CREATE POLICY "events_select_own_or_org" ON public.events FOR SELECT
USING (
  actor = auth.uid() OR 
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "events_insert_service" ON public.events FOR INSERT
WITH CHECK (true);

-- Create enhanced quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT UNIQUE NOT NULL DEFAULT generate_quote_number(),
  organization_id UUID,
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  booking_id UUID REFERENCES public.bookings(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  
  -- Pricing
  price_mode TEXT DEFAULT 'hourly' CHECK (price_mode IN ('hourly', 'fixed')),
  hours NUMERIC,
  hourly_rate NUMERIC,
  
  -- Line items for fixed pricing
  line_items JSONB DEFAULT '[]',
  
  -- Totals
  subtotal NUMERIC NOT NULL,
  vat_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  
  -- ROT/RUT
  rot_rut_type TEXT CHECK (rot_rut_type IN ('rot', 'rut')),
  rot_rut_amount NUMERIC DEFAULT 0,
  total_after_deduction NUMERIC,
  
  -- Metadata
  currency TEXT DEFAULT 'SEK',
  due_date DATE,
  valid_until DATE,
  pdf_url TEXT,
  sent_to TEXT[] DEFAULT '{}',
  notes TEXT,
  
  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for quotes
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- RLS policies for quotes
CREATE POLICY "quotes_select_customer_or_org" ON public.quotes FOR SELECT
USING (
  customer_id = auth.uid() OR 
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "quotes_insert_org_admin" ON public.quotes FOR INSERT
WITH CHECK (
  organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id)
);

CREATE POLICY "quotes_update_org_admin" ON public.quotes FOR UPDATE
USING (
  organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id)
);

-- Create enhanced invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL DEFAULT generate_invoice_number(),
  organization_id UUID,
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  booking_id UUID REFERENCES public.bookings(id),
  quote_id UUID REFERENCES public.quotes(id),
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'overdue', 'paid', 'cancelled')),
  
  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  
  -- Pricing
  hours NUMERIC,
  hourly_rate NUMERIC,
  line_items JSONB DEFAULT '[]',
  
  -- Totals
  subtotal NUMERIC NOT NULL,
  vat_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  
  -- ROT/RUT
  rot_rut_amount NUMERIC DEFAULT 0,
  total_after_deduction NUMERIC,
  
  -- Files and communication
  pdf_url TEXT,
  sent_to TEXT[] DEFAULT '{}',
  notes TEXT,
  
  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS policies for invoices
CREATE POLICY "invoices_select_customer_or_org" ON public.invoices FOR SELECT
USING (
  customer_id = auth.uid() OR 
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "invoices_insert_org_admin" ON public.invoices FOR INSERT
WITH CHECK (
  organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id)
);

CREATE POLICY "invoices_update_org_admin" ON public.invoices FOR UPDATE
USING (
  organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id)
);

-- Create payments table for invoice tracking
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id),
  amount NUMERIC NOT NULL,
  method TEXT DEFAULT 'bank' CHECK (method IN ('bank', 'swish', 'card', 'cash', 'other')),
  reference TEXT,
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS policy for payments
CREATE POLICY "payments_select_via_invoice" ON public.payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.invoices i 
    WHERE i.id = payments.invoice_id 
    AND (
      i.customer_id = auth.uid() OR 
      (i.organization_id IS NOT NULL AND is_organization_member(auth.uid(), i.organization_id))
    )
  )
);

CREATE POLICY "payments_insert_org_admin" ON public.payments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invoices i 
    WHERE i.id = payments.invoice_id 
    AND i.organization_id IS NOT NULL 
    AND is_organization_member(auth.uid(), i.organization_id)
  )
);

-- Create triggers for event logging

-- Booking events
CREATE OR REPLACE FUNCTION log_booking_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Log booking creation
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.events (organization_id, actor, type, ref_table, ref_id, summary, payload)
    VALUES (NEW.organization_id, NEW.customer_id, 'booking_created', 'bookings', NEW.id,
            'Ny bokning skapad', jsonb_build_object('service', NEW.service_name, 'customer_id', NEW.customer_id));
    RETURN NEW;
  END IF;
  
  -- Log booking status changes
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.events (organization_id, actor, type, ref_table, ref_id, summary, payload)
    VALUES (NEW.organization_id, auth.uid(), 'booking_status_changed', 'bookings', NEW.id,
            'Bokningsstatus ändrad till ' || NEW.status, 
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status));
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END $$;

CREATE TRIGGER trg_booking_events
AFTER INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION log_booking_event();

-- Quote events
CREATE OR REPLACE FUNCTION log_quote_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.events (organization_id, actor, type, ref_table, ref_id, summary, payload)
    VALUES (NEW.organization_id, NEW.created_by, 'quote_created', 'quotes', NEW.id,
            'Offert skapad', jsonb_build_object('customer_id', NEW.customer_id, 'total', NEW.total_amount));
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.events (organization_id, actor, type, ref_table, ref_id, summary, payload)
    VALUES (NEW.organization_id, auth.uid(), 'quote_' || NEW.status, 'quotes', NEW.id,
            'Offert ' || CASE NEW.status 
              WHEN 'sent' THEN 'skickad'
              WHEN 'accepted' THEN 'accepterad'
              WHEN 'rejected' THEN 'avvisad'
              ELSE NEW.status
            END, 
            jsonb_build_object('total', NEW.total_amount, 'customer_id', NEW.customer_id));
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END $$;

CREATE TRIGGER trg_quote_events
AFTER INSERT OR UPDATE ON public.quotes
FOR EACH ROW EXECUTE FUNCTION log_quote_event();

-- Invoice events
CREATE OR REPLACE FUNCTION log_invoice_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.events (organization_id, actor, type, ref_table, ref_id, summary, payload)
    VALUES (NEW.organization_id, NEW.created_by, 'invoice_created', 'invoices', NEW.id,
            'Faktura skapad', jsonb_build_object('customer_id', NEW.customer_id, 'total', NEW.total_amount));
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.events (organization_id, actor, type, ref_table, ref_id, summary, payload)
    VALUES (NEW.organization_id, auth.uid(), 'invoice_' || NEW.status, 'invoices', NEW.id,
            'Faktura ' || CASE NEW.status 
              WHEN 'sent' THEN 'skickad'
              WHEN 'paid' THEN 'betald'
              WHEN 'overdue' THEN 'försenad'
              ELSE NEW.status
            END,
            jsonb_build_object('total', NEW.total_amount, 'customer_id', NEW.customer_id));
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END $$;

CREATE TRIGGER trg_invoice_events
AFTER INSERT OR UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION log_invoice_event();

-- Payment events
CREATE OR REPLACE FUNCTION log_payment_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update invoice status to paid
    UPDATE public.invoices 
    SET status = 'paid' 
    WHERE id = NEW.invoice_id;
    
    -- Log payment event
    INSERT INTO public.events (organization_id, actor, type, ref_table, ref_id, summary, payload)
    SELECT i.organization_id, auth.uid(), 'payment_received', 'payments', NEW.id,
           'Betalning mottagen', 
           jsonb_build_object('amount', NEW.amount, 'method', NEW.method, 'invoice_id', NEW.invoice_id)
    FROM public.invoices i WHERE i.id = NEW.invoice_id;
    
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END $$;

CREATE TRIGGER trg_payment_events
AFTER INSERT ON public.payments
FOR EACH ROW EXECUTE FUNCTION log_payment_event();

-- Profile change events
CREATE OR REPLACE FUNCTION log_profile_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.events (actor, type, ref_table, ref_id, summary, payload)
    VALUES (NEW.id, 'profile_updated', 'profiles', NEW.id,
            'Profil uppdaterad', 
            jsonb_build_object('changes', 
              jsonb_build_object(
                'first_name', CASE WHEN OLD.first_name IS DISTINCT FROM NEW.first_name THEN NEW.first_name END,
                'last_name', CASE WHEN OLD.last_name IS DISTINCT FROM NEW.last_name THEN NEW.last_name END,
                'email', CASE WHEN OLD.email IS DISTINCT FROM NEW.email THEN NEW.email END
              )
            ));
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END $$;

CREATE TRIGGER trg_profile_events
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION log_profile_event();

-- Update triggers for timestamps
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();