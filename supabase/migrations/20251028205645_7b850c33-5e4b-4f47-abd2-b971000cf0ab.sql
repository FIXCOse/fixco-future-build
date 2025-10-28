-- Create payroll_periods table
CREATE TABLE public.payroll_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, locked, paid
  locked_at TIMESTAMP WITH TIME ZONE,
  locked_by UUID REFERENCES public.profiles(id),
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_period CHECK (period_end >= period_start),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'locked', 'paid'))
);

-- Create payroll_entries table
CREATE TABLE public.payroll_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id UUID REFERENCES public.payroll_periods(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.profiles(id),
  staff_id UUID REFERENCES public.staff(id),
  total_hours NUMERIC NOT NULL DEFAULT 0,
  hourly_rate NUMERIC NOT NULL,
  gross_salary NUMERIC NOT NULL,
  deductions NUMERIC DEFAULT 0,
  net_salary NUMERIC NOT NULL,
  jobs_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_payroll_periods_status ON public.payroll_periods(status);
CREATE INDEX idx_payroll_periods_dates ON public.payroll_periods(period_start, period_end);
CREATE INDEX idx_payroll_entries_period ON public.payroll_entries(period_id);
CREATE INDEX idx_payroll_entries_worker ON public.payroll_entries(worker_id);

-- Enable RLS
ALTER TABLE public.payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admin/owner can access
CREATE POLICY "Admin can manage payroll periods"
  ON public.payroll_periods
  FOR ALL
  USING (is_admin_or_owner());

CREATE POLICY "Admin can manage payroll entries"
  ON public.payroll_entries
  FOR ALL
  USING (is_admin_or_owner());

-- Trigger for updated_at
CREATE TRIGGER update_payroll_periods_updated_at
  BEFORE UPDATE ON public.payroll_periods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_entries_updated_at
  BEFORE UPDATE ON public.payroll_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();