import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body with defaults
    const { q = '', role = '', page = 1, pageSize = 50 } = await req.json().catch(() => ({}));

    console.log('Listing users with params:', { q, role, page, pageSize });

    // 1) Get auth users with pagination
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page,
      perPage: pageSize
    });

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: authError.message }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const users = authData?.users || [];
    console.log(`Found ${users.length} auth users`);

    // 2) Get corresponding profiles
    const userIds = users.map(u => u.id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, created_at, user_type, company_name, brf_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch profiles' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const profilesData = profiles || [];
    console.log(`Found ${profilesData.length} profiles`);

    // 3) Get user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', userIds);

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
    }

    // 4) Create lookup maps
    const profileMap = Object.fromEntries(profilesData.map(p => [p.id, p]));
    const roleMap = new Map<string, string[]>();
    (userRoles || []).forEach(ur => {
      if (!roleMap.has(ur.user_id)) {
        roleMap.set(ur.user_id, []);
      }
      roleMap.get(ur.user_id)!.push(ur.role);
    });

    // 5) Combine auth + profile + role data and apply filters
    const combinedUsers = users
      .map(user => {
        const profile = profileMap[user.id];
        const roles = roleMap.get(user.id) || ['customer'];
        const primaryRole = roles.includes('owner') ? 'owner' :
                           roles.includes('admin') ? 'admin' :
                           roles.includes('manager') ? 'manager' :
                           roles.includes('technician') ? 'technician' :
                           roles.includes('worker') ? 'worker' : 'customer';
        
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          role: primaryRole,
          roles: roles,
          user_type: profile?.user_type || 'private',
          company_name: profile?.company_name,
          brf_name: profile?.brf_name,
          full_name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user.email?.split('@')[0] || ''
        };
      })
      .filter(user => {
        // Apply search filter
        if (q) {
          const searchTerm = q.toLowerCase();
          const matchesSearch = 
            user.email?.toLowerCase().includes(searchTerm) ||
            user.first_name?.toLowerCase().includes(searchTerm) ||
            user.last_name?.toLowerCase().includes(searchTerm) ||
            user.full_name?.toLowerCase().includes(searchTerm);
          
          if (!matchesSearch) return false;
        }

        // Apply role filter
        if (role && role !== 'all') {
          return user.role === role;
        }

        return true;
      });

    console.log(`Returning ${combinedUsers.length} filtered users`);

    return new Response(JSON.stringify({ 
      users: combinedUsers, 
      page, 
      pageSize,
      total: combinedUsers.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});