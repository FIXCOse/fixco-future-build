import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendQuoteEmailRequest {
  quoteId: string;
  customerEmail: string;
  customerName?: string;
  logoUrl?: string;
  siteUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, customerEmail, customerName, logoUrl, siteUrl }: SendQuoteEmailRequest = await req.json();

    console.log("Sending quote email for:", { quoteId, customerEmail, customerName, logoUrl, siteUrl });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch quote details
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      console.error("Error fetching quote:", quoteError);
      throw new Error("Kunde inte hämta offerten");
    }

    const displayName = customerName || 'Kund';

    // Format line items for email
    const lineItemsHtml = quote.line_items.map((item: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.unit_price?.toLocaleString('sv-SE')} kr</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.total?.toLocaleString('sv-SE')} kr</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin:0; background: #f3f4f6; font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
          .container { max-width: 640px; margin: 0 auto; padding: 0 16px 40px; }
          .preheader { display:none!important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; }
          .brand-header { background: linear-gradient(135deg, #111827 0%, #4f46e5 100%); padding: 32px 24px; text-align: center; border-radius: 0 0 16px 16px; box-shadow: 0 10px 30px rgba(79,70,229,0.25); }
          .brand-logo { max-width: 160px; height: auto; display: inline-block; margin-bottom: 8px; }
          .brand-title { color: #ffffff; font-size: 22px; font-weight: 700; margin: 8px 0 0; letter-spacing: 0.3px; }
          .card { background:#ffffff; border-radius: 12px; padding: 24px; margin-top: -16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
          .h1 { font-size: 20px; margin: 0 0 12px; color:#111827; }
          .muted { color:#6b7280; margin: 0 0 16px; }
          .divider { height:1px; background:#e5e7eb; margin:16px 0; }
          .section-title { font-size:16px; font-weight:700; margin:16px 0 8px; color:#111827; }
          .quote-table { width: 100%; border-collapse: collapse; margin: 12px 0 4px; }
          .quote-table th { background: #f9fafb; padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; color:#374151; font-size:13px; }
          .quote-table td { padding: 10px; border-bottom: 1px solid #f3f4f6; font-size:13px; color:#111827; }
          .total-row { background: #f9fafb; font-weight: bold; }
          .cta { display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; padding: 12px 18px; border-radius:8px; font-weight:700; margin-top: 16px; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <span class="preheader">Din offert ${quote.quote_number} från Fixco</span>
        <div class="container">
          <div class="brand-header">
            ${logoUrl ? `<img src="${logoUrl}" alt="FIXCO logotyp" class="brand-logo" />` : ''}
            <div class="brand-title">Offert från Fixco</div>
            <div style="color:#c7d2fe; font-size: 13px; margin-top:4px;">Offertnummer: ${quote.quote_number}</div>
          </div>
          
          <div class="card">
            <h2 class="h1">Hej ${displayName}!</h2>
            <p class="muted">Tack för ditt intresse för våra tjänster. Här är en lockande offert speciellt framtagen för dig.</p>
            
            <div class="section-title">${quote.title}</div>
            ${quote.description ? `<p class="muted"><strong style="color:#111827">Beskrivning:</strong> ${quote.description}</p>` : ''}
            
            <table class="quote-table" role="table" aria-label="Offertdetaljer">
              <thead>
                <tr>
                  <th>Beskrivning</th>
                  <th>Antal</th>
                  <th>Pris/enhet</th>
                  <th style="text-align:right;">Totalt</th>
                </tr>
              </thead>
              <tbody>
                ${lineItemsHtml}
                <tr class="total-row">
                  <td colspan="3" style="padding: 12px; text-align: right;">Subtotal:</td>
                  <td style="padding: 12px; text-align: right;">${quote.subtotal?.toLocaleString('sv-SE')} kr</td>
                </tr>
                ${quote.discount_amount > 0 ? `
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right;">Rabatt:</td>
                  <td style="padding: 8px; text-align: right;">-${quote.discount_amount?.toLocaleString('sv-SE')} kr</td>
                </tr>
                ` : ''}
                ${quote.rot_amount > 0 ? `
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right;">ROT-avdrag:</td>
                  <td style="padding: 8px; text-align: right;">-${quote.rot_amount?.toLocaleString('sv-SE')} kr</td>
                </tr>
                ` : ''}
                ${quote.rut_amount > 0 ? `
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right;">RUT-avdrag:</td>
                  <td style="padding: 8px; text-align: right;">-${quote.rut_amount?.toLocaleString('sv-SE')} kr</td>
                </tr>
                ` : ''}
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right;">Moms (25%):</td>
                  <td style="padding: 8px; text-align: right;">${quote.vat_amount?.toLocaleString('sv-SE')} kr</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" style="padding: 12px; text-align: right; font-size: 18px;">Totalt att betala:</td>
                  <td style="padding: 12px; text-align: right; font-size: 18px;">${quote.total_amount?.toLocaleString('sv-SE')} kr</td>
                </tr>
              </tbody>
            </table>

            ${quote.valid_until ? `<p class="muted" style="margin: 8px 0 0;"><strong style="color:#111827">Giltig till:</strong> ${new Date(quote.valid_until).toLocaleDateString('sv-SE')}</p>` : ''}

            <div style="margin-top:16px;">
              <a class="cta" href="${siteUrl ? `${siteUrl}/admin/quotes/${quote.id}` : '#'}" target="_blank" rel="noopener">Visa offerten online</a>
            </div>

            <div class="divider"></div>
            <p class="muted" style="margin:0 0 4px;"><strong style="color:#111827">Kontakt</strong></p>
            <ul style="margin:0; padding-left:18px; color:#374151;">
              <li>E-post: info@fixco.se</li>
              <li>Telefon: 08-123 45 67</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Med varma hälsningar,<br><strong>Fixco Team</strong></p>
            <p><em>Detta e‑postmeddelande genererades automatiskt.</em></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Fixco <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Offert ${quote.quote_number} från Fixco`,
      html: emailHtml,
      replyTo: ["info@fixco.se"],
    });

    // If Resend returns an error, return preview so admins can test without domain verification
    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: emailResponse.error.message || 'E-post kunde inte skickas',
          previewHtml: emailHtml,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark quote as sent only after a successful email
    const { error: updateError } = await supabase
      .from('quotes')
      .update({ status: 'sent', updated_at: new Date().toISOString() })
      .eq('id', quoteId);

    if (updateError) {
      console.error('Error updating quote status after email:', updateError);
      return new Response(JSON.stringify({
        success: false,
        error: 'E-post skickades men status kunde inte uppdateras'
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: "Offerten har skickats via e-post"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Kunde inte skicka e-post"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);