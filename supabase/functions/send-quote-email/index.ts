import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: quote, error: quoteError } = await supabase
      .from('quotes_new')
      .select(`
        *,
        customer:customers(name, email)
      `)
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      throw new Error('Quote not found');
    }

    const publicUrl = `${window.location.origin}/q/${quote.public_token}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Offert ${quote.number} – Fixco</h1>
          <p>Hej ${quote.customer?.name || 'kund'}!</p>
          <p>Här är din offert från Fixco.</p>
          <p><strong>${quote.title}</strong></p>
          <p>Totalsumma: ${Number(quote.total_sek).toLocaleString('sv-SE')} kr (inkl. moms)</p>
          <a href="${publicUrl}" class="button">Visa & svara</a>
          <p>Giltig t.o.m. ${quote.valid_until || '—'}</p>
          <p>Om knappen inte fungerar, öppna: ${publicUrl}</p>
          <div class="footer">
            <p>Vänliga hälsningar,<br>Fixco</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('Sending quote email to:', quote.customer?.email);

    const { error: emailError } = await resend.emails.send({
      from: "Fixco <onboarding@resend.dev>",
      to: [quote.customer?.email || 'test@example.com'],
      subject: `Offert ${quote.number} – Fixco`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Email error:', emailError);
      throw emailError;
    }

    await supabase
      .from('quotes_new')
      .update({ 
        status: 'sent', 
        sent_at: new Date().toISOString() 
      })
      .eq('id', quoteId);

    return new Response(
      JSON.stringify({ success: true, publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
