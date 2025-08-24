import { supabase } from '@/integrations/supabase/client';

export type QuoteRequestRow = {
  id: string;
  customer_id: string;
  service_id: string;
  status: string;
  message?: string | null;
  rot_rut_type?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at?: string | null;
  customer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
};

export async function fetchQuoteRequests(params?: {
  status?: string[];
  q?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('quote_requests')
    .select(`*`, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (params?.status?.length) {
    query = query.in('status', params.status);
  }
  
  if (params?.from) {
    query = query.gte('created_at', params.from);
  }
  
  if (params?.to) {
    query = query.lte('created_at', params.to);
  }
  
  if (params?.q) {
    query = query.or(`service_id.ilike.%${params.q}%,name.ilike.%${params.q}%,email.ilike.%${params.q}%,message.ilike.%${params.q}%`);
  }
  
  if (params?.limit) {
    query = query.limit(params.limit);
  }
  
  if (params?.offset) {
    query = query.range(params.offset, (params.offset + (params.limit ?? 50) - 1));
  }

  const { data, count, error } = await query;
  if (error) throw error;
  
  return { 
    data: data || [], 
    count: count ?? 0 
  };
}

export async function createQuoteRequest(quoteRequestData: {
  service_id: string;
  customer_id: string;
  message?: string;
  rot_rut_type?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  city?: string;
}) {
  const user = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('quote_requests')
    .insert({
      ...quoteRequestData,
      created_by: user.data.user?.id,
      status: 'new'
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}