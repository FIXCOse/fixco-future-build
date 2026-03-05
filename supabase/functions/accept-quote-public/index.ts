import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function notifyAdmin(subject: string, html: string) {
  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) return;
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Fixco <info@fixco.se>',
        to: ['imedashviliomar@gmail.com'],
        subject,
        html,
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
    const token = url.pathname.split('/').pop();
    
    const body = req.method === 'POST' ? await req.json() : {};
    const { signature_name, terms_accepted } = body;

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token saknas' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: quote, error: fetchError } = await supabase
      .from('quotes_new')
      .select('id, number, title, status, valid_until, customer_id, accepted_at, deleted_at, customer:customers(name, email)')
      .eq('public_token', token)
      .single();

    if (fetchError || !quote) {
      console.error('Quote not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Offert hittades inte' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, user_id')
      .eq('id', quote.customer_id)
      .maybeSingle();
    
    if (customerError) {
      console.error('Error fetching customer:', customerError);
    }

    if ((quote as any).deleted_at) {
      return new Response(
        JSON.stringify({ error: 'deleted', message: 'Denna offert har raderats och kan inte accepteras' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (quote.valid_until && new Date(quote.valid_until) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'expired', message: 'Offerten har gått ut' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const customerName = quote.customer?.name || 'Okänd kund';
    const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });

    if (quote.status === 'accepted') {
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('quote_id', quote.id)
        .maybeSingle();

      return new Response(
        JSON.stringify({ ok: true, already: true, projectId: existingProject?.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (quote.status === 'pending_reaccept') {
      const updateData: any = {
        status: 'accepted',
        accepted_at: new Date().toISOString()
      };
      if (signature_name) {
        updateData.signature_name = signature_name;
        updateData.signature_date = new Date().toISOString();
      }
      if (terms_accepted !== undefined) {
        updateData.terms_accepted = terms_accepted;
      }

      const { error: updateError } = await supabase
        .from('quotes_new')
        .update(updateData)
        .eq('id', quote.id);

      if (updateError) {
        console.error('Failed to update quote:', updateError);
        throw new Error('Kunde inte uppdatera offert');
      }

      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('quote_id', quote.id)
        .maybeSingle();

      notifyAdmin(
        `✅ Offert ${quote.number} accepterad igen av ${customerName}`,
        `<h2>Offert accepterad (re-accept)</h2>
        <p><strong>Offert:</strong> ${quote.number} – ${quote.title || ''}</p>
        <p><strong>Kund:</strong> ${customerName}</p>
        <p><strong>Signatur:</strong> ${signature_name || 'Ej angiven'}</p>
        <p><strong>Tidpunkt:</strong> ${now}</p>`
      );

      return new Response(
        JSON.stringify({ ok: true, reaccepted: true, projectId: existingProject?.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const updateData: any = {
      status: 'accepted',
      accepted_at: new Date().toISOString()
    };
    if (signature_name) {
      updateData.signature_name = signature_name;
      updateData.signature_date = new Date().toISOString();
    }
    if (terms_accepted !== undefined) {
      updateData.terms_accepted = terms_accepted;
    }

    const { error: updateError } = await supabase
      .from('quotes_new')
      .update(updateData)
      .eq('id', quote.id);

    if (updateError) {
      console.error('Failed to update quote:', updateError);
      throw new Error('Kunde inte uppdatera offert');
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        quote_id: quote.id,
        customer_id: customer?.user_id || null,
        title: quote.title,
        status: 'pending'
      })
      .select('id')
      .single();

    if (projectError) {
      console.error('Failed to create project:', projectError);
      return new Response(
        JSON.stringify({ 
          error: 'project_creation_failed',
          message: 'Offerten accepterades men projektet kunde inte skapas. Vi kontaktar dig inom kort.',
          projectId: null
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    notifyAdmin(
      `✅ Offert ${quote.number} accepterad av ${customerName}`,
      `<h2>Offert accepterad!</h2>
      <p><strong>Offert:</strong> ${quote.number} – ${quote.title || ''}</p>
      <p><strong>Kund:</strong> ${customerName}</p>
      <p><strong>Signatur:</strong> ${signature_name || 'Ej angiven'}</p>
      <p><strong>Tidpunkt:</strong> ${now}</p>
      <p>Projekt har skapats automatiskt.</p>`
    );

    return new Response(
      JSON.stringify({ ok: true, projectId: project.id }),
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
