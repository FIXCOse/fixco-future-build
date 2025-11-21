-- Create a secure function to fetch all workers
CREATE OR REPLACE FUNCTION public.get_workers()
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz,
  user_type text,
  address_line text,
  postal_code text,
  city text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT 
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.full_name,
    p.phone,
    p.avatar_url,
    p.created_at,
    p.user_type::text,
    p.address_line,
    p.postal_code,
    p.city
  FROM public.profiles p
  INNER JOIN public.user_roles ur ON p.id = ur.user_id
  WHERE ur.role = 'worker'
  ORDER BY p.created_at DESC;
$$;