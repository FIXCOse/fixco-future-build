import { supabase } from '@/integrations/supabase/client';

export type Job = {
  id: string;
  created_at: string;
  source_type: 'booking' | 'quote';
  source_id: string;
  customer_id?: string;
  property_id?: string;
  title?: string;
  description?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  pricing_mode: 'hourly' | 'fixed';
  hourly_rate?: number;
  fixed_price?: number;
  rot_rut: any;
  status: 'pool' | 'assigned' | 'in_progress' | 'paused' | 'completed' | 'approved' | 'invoiced' | 'cancelled';
  pool_enabled: boolean;
  assigned_worker_id?: string;
  assigned_at?: string;
  start_scheduled_at?: string;
  due_date?: string;
};

export type TimeLog = {
  id: string;
  job_id: string;
  worker_id: string;
  started_at?: string;
  ended_at?: string;
  break_min: number;
  hours?: number;
  manual_hours?: number;
  note?: string;
  created_at: string;
};

export type MaterialLog = {
  id: string;
  job_id: string;
  worker_id: string;
  sku?: string;
  name: string;
  qty: number;
  unit_price?: number;
  supplier?: string;
  created_at: string;
};

export type ExpenseLog = {
  id: string;
  job_id: string;
  worker_id: string;
  category?: string;
  amount: number;
  receipt_url?: string;
  note?: string;
  created_at: string;
};

export async function fetchJobs(params?: {
  status?: string[];
  assigned_to_me?: boolean;
  pool_only?: boolean;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (params?.status) {
    query = query.in('status', params.status);
  }

  if (params?.assigned_to_me) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      query = query.eq('assigned_worker_id', user.id);
    }
  }

  if (params?.pool_only) {
    query = query.eq('status', 'pool').eq('pool_enabled', true);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data as Job[];
}

export async function fetchJobById(jobId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) throw error;
  return data as Job;
}

export async function claimJob(jobId: string) {
  const { data, error } = await supabase.rpc('claim_job', {
    p_job_id: jobId
  });

  if (error) throw error;
  return data;
}

export async function updateJobStatus(jobId: string, status: string) {
  const { data, error } = await supabase.rpc('update_job_status', {
    p_job_id: jobId,
    p_status: status
  });

  if (error) throw error;
  return data;
}

export async function completeJob(jobId: string) {
  const { data, error } = await supabase.rpc('complete_job', {
    p_job_id: jobId
  });

  if (error) throw error;
  return data;
}

export async function createTimeEntry(timeData: {
  job_id: string;
  started_at?: string;
  ended_at?: string;
  break_min?: number;
  manual_hours?: number;
  note?: string;
}) {
  const { data, error } = await supabase.rpc('create_time_entry', { p: timeData });
  if (error) throw error;
  return data;
}

export async function createMaterialEntry(materialData: {
  job_id: string;
  sku?: string;
  name: string;
  qty: number;
  unit_price?: number;
  supplier?: string;
}) {
  const { data, error } = await supabase.rpc('create_material_entry', { p: materialData });
  if (error) throw error;
  return data;
}

export async function createExpenseEntry(expenseData: {
  job_id: string;
  category?: string;
  amount: number;
  receipt_url?: string;
  note?: string;
}) {
  const { data, error } = await supabase.rpc('create_expense_entry', { p: expenseData });
  if (error) throw error;
  return data;
}

export async function fetchTimeLogs(jobId: string) {
  const { data, error } = await supabase
    .from('time_logs')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as TimeLog[];
}

export async function fetchMaterialLogs(jobId: string) {
  const { data, error } = await supabase
    .from('material_logs')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as MaterialLog[];
}

export async function fetchExpenseLogs(jobId: string) {
  const { data, error } = await supabase
    .from('expense_logs')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ExpenseLog[];
}

export async function prepareInvoiceFromJob(jobId: string) {
  const { data, error } = await supabase.rpc('prepare_invoice_from_job', {
    p_job_id: jobId
  });

  if (error) throw error;
  return data;
}