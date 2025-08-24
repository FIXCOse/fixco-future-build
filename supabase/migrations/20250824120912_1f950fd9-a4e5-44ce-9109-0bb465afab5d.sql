-- Typ för roller (om den inte redan finns)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('OWNER','ADMIN','TECH','USER');
  END IF;
END$$;

-- Profiltabell (om kolumner saknas)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role user_role,
  ADD COLUMN IF NOT EXISTS owner_welcome_at timestamptz NULL;

-- Uppdatera befintliga rader med default role om NULL
UPDATE public.profiles 
SET role = 'USER'
WHERE role IS NULL;

-- Sätt NOT NULL constraint efter default värden är satta
ALTER TABLE public.profiles 
ALTER COLUMN role SET NOT NULL,
ALTER COLUMN role SET DEFAULT 'USER';

-- Trigger-funktion: skapar profilrad när auth.users får en ny user
CREATE OR REPLACE FUNCTION public.ensure_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS
$$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'first_name',''), split_part(NEW.email,'@',1)),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'last_name',''), ''),
    CASE WHEN lower(NEW.email) IN ('omar@fixco.se', 'omar@dinadress.se') THEN 'OWNER' ELSE 'USER' END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = CASE WHEN profiles.role IS NULL THEN EXCLUDED.role ELSE profiles.role END;

  RETURN NEW;
END;
$$;

-- Skapa trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.ensure_profile();

-- RLS-policies: låt användaren läsa/uppdatera sin egen profil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Ta bort gamla policies om de finns
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_select_own_or_org_members ON public.profiles;

-- Skapa nya policies
CREATE POLICY profiles_select_own
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY profiles_update_own
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY profiles_insert_own
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());