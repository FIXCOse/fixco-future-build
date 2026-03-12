ALTER TABLE public.quote_views 
  ADD COLUMN IF NOT EXISTS viewer_email text,
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'direct';