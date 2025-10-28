-- Drop dependencies
DROP VIEW IF EXISTS public.worker_statistics CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_or_owner(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_worker(uuid) CASCADE;

-- Backup existing roles
CREATE TEMP TABLE temp_user_roles AS SELECT user_id, role::text as role_text FROM public.user_roles;

-- Drop and recreate user_roles table
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- Create new enum
CREATE TYPE public.user_role AS ENUM ('customer', 'worker', 'admin', 'owner');

-- Recreate table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Restore roles (only valid ones)
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 
  CASE role_text
    WHEN 'owner' THEN 'owner'::public.user_role
    WHEN 'admin' THEN 'admin'::public.user_role
    WHEN 'worker' THEN 'worker'::public.user_role
    ELSE 'customer'::public.user_role
  END
FROM temp_user_roles;

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Recreate functions and policies
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role::text = _role) $$;

CREATE OR REPLACE FUNCTION public.is_admin_or_owner(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT (public.has_role(user_uuid, 'owner') OR public.has_role(user_uuid, 'admin')) $$;

CREATE OR REPLACE FUNCTION public.is_worker(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT public.has_role(user_uuid, 'worker') $$;

CREATE POLICY "user_roles_insert_admin" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin_or_owner());
CREATE POLICY "user_roles_update_admin" ON public.user_roles FOR UPDATE USING (public.is_admin_or_owner());
CREATE POLICY "user_roles_delete_admin" ON public.user_roles FOR DELETE USING (public.is_admin_or_owner());
CREATE POLICY "user_roles_select_own_or_admin" ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR public.is_admin_or_owner());

-- Recreate view
CREATE VIEW public.worker_statistics WITH (security_invoker = true) AS
SELECT p.id, p.first_name, p.last_name, p.email,
  COUNT(j.id) AS total_jobs,
  COUNT(j.id) FILTER (WHERE j.status = 'completed') AS completed_jobs,
  COUNT(j.id) FILTER (WHERE j.created_at >= NOW() - INTERVAL '30 days') AS jobs_last_30_days,
  ROUND(AVG(EXTRACT(EPOCH FROM (j.due_date - j.start_scheduled_at)) / 3600), 2) AS avg_job_duration_hours
FROM public.profiles p
INNER JOIN public.user_roles ur ON p.id = ur.user_id
LEFT JOIN public.jobs j ON j.assigned_worker_id = p.id
WHERE ur.role = 'worker'::public.user_role
GROUP BY p.id, p.first_name, p.last_name, p.email;