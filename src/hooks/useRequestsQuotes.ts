import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBookingsRealtime } from './useBookingsRealtime';
import { useQuotesRealtime } from './useQuotesRealtime';
import { useJobsRealtime } from './useJobsRealtime';
import { useJobWorkersRealtime } from './useJobWorkersRealtime';
import { useInvoicesRealtime } from './useInvoicesRealtime';
import type { QuoteNewRow as QuoteType } from '@/lib/api/quotes-new';

export type BookingRow = {
  id: string;
  customer_id: string;
  service_slug: string;
  mode: string;
  status: string;
  payload: any;
  file_urls: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  customer_type?: 'private' | 'company' | 'brf';
  company_name?: string;
  brf_name?: string;
  org_number?: string;
  personnummer?: string;
};

export type JobRow = {
  id: string;
  status: string;
  estimated_hours?: number;
  created_at: string;
  pool_enabled: boolean;
  source_type: string;
  source_id: string;
  pricing_mode?: string;
  hourly_rate?: number;
  fixed_price?: number;
};

export type JobWorkerRow = {
  job_id: string;
  worker_id: string;
  is_lead: boolean;
  status: string;
  total_hours: number;
};

export type TimeLogRow = {
  id: string;
  job_id: string;
  worker_id: string;
  started_at: string;
  ended_at: string | null;
  hours: number;
};

export type MaterialLogRow = {
  id: string;
  job_id: string;
  worker_id: string;
  name: string;
  sku: string;
  supplier: string;
  qty: number;
  unit_price: number;
  created_at: string;
};

export type ExpenseLogRow = {
  id: string;
  job_id: string;
  worker_id: string;
  category: string;
  note: string;
  amount: number;
  receipt_url: string | null;
  created_at: string;
};

export type RequestWithQuote = {
  booking: BookingRow;
  quote?: QuoteType;
  customer?: CustomerRow;
  invoice?: InvoiceRow;
  job?: JobRow;
  workers?: JobWorkerRow[];
  timeLogs?: TimeLogRow[];
  materialLogs?: MaterialLogRow[];
  expenseLogs?: ExpenseLogRow[];
  totalHours?: number;
  totalMaterialCost?: number;
  totalExpenses?: number;
};

export type InvoiceRow = {
  id: string;
  invoice_number: string;
  status: string;
  total_amount: number;
  due_date: string;
  created_at: string;
};

