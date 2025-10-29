-- Remove role column from profiles if it exists (fixing PGRST204 error)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';