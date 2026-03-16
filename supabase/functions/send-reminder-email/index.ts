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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the requesting user is admin/owner
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if user is admin/owner via user_roles table
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => ['admin', 'owner'].includes(r.role));
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { quoteId, subject, body, testEmail } = await req.json();
    const isTest = !!testEmail;

    if (!quoteId || !subject || !body) {
      throw new Error("quoteId, subject och body krävs");
    }

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

    // Format valid_until if exists
    let validUntilHtml = '';
    if (quote.valid_until) {
      const validDate = new Date(quote.valid_until);
      const formattedDate = validDate.toLocaleDateString(quote.locale === 'en' ? 'en-GB' : 'sv-SE', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      const isEn = quote.locale === 'en';
      validUntilHtml = `
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px 16px; margin-top: 16px; text-align: center;">
          <span style="font-size: 13px; color: #92400e; font-weight: 600;">
            ⏰ ${isEn ? 'Quote valid until' : 'Offerten giltig till'}: ${formattedDate}
          </span>
        </div>
      `;
    }

    // Convert plain text body to HTML paragraphs
    const bodyHtml = body
      .split('\n')
      .filter((line: string) => line.trim() !== '')
      .map((line: string) => `<p style="margin: 8px 0; line-height: 1.6;">${line}</p>`)
      .join('');

    const isEn = quote.locale === 'en';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin:0; background: #fffbeb; font-family: Arial, sans-serif; }
          .container { max-width: 640px; margin: 0 auto; padding: 0 16px 40px; }
          .header { background: linear-gradient(135deg, #b45309 0%, #f59e0b 100%); padding: 32px 24px; text-align: center; border-radius: 0 0 16px 16px; }
          .badge { display: inline-block; background: rgba(255,255,255,0.2); color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }
          .title { color: #ffffff; font-size: 22px; font-weight: 700; margin: 8px 0 0; }
          .card { background:#ffffff; border-top: 3px solid #f59e0b; border-radius: 12px; padding: 24px; margin-top: 16px; }
          .cta { display:inline-block; background:#b45309; color:#ffffff; text-decoration:none; padding: 14px 28px; border-radius:8px; font-weight:700; margin-top: 16px; font-size: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge">${isEn ? '⏰ Reminder' : '⏰ Påminnelse'}</div>
            <div class="title">Fixco</div>
            <div style="color:#fef3c7; font-size: 13px; margin-top:4px;">${isEn ? 'Quote' : 'Offert'} ${quote.number}</div>
          </div>
          
          <div class="card">
            ${bodyHtml}
            ${validUntilHtml}
            
            <div style="text-align: center; margin-top: 24px;">
              <a class="cta" href="${publicUrl}" target="_blank" style="display:inline-block;background:#b45309;color:#ffffff !important;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;">${isEn ? 'View your quote' : 'Se din offert'}</a>
            </div>
          </div>
          
          <div style="text-align: center; color: #92400e; font-size: 12px; margin-top: 16px;">
            <p>Fixco | <a href="https://www.fixco.se" style="color: #92400e;">www.fixco.se</a></p>
            <p>📧 info@fixco.se</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`${isTest ? '🧪 TEST' : '🔔'} Sending reminder to:`, recipientEmail);

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

    console.log(`${isTest ? '🧪 TEST' : '✅'} Reminder email sent to:`, recipientEmail);

    return new Response(JSON.stringify({ success: true, message: "Påminnelsemail skickat!" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-reminder-email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Kunde inte skicka påminnelsemail" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
