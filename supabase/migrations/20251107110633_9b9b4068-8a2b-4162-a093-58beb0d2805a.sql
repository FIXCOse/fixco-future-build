-- Create sitemap_pings table for logging Google sitemap ping events
CREATE TABLE IF NOT EXISTS public.sitemap_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pinged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pinged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  response_code INTEGER,
  response_message TEXT,
  sitemap_url TEXT NOT NULL DEFAULT 'https://fixco.se/sitemap.xml'
);

-- Enable RLS
ALTER TABLE public.sitemap_pings ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all ping logs
CREATE POLICY "Admins can view sitemap pings"
  ON public.sitemap_pings
  FOR SELECT
  USING (is_admin_or_owner());

-- Policy: Admins can insert ping logs
CREATE POLICY "Admins can insert sitemap pings"
  ON public.sitemap_pings
  FOR INSERT
  WITH CHECK (is_admin_or_owner());

-- Add index for faster queries
CREATE INDEX idx_sitemap_pings_pinged_at ON public.sitemap_pings(pinged_at DESC);

COMMENT ON TABLE public.sitemap_pings IS 'Logs all Google Search Console sitemap ping events';
COMMENT ON COLUMN public.sitemap_pings.pinged_by IS 'User who triggered the ping (NULL if automated)';
COMMENT ON COLUMN public.sitemap_pings.status IS 'Result status: success or error';
COMMENT ON COLUMN public.sitemap_pings.response_code IS 'HTTP response code from Google';
COMMENT ON COLUMN public.sitemap_pings.response_message IS 'Response message or error details';