-- Add unique constraint on user_id in staff table (if not exists)
ALTER TABLE public.staff 
ADD CONSTRAINT staff_user_id_unique UNIQUE (user_id);

-- Create trigger function to automatically create staff when user gets worker role
CREATE OR REPLACE FUNCTION public.create_staff_on_worker_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only create staff if role is worker
  IF NEW.role = 'worker' THEN
    INSERT INTO public.staff (
      user_id,
      name,
      email,
      phone,
      role,
      active,
      hourly_rate
    )
    SELECT 
      NEW.user_id,
      COALESCE(p.full_name, p.first_name || ' ' || p.last_name, p.email, 'Worker'),
      p.email,
      p.phone,
      'technician',
      true,
      550 -- default hourly rate
    FROM public.profiles p
    WHERE p.id = NEW.user_id
    ON CONFLICT (user_id) DO UPDATE
    SET 
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      name = EXCLUDED.name;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS worker_creates_staff ON public.user_roles;
CREATE TRIGGER worker_creates_staff
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_staff_on_worker_role();

-- Backfill: Create staff records for existing workers who don't have staff records
INSERT INTO public.staff (
  user_id,
  name,
  email,
  phone,
  role,
  active,
  hourly_rate
)
SELECT 
  ur.user_id,
  COALESCE(p.full_name, p.first_name || ' ' || p.last_name, p.email, 'Worker'),
  p.email,
  p.phone,
  'technician',
  true,
  550
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE ur.role = 'worker'
  AND NOT EXISTS (
    SELECT 1 FROM public.staff s WHERE s.user_id = ur.user_id
  )
ON CONFLICT (user_id) DO NOTHING;