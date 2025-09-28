-- Drop all existing policies on services table first
DROP POLICY IF EXISTS "services_select_public" ON public.services;
DROP POLICY IF EXISTS "services_select_admin" ON public.services;
DROP POLICY IF EXISTS "services_insert_admin" ON public.services;
DROP POLICY IF EXISTS "services_update_admin" ON public.services;
DROP POLICY IF EXISTS "services_delete_admin" ON public.services;
DROP POLICY IF EXISTS "Admin can manage services" ON public.services;
DROP POLICY IF EXISTS "Services are publicly readable" ON public.services;