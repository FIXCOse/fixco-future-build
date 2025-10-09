-- Aktivera pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Fixa generate_public_token att använda extensions-schemat
DROP FUNCTION IF EXISTS public.generate_public_token();

CREATE OR REPLACE FUNCTION public.generate_public_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  token text;
  exists_token boolean;
BEGIN
  LOOP
    token := encode(extensions.gen_random_bytes(32), 'base64');
    token := replace(replace(replace(token, '+',''), '/',''), '=','');

    SELECT EXISTS(SELECT 1 FROM public.quotes_new WHERE public_token = token)
      INTO exists_token;

    IF NOT exists_token THEN
      RETURN token;
    END IF;
  END LOOP;
END;
$$;