-- Update permanently_delete_quote_new to handle project relations
CREATE OR REPLACE FUNCTION public.permanently_delete_quote_new(p_quote_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- First, set quote_id to NULL in any projects referencing this quote
  UPDATE public.projects
  SET quote_id = NULL
  WHERE quote_id = p_quote_id;

  -- Now delete the quote
  DELETE FROM public.quotes_new
  WHERE id = p_quote_id;

  RETURN FOUND;
END;
$function$;

-- Update empty_quotes_new_trash to handle project relations
CREATE OR REPLACE FUNCTION public.empty_quotes_new_trash()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  deleted_count integer;
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- First, set quote_id to NULL in projects for quotes being deleted
  UPDATE public.projects
  SET quote_id = NULL
  WHERE quote_id IN (
    SELECT id FROM public.quotes_new WHERE deleted_at IS NOT NULL
  );

  -- Now delete the quotes
  DELETE FROM public.quotes_new
  WHERE deleted_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;