import { supabase } from '@/integrations/supabase/client';

export type UserProfile = {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  role: string;
  user_type: string;
  company_name?: string;
  org_number?: string;
  brf_name?: string;
  address_line?: string;
  city?: string;
  postal_code?: string;
  created_at: string;
  total_spent?: number;
  loyalty_points?: number;
};

export async function fetchAllUsers(params?: {
  limit?: number;
  offset?: number;
  q?: string;
  userType?: string;
  role?: string;
}) {
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (params?.q) {
    const searchTerm = `%${params.q}%`;
    query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},full_name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm},company_name.ilike.${searchTerm},org_number.ilike.${searchTerm}`);
  }

  if (params?.userType && params.userType !== 'all') {
    query = query.eq('user_type', params.userType as any);
  }

  if (params?.role && params.role !== 'all') {
    query = query.eq('role', params.role);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, (params.offset + (params.limit ?? 100) - 1));
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return { 
    data: data as UserProfile[], 
    count: count ?? 0 
  };
}