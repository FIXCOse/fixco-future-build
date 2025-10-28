import { supabase } from '@/integrations/supabase/client';

// User management functions
export async function listUsers(searchQuery?: string) {
  let query = supabase
    .from('profiles')
    .select('id, email, first_name, last_name, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (searchQuery) {
    query = query.or(`email.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: 'customer' | 'staff' | 'admin' | 'owner' | 'worker') {
  // Delete existing roles
  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) throw deleteError;
  
  // Insert new role
  const { data, error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role })
    .select()
    .single();
  
  if (error) throw error;
  
  // Log the action
  await supabase.rpc('log_admin_action', {
    p_action: 'update_user_role',
    p_target: userId,
    p_meta: { role }
  });
  
  return data;
}

// Settings functions
export async function getSettings(keys: string[]) {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .in('key', keys);
  
  if (error) throw error;
  return Object.fromEntries((data || []).map(row => [row.key, row.value]));
}

export async function setSetting(key: string, value: any) {
  const { data: userData } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({
      key,
      value,
      updated_by: userData.user?.id,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  
  // Log the action
  await supabase.rpc('log_admin_action', {
    p_action: 'update_setting',
    p_target: key,
    p_meta: { value }
  });
  
  return data;
}

// Staff functions
export async function listStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createStaff(staffData: {
  name: string;
  role: string;
  skills: string[];
  user_id?: string;
}) {
  const { data, error } = await supabase
    .from('staff')
    .insert(staffData)
    .select()
    .single();
  
  if (error) throw error;
  
  await supabase.rpc('log_admin_action', {
    p_action: 'create_staff',
    p_target: data.id,
    p_meta: staffData
  });
  
  return data;
}

export async function updateStaff(id: string, updates: Partial<{
  name: string;
  role: string;
  skills: string[];
  active: boolean;
}>) {
  const { data, error } = await supabase
    .from('staff')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  await supabase.rpc('log_admin_action', {
    p_action: 'update_staff',
    p_target: id,
    p_meta: updates
  });
  
  return data;
}

export async function assignWork(bookingId: string, staffId: string, notes?: string) {
  const { data, error } = await supabase
    .from('work_orders')
    .insert({
      booking_id: bookingId,
      staff_id: staffId,
      notes
    })
    .select()
    .single();
  
  if (error) throw error;
  
  await supabase.rpc('log_admin_action', {
    p_action: 'assign_work',
    p_target: bookingId,
    p_meta: { staff_id: staffId, notes }
  });
  
  return data;
}

// Reporting functions
export async function getBookingsDaily() {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Group by day
  const grouped = data.reduce((acc: Record<string, number>, booking) => {
    const day = new Date(booking.created_at).toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([day, bookings]) => ({ day, bookings }));
}

export async function getRevenueMonthly() {
  const { data, error } = await supabase
    .from('invoices')
    .select('created_at, total_amount')
    .eq('status', 'paid')
    .gte('created_at', new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Group by month
  const grouped = data.reduce((acc: Record<string, number>, invoice) => {
    const month = new Date(invoice.created_at).toISOString().substring(0, 7);
    acc[month] = (acc[month] || 0) + (invoice.total_amount || 0);
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([month, revenue]) => ({ month, revenue }));
}

export async function getROTRUTSavings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, payload')
    .gte('created_at', new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString());
  
  if (error) throw error;
  
  // Calculate savings and group by month (from payload data)
  const grouped = data.reduce((acc: Record<string, number>, booking) => {
    const month = new Date(booking.created_at).toISOString().substring(0, 7);
    let savings = 0;
    
    const payload = booking.payload as any || {};
    const finalPrice = Number(payload.final_price) || 0;
    const laborShare = Number(payload.labor_share) || 0.7;
    
    if (payload.rot_eligible) {
      savings = finalPrice * laborShare * 0.30;
    } else if (payload.rut_eligible) {
      savings = finalPrice * laborShare * 0.50;
    }
    
    acc[month] = (acc[month] || 0) + savings;
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([month, savings]) => ({ month, savings }));
}

export async function getTopServices() {
  const { data, error } = await supabase
    .from('bookings')
    .select('service_slug, payload')
    .order('created_at', { ascending: false })
    .limit(1000);
  
  if (error) throw error;
  
  // Count services
  const grouped = data.reduce((acc: Record<string, { name: string; count: number }>, booking) => {
    const key = booking.service_slug || 'Unknown';
    if (!acc[key]) {
    const payload = booking.payload as any || {};
    const serviceName = String(payload.service_name || booking.service_slug || 'Unknown Service');
    acc[key] = { name: serviceName, count: 0 };
    }
    acc[key].count++;
    return acc;
  }, {});
  
  return Object.entries(grouped)
    .map(([service_id, { name, count }]) => ({ service_id, service_name: name, booking_count: count }))
    .sort((a, b) => b.booking_count - a.booking_count)
    .slice(0, 10);
}

// Audit functions
export async function getAuditLog(filters?: { action?: string; actor?: string; limit?: number }) {
  let query = supabase
    .from('audit_log')
    .select('*, profiles!inner(first_name, last_name, email)')
    .order('created_at', { ascending: false });
  
  if (filters?.action) {
    query = query.eq('action', filters.action);
  }
  
  if (filters?.actor) {
    query = query.eq('actor', filters.actor);
  }
  
  query = query.limit(filters?.limit || 100);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Dashboard stats
export async function getDashboardStats() {
  const [bookingsResult, quotesResult, invoicesResult] = await Promise.all([
    supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .gte('scheduled_date', new Date().toISOString().split('T')[0]),
    
    supabase
      .from('quotes')
      .select('id', { count: 'exact' })
      .eq('status', 'draft'),
    
    supabase
      .from('invoices')
      .select('id', { count: 'exact' })
      .neq('status', 'paid')
  ]);
  
  return {
    upcomingBookings: bookingsResult.count || 0,
    pendingQuotes: quotesResult.count || 0,
    unpaidInvoices: invoicesResult.count || 0
  };
}