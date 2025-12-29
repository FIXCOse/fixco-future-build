-- =====================================================
-- FIX: Remove hardcoded email bypasses from RLS policies
-- Replace with is_admin_or_owner() function
-- =====================================================

-- 1. Ensure admin roles are set for the current admin emails
-- This ensures they keep access after we remove hardcoded emails
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role 
FROM auth.users 
WHERE email IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- Also ensure owner role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'owner'::user_role 
FROM auth.users 
WHERE email IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Fix quote_questions policies - remove hardcoded emails
DROP POLICY IF EXISTS "Admin and owner can view all quote questions" ON public.quote_questions;
CREATE POLICY "Admin and owner can view all quote questions"
ON public.quote_questions FOR SELECT TO authenticated
USING (public.is_admin_or_owner());

DROP POLICY IF EXISTS "Admin and owner can update quote questions" ON public.quote_questions;
CREATE POLICY "Admin and owner can update quote questions"
ON public.quote_questions FOR UPDATE TO authenticated
USING (public.is_admin_or_owner())
WITH CHECK (public.is_admin_or_owner());

DROP POLICY IF EXISTS "Admin and owner can delete quote questions" ON public.quote_questions;
CREATE POLICY "Admin and owner can delete quote questions"
ON public.quote_questions FOR DELETE TO authenticated
USING (public.is_admin_or_owner());

-- 3. Fix storage.objects policies for reference-projects bucket
DROP POLICY IF EXISTS "Admin and owner can upload reference project images" ON storage.objects;
CREATE POLICY "Admin and owner can upload reference project images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'reference-projects'
  AND public.is_admin_or_owner()
);

DROP POLICY IF EXISTS "Admin and owner can update reference project images" ON storage.objects;
CREATE POLICY "Admin and owner can update reference project images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'reference-projects'
  AND public.is_admin_or_owner()
);

DROP POLICY IF EXISTS "Admin and owner can delete reference project images" ON storage.objects;
CREATE POLICY "Admin and owner can delete reference project images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'reference-projects'
  AND public.is_admin_or_owner()
);