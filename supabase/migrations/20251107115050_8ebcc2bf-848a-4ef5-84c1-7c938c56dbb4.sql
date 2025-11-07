-- Create job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  profession TEXT NOT NULL CHECK (profession IN ('Snickare', 'Elektriker', 'VVS', 'Målare', 'Trädgård', 'Städ', 'Montering', 'Markarbeten', 'Flytt')),
  skills JSONB DEFAULT '[]'::jsonb,
  experience_years INTEGER,
  has_drivers_license BOOLEAN DEFAULT false,
  has_own_tools BOOLEAN DEFAULT false,
  has_company BOOLEAN DEFAULT false,
  company_name TEXT,
  org_number TEXT,
  cv_file_path TEXT,
  certificates JSONB DEFAULT '[]'::jsonb,
  availability TEXT CHECK (availability IN ('Heltid', 'Deltid', 'Projekt', 'Flexibelt')),
  preferred_start_date DATE,
  motivation TEXT,
  work_references JSONB DEFAULT '[]'::jsonb,
  linkedin_url TEXT,
  portfolio_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn', 'converted')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  interview_date TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  gdpr_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit applications"
  ON public.job_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins and owners can view all applications"
  ON public.job_applications
  FOR SELECT
  TO authenticated
  USING (is_admin_or_owner());

CREATE POLICY "Admins and owners can update applications"
  ON public.job_applications
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_owner())
  WITH CHECK (is_admin_or_owner());

CREATE POLICY "Admins and owners can delete applications"
  ON public.job_applications
  FOR DELETE
  TO authenticated
  USING (is_admin_or_owner());

-- Indexes for performance
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_job_applications_profession ON public.job_applications(profession);
CREATE INDEX idx_job_applications_created_at ON public.job_applications(created_at DESC);
CREATE INDEX idx_job_applications_email ON public.job_applications(email);

-- Updated at trigger
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-applications',
  'job-applications',
  false,
  5242880, -- 5MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Anyone can upload CVs"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'job-applications');

CREATE POLICY "Admins can view CVs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'job-applications' AND is_admin_or_owner());

CREATE POLICY "Admins can delete CVs"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'job-applications' AND is_admin_or_owner());