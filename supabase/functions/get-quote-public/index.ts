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
    
    const funcIndex = pathParts.findIndex(p => p === 'get-quote-public');
    const relevantParts = funcIndex >= 0 ? pathParts.slice(funcIndex + 1) : pathParts;
    
    let quoteNumber: string | null = null;
    let token: string;
    
    if (relevantParts.length >= 2) {
      quoteNumber = relevantParts[0];
      token = relevantParts[1];
    } else if (relevantParts.length === 1) {
      token = relevantParts[0];
    } else {
      return new Response(
        JSON.stringify({ error: 'Token saknas' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token saknas' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from('quotes_new')
      .select(`
        id,
        number,
        title,
        items,
        subtotal_work_sek,
        subtotal_mat_sek,
        vat_sek,
        vat_included,
        rot_deduction_sek,
        rot_percentage,
        discount_amount_sek,
        discount_type,
        discount_value,
        total_sek,
        pdf_url,
        valid_until,
        status,
        accepted_at,
        signature_name,
        signature_date,
        deleted_at,
        locale,
        replaced_by_id,
        customer:customers(name, email)
      `);
    
    if (quoteNumber) {
      query = query.eq('number', quoteNumber).eq('public_token', token);
    } else {
      query = query.eq('public_token', token);
    }
    
    const { data: quote, error: fetchError } = await query.single();

    if (fetchError || !quote) {
      console.error('Quote not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Offert hittades inte' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If quote has been superseded, return redirect info to the new quote
    if (quote.status === 'superseded' && quote.replaced_by_id) {
      const { data: newQuote } = await supabase
        .from('quotes_new')
        .select('number, public_token, locale')
        .eq('id', quote.replaced_by_id)
        .single();

      if (newQuote) {
        const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://fixco.se';
        const newUrl = `${frontendUrl}/q/${newQuote.number}/${newQuote.public_token}`;
        const locale = newQuote.locale || quote.locale || 'sv';
        return new Response(
          JSON.stringify({ 
            superseded: true, 
            new_quote_url: newUrl,
            new_quote_number: newQuote.number,
            locale 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const { data: questions } = await supabase
      .from('quote_questions')
      .select('*, asked_by')
      .eq('quote_id', quote.id)
      .order('asked_at', { ascending: true });

    if (quote.deleted_at) {
      return new Response(
        JSON.stringify({ error: 'deleted', message: 'Denna offert har raderats' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if this is an admin preview (skip tracking)
    const isAdminView = url.searchParams.get('source') === 'admin';

    if (!isAdminView) {
      // Log every customer view in quote_views
      const userAgent = req.headers.get('user-agent') || null;
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'okänd';
      await supabase
        .from('quote_views')
        .insert({ quote_id: quote.id, user_agent: userAgent, ip_address: ip });

      // Only update status and send admin email on FIRST view (sent → viewed)
      if (quote.status === 'sent') {
        const { error: updateError } = await supabase
          .from('quotes_new')
          .update({
            status: 'viewed',
            viewed_at: new Date().toISOString()
          })
          .eq('id', quote.id);

        if (updateError) {
          console.error('Failed to update status:', updateError);
        }

        const customerName = quote.customer?.name || 'Okänd kund';
        const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });
        notifyAdmin(
          `Offert ${quote.number} oppnad av ${customerName}`,
          `<p><strong>Offert:</strong> ${quote.number} – ${quote.title || ''}</p>
          <p><strong>Kund:</strong> ${customerName}</p>
          <p><strong>Tidpunkt:</strong> ${now}</p>
          <p>Kunden har oppnat offertlanken.</p>`
        );
      }
    }

    const publicData = {
      id: quote.id,
      number: quote.number,
      title: quote.title,
      items: quote.items,
      subtotal_work_sek: quote.subtotal_work_sek,
      subtotal_mat_sek: quote.subtotal_mat_sek,
      vat_sek: quote.vat_sek,
      vat_included: quote.vat_included ?? false,
      rot_deduction_sek: quote.rot_deduction_sek,
      rot_percentage: quote.rot_percentage || 0,
      discount_amount_sek: quote.discount_amount_sek || 0,
      discount_type: quote.discount_type || 'none',
      discount_value: quote.discount_value || 0,
      total_sek: quote.total_sek,
      pdf_url: quote.pdf_url,
      valid_until: quote.valid_until,
      status: quote.status,
      accepted_at: quote.accepted_at,
      signature_name: quote.signature_name,
      signature_date: quote.signature_date,
      customer_name: quote.customer?.name || 'Okänd kund',
      customer_email: quote.customer?.email || '',
      locale: quote.locale || 'sv',
      questions: questions || []
    };

    return new Response(
      JSON.stringify(publicData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Serverfel' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
