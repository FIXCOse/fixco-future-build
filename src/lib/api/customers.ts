import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Customer[];
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single();
  
  if (error) throw error;
  return data as Customer;
}

export async function upsertCustomer(customer: Omit<Customer, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .upsert(customer, { onConflict: 'email' })
    .select()
    .single();
  
  if (error) throw error;
  return data as Customer;
}
