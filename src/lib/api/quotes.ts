import { supabase } from '@/integrations/supabase/client';

export type QuoteRow = {
  id: string;
  quote_number: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  title: string;
  description?: string | null;
  created_at: string;
  updated_at?: string;
  accepted_at?: string | null;
  valid_until?: string | null;
  customer_id: string;
  property_id: string;
  organization_id?: string | null;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  rot_amount?: number | null;
  rut_amount?: number | null;
  discount_amount?: number | null;
  discount_percent?: number | null;
  line_items: any;
  created_by?: string | null;
  customer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  property?: {
    address?: string;
    city?: string;
  } | null;
};

export async function fetchQuotes(params?: {
  status?: string[];
  q?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('quotes')
    .select(`
      *,
      customer:profiles!quotes_customer_id_fkey(first_name, last_name, email),
      property:properties(address, city)
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (params?.status?.length) {
    query = query.in('status', params.status as any);
  }
  
  if (params?.from) {
    query = query.gte('created_at', params.from);
  }
  
  if (params?.to) {
    query = query.lte('created_at', params.to);
  }
  
  if (params?.q) {
    query = query.or(`quote_number.ilike.%${params.q}%,title.ilike.%${params.q}%`);
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

export async function createQuote(quoteData: {
  customer_id: string;
  property_id?: string | null;
  title: string;
  description?: string;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  rot_amount?: number;
  rut_amount?: number;
  discount_amount?: number;
  discount_percent?: number;
  line_items: any[];
  organization_id?: string;
}) {
  const user = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('quotes')
    .insert({
      ...quoteData,
      created_by: user.data.user?.id,
      quote_number: '' // Will be overridden by trigger
    } as any)
    .select('id')
    .single();

  if (error) throw error;
  return data;
}