
-- Table: scheduled_quote_sends
CREATE TABLE public.scheduled_quote_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes_new(id) ON DELETE CASCADE,
  scheduled_for timestamptz NOT NULL,
  executed boolean NOT NULL DEFAULT false,
  executed_at timestamptz,
  cancelled boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.scheduled_quote_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/owner can read scheduled_quote_sends"
  ON public.scheduled_quote_sends FOR SELECT
  TO authenticated
  USING (public.is_admin_or_owner());

CREATE POLICY "Admin/owner can insert scheduled_quote_sends"
  ON public.scheduled_quote_sends FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_owner());

CREATE POLICY "Admin/owner can update scheduled_quote_sends"
  ON public.scheduled_quote_sends FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_owner());

-- Allow service_role (edge functions) to read/update
CREATE POLICY "Service role full access on scheduled_quote_sends"
  ON public.scheduled_quote_sends FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
