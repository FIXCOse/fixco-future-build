-- Quick critical security fix - drop the dangerous policy immediately
DROP POLICY IF EXISTS "profiles_select_for_rls" ON public.profiles;

-- Drop profiles.role column immediately
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role CASCADE;

-- Create has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- Update is_admin_or_owner
CREATE OR REPLACE FUNCTION public.is_admin_or_owner(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT (public.has_role(user_uuid, 'owner') OR public.has_role(user_uuid, 'admin')) $$;

-- Fix user_roles structure
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey CASCADE;
ALTER TABLE public.user_roles ADD PRIMARY KEY (id);
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

-- Update handle_new_user to remove hardcoded credentials
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)), COALESCE(NEW.raw_user_meta_data->>'last_name', ''))
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;