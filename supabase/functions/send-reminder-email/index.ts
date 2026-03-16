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

    // Format valid_until as plain text
    let validUntilText = '';
    if (quote.valid_until) {
      const validDate = new Date(quote.valid_until);
      const formattedDate = validDate.toLocaleDateString(quote.locale === 'en' ? 'en-GB' : 'sv-SE', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      validUntilText = quote.locale === 'en'
        ? `The quote is valid until ${formattedDate}.`
        : `Offerten gäller till ${formattedDate}.`;
    }

    // Convert plain text body to HTML paragraphs (minimal styling)
    const bodyHtml = body
      .split('\n')
      .filter((line: string) => line.trim() !== '')
      .map((line: string) => `<p style="margin: 0 0 12px 0;">${line}</p>`)
      .join('');

    const isEn = quote.locale === 'en';
    const linkText = isEn ? 'View your quote here' : 'Se din offert här';
    const signoff = isEn ? 'Best regards' : 'Med vänliga hälsningar';

    const emailHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#333333;">
${bodyHtml}
${validUntilText ? `<p style="margin:0 0 12px 0;">${validUntilText}</p>` : ''}
<p style="margin:0 0 12px 0;"><a href="${publicUrl}" style="color:#1a73e8;">${linkText}</a></p>
<p style="margin:24px 0 0 0;">${signoff},<br>Fixco<br>
<span style="font-size:13px;color:#666666;">info@fixco.se | 079-335 02 28 | <a href="https://www.fixco.se" style="color:#666666;">www.fixco.se</a></span></p>
</body></html>`;

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
