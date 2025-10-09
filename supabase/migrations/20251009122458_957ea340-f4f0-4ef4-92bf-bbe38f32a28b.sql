-- Update handle_new_user to assign technician role to specific email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    CASE 
      WHEN lower(NEW.email) IN ('omar@fixco.se', 'omar@dinadress.se') THEN 'owner'
      WHEN lower(NEW.email) = 'imedashviliomar@gmail.com' THEN 'technician'
      ELSE 'customer' 
    END,
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = CASE WHEN profiles.role IS NULL THEN EXCLUDED.role ELSE profiles.role END;
  
  RETURN NEW;
END;
$function$;