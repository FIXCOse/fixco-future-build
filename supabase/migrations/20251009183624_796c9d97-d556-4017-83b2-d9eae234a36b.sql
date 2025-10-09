-- Fix is_worker() function to work correctly in RLS context
-- Use CREATE OR REPLACE without DROP since policy depends on it
CREATE OR REPLACE FUNCTION public.is_worker()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('worker', 'technician')
  );
$$;

-- Ensure authenticated users can execute
GRANT EXECUTE ON FUNCTION public.is_worker() TO authenticated;