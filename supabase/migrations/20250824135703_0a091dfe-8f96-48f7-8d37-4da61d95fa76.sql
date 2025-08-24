-- Create activity_log table for real-time admin activity feed
CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz DEFAULT now(),
  event_type text NOT NULL,
  actor_user uuid REFERENCES auth.users(id),
  subject_type text,
  subject_id uuid,
  organization_id uuid,
  summary text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_activity_log_occurred_at ON public.activity_log (occurred_at DESC);
CREATE INDEX idx_activity_log_organization_id ON public.activity_log (organization_id);
CREATE INDEX idx_activity_log_event_type ON public.activity_log (event_type);

-- Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies - only admin/owner can see activity
CREATE POLICY "Admin can view all activity logs" ON public.activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
  p_event_type text,
  p_summary text,
  p_subject_type text DEFAULT NULL,
  p_subject_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.activity_log (
    event_type,
    actor_user,
    subject_type,
    subject_id,
    summary,
    metadata
  ) VALUES (
    p_event_type,
    auth.uid(),
    p_subject_type,
    p_subject_id,
    p_summary,
    p_metadata
  );
END;
$$;

-- Triggers for automatic activity logging
CREATE OR REPLACE FUNCTION public.log_booking_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_activity(
      'booking_created',
      'Ny bokning skapad för ' || (SELECT COALESCE(first_name || ' ' || last_name, 'Okänd kund') FROM profiles WHERE id = NEW.customer_id),
      'booking',
      NEW.id,
      jsonb_build_object('service_name', NEW.service_name, 'base_price', NEW.base_price)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM log_activity(
        'booking_status_changed',
        'Bokning status ändrad till ' || NEW.status,
        'booking',
        NEW.id,
        jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trg_booking_activity ON public.bookings;
CREATE TRIGGER trg_booking_activity
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.log_booking_activity();

-- Trigger for quotes
CREATE OR REPLACE FUNCTION public.log_quote_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_activity(
      'quote_created',
      'Offert skapad',
      'quote',
      NEW.id,
      jsonb_build_object('total_amount', NEW.total_amount)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'sent' THEN
      PERFORM log_activity(
        'quote_sent',
        'Offert skickad till kund',
        'quote',
        NEW.id,
        jsonb_build_object('total_amount', NEW.total_amount)
      );
    ELSIF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'accepted' THEN
      PERFORM log_activity(
        'quote_accepted',
        'Offert accepterad av kund',
        'quote',
        NEW.id,
        jsonb_build_object('total_amount', NEW.total_amount)
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_quote_activity ON public.quotes;
CREATE TRIGGER trg_quote_activity
  AFTER INSERT OR UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.log_quote_activity();

-- Trigger for invoices
CREATE OR REPLACE FUNCTION public.log_invoice_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_activity(
      'invoice_created',
      'Faktura skapad',
      'invoice',
      NEW.id,
      jsonb_build_object('total_amount', NEW.total_amount)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'sent' THEN
      PERFORM log_activity(
        'invoice_sent',
        'Faktura skickad till kund',
        'invoice',
        NEW.id,
        jsonb_build_object('total_amount', NEW.total_amount)
      );
    ELSIF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'paid' THEN
      PERFORM log_activity(
        'invoice_paid',
        'Faktura betald',
        'invoice',
        NEW.id,
        jsonb_build_object('total_amount', NEW.total_amount)
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;