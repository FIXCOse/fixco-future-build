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
      // New format: /get-quote-public/Q-2025-042/Xk9m
      quoteNumber = pathParts[pathParts.length - 2];
      token = pathParts[pathParts.length - 1];
    } else {
      // Legacy format: /get-quote-public/long-token
      token = pathParts[pathParts.length - 1];
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

    // Hämta offert - stödjer både nummer+token och bara token
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
        customer:customers(name, email)
      `);
    
    if (quoteNumber) {
      // New format: verify both number and token
      query = query.eq('number', quoteNumber).eq('public_token', token);
    } else {
      // Legacy format: verify only token
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

    // Hämta frågor och svar
    const { data: questions } = await supabase
      .from('quote_questions')
      .select('*')
      .eq('quote_id', quote.id)
      .order('asked_at', { ascending: true });

    // Kontrollera om offerten är raderad
    if (quote.deleted_at) {
      return new Response(
        JSON.stringify({ error: 'deleted', message: 'Denna offert har raderats' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Om status är 'sent', uppdatera till 'viewed'
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
    }

    // Returnera endast icke-känslig data
    const publicData = {
      number: quote.number,
      title: quote.title,
      items: quote.items,
      subtotal_work_sek: quote.subtotal_work_sek,
      subtotal_mat_sek: quote.subtotal_mat_sek,
      vat_sek: quote.vat_sek,
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
