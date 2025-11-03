-- Förbättra ensure_customer_from_booking trigger för robustare kundsynkronisering
CREATE OR REPLACE FUNCTION public.ensure_customer_from_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id uuid;
  v_email text;
  v_name text;
  v_phone text;
BEGIN
  -- Extrahera normaliserade värden från payload (försök flera fält)
  v_email := LOWER(TRIM(COALESCE(
    NEW.payload->>'email',
    NEW.payload->>'contact_email',
    NEW.payload->>'customerEmail',
    NEW.payload->>'customer_email'
  )));
  
  v_name := TRIM(COALESCE(
    NEW.payload->>'name',
    NEW.payload->>'contact_name',
    NEW.payload->>'customerName',
    NEW.payload->>'customer_name',
    'Okänd kund'
  ));
  
  -- Normalisera telefonnummer: ta bort alla mellanslag och bindestreck
  v_phone := REGEXP_REPLACE(
    COALESCE(
      NEW.payload->>'phone',
      NEW.payload->>'contact_phone',
      NEW.payload->>'customerPhone',
      NEW.payload->>'customer_phone',
      ''
    ),
    '[^0-9+]',
    '',
    'g'
  );

  -- Endast fortsätt om vi har en giltig email
  IF v_email IS NOT NULL AND v_email != '' THEN
    -- Sök efter befintlig kund baserat på email
    SELECT id INTO v_customer_id 
    FROM customers 
    WHERE email = v_email 
    LIMIT 1;
    
    -- Skapa ny kund om den inte finns
    IF v_customer_id IS NULL THEN
      INSERT INTO customers (name, email, phone)
      VALUES (v_name, v_email, NULLIF(v_phone, ''))
      RETURNING id INTO v_customer_id;
      
      RAISE NOTICE 'Ny kund skapad från bokning: % (email: %)', v_customer_id, v_email;
    ELSE
      RAISE NOTICE 'Befintlig kund hittad: % (email: %)', v_customer_id, v_email;
    END IF;

    NEW.customer_id := v_customer_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Se till att triggern är aktiv på bookings-tabellen
DROP TRIGGER IF EXISTS ensure_customer_from_booking_trigger ON bookings;
CREATE TRIGGER ensure_customer_from_booking_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION ensure_customer_from_booking();