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
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
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
  console.log('fetchJobs called with params:', params);
  
  // Verify auth first
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log('Current auth user:', user?.id, user?.email, 'authError:', authError);

  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (params?.status) {
    query = query.in('status', params.status);
  }

  if (params?.assigned_to_me) {
    if (user) {
      query = query.eq('assigned_worker_id', user.id);
    }
  }

  if (params?.pool_only) {
    console.log('Fetching pool jobs: status=pool, pool_enabled=true');
    query = query.eq('status', 'pool').eq('pool_enabled', true);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
  }

  const { data, error } = await query;
  console.log('fetchJobs result:', { 
    dataCount: data?.length, 
    error: error?.message,
    errorDetails: error,
    firstJob: data?.[0]
  });
  
  if (error) {
    console.error('fetchJobs error:', error);
    throw error;
  }

  return data as Job[];
}

export async function fetchJobById(jobId: string) {
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .maybeSingle();

  if (error) throw error;
  if (!job) return null;

  // Fetch customer info if customer_id exists
  let customer = null;
  if (job.customer_id) {
    const { data: customerData } = await supabase
      .from('customers')
      .select('name, email, phone')
      .eq('id', job.customer_id)
      .maybeSingle();
    
    customer = customerData;
  }

  return { ...job, customer } as Job;
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

export const createJobFromBooking = async (bookingId: string) => {
  const { data, error } = await supabase.rpc('create_job_from_booking', {
    p_booking_id: bookingId
  });
  if (error) throw error;
  return data;
};

export const createJobFromQuote = async (quoteId: string) => {
  const { data, error } = await supabase.rpc('create_job_from_quote', {
    p_quote_id: quoteId
  });
  if (error) throw error;
  return data;
};

export const assignJobToWorker = async (jobId: string, workerId: string) => {
  const { data, error } = await supabase.rpc('assign_job_to_worker', {
    p_job_id: jobId,
    p_worker_id: workerId
  });
  if (error) throw error;
  return data;
};