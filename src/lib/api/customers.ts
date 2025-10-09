import { supabase } from '@/integrations/supabase/client';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  created_at: string;
};

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createCustomer(customerData: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  personnummer?: string;
  postalCode?: string;
  city?: string;
}) {
  const { data, error } = await supabase
    .from('customers')
    .insert(customerData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomer(id: string, customerData: Partial<Customer>) {
  const { data, error } = await supabase
    .from('customers')
    .update(customerData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
