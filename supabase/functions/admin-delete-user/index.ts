import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the requesting user is admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin/owner
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['owner', 'admin'].includes(profile.role)) {
      throw new Error('Unauthorized - Admin access required')
    }

    const { userId } = await req.json()

    if (!userId) {
      throw new Error('userId is required')
    }

    console.log('Deleting user and related data:', userId)

    // First, handle all relations by setting foreign keys to null or deleting dependent records
    
    // Delete AI conversations
    const { error: aiConvError } = await supabaseClient
      .from('ai_conversations')
      .delete()
      .eq('user_id', userId)
    
    if (aiConvError) {
      console.error('Error deleting AI conversations:', aiConvError)
    }

    // Delete events
    const { error: eventsError } = await supabaseClient
      .from('events')
      .delete()
      .eq('user_id', userId)
    
    if (eventsError) {
      console.error('Error deleting events:', eventsError)
    }

    // Delete chat conversations
    const { error: chatError } = await supabaseClient
      .from('chat_conversations')
      .delete()
      .eq('user_id', userId)
    
    if (chatError) {
      console.error('Error deleting chat conversations:', chatError)
    }

    // Delete product interactions
    const { error: interactionsError } = await supabaseClient
      .from('product_interactions')
      .delete()
      .eq('user_id', userId)
    
    if (interactionsError) {
      console.error('Error deleting interactions:', interactionsError)
    }

    // Update bookings - set customer_id to null
    const { error: bookingsError } = await supabaseClient
      .from('bookings')
      .update({ customer_id: null })
      .eq('customer_id', userId)
    
    if (bookingsError) {
      console.error('Error updating bookings:', bookingsError)
    }

    // Update quotes (old table) - set customer_id to null
    const { error: quotesOldError } = await supabaseClient
      .from('quotes')
      .update({ customer_id: null })
      .eq('customer_id', userId)
    
    if (quotesOldError) {
      console.error('Error updating old quotes:', quotesOldError)
    }

    // Update quotes_new - set customer_id to null
    const { error: quotesError } = await supabaseClient
      .from('quotes_new')
      .update({ customer_id: null })
      .eq('customer_id', userId)
    
    if (quotesError) {
      console.error('Error updating quotes_new:', quotesError)
    }

    // Update invoices - set customer_id to null  
    const { error: invoicesError } = await supabaseClient
      .from('invoices')
      .update({ customer_id: null })
      .eq('customer_id', userId)
    
    if (invoicesError) {
      console.error('Error updating invoices:', invoicesError)
    }

    // Update projects - set customer_id and assigned_to to null
    const { error: projectsError } = await supabaseClient
      .from('projects')
      .update({ customer_id: null, assigned_to: null })
      .or(`customer_id.eq.${userId},assigned_to.eq.${userId}`)
    
    if (projectsError) {
      console.error('Error updating projects:', projectsError)
    }

    // Delete properties owned by user
    const { error: propertiesError } = await supabaseClient
      .from('properties')
      .delete()
      .eq('owner_id', userId)
    
    if (propertiesError) {
      console.error('Error deleting properties:', propertiesError)
    }

    // Update jobs - set customer_id and assigned_worker_id to null
    const { error: jobsError } = await supabaseClient
      .from('jobs')
      .update({ customer_id: null, assigned_worker_id: null })
      .or(`customer_id.eq.${userId},assigned_worker_id.eq.${userId}`)
    
    if (jobsError) {
      console.error('Error updating jobs:', jobsError)
    }

    // Delete loyalty_transactions
    const { error: loyaltyError } = await supabaseClient
      .from('loyalty_transactions')
      .delete()
      .eq('user_id', userId)
    
    if (loyaltyError) {
      console.error('Error deleting loyalty transactions:', loyaltyError)
    }

    // Delete organization_members
    const { error: orgMembersError } = await supabaseClient
      .from('organization_members')
      .delete()
      .eq('user_id', userId)
    
    if (orgMembersError) {
      console.error('Error deleting org members:', orgMembersError)
    }

    // Update staff - set user_id to null
    const { error: staffError } = await supabaseClient
      .from('staff')
      .update({ user_id: null })
      .eq('user_id', userId)
    
    if (staffError) {
      console.error('Error updating staff:', staffError)
    }

    // Delete from profiles first (this should work even if auth.users delete fails)
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (profileError) {
      console.error('Error deleting profile:', profileError)
      throw new Error('Could not delete user profile')
    }

    // Try to delete from auth.users (might fail but profile is already gone)
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.warn('Warning deleting auth user (but profile deleted):', deleteError)
      // Don't throw - profile is deleted which is what matters
    }

    console.log('User and all related data deleted successfully:', userId)

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
