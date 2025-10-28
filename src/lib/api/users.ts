import { supabase } from '@/integrations/supabase/client';

export type UserProfile = {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
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
  role?: string; // Added for admin views - fetched from user_roles
  roles?: string[]; // All roles user has
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

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, (params.offset + (params.limit ?? 100) - 1));
  }

  const { data, count, error } = await query;
  if (error) throw error;

  // Fetch roles for all users
  const userIds = data?.map(u => u.id) || [];
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('user_id, role')
    .in('user_id', userIds);

  // Create role map
  const roleMap = new Map<string, string[]>();
  (userRoles || []).forEach(ur => {
    if (!roleMap.has(ur.user_id)) {
      roleMap.set(ur.user_id, []);
    }
    roleMap.get(ur.user_id)!.push(ur.role);
  });

  // Enrich profiles with role data
  const enrichedData = (data || []).map(profile => {
    const roles = roleMap.get(profile.id) || ['customer'];
    const primaryRole = roles.includes('owner') ? 'owner' :
                       roles.includes('admin') ? 'admin' :
                       roles.includes('manager') ? 'manager' :
                       roles.includes('technician') ? 'technician' :
                       roles.includes('worker') ? 'worker' : 'customer';
    
    return {
      ...profile,
      role: primaryRole,
      roles: roles
    };
  });

  // Apply role filter if specified
  let filteredData = enrichedData;
  if (params?.role && params.role !== 'all') {
    filteredData = enrichedData.filter(u => u.role === params.role);
  }

  return { 
    data: filteredData as UserProfile[], 
    count: filteredData.length
  };
}