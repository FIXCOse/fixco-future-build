-- Add soft delete column to quotes table
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for better performance on deleted_at queries
CREATE INDEX IF NOT EXISTS idx_quotes_deleted_at ON public.quotes(deleted_at) WHERE deleted_at IS NOT NULL;

-- Create function to permanently delete old trashed quotes
CREATE OR REPLACE FUNCTION public.cleanup_old_deleted_quotes()
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
END;
$$;

-- Create function to restore deleted quotes
CREATE OR REPLACE FUNCTION public.restore_quote(p_quote_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has permission
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.quotes
  SET deleted_at = NULL
  WHERE id = p_quote_id
    AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$;

-- Create function to permanently delete a quote
CREATE OR REPLACE FUNCTION public.permanently_delete_quote(p_quote_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has permission
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM public.quotes
  WHERE id = p_quote_id;

  RETURN FOUND;
END;
$$;