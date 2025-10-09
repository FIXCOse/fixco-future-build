-- Add deleted_at column to job_requests if not exists
ALTER TABLE public.job_requests 
ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- Create restore function for job_requests
CREATE OR REPLACE FUNCTION public.restore_job_request(p_request_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.job_requests
  SET deleted_at = NULL
  WHERE id = p_request_id
    AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$;

-- Create permanent delete function for job_requests
CREATE OR REPLACE FUNCTION public.permanently_delete_job_request(p_request_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM public.job_requests
  WHERE id = p_request_id;

  RETURN FOUND;
END;
$$;

-- Create empty trash function for job_requests
CREATE OR REPLACE FUNCTION public.empty_job_requests_trash()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  deleted_count integer;
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM public.job_requests
  WHERE deleted_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;