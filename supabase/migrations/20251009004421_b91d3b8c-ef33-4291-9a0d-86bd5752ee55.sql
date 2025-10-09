-- Add soft delete columns to quote_requests, bookings, and jobs
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quote_requests_deleted_at ON public.quote_requests(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_deleted_at ON public.bookings(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_deleted_at ON public.jobs(deleted_at) WHERE deleted_at IS NOT NULL;

-- Functions for quote_requests
CREATE OR REPLACE FUNCTION public.restore_quote_request(p_quote_request_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.quote_requests
  SET deleted_at = NULL
  WHERE id = p_quote_request_id
    AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.permanently_delete_quote_request(p_quote_request_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM public.quote_requests
  WHERE id = p_quote_request_id;

  RETURN FOUND;
END;
$$;

-- Functions for bookings
CREATE OR REPLACE FUNCTION public.restore_booking(p_booking_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.bookings
  SET deleted_at = NULL
  WHERE id = p_booking_id
    AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.permanently_delete_booking(p_booking_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM public.bookings
  WHERE id = p_booking_id;

  RETURN FOUND;
END;
$$;

-- Functions for jobs
CREATE OR REPLACE FUNCTION public.restore_job(p_job_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.jobs
  SET deleted_at = NULL
  WHERE id = p_job_id
    AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.permanently_delete_job(p_job_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM public.jobs
  WHERE id = p_job_id;

  RETURN FOUND;
END;
$$;

-- Update cleanup function to include all types
CREATE OR REPLACE FUNCTION public.cleanup_old_deleted_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete quotes that have been in trash for more than 30 days
  DELETE FROM public.quotes
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';
    
  -- Delete quote requests that have been in trash for more than 30 days
  DELETE FROM public.quote_requests
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';
    
  -- Delete bookings that have been in trash for more than 30 days
  DELETE FROM public.bookings
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';
    
  -- Delete jobs that have been in trash for more than 30 days
  DELETE FROM public.jobs
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';
END;
$$;