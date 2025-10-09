-- Fix foreign key constraints to allow user deletion
-- Drop and recreate constraints with ON DELETE SET NULL

-- Fix quotes table foreign keys
ALTER TABLE public.quotes 
  DROP CONSTRAINT IF EXISTS quotes_customer_id_fkey;

ALTER TABLE public.quotes 
  ADD CONSTRAINT quotes_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

ALTER TABLE public.quotes 
  DROP CONSTRAINT IF EXISTS quotes_created_by_fkey;

ALTER TABLE public.quotes 
  ADD CONSTRAINT quotes_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

-- Fix other tables that might block deletion
ALTER TABLE public.bookings 
  DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;

ALTER TABLE public.bookings 
  ADD CONSTRAINT bookings_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

ALTER TABLE public.invoices 
  DROP CONSTRAINT IF EXISTS invoices_customer_id_fkey;

ALTER TABLE public.invoices 
  ADD CONSTRAINT invoices_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

ALTER TABLE public.projects 
  DROP CONSTRAINT IF EXISTS projects_customer_id_fkey;

ALTER TABLE public.projects 
  ADD CONSTRAINT projects_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

ALTER TABLE public.projects 
  DROP CONSTRAINT IF EXISTS projects_assigned_to_fkey;

ALTER TABLE public.projects 
  ADD CONSTRAINT projects_assigned_to_fkey 
  FOREIGN KEY (assigned_to) 
  REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

ALTER TABLE public.jobs 
  DROP CONSTRAINT IF EXISTS jobs_customer_id_fkey;

ALTER TABLE public.jobs 
  ADD CONSTRAINT jobs_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

ALTER TABLE public.jobs 
  DROP CONSTRAINT IF EXISTS jobs_assigned_worker_id_fkey;

ALTER TABLE public.jobs 
  ADD CONSTRAINT jobs_assigned_worker_id_fkey 
  FOREIGN KEY (assigned_worker_id) 
  REFERENCES public.profiles(id) 
  ON DELETE SET NULL;