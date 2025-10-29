-- Force PostgREST to reload schema cache by making a trivial schema change
-- This will clear the outdated cache that still references the removed 'role' column

-- Add a temporary column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS _schema_reload_trigger timestamp with time zone DEFAULT now();

-- Remove it immediately
ALTER TABLE public.profiles DROP COLUMN IF EXISTS _schema_reload_trigger;

-- Notify PostgREST to reload schema multiple times to ensure cache refresh
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';

-- Add a comment to force another schema change detection
COMMENT ON TABLE public.profiles IS 'User profile information - schema reloaded to clear role column cache';
