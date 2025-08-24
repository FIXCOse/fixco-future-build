-- Remove the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "admin_profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "admin_profiles_update_all" ON public.profiles;

-- The existing policies should be sufficient:
-- profiles_select_own - allows users to see their own profile
-- profiles_update_own - allows users to update their own profile
-- profiles_insert_own - allows users to create their own profile

-- These existing policies work fine and don't cause recursion