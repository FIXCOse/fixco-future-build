-- Add deleted_at column to quotes_new table for soft delete
ALTER TABLE public.quotes_new 
ADD COLUMN deleted_at timestamp with time zone DEFAULT NULL;

-- Create index for better performance when filtering deleted quotes
CREATE INDEX idx_quotes_new_deleted_at ON public.quotes_new(deleted_at);

-- Function to restore quote from trash
CREATE OR REPLACE FUNCTION public.restore_quote_new(p_quote_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.quotes_new
  SET deleted_at = NULL
  WHERE id = p_quote_id
    AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$function$;

-- Function to permanently delete quote
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

  DELETE FROM public.quotes_new
  WHERE id = p_quote_id;

  RETURN FOUND;
END;
$function$;

-- Function to empty quotes trash (delete all soft-deleted quotes)
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

  DELETE FROM public.quotes_new
  WHERE deleted_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;