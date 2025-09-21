-- Fix the function search path for the new i18n function
CREATE OR REPLACE FUNCTION update_i18n_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;