-- Make property_id optional to support quotes created without a saved property
ALTER TABLE public.quotes
ALTER COLUMN property_id DROP NOT NULL;