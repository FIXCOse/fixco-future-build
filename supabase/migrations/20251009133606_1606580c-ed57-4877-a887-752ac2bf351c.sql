-- Fix bookings foreign key constraint issue
-- The bookings.customer_id should reference auth.users, not profiles
-- since bookings can be created before profile is fully set up

-- First, check if the constraint exists and drop it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'bookings_customer_id_fkey'
    ) THEN
        ALTER TABLE public.bookings DROP CONSTRAINT bookings_customer_id_fkey;
    END IF;
END $$;

-- Ensure all auth users have profiles (migrate existing users)
INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', split_part(au.email, '@', 1)),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  CASE 
    WHEN lower(au.email) IN ('omar@fixco.se', 'omar@dinadress.se') THEN 'owner'
    WHEN lower(au.email) = 'imedashviliomar@gmail.com' THEN 'technician'
    ELSE 'customer'
  END,
  au.created_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;