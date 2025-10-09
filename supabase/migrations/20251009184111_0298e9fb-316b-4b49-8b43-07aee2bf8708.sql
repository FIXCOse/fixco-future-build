-- Skapa en debug-funktion som visar vad auth.uid() returnerar
CREATE OR REPLACE FUNCTION public.debug_auth_context()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  result := jsonb_build_object(
    'auth_uid', auth.uid(),
    'auth_role', auth.role(),
    'current_user', current_user,
    'session_user', session_user,
    'profile_exists', EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid()),
    'profile_role', (SELECT role FROM profiles WHERE id = auth.uid())
  );
  
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.debug_auth_context() TO authenticated;