import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

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
    const { quoteId, subject, body, testEmail } = await req.json();
    const isTest = !!testEmail;

    if (!quoteId || !subject || !body) {
      throw new Error("quoteId, subject och body krävs");
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: quote, error: quoteError } = await supabase
      .from('quotes_new')
      .select(`*, customer:customers!customer_id(id, name, email, phone)`)
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) throw new Error("Kunde inte hämta offerten");

    const customerEmail = quote.customer?.email;
    if (!customerEmail && !isTest) throw new Error("Ingen e-postadress hittades för kunden");
    const recipientEmail = isTest ? testEmail : customerEmail;

    const customerName = quote.customer?.name || 'Kund';
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://fixco.se';
    const publicUrl = `${frontendUrl}/q/${quote.number}/${quote.public_token}`;

    // Convert plain text body to HTML paragraphs
    const bodyHtml = body
      .split('\n')
      .filter((line: string) => line.trim() !== '')
      .map((line: string) => `<p style="margin: 8px 0; line-height: 1.6;">${line}</p>`)
      .join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin:0; background: #f3f4f6; font-family: Arial, sans-serif; }
          .container { max-width: 640px; margin: 0 auto; padding: 0 16px 40px; }
          .header { background: linear-gradient(135deg, #111827 0%, #4f46e5 100%); padding: 32px 24px; text-align: center; border-radius: 0 0 16px 16px; }
          .title { color: #ffffff; font-size: 22px; font-weight: 700; margin: 8px 0 0; }
          .card { background:#ffffff; border-radius: 12px; padding: 24px; margin-top: 16px; }
          .cta { display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; padding: 12px 24px; border-radius:8px; font-weight:700; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">Fixco</div>
            <div style="color:#c7d2fe; font-size: 13px; margin-top:4px;">Offert ${quote.number}</div>
          </div>
          
          <div class="card">
            ${bodyHtml}
            
            <div style="text-align: center; margin-top: 24px;">
              <a class="cta" href="${publicUrl}" target="_blank">Se din offert här</a>
            </div>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 16px;">
            <p>Fixco | <a href="https://www.fixco.se" style="color: #6b7280;">www.fixco.se</a></p>
            <p>📧 info@fixco.se | 📞 079-335 02 28</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`${isTest ? '🧪 TEST' : '📧'} Sending follow-up to:`, recipientEmail);

    const emailResponse = await resend.emails.send({
      from: "Fixco <info@fixco.se>",
      to: [recipientEmail],
      subject: `${isTest ? '[TEST] ' : ''}${subject}`,
      html: emailHtml,
      replyTo: ["info@fixco.se"],
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return new Response(
        JSON.stringify({ success: false, error: emailResponse.error.message || 'E-post kunde inte skickas' }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`${isTest ? '🧪 TEST' : '✅'} Follow-up email sent to:`, recipientEmail);

    return new Response(JSON.stringify({ success: true, message: "Uppföljningsmail skickat!" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-followup-email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Kunde inte skicka uppföljningsmail" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
