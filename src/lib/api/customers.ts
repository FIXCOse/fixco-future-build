import { supabase } from '@/integrations/supabase/client';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  personnummer?: string | null;
  postal_code?: string | null;
  city?: string | null;
  customer_type?: 'private' | 'company' | 'brf';
  company_name?: string | null;
  org_number?: string | null;
  brf_name?: string | null;
  booking_count?: number;
  last_booking_at?: string | null;
  total_spent?: number;
  notes?: string | null;
  created_at: string;
};

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchCustomerWithDetails(customerId: string) {
  const [customerRes, bookingsRes, quotesRes] = await Promise.all([
    supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single(),
    supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false }),
    supabase
      .from('quotes_new')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
  ]);

  if (customerRes.error) throw customerRes.error;
  
  return {
    customer: customerRes.data,
    bookings: bookingsRes.data || [],
    quotes: quotesRes.data || []
  };
}

export async function createCustomer(customerData: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  personnummer?: string;
  postalCode?: string;
  city?: string;
  customerType?: 'private' | 'company' | 'brf';
  companyName?: string;
  orgNumber?: string;
  brfName?: string;
}) {
  const { data, error } = await supabase
    .from('customers')
    .insert({
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address,
      personnummer: customerData.personnummer,
      postal_code: customerData.postalCode,
      city: customerData.city,
      customer_type: customerData.customerType || 'private',
      company_name: customerData.companyName,
      org_number: customerData.orgNumber,
      brf_name: customerData.brfName
    })
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
