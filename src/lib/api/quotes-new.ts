import { supabase } from '@/integrations/supabase/client';

export type QuoteNewRow = {
  id: string;
  number: string;
  customer_id: string | null;
  request_id?: string | null;
  title: string;
  items: any;
  subtotal_work_sek: number;
  subtotal_mat_sek: number;
  vat_sek: number;
  rot_deduction_sek: number;
  total_sek: number;
  pdf_url?: string | null;
  status: 'draft' | 'sent' | 'viewed' | 'change_requested' | 'accepted' | 'declined' | 'expired';
  valid_until?: string | null;
  public_token: string;
  sent_at?: string | null;
  viewed_at?: string | null;
  accepted_at?: string | null;
  change_req_at?: string | null;
  declined_at?: string | null;
  created_at: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  } | null;
};

export async function fetchQuotesNew(params?: {
  status?: string[];
  q?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('quotes_new')
    .select(`
      *,
      customer:customers(id, name, email, phone, address)
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (params?.status?.length) {
    query = query.in('status', params.status);
  }
  
  if (params?.q) {
    query = query.or(`number.ilike.%${params.q}%,title.ilike.%${params.q}%`);
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
    data: (data || []) as QuoteNewRow[], 
    count: count ?? 0 
  };
}

export async function getQuoteNew(id: string) {
  const { data, error } = await supabase
    .from('quotes_new')
    .select(`
      *,
      customer:customers(id, name, email, phone, address)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as QuoteNewRow;
}

export async function createQuoteNew(quoteData: {
  customer_id: string;
  title: string;
  items: any[];
  subtotal_work_sek: number;
  subtotal_mat_sek: number;
  vat_sek: number;
  rot_deduction_sek: number;
  total_sek: number;
  pdf_url?: string;
  valid_until?: string;
  request_id?: string;
}) {
  // Call DB functions to generate number and token
  const { data: numberData, error: numberError } = await supabase
    .rpc('generate_quote_number_new');
  
  if (numberError) throw numberError;

  const { data: tokenData, error: tokenError } = await supabase
    .rpc('generate_public_token');
  
  if (tokenError) throw tokenError;

  const { data, error } = await supabase
    .from('quotes_new')
    .insert({
      ...quoteData,
      number: numberData,
      public_token: tokenData,
      status: 'draft'
    })
    .select(`
      *,
      customer:customers(id, name, email, phone, address)
    `)
    .single();

  if (error) throw error;
  return data as QuoteNewRow;
}

export async function updateQuoteNew(id: string, quoteData: Partial<QuoteNewRow>) {
  const { data, error } = await supabase
    .from('quotes_new')
    .update(quoteData)
    .eq('id', id)
    .select(`
      *,
      customer:customers(id, name, email, phone, address)
    `)
    .single();

  if (error) throw error;
  return data as QuoteNewRow;
}

export async function deleteQuoteNew(id: string) {
  const { error } = await supabase
    .from('quotes_new')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
