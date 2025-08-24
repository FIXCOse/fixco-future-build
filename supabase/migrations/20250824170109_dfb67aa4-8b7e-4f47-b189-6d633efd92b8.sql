-- Ensure sequence exists for quote numbers
CREATE SEQUENCE IF NOT EXISTS public.quote_number_seq;

-- Make set_quote_number robust to blank values
CREATE OR REPLACE FUNCTION public.set_quote_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number = generate_quote_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to quotes table if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_quote_number'
  ) THEN
    CREATE TRIGGER trg_set_quote_number
    BEFORE INSERT ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_quote_number();
  END IF;
END $$;