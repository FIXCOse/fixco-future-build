-- Add descriptions to existing feature flags that are missing them

-- user_dashboard: Customer-facing dashboard
UPDATE feature_flags 
SET meta = jsonb_build_object(
  'description', 'Aktivera användarpanel med översikt över bokningar, fakturor och lojalitetspoäng',
  'impact_level', 'medium',
  'affected_users', 'authenticated_customers'
) 
WHERE key = 'user_dashboard';

-- admin_dashboard: Admin panel
UPDATE feature_flags 
SET meta = jsonb_build_object(
  'description', 'Aktivera administratörspanel med systemöversikt, statistik och snabbåtgärder',
  'impact_level', 'low',
  'affected_users', 'admins_only'
) 
WHERE key = 'admin_dashboard';

-- staff_management: Staff management system
UPDATE feature_flags 
SET meta = jsonb_build_object(
  'description', 'Aktivera personalhantering för schemaläggning, arbetspass och tidrapportering',
  'impact_level', 'medium',
  'affected_users', 'admins_and_staff'
) 
WHERE key = 'staff_management';