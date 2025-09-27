-- Fix the reorder_services function with proper search_path
CREATE OR REPLACE FUNCTION reorder_services(_service_updates jsonb)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _update record;
BEGIN
  -- Check if user is admin/owner
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update each service's sort_order
  FOR _update IN SELECT * FROM jsonb_to_recordset(_service_updates) AS x(id text, sort_order integer)
  LOOP
    UPDATE public.services 
    SET sort_order = _update.sort_order
    WHERE id = _update.id;
  END LOOP;
END;
$$;