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
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    
    // Support both formats: /number/token (new) and /token (legacy)
    let quoteNumber: string | null = null;
    let token: string;
    
    if (pathParts.length >= 2) {
      quoteNumber = pathParts[pathParts.length - 2];
      token = pathParts[pathParts.length - 1];
    } else {
      token = pathParts[pathParts.length - 1];
    }

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token saknas' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { question, customer_name, customer_email } = await req.json();

    if (!question || !customer_name) {
      return new Response(
        JSON.stringify({ error: 'Fråga och namn krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hämta offerten - stödjer både nummer+token och bara token
    let query = supabase
      .from('quotes_new')
      .select('id, deleted_at');
    
    if (quoteNumber) {
      query = query.eq('number', quoteNumber).eq('public_token', token);
    } else {
      query = query.eq('public_token', token);
    }
    
    const { data: quote, error: fetchError } = await query.single();

    if (fetchError || !quote) {
      return new Response(
        JSON.stringify({ error: 'Offert hittades inte' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (quote.deleted_at) {
      return new Response(
        JSON.stringify({ error: 'deleted' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Spara frågan
    const { error: insertError } = await supabase
      .from('quote_questions')
      .insert({
        quote_id: quote.id,
        question,
        customer_name,
        customer_email
      });

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Serverfel' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
