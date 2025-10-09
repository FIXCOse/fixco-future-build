-- Add deleted_at column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- Create restore function for projects
CREATE OR REPLACE FUNCTION public.restore_project(p_project_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.projects
  SET deleted_at = NULL
  WHERE id = p_project_id
    AND deleted_at IS NOT NULL;

  RETURN FOUND;
END;
$$;

-- Create permanent delete function for projects
CREATE OR REPLACE FUNCTION public.permanently_delete_project(p_project_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM public.projects
  WHERE id = p_project_id;

  RETURN FOUND;
END;
$$;

-- Create empty trash function for projects
CREATE OR REPLACE FUNCTION public.empty_projects_trash()
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

  DELETE FROM public.projects
  WHERE deleted_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;