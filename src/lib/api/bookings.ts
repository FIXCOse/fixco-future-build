import { supabase } from '@/integrations/supabase/client';

export type BookingRow = {
  id: string;
  customer_id: string;
  service_id: string;
  status: string;
  price_type: string;
  hours_estimated?: number | null;
  hourly_rate?: number | null;
  materials?: number | null;
  discount_percent?: number | null;
  vat_percent?: number | null;
  rot_rut_type?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at?: string | null;
  customer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
};

export async function fetchBookings(params?: {
  status?: string[];
  q?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      customer:profiles!bookings_customer_id_fkey(first_name, last_name, email)
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
    query = query.or(`service_name.ilike.%${params.q}%,name.ilike.%${params.q}%,email.ilike.%${params.q}%`);
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

export async function createBooking(bookingData: {
  service_id: string;
  customer_id: string;
  price_type: string;
  hours_estimated?: number;
  hourly_rate?: number;
  materials?: number;
  rot_rut_type?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  notes?: string;
}) {
  const user = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: bookingData.customer_id,
      service_id: bookingData.service_id,
      service_name: bookingData.service_id, // Use service_id as service_name for now
      property_id: null, // We'll make this optional for direct bookings
      status: 'pending',
      price_type: bookingData.price_type,
      hours_estimated: bookingData.hours_estimated,
      hourly_rate: bookingData.hourly_rate,
      materials: bookingData.materials || 0,
      base_price: bookingData.hourly_rate || 0,
      final_price: bookingData.hourly_rate || 0,
      rot_rut_type: bookingData.rot_rut_type,
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      address: bookingData.address,
      postal_code: bookingData.postal_code,
      city: bookingData.city,
      notes: bookingData.notes,
      created_by: user.data.user?.id
    } as any)
    .select('id')
    .single();

  if (error) throw error;
  return data;
}