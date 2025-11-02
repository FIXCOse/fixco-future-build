import { supabase } from '@/integrations/supabase/client';
import { getServiceCategoriesForSkills } from '@/lib/skillCategoryMapping';

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
  admin_set_price?: number;
  bonus_amount?: number;
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
  
  // Verify session and auth first
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('fetchJobs - Session exists:', !!session, 'Session error:', sessionError);
  
  if (!session) {
    throw new Error('Ingen aktiv session. Vänligen logga in igen.');
  }
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log('fetchJobs - Current auth user:', user?.id, user?.email, 'authError:', authError);
  
  if (!user) {
    throw new Error('Kunde inte hämta användarinformation. Vänligen logga in igen.');
  }

  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (params?.status) {
    query = query.in('status', params.status);
  }

  if (params?.assigned_to_me) {
    query = query.eq('assigned_worker_id', user.id);
  }

  if (params?.pool_only) {
    console.log('Fetching pool jobs with skill-based filtering');
    
    // Fetch worker's skills
    const { data: staffData } = await supabase
      .from('staff')
      .select(`
        staff_id,
        staff_skills (
          skills (
            category
          )
        )
      `)
      .eq('user_id', user.id)
      .maybeSingle();

    if (staffData?.staff_skills && staffData.staff_skills.length > 0) {
      // Extract skill categories
      const skillCategories = staffData.staff_skills
        .map((ss: any) => ss.skills?.category)
        .filter(Boolean);

      console.log('Worker skill categories:', skillCategories);

      if (skillCategories.length > 0) {
        // Map to service categories
        const serviceCategories = getServiceCategoriesForSkills(skillCategories);
        console.log('Mapped service categories:', serviceCategories);

        // Fetch matching service IDs
        const { data: matchingServices } = await supabase
          .from('services')
          .select('id')
          .in('category', serviceCategories)
          .eq('is_active', true);

        const serviceIds = matchingServices?.map((s: any) => s.id) || [];
        console.log('Matching service IDs:', serviceIds);

        if (serviceIds.length > 0) {
          // Filter jobs: either matching service_id OR null (for backward compatibility)
          query = query.or(`service_id.in.(${serviceIds.join(',')}),service_id.is.null`);
        } else {
          // No matching services found, but still show jobs without service_id
          query = query.is('service_id', null);
        }
      }
    }
    
    query = query
      .eq('status', 'pool')
      .eq('pool_enabled', true)
      .is('assigned_worker_id', null);
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
  // First, get booking details to extract service_slug
  const { data: booking } = await supabase
    .from('bookings')
    .select('service_slug')
    .eq('id', bookingId)
    .single();

  const { data, error } = await supabase.rpc('create_job_from_booking', {
    p_booking_id: bookingId
  });
  if (error) throw error;

  // Update the created job with service_id from booking
  if (data && booking?.service_slug) {
    await supabase
      .from('jobs')
      .update({ service_id: booking.service_slug })
      .eq('source_type', 'booking')
      .eq('source_id', bookingId);
  }

  return data;
};

export const createJobFromQuote = async (quoteId: string) => {
  // First, get quote details to extract service from line_items
  const { data: quote } = await supabase
    .from('quotes')
    .select('line_items')
    .eq('id', quoteId)
    .single();

  const { data, error } = await supabase.rpc('create_job_from_quote', {
    p_quote_id: quoteId
  });
  if (error) throw error;

  // Update the created job with service_id from quote's first line item
  if (data && quote?.line_items && Array.isArray(quote.line_items) && quote.line_items[0]) {
    const firstItem: any = quote.line_items[0];
    if (firstItem.service_id) {
      await supabase
        .from('jobs')
        .update({ service_id: firstItem.service_id })
        .eq('source_type', 'quote')
        .eq('source_id', quoteId);
    }
  }

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

export const returnJobToPool = async (
  jobId: string, 
  reason: 'too_difficult' | 'time_conflict' | 'equipment_missing' | 'customer_request' | 'other',
  reasonText?: string
) => {
  const { data, error } = await supabase.rpc('return_job_to_pool', {
    p_job_id: jobId,
    p_reason: reason,
    p_reason_text: reasonText || null
  });
  
  if (error) throw error;
  return data;
};