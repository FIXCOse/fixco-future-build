-- Admin system tables and views for OWNER/ADMIN functionality (fixed version)

-- Audit log for admin actions
CREATE TABLE IF NOT EXISTS public.audit_log (
  id bigserial PRIMARY KEY,
  actor uuid REFERENCES auth.users NOT NULL,
  action text NOT NULL,
  target text,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

-- App settings key/value store
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES auth.users,
  updated_at timestamptz DEFAULT now()
);

-- Feature flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  meta jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Staff/employees table
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  role text CHECK (role IN ('Elektriker','VVS','Snickare','Admin','Koordinator')) NOT NULL,
  skills text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Work orders for staff assignments
CREATE TABLE IF NOT EXISTS public.work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES staff(id),
  status text CHECK (status IN ('Tilldelad','Pågår','Pausad','Klar')) DEFAULT 'Tilldelad',
  notes text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all admin tables
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for OWNER/ADMIN access
CREATE POLICY audit_log_owner_admin_read ON public.audit_log
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  );

CREATE POLICY app_settings_owner_admin_all ON public.app_settings
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  )
  WITH CHECK (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  );

CREATE POLICY feature_flags_owner_admin_all ON public.feature_flags
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  )
  WITH CHECK (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  );

CREATE POLICY staff_owner_admin_all ON public.staff
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  )
  WITH CHECK (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  );

CREATE POLICY work_orders_owner_admin_all ON public.work_orders
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  )
  WITH CHECK (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  );

-- Reporting views (fixed to use existing columns)
CREATE OR REPLACE VIEW public.vw_bookings_daily AS
SELECT 
  date_trunc('day', created_at) AS day, 
  count(*) AS bookings
FROM public.bookings
GROUP BY 1
ORDER BY 1 DESC
LIMIT 30;

CREATE OR REPLACE VIEW public.vw_revenue_monthly AS
SELECT 
  date_trunc('month', created_at) AS month, 
  sum(total_amount) AS revenue
FROM public.invoices
WHERE status = 'paid'
GROUP BY 1
ORDER BY 1 DESC
LIMIT 12;

-- ROT/RUT savings from bookings - use existing rot_eligible/rut_eligible and labor_share
CREATE OR REPLACE VIEW public.vw_rot_rut_savings_monthly AS
SELECT 
  date_trunc('month', created_at) AS month,
  sum(
    CASE 
      WHEN rot_eligible = true THEN final_price * labor_share * 0.30
      WHEN rut_eligible = true THEN final_price * labor_share * 0.50  
      ELSE 0
    END
  ) AS savings
FROM public.bookings
WHERE (rot_eligible = true OR rut_eligible = true)
GROUP BY 1
ORDER BY 1 DESC
LIMIT 12;

CREATE OR REPLACE VIEW public.vw_top_services AS
SELECT 
  service_id, 
  service_name,
  count(*) AS booking_count
FROM public.bookings
GROUP BY 1, 2
ORDER BY 3 DESC
LIMIT 10;

-- RLS Policies for views  
CREATE POLICY vw_bookings_daily_owner_admin ON public.vw_bookings_daily
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  );

CREATE POLICY vw_revenue_monthly_owner_admin ON public.vw_revenue_monthly  
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  );

CREATE POLICY vw_rot_rut_savings_monthly_owner_admin ON public.vw_rot_rut_savings_monthly
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  );

CREATE POLICY vw_top_services_owner_admin ON public.vw_top_services
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('owner','admin'))
  );

-- Create audit logging function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action text,
  p_target text DEFAULT NULL,
  p_meta jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_log (actor, action, target, meta)
  VALUES (auth.uid(), p_action, p_target, p_meta);
END;
$$;

-- Insert default app settings
INSERT INTO public.app_settings (key, value) VALUES 
  ('brand.phone', '"08-123 456 78"'),
  ('brand.email', '"kontakt@fixco.se"'),
  ('service.cities', '["Stockholm", "Göteborg", "Malmö"]'),
  ('pricing.rotDefault', 'true'),
  ('chat.whatsapp.enabled', 'true'),
  ('features.offerWizard', 'true')
ON CONFLICT (key) DO NOTHING;

-- Insert default feature flags  
INSERT INTO public.feature_flags (key, enabled) VALUES
  ('force_2fa', false),
  ('maintenance_mode', false),
  ('chat_ai_enabled', true),
  ('offer_wizard_v2', false)
ON CONFLICT (key) DO NOTHING;