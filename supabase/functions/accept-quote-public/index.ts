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

async function sendCustomerConfirmation(customerEmail: string, customerName: string, quoteNumber: string, quoteTitle: string, signatureName?: string) {
  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY || !customerEmail) return;

    const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:linear-gradient(135deg,#16a34a,#15803d);color:white;padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">🎉</div>
      <h1 style="margin:0;font-size:24px;font-weight:700;">Tack för ditt förtroende!</h1>
      <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">Din offert är nu bekräftad</p>
    </div>
    <div style="background:white;padding:30px;border:1px solid #e5e7eb;border-top:none;">
      <p style="font-size:16px;margin:0 0 20px;color:#374151;">Hej ${customerName},</p>
      <p style="font-size:15px;margin:0 0 20px;color:#6b7280;line-height:1.6;">
        Vi har mottagit ditt godkännande av offerten och ser fram emot att köra igång med projektet!
      </p>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;width:140px;">Offert</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:14px;">${quoteNumber} – ${quoteTitle || ''}</td>
        </tr>
        ${signatureName ? `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Signerad av</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">${signatureName}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Godkänd</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">${now}</td>
        </tr>
      </table>

      <div style="background:#f0fdf4;border-radius:8px;border-left:4px solid #16a34a;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 8px;font-size:15px;color:#15803d;font-weight:600;">Vad händer nu?</p>
        <ol style="margin:0;padding-left:18px;color:#166534;font-size:14px;line-height:1.8;">
          <li>Vi kontaktar dig inom kort för att planera nästa steg</li>
          <li>Vi bokar in en starttid som passar dig</li>
          <li>Du får en bekräftelse med alla detaljer</li>
        </ol>
      </div>

      <p style="font-size:14px;color:#6b7280;margin:0;">
        Har du frågor? Kontakta oss på <a href="mailto:info@fixco.se" style="color:#2563eb;text-decoration:none;">info@fixco.se</a>
      </p>
    </div>
    <div style="text-align:center;padding:20px;color:#9ca3af;font-size:12px;">
      <p style="margin:0;">Fixco · info@fixco.se</p>
      <p style="margin:4px 0 0;">© ${new Date().getFullYear()} Fixco. Alla rättigheter förbehållna.</p>
    </div>
  </div>
</body>
</html>`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Fixco <info@fixco.se>',
        to: [customerEmail],
        subject: `Tack! Din offert ${quoteNumber} från Fixco är bekräftad`,
        html,
      }),
    });
    console.log('Customer confirmation email sent to:', customerEmail);
  } catch (e) {
    console.error('Customer confirmation email failed:', e);
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

      sendCustomerConfirmation(
        quote.customer?.email, customerName, quote.number, quote.title, signature_name
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

    sendCustomerConfirmation(
      quote.customer?.email, customerName, quote.number, quote.title, signature_name
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
