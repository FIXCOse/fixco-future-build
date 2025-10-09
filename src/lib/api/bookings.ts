import { supabase } from '@/integrations/supabase/client';

export type BookingRow = {
  id: string;
  customer_id: string;
  service_id: string;
  service_name?: string | null;
  status: string;
  price_type: string;
  hours_estimated?: number | null;
  hourly_rate?: number | null;
  materials?: number | null;
  discount_percent?: number | null;
  vat_percent?: number | null;
  rot_rut_type?: string | null;
  description?: string | null;
  internal_notes?: string | null;
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
  deleted_at?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  customer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  base_price?: number;
  final_price?: number;
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
  service_name: string;
  customer_id?: string | null;
  price_type: string;
  hours_estimated?: number | null;
  hourly_rate?: number | null;
  materials?: number;
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
  notes?: string;
}) {
  console.log('[API] createBooking called with data:', bookingData);
  
  const user = await supabase.auth.getUser();
  
  // Prepare insert data with guest/user support
  const insertData = {
    customer_id: bookingData.customer_id || user.data.user?.id || null,
    service_id: bookingData.service_id,
    service_name: bookingData.service_name || bookingData.service_id,
    property_id: null,
    status: 'pending' as const,
    price_type: bookingData.price_type,
    hours_estimated: bookingData.hours_estimated,
    hourly_rate: bookingData.hourly_rate,
    materials: bookingData.materials || 0,
    base_price: bookingData.hourly_rate || 500,
    final_price: (bookingData.hourly_rate || 500) + (bookingData.materials || 0),
    rot_rut_type: bookingData.rot_rut_type,
    
    // Guest support fields
    contact_name: bookingData.contact_name || bookingData.name,
    contact_email: bookingData.contact_email || bookingData.email,
    contact_phone: bookingData.contact_phone || bookingData.phone,
    source: bookingData.source || (user.data.user ? 'user' : 'guest'),
    created_by_type: bookingData.created_by_type || (user.data.user ? 'user' : 'guest'),
    
    // Legacy fields
    name: bookingData.contact_name || bookingData.name,
    phone: bookingData.contact_phone || bookingData.phone,
    email: bookingData.contact_email || bookingData.email,
    address: bookingData.address,
    postal_code: bookingData.postal_code,
    city: bookingData.city,
    notes: bookingData.notes,
    created_by: user.data.user?.id
  };

  console.log('[API] Inserting booking data:', insertData);

  const { data, error } = await supabase
    .from('bookings')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('[API] Booking insert error:', error);
    throw error;
  }
  
  console.log('[API] Booking created successfully:', data);
  return data;
}