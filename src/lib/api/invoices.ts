import { supabase } from '@/integrations/supabase/client';

export async function createInvoiceFromJob(jobId: string, customerId: string) {
  const { data, error } = await supabase.functions.invoke('create-invoice-from-job', {
    body: { jobId, customerId }
  });
  
  if (error) throw error;
  return data;
}
