
CREATE TABLE public.quote_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES public.quotes_new(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now() NOT NULL,
  user_agent text
);

ALTER TABLE public.quote_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read quote_views"
  ON public.quote_views FOR SELECT TO authenticated
  USING (public.is_admin_or_owner());

CREATE POLICY "Service role can insert quote_views"
  ON public.quote_views FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_quote_views_quote_id ON public.quote_views(quote_id);
