import { supabase } from '@/integrations/supabase/client';

export interface QuoteNew {
  id: string;
  number: string;
  customer_id: string | null;
  request_id?: string | null;
  title: string;
  items: any[];
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
}

export async function fetchQuotesNew() {
  const { data, error } = await supabase
    .from('quotes_new')
    .select(`
      *,
      customer:customers(name, email, phone)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createQuoteNew(quote: {
  customer_id: string;
  request_id?: string;
  title: string;
  items: any[];
  subtotal_work_sek: number;
  subtotal_mat_sek: number;
  vat_sek: number;
  rot_deduction_sek: number;
  total_sek: number;
  pdf_url?: string;
  valid_until?: string;
}) {
  // Generate quote number and token
  const { data: numberData } = await supabase.rpc('generate_quote_number_new');
  const { data: tokenData } = await supabase.rpc('generate_public_token');
  
  const { data, error } = await supabase
    .from('quotes_new')
    .insert({
      ...quote,
      number: numberData,
      public_token: tokenData,
      status: 'draft'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as QuoteNew;
}

export async function getQuoteByToken(token: string) {
  const { data, error } = await supabase
    .from('quotes_new')
    .select(`
      id,
      number,
      title,
      items,
      total_sek,
      pdf_url,
      valid_until,
      status,
      customer:customers(name, email)
    `)
    .eq('public_token', token)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export async function markQuoteViewed(token: string) {
  const { error } = await supabase
    .from('quotes_new')
    .update({ 
      status: 'viewed',
      viewed_at: new Date().toISOString() 
    })
    .eq('public_token', token)
    .eq('status', 'sent');
  
  if (error) throw error;
}

export async function sendQuoteEmail(quoteId: string) {
  const { data, error } = await supabase.functions.invoke('send-quote-email', {
    body: { quoteId }
  });
  
  if (error) throw error;
  return data;
}
