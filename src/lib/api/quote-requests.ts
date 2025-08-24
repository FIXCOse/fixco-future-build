import { supabase } from '@/integrations/supabase/client';

export type QuoteRequestRow = {
  id: string;
  customer_id: string;
  service_id: string;
  service_name?: string | null;
  status: string;
  description?: string | null;
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
  customer_id?: string | null;
  message?: string;
  rot_rut_type?: string | null;
  // Guest support fields
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  source?: string;
  created_by_type?: string;
  // Legacy fields (for backwards compatibility)
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  city?: string;
}) {
  console.log('[API] createQuoteRequest called with data:', quoteRequestData);
  
  const user = await supabase.auth.getUser();
  
  // Prepare insert data with guest/user support
  const insertData = {
    service_id: quoteRequestData.service_id,
    customer_id: quoteRequestData.customer_id || user.data.user?.id || null,
    message: quoteRequestData.message,
    rot_rut_type: quoteRequestData.rot_rut_type,
    
    // Guest support fields
    contact_name: quoteRequestData.contact_name || quoteRequestData.name,
    contact_email: quoteRequestData.contact_email || quoteRequestData.email,
    contact_phone: quoteRequestData.contact_phone || quoteRequestData.phone,
    source: quoteRequestData.source || (user.data.user ? 'user' : 'guest'),
    created_by_type: quoteRequestData.created_by_type || (user.data.user ? 'user' : 'guest'),
    
    // Legacy fields  
    name: quoteRequestData.contact_name || quoteRequestData.name,
    phone: quoteRequestData.contact_phone || quoteRequestData.phone,
    email: quoteRequestData.contact_email || quoteRequestData.email,
    address: quoteRequestData.address,
    postal_code: quoteRequestData.postal_code,
    city: quoteRequestData.city,
    
    created_by: user.data.user?.id,
    status: 'new'
  };

  console.log('[API] Inserting quote request via RPC with data:', insertData);

  const { data, error } = await supabase.rpc('create_quote_request_secure', { p: insertData });

  if (error) {
    console.error('[API] Quote request RPC error:', error);
    throw error;
  }
  
  console.log('[API] Quote request created successfully. ID:', data);
  return { id: data as string };
}