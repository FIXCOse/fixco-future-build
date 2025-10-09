-- Add RPC functions to empty trash for each entity type
-- These use SECURITY DEFINER to bypass RLS

CREATE OR REPLACE FUNCTION public.empty_bookings_trash()
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

  DELETE FROM public.bookings
  WHERE deleted_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.empty_quote_requests_trash()
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

  DELETE FROM public.quote_requests
  WHERE deleted_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.empty_quotes_trash()
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

  DELETE FROM public.quotes
  WHERE deleted_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.empty_jobs_trash()
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

  DELETE FROM public.jobs
  WHERE deleted_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;