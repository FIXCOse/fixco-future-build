-- Fix errors: add missing column and harden activity logging summary

-- 1) Ensure service_name exists on quote_requests (used by RPC/UI)
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS service_name text;

-- 2) Harden log_booking_activity to always provide a non-null summary
CREATE OR REPLACE FUNCTION public.log_booking_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_activity(
      'booking_created',
      COALESCE(
        'Ny bokning skapad' ||
        CASE 
          WHEN NEW.customer_id IS NOT NULL THEN 
            ' för ' || COALESCE(
              (SELECT COALESCE(first_name || ' ' || last_name, 'Okänd kund') FROM profiles WHERE id = NEW.customer_id),
              'Okänd kund'
            )
          ELSE ''
        END,
        'Ny bokning skapad'
      ),
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