export function useRequestsQuotes(statusFilter: string[] = []) {
  const [data, setData] = useState<RequestWithQuote[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch all quotes
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes_new')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      // Fetch invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;

      // Fetch jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, status, estimated_hours, created_at, pool_enabled, source_type, source_id, pricing_mode, hourly_rate, fixed_price')
        .order('created_at', { ascending: false });

      if (jobsError) console.error('Error fetching jobs:', jobsError);

      // Fetch job workers
      const { data: jobWorkers, error: workersError } = await supabase
        .from('job_worker_hours')
        .select('*');

      if (workersError) console.error('Error fetching workers:', workersError);

      // Fetch time logs
      const { data: timeLogs, error: timeLogsError } = await supabase
        .from('time_logs')
        .select('*');

      if (timeLogsError) console.error('Error fetching time logs:', timeLogsError);

      // Fetch material logs
      const { data: materialLogs, error: materialLogsError } = await supabase
        .from('material_logs')
        .select('*');

      if (materialLogsError) console.error('Error fetching material logs:', materialLogsError);

      // Fetch expense logs
      const { data: expenseLogs, error: expenseLogsError } = await supabase
        .from('expense_logs')
        .select('*');

      if (expenseLogsError) console.error('Error fetching expense logs:', expenseLogsError);

      // Fetch customers from BOTH bookings AND standalone quotes
      const bookingCustomerIds = bookings?.map((b: any) => b.customer_id).filter(Boolean) || [];
      const standaloneQuotes = quotes?.filter((q: any) => !q.request_id) || [];
      const quoteCustomerIds = standaloneQuotes.map((q: any) => q.customer_id).filter(Boolean);
      const customerIds = [...new Set([...bookingCustomerIds, ...quoteCustomerIds])];
      
      console.log('📊 Standalone quotes found:', standaloneQuotes.length);
      console.log('📊 Total customer IDs to fetch:', customerIds.length);
      
      const { data: customers } = customerIds.length > 0
        ? await supabase
            .from('customers')
            .select('id, name, email, phone, customer_type, company_name, brf_name, org_number, personnummer')
            .in('id', customerIds)
        : { data: [] };

      // Combine data
      const combined: RequestWithQuote[] = (bookings || []).map((booking: any) => {
        const quote = quotes?.find((q: any) => q.request_id === booking.id) as QuoteType | undefined;
        const customer = customers?.find((c: any) => c.id === booking.customer_id);
        // Find invoice via quote_id OR booking_id
        const invoice = invoices?.find((inv: any) => 
          (quote && inv.quote_id === quote.id) || 
          (inv.booking_id === booking.id)
        );
        
        // Find job by source (quote or booking)
        const job = jobs?.find((j: any) => 
          (j.source_type === 'quote' && j.source_id === quote?.id) ||
          (j.source_type === 'booking' && j.source_id === booking.id)
        );

        // Get workers for this job
        const workers = job ? jobWorkers?.filter((jw: any) => jw.job_id === job.id) : [];

        // Get logs for this job
        const jobTimeLogs = job ? timeLogs?.filter((tl: any) => tl.job_id === job.id) : [];
        const jobMaterialLogs = job ? materialLogs?.filter((ml: any) => ml.job_id === job.id) : [];
        const jobExpenseLogs = job ? expenseLogs?.filter((el: any) => el.job_id === job.id) : [];

        // Calculate totals
        const totalHours = jobTimeLogs?.reduce((sum: number, log: any) => sum + (log.hours || 0), 0) || 0;
        const totalMaterialCost = jobMaterialLogs?.reduce((sum: number, log: any) => sum + ((log.qty || 0) * (log.unit_price || 0)), 0) || 0;
        const totalExpenses = jobExpenseLogs?.reduce((sum: number, log: any) => sum + (log.amount || 0), 0) || 0;

        return {
          booking,
          quote,
          customer,
          invoice,
          job,
          workers,
          timeLogs: jobTimeLogs,
          materialLogs: jobMaterialLogs,
          expenseLogs: jobExpenseLogs,
          totalHours,
          totalMaterialCost,
          totalExpenses,
        };
      });

    const allCombined = combined.filter((item): item is RequestWithQuote => item !== null);

    // Add standalone quotes (quotes without request_id)
    const standaloneQuotesForMapping = quotes?.filter((q: any) => !q.request_id) || [];
    console.log('🔍 Processing standalone quotes:', standaloneQuotesForMapping.length);
    
    const standaloneItems: RequestWithQuote[] = standaloneQuotesForMapping.map((quote: any) => {
      console.log('🔍 Standalone quote:', quote.id, 'Customer:', quote.customer_id, 'Status:', quote.status);
      const customer = customers?.find((c: any) => c.id === quote.customer_id);
      const invoice = invoices?.find((inv: any) => inv.quote_id === quote.id);
      const job = jobs?.find((j: any) => j.source_type === 'quote' && j.source_id === quote.id);
      
      // Create synthetic booking for UI compatibility
      const syntheticBooking: BookingRow = {
        id: `synthetic-${quote.id}`,
        customer_id: quote.customer_id,
        service_slug: 'standalone-quote',
        mode: 'quote',
        status: 'new',
        payload: { name: customer?.name, email: customer?.email },
        file_urls: [],
        created_at: quote.created_at,
        updated_at: quote.created_at,
        deleted_at: null
      };

      const workers = job ? jobWorkers?.filter((jw: any) => jw.job_id === job.id) : [];
      const jobTimeLogs = job ? timeLogs?.filter((tl: any) => tl.job_id === job.id) : [];
      const jobMaterialLogs = job ? materialLogs?.filter((ml: any) => ml.job_id === job.id) : [];
      const jobExpenseLogs = job ? expenseLogs?.filter((el: any) => el.job_id === job.id) : [];
      
      const totalHours = jobTimeLogs?.reduce((sum: number, log: any) => sum + (log.hours || 0), 0) || 0;
      const totalMaterialCost = jobMaterialLogs?.reduce((sum: number, log: any) => sum + ((log.qty || 0) * (log.unit_price || 0)), 0) || 0;
      const totalExpenses = jobExpenseLogs?.reduce((sum: number, log: any) => sum + (log.amount || 0), 0) || 0;

      return {
        booking: syntheticBooking,
        quote,
        customer,
        invoice,
        job,
        workers,
        timeLogs: jobTimeLogs,
        materialLogs: jobMaterialLogs,
        expenseLogs: jobExpenseLogs,
        totalHours,
        totalMaterialCost,
        totalExpenses,
      };
    });

    // Combine all items
    const allItems = [...allCombined, ...standaloneItems];

    // Apply filters
    let filtered = allItems;
    if (statusFilter.length > 0) {
      const filterType = statusFilter[0];
      
      if (filterType === 'requests') {
        // Visa alla med status "new" OCH som inte har offert
        filtered = allItems.filter(item => 
          item.booking.status === 'new' && !item.quote
        );
      } else if (filterType === 'quotes') {
        // Visa ALLA som har en offert, oavsett booking status
        filtered = allItems.filter(item => !!item.quote);
      } else if (filterType === 'archived') {
        // Visa arkiverade
        filtered = allItems.filter(item => 
          ['completed', 'cancelled'].includes(item.booking.status)
        );
      }
    }

    setData(filtered);
    } catch (error) {
      console.error('Error loading requests and quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter.join(',')]);

  // Realtime updates
  useBookingsRealtime(() => loadData());
  useQuotesRealtime(() => loadData());
  useJobsRealtime(() => loadData());
  useJobWorkersRealtime(() => loadData());
  useInvoicesRealtime(() => loadData());

  return { data, loading, refresh: loadData };
}
