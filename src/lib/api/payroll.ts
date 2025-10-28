import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export type PayrollPeriod = {
  id: string;
  period_start: string;
  period_end: string;
  status: 'draft' | 'locked' | 'paid';
  locked_at?: string;
  locked_by?: string;
  paid_at?: string;
  notes?: string;
  created_at: string;
};

export type PayrollEntry = {
  id: string;
  period_id: string;
  worker_id: string;
  staff_id?: string;
  total_hours: number;
  hourly_rate: number;
  gross_salary: number;
  deductions: number;
  net_salary: number;
  jobs_count: number;
  notes?: string;
  worker?: {
    first_name: string;
    last_name: string;
    email: string;
  };
};

export type WorkerPayrollSummary = {
  worker_id: string;
  name: string;
  email: string;
  hourly_rate: number;
  total_hours: number;
  gross_salary: number;
  jobs_count: number;
  avg_hours_per_job: number;
  revenue_generated: number;
  cost: number;
  profit: number;
  profit_margin: number;
};

export async function fetchPayrollSummary(startDate: Date, endDate: Date) {
  const { data: timeLogs, error: timeError } = await supabase
    .from('time_logs')
    .select(`
      worker_id,
      hours,
      manual_hours,
      job_id,
      jobs!inner(
        fixed_price,
        hourly_rate,
        pricing_mode,
        status
      )
    `)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (timeError) throw timeError;

  // Get workers by querying user_roles table
  const { data: workerRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('user_id')
    .in('role', ['worker', 'technician']);

  if (rolesError) throw rolesError;

  const workerIds = workerRoles?.map(r => r.user_id) || [];

  const { data: workers, error: workerError } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      last_name,
      email,
      staff!staff_user_id_fkey(hourly_rate, active)
    `)
    .in('id', workerIds);

  if (workerError) throw workerError;

  // Calculate summary per worker
  const summaries: WorkerPayrollSummary[] = workers
    .filter((w: any) => w.staff && w.staff[0]?.active)
    .map((worker: any) => {
      const workerLogs = timeLogs?.filter((log: any) => log.worker_id === worker.id) || [];
      const totalHours = workerLogs.reduce(
        (sum: number, log: any) => sum + (log.hours || log.manual_hours || 0),
        0
      );
      const hourlyRate = worker.staff[0]?.hourly_rate || 0;
      const grossSalary = totalHours * hourlyRate;

      const jobIds = new Set(workerLogs.map((log: any) => log.job_id));
      const jobsCount = jobIds.size;

      // Calculate revenue generated
      const revenueGenerated = workerLogs.reduce((sum: number, log: any) => {
        const job = log.jobs;
        if (job?.status === 'completed' && job.pricing_mode === 'fixed') {
          return sum + (job.fixed_price || 0) / jobsCount; // Simplistic split
        }
        return sum + (log.hours || log.manual_hours || 0) * (job?.hourly_rate || 0);
      }, 0);

      const profit = revenueGenerated - grossSalary;
      const profitMargin = revenueGenerated > 0 ? (profit / revenueGenerated) * 100 : 0;

      return {
        worker_id: worker.id,
        name: `${worker.first_name} ${worker.last_name}`,
        email: worker.email,
        hourly_rate: hourlyRate,
        total_hours: totalHours,
        gross_salary: grossSalary,
        jobs_count: jobsCount,
        avg_hours_per_job: jobsCount > 0 ? totalHours / jobsCount : 0,
        revenue_generated: revenueGenerated,
        cost: grossSalary,
        profit,
        profit_margin: profitMargin,
      };
    });

  return summaries;
}

export async function fetchWorkerPayrollDetails(
  workerId: string,
  startDate: Date,
  endDate: Date
) {
  const { data: timeLogs, error } = await supabase
    .from('time_logs')
    .select(`
      *,
      jobs(id, title, status, fixed_price, pricing_mode)
    `)
    .eq('worker_id', workerId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;

  const { data: worker, error: workerError } = await supabase
    .from('profiles')
    .select(`
      *,
      staff!staff_user_id_fkey(*)
    `)
    .eq('id', workerId)
    .single();

  if (workerError) throw workerError;

  return { timeLogs, worker };
}

export async function fetchPayrollPeriods() {
  const { data, error } = await supabase
    .from('payroll_periods')
    .select('*')
    .order('period_start', { ascending: false });

  if (error) throw error;
  return data as PayrollPeriod[];
}

export async function createPayrollPeriod(startDate: Date, endDate: Date, notes?: string) {
  const { data, error } = await supabase
    .from('payroll_periods')
    .insert({
      period_start: format(startDate, 'yyyy-MM-dd'),
      period_end: format(endDate, 'yyyy-MM-dd'),
      status: 'draft',
      notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PayrollPeriod;
}

export async function lockPayrollPeriod(periodId: string) {
  const { data, error } = await supabase
    .from('payroll_periods')
    .update({
      status: 'locked',
      locked_at: new Date().toISOString(),
      locked_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .eq('id', periodId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markPayrollPeriodPaid(periodId: string) {
  const { data, error } = await supabase
    .from('payroll_periods')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('id', periodId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function generatePayrollEntriesForPeriod(periodId: string) {
  // Get period details
  const { data: period, error: periodError } = await supabase
    .from('payroll_periods')
    .select('*')
    .eq('id', periodId)
    .single();

  if (periodError) throw periodError;

  const startDate = new Date(period.period_start);
  const endDate = new Date(period.period_end);

  // Get worker summaries
  const summaries = await fetchPayrollSummary(startDate, endDate);

  // Create entries
  const entries = summaries.map((summary) => ({
    period_id: periodId,
    worker_id: summary.worker_id,
    total_hours: summary.total_hours,
    hourly_rate: summary.hourly_rate,
    gross_salary: summary.gross_salary,
    deductions: 0,
    net_salary: summary.gross_salary,
    jobs_count: summary.jobs_count,
  }));

  const { data, error } = await supabase
    .from('payroll_entries')
    .insert(entries)
    .select();

  if (error) throw error;
  return data;
}

export async function fetchPayrollEntriesForPeriod(periodId: string) {
  const { data, error } = await supabase
    .from('payroll_entries')
    .select(`
      *,
      worker:profiles!payroll_entries_worker_id_fkey(
        first_name,
        last_name,
        email
      )
    `)
    .eq('period_id', periodId)
    .order('gross_salary', { ascending: false });

  if (error) throw error;
  return data as PayrollEntry[];
}
