import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[admin-update-user-role] No auth header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's token for auth verification
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('[admin-update-user-role] Auth verification failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[admin-update-user-role] Request from user:', user.id);

    // Check if user is admin/owner using service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { data: callerRoles, error: roleCheckError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleCheckError) {
      console.error('[admin-update-user-role] Error checking caller roles:', roleCheckError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isAdminOrOwner = callerRoles?.some(r => r.role === 'admin' || r.role === 'owner');
    if (!isAdminOrOwner) {
      console.error('[admin-update-user-role] User is not admin/owner:', user.id);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Only admins and owners can update roles' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { user_id, new_role } = await req.json();

    if (!user_id || !new_role) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id or new_role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate role
    const validRoles = ['customer', 'admin', 'owner', 'worker'];
    if (!validRoles.includes(new_role)) {
      return new Response(
        JSON.stringify({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[admin-update-user-role] Updating user ${user_id} to role ${new_role}`);

    // Delete existing roles
    const { error: deleteError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', user_id);

    if (deleteError) {
      console.error('[admin-update-user-role] Error deleting roles:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete existing roles', details: deleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[admin-update-user-role] Deleted existing roles for user ${user_id}`);

    // Insert new role
    const { error: insertError } = await supabaseAdmin
      .from('user_roles')
      .insert([{ user_id, role: new_role }]);

    if (insertError) {
      console.error('[admin-update-user-role] Error inserting role:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert new role', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[admin-update-user-role] Successfully updated user ${user_id} to role ${new_role}`);

    // Log the action
    await supabaseAdmin
      .from('activity_log')
      .insert([{
        event_type: 'role_updated',
        actor_user: user.id,
        subject_type: 'user',
        subject_id: user_id,
        summary: `Role updated to ${new_role}`,
        metadata: { old_role: null, new_role }
      }]);

    return new Response(
      JSON.stringify({ success: true, user_id, role: new_role }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[admin-update-user-role] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
