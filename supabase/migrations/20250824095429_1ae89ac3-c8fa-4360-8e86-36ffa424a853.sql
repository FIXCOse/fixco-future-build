-- Restrict vouchers visibility to authenticated users only
-- 1) Drop the overly-permissive policy allowing public reads
DROP POLICY IF EXISTS "vouchers_select_all" ON public.vouchers;

-- 2) Create a new policy for authenticated users only, while keeping existing behavior
--    Only authenticated users can read active vouchers
CREATE POLICY "vouchers_select_authenticated_active"
ON public.vouchers
FOR SELECT
TO authenticated
USING (is_active = true);

-- Note: No INSERT/UPDATE/DELETE policies are added for end-users, preserving current restrictions.
