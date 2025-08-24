-- Helper functions to avoid RLS recursion and simplify checks
CREATE OR REPLACE FUNCTION public.is_organization_admin(user_uuid uuid, org_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = user_uuid AND organization_id = org_uuid AND role = 'admin'::user_role
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.organization_has_members(org_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_uuid
  );
END;
$$;

-- Replace problematic RLS policies on organization_members to remove recursive self-references
DROP POLICY IF EXISTS org_members_select_same_org ON public.organization_members;
DROP POLICY IF EXISTS org_members_insert_admin ON public.organization_members;
DROP POLICY IF EXISTS org_members_update_admin ON public.organization_members;
DROP POLICY IF EXISTS org_members_delete_admin_or_self ON public.organization_members;

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Users can read their own row or any member rows from orgs they belong to
CREATE POLICY "org_members_select_self_or_same_org"
ON public.organization_members
FOR SELECT
USING (
  user_id = auth.uid()
  OR public.is_organization_member(auth.uid(), organization_id)
);

-- Only org admins can add members, except allow the very first member of an org
CREATE POLICY "org_members_insert_admin_or_first_member"
ON public.organization_members
FOR INSERT
WITH CHECK (
  public.is_organization_admin(auth.uid(), organization_id)
  OR NOT public.organization_has_members(organization_id)
);

-- Only org admins can update member rows
CREATE POLICY "org_members_update_admin"
ON public.organization_members
FOR UPDATE
USING (
  public.is_organization_admin(auth.uid(), organization_id)
);

-- A user can remove themself or an org admin can remove any member
CREATE POLICY "org_members_delete_admin_or_self"
ON public.organization_members
FOR DELETE
USING (
  user_id = auth.uid()
  OR public.is_organization_admin(auth.uid(), organization_id)
);
