-- Uppdatera generate_public_token() för kortare tokens
-- Innan: 32 bytes = ~43 tecken
-- Efter: 4 bytes = ~6 tecken (kortare, snyggare länkar)

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
    -- Generera kortare token: 4 bytes ger ~6 tecken efter base64 cleanup
    token := encode(extensions.gen_random_bytes(4), 'base64');
    token := replace(replace(replace(token, '+',''), '/',''), '=','');
    
    -- Kontrollera att token är unik
    SELECT EXISTS(SELECT 1 FROM public.quotes_new WHERE public_token = token)
      INTO exists_token;

    IF NOT exists_token THEN
      RETURN token;
    END IF;
  END LOOP;
END;
$$;