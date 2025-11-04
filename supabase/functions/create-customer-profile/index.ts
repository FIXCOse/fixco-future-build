import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email, firstName, lastName, phone, customerType, companyName, orgNumber, brfName } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists in profiles
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile) {
      return new Response(
        JSON.stringify({ customer_id: existingProfile.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if auth user exists but profile doesn't
    const { data: existingAuthUser } = await supabaseAdmin.auth.admin.listUsers();
    const authUserExists = existingAuthUser?.users?.find(u => u.email === email);

    if (authUserExists) {
      console.log('Auth user exists but no profile, returning user ID:', authUserExists.id);
      return new Response(
        JSON.stringify({ customer_id: authUserExists.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new auth user (only if doesn't exist)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        first_name: firstName || 'Okänd',
        last_name: lastName || 'Kund',
        phone: phone || null,
        customer_type: customerType || 'private',
        company_name: companyName || null,
        org_number: orgNumber || null,
        brf_name: brfName || null
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }

    console.log('Created customer profile:', authData.user.id);

    return new Response(
      JSON.stringify({ customer_id: authData.user.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-customer-profile:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
