-- Fix för worker job pool visibility

-- 1. Uppdatera is_worker() funktionen för att vara mer robust
CREATE OR REPLACE FUNCTION public.is_worker()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('worker', 'technician')
  );
$$;

-- 2. Lägg till worker i worker_profiles om de har role='worker' men inte finns där
INSERT INTO public.worker_profiles (user_id, name, active)
SELECT 
  p.id,
  COALESCE(p.first_name || ' ' || p.last_name, p.email, 'Worker'),
  true
FROM public.profiles p
WHERE p.role IN ('worker', 'technician')
AND NOT EXISTS (
  SELECT 1 FROM public.worker_profiles wp WHERE wp.user_id = p.id
)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Verifiera och logga
DO $$
DECLARE
  worker_count integer;
  profile_worker_count integer;
BEGIN
  SELECT COUNT(*) INTO worker_count FROM public.worker_profiles;
  SELECT COUNT(*) INTO profile_worker_count FROM public.profiles WHERE role IN ('worker', 'technician');
  
  RAISE NOTICE 'Workers in worker_profiles: %', worker_count;
  RAISE NOTICE 'Workers in profiles: %', profile_worker_count;
END $$;