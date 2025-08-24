-- Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role FROM public.organization_members 
     WHERE user_id = user_uuid 
     ORDER BY joined_at DESC 
     LIMIT 1),
    'member'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_user_organizations(user_uuid UUID)
RETURNS TABLE(organization_id UUID, role user_role) AS $$
BEGIN
  RETURN QUERY
  SELECT om.organization_id, om.role
  FROM public.organization_members om
  WHERE om.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_organization_member(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.organization_members
    WHERE user_id = user_uuid AND organization_id = org_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Fix existing functions by setting search_path
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'OFF-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('quote_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Comprehensive RLS Policies

-- Profiles policies
CREATE POLICY "profiles_select_own_or_org_members" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.organization_members om1, public.organization_members om2
      WHERE om1.user_id = auth.uid() 
      AND om2.user_id = profiles.id
      AND om1.organization_id = om2.organization_id
    )
  );

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Organizations policies
CREATE POLICY "organizations_select_members" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organizations.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "organizations_insert_admin" ON public.organizations
  FOR INSERT WITH CHECK (true); -- Will be restricted by business logic

CREATE POLICY "organizations_update_admin" ON public.organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organizations.id 
      AND user_id = auth.uid() 
      AND role IN ('admin'::user_role)
    )
  );

-- Organization members policies
CREATE POLICY "org_members_select_same_org" ON public.organization_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "org_members_insert_admin" ON public.organization_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organization_members.organization_id
      AND user_id = auth.uid()
      AND role = 'admin'::user_role
    ) OR NOT EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organization_members.organization_id
    )
  );

CREATE POLICY "org_members_update_admin" ON public.organization_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organization_members.organization_id
      AND user_id = auth.uid()
      AND role = 'admin'::user_role
    )
  );

CREATE POLICY "org_members_delete_admin_or_self" ON public.organization_members
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organization_members.organization_id
      AND user_id = auth.uid()
      AND role = 'admin'::user_role
    )
  );

-- Properties policies
CREATE POLICY "properties_select_owner_or_org" ON public.properties
  FOR SELECT USING (
    owner_id = auth.uid() OR
    (organization_id IS NOT NULL AND public.is_organization_member(auth.uid(), organization_id))
  );

CREATE POLICY "properties_insert_owner_or_org_admin" ON public.properties
  FOR INSERT WITH CHECK (
    owner_id = auth.uid() OR
    (organization_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = properties.organization_id
      AND user_id = auth.uid()
      AND role IN ('admin'::user_role, 'beställare'::user_role)
    ))
  );

CREATE POLICY "properties_update_owner_or_org_admin" ON public.properties
  FOR UPDATE USING (
    owner_id = auth.uid() OR
    (organization_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = properties.organization_id
      AND user_id = auth.uid()
      AND role IN ('admin'::user_role, 'beställare'::user_role)
    ))
  );

CREATE POLICY "properties_delete_owner_or_org_admin" ON public.properties
  FOR DELETE USING (
    owner_id = auth.uid() OR
    (organization_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = properties.organization_id
      AND user_id = auth.uid()
      AND role IN ('admin'::user_role)
    ))
  );

-- Bookings policies
CREATE POLICY "bookings_select_customer_or_org_or_technician" ON public.bookings
  FOR SELECT USING (
    customer_id = auth.uid() OR
    technician_id = auth.uid() OR
    (organization_id IS NOT NULL AND public.is_organization_member(auth.uid(), organization_id))
  );

CREATE POLICY "bookings_insert_customer_or_org" ON public.bookings
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() OR
    (organization_id IS NOT NULL AND public.is_organization_member(auth.uid(), organization_id))
  );

CREATE POLICY "bookings_update_customer_or_technician_or_org" ON public.bookings
  FOR UPDATE USING (
    customer_id = auth.uid() OR
    technician_id = auth.uid() OR
    (organization_id IS NOT NULL AND public.is_organization_member(auth.uid(), organization_id))
  );

-- Quotes policies
CREATE POLICY "quotes_select_customer_or_org" ON public.quotes
  FOR SELECT USING (
    customer_id = auth.uid() OR
    (organization_id IS NOT NULL AND public.is_organization_member(auth.uid(), organization_id))
  );

CREATE POLICY "quotes_insert_customer_or_org" ON public.quotes
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() OR
    (organization_id IS NOT NULL AND public.is_organization_member(auth.uid(), organization_id))
  );

CREATE POLICY "quotes_update_customer_or_org" ON public.quotes
  FOR UPDATE USING (
    customer_id = auth.uid() OR
    (organization_id IS NOT NULL AND public.is_organization_member(auth.uid(), organization_id))
  );

-- Invoices policies
CREATE POLICY "invoices_select_customer_or_org" ON public.invoices
  FOR SELECT USING (
    customer_id = auth.uid() OR
    (organization_id IS NOT NULL AND public.is_organization_member(auth.uid(), organization_id))
  );

CREATE POLICY "invoices_insert_service" ON public.invoices
  FOR INSERT WITH CHECK (true); -- Controlled by edge functions

CREATE POLICY "invoices_update_service" ON public.invoices
  FOR UPDATE USING (true); -- Controlled by edge functions

-- Loyalty transactions policies
CREATE POLICY "loyalty_select_own" ON public.loyalty_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "loyalty_insert_service" ON public.loyalty_transactions
  FOR INSERT WITH CHECK (true); -- Controlled by edge functions

-- Vouchers policies (read-only for users)
CREATE POLICY "vouchers_select_all" ON public.vouchers
  FOR SELECT USING (is_active = true);

-- Voucher usage policies
CREATE POLICY "voucher_usage_select_own" ON public.voucher_usage
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "voucher_usage_insert_own" ON public.voucher_usage
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Events policies
CREATE POLICY "events_select_own" ON public.events
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "events_insert_own_or_anonymous" ON public.events
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Chat conversations policies
CREATE POLICY "chat_select_own" ON public.chat_conversations
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "chat_insert_own_or_anonymous" ON public.chat_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "chat_update_own_or_anonymous" ON public.chat_conversations
  FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);