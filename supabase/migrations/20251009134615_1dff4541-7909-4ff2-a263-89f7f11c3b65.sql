-- Remove foreign key constraints that require profiles to exist
-- Jobs can be for guests or users without complete profiles

-- Drop jobs.customer_id foreign key to profiles
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'jobs_customer_id_fkey'
        AND table_name = 'jobs'
    ) THEN
        ALTER TABLE public.jobs DROP CONSTRAINT jobs_customer_id_fkey;
    END IF;
END $$;

-- Ensure all customers in quotes_new table have corresponding entries in customers table
-- This helps with data consistency
INSERT INTO public.customers (id, email, name, created_at)
SELECT DISTINCT
  q.customer_id,
  COALESCE(c.email, 'unknown@example.com'),
  COALESCE(c.name, 'Kund'),
  NOW()
FROM public.quotes_new q
LEFT JOIN public.customers c ON c.id = q.customer_id
WHERE q.customer_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.customers WHERE id = q.customer_id
  )
ON CONFLICT (id) DO NOTHING;