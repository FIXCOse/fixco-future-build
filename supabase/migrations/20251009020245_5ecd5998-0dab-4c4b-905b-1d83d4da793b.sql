-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES public.quotes_new(id),
  customer_id uuid REFERENCES public.customers(id),
  title text,
  status text CHECK (status IN ('pending','scheduled','in_progress','done','archived')) DEFAULT 'pending',
  start_date date,
  assigned_to uuid,
  created_at timestamptz DEFAULT now()
);

-- Create workers table
CREATE TABLE IF NOT EXISTS public.workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  skills jsonb,
  region text,
  active boolean DEFAULT true
);

-- Create dispatch_queue table
CREATE TABLE IF NOT EXISTS public.dispatch_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  strategy text CHECK (strategy IN ('pool','manual')),
  status text CHECK (status IN ('unassigned','invited','assigned','declined')) DEFAULT 'unassigned',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON public.projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_quote_id ON public.projects(quote_id);
CREATE INDEX IF NOT EXISTS idx_dispatch_queue_project_id ON public.dispatch_queue(project_id);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Admin can manage projects"
  ON public.projects
  FOR ALL
  USING (is_admin_or_owner());

CREATE POLICY "Users can view own projects"
  ON public.projects
  FOR SELECT
  USING (customer_id = auth.uid());

-- RLS Policies for workers
CREATE POLICY "Admin can manage workers"
  ON public.workers
  FOR ALL
  USING (is_admin_or_owner());

CREATE POLICY "Workers can view themselves"
  ON public.workers
  FOR SELECT
  USING (true);

-- RLS Policies for dispatch_queue
CREATE POLICY "Admin can manage dispatch queue"
  ON public.dispatch_queue
  FOR ALL
  USING (is_admin_or_owner());