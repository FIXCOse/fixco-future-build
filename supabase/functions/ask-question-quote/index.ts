import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting helper
async function checkRateLimit(
  supabase: any,
  identifier: string,
  action: string,
  maxAttempts: number,
  windowMinutes: number
): Promise<boolean> {
  try {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('rate_limit_log')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .eq('action', action)
      .gte('created_at', windowStart);

    return (count || 0) < maxAttempts;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Fail open
  }
}

function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate limiting: 10 frågor per 15 minuter per IP
    const clientIp = getClientIp(req);
    const allowed = await checkRateLimit(supabase, clientIp, 'ask-question-quote', 10, 15);
    
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'För många förfrågningar. Vänta några minuter och försök igen.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Logga detta request
    await supabase.from('rate_limit_log').insert({
      identifier: clientIp,
      action: 'ask-question-quote',
      metadata: { endpoint: 'ask-question-quote', timestamp: new Date().toISOString() }
    });

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

    // Input validation - max längder
    if (question.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Frågan är för lång (max 2000 tecken)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (customer_name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Namnet är för långt (max 100 tecken)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
