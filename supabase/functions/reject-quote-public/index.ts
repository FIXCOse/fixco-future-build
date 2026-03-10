import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function notifyAdmin(subject: string, body: string) {
  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) return;
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Fixco System <info@fixco.se>',
        to: ['imedashviliomar@gmail.com'],
        subject,
        html: `<div style="font-family:sans-serif;font-size:14px;color:#333;">${body}</div>`,
      }),
    });
  } catch (e) {
    console.error('Admin notification failed:', e);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    
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

    const { reason, reason_text, customer_name, customer_email } = await req.json();

    if (!reason) {
      return new Response(
        JSON.stringify({ error: 'Anledning krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from('quotes_new')
      .select('id, number, title, status, deleted_at, customer:customers(name, email)');
    
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

    const { error: insertError } = await supabase
      .from('quote_rejections')
      .insert({
        quote_id: quote.id,
        reason,
        reason_text,
        customer_name,
        customer_email
      });

    if (insertError) throw insertError;

    const { error: updateError } = await supabase
      .from('quotes_new')
      .update({
        status: 'declined',
        declined_at: new Date().toISOString()
      })
      .eq('id', quote.id);

    if (updateError) throw updateError;

    const custName = quote.customer?.name || customer_name || 'Okänd kund';
    const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });
    notifyAdmin(
      `❌ Offert ${quote.number} avböjd av ${custName}`,
      `<h2>Offert avböjd</h2>
      <p><strong>Offert:</strong> ${quote.number} – ${quote.title || ''}</p>
      <p><strong>Kund:</strong> ${custName}</p>
      <p><strong>Anledning:</strong> ${reason}</p>
      ${reason_text ? `<p><strong>Kommentar:</strong> ${reason_text}</p>` : ''}
      <p><strong>Tidpunkt:</strong> ${now}</p>`
    );

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
