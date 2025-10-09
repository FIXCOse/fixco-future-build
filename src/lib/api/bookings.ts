import { supabase } from '@/integrations/supabase/client';

export type BookingRow = {
  id: string;
  customer_id: string;
  service_slug: string;
  mode: string;
  status: string;
  payload: any; // jsonb field containing all additional data
  file_urls: string[];
  created_at: string;
  customer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
  // Legacy properties for backward compatibility (extract from payload)
  service_name?: string;
  service_id?: string;
  description?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  name?: string;
  email?: string;
  phone?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  price_type?: string;
  hourly_rate?: number;
  hours_estimated?: number;
  rot_rut_type?: string;
  internal_notes?: string;
  updated_at?: string;
  deleted_at?: string;
  created_by?: string;
  property_id?: string;
  rut_eligible?: boolean;
  rot_eligible?: boolean;
  labor_share?: number;
  final_price?: number;
  base_price?: number;
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
    .select('*', { count: 'exact' })
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
    query = query.or(`service_slug.ilike.%${params.q}%`);
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
  service_slug: string;
  mode?: string;
  fields?: Record<string, any>;
}) {
  console.log('[API] createBooking called with data:', bookingData);
  
  const user = await supabase.auth.getUser();
  
  const insertData = {
    customer_id: user.data.user?.id || null,
    service_slug: bookingData.service_slug,
    mode: bookingData.mode || 'quote',
    status: 'new',
    payload: bookingData.fields || {},
    file_urls: []
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