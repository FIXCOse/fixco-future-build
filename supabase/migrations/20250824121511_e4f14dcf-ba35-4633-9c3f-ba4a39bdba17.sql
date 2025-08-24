-- A. Skapa/uppdatera profil för Omar och sätt korrekt roll
-- Skapa/uppdatera profilen och markera rätt roll
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT u.id, u.email, 
       COALESCE(u.raw_user_meta_data->>'first_name', split_part(u.email,'@',1)),
       COALESCE(u.raw_user_meta_data->>'last_name', ''),
       'owner'
FROM auth.users u
WHERE lower(u.email) IN ('omar@fixco.se', 'omar@dinadress.se')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = 'owner';

-- Nollställ owner_welcome_at så grattis visas EN gång
UPDATE public.profiles
SET owner_welcome_at = NULL
WHERE email ILIKE ANY(ARRAY['omar@fixco.se', 'omar@dinadress.se']);

-- B. Se till att Fixco-org finns och att Omar är medlem/ägare
-- 1) Org: Fixco (skapa om saknas)
INSERT INTO public.organizations (name, type, contact_email)
VALUES ('Fixco', 'company', 'omar@fixco.se')
ON CONFLICT (name) DO NOTHING;

-- 2) Lägg till Omar som owner i organisationen
WITH o AS (
  SELECT id FROM public.organizations WHERE name='Fixco' LIMIT 1
), u AS (
  SELECT id AS user_id FROM auth.users WHERE lower(email) IN ('omar@fixco.se', 'omar@dinadress.se') LIMIT 1
)
INSERT INTO public.organization_members (organization_id, user_id, role)
SELECT o.id, u.user_id, 'admin'
FROM o, u
WHERE o.id IS NOT NULL AND u.user_id IS NOT NULL
ON CONFLICT (organization_id, user_id) DO UPDATE SET role='admin';

-- C. Säkerhetspolicies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Uppdatera profiles policies
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own
  ON public.profiles FOR SELECT 
  USING (id = auth.uid());

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
  ON public.profiles FOR UPDATE 
  USING (id = auth.uid());

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own
  ON public.profiles FOR INSERT 
  WITH CHECK (id = auth.uid());

-- Organization members policies
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;