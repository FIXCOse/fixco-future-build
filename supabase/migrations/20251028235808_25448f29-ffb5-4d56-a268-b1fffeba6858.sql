-- Merge profiles UPDATE policies to fix RLS conflict
-- The issue: Two separate UPDATE policies with different USING/WITH CHECK clauses
-- caused conflicts when admin tried to update other users' profiles

-- Drop both conflicting policies
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

-- Create a single merged policy that handles both cases
CREATE POLICY "profiles_update_own_or_admin"
ON public.profiles
FOR UPDATE
TO public
USING (id = auth.uid() OR is_admin_or_owner())
WITH CHECK (id = auth.uid() OR is_admin_or_owner());