import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, customerEmail, customerName }: SendQuoteEmailRequest = await req.json();

    console.log("Sending quote email for:", { quoteId, customerEmail, customerName });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch quote details
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*, profiles!quotes_customer_id_fkey(first_name, last_name, email)')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      console.error("Error fetching quote:", quoteError);
      throw new Error("Kunde inte hämta offerten");
    }

    // Update quote status to 'sent'
    const { error: updateError } = await supabase
      .from('quotes')
      .update({ 
        status: 'sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', quoteId);

    if (updateError) {
      console.error("Error updating quote status:", updateError);
      throw new Error("Kunde inte uppdatera offertstatus");
    }

    const customer = quote.profiles;
    const displayName = customerName || 
                       (customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : '') || 
                       'Kund';

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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .quote-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .quote-table th { background: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
          .total-row { background: #f3f4f6; font-weight: bold; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Offert från Fixco</h1>
            <p>Offertnummer: ${quote.quote_number}</p>
          </div>
          
          <div class="content">
            <h2>Hej ${displayName}!</h2>
            <p>Tack för ditt intresse för våra tjänster. Vi har förberett en offert för dig:</p>
            
            <h3>${quote.title}</h3>
            ${quote.description ? `<p><strong>Beskrivning:</strong> ${quote.description}</p>` : ''}
            
            <table class="quote-table">
              <thead>
                <tr>
                  <th>Beskrivning</th>
                  <th>Antal</th>
                  <th>Pris/enhet</th>
                  <th>Totalt</th>
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
            
            ${quote.valid_until ? `<p><strong>Offerten gäller till:</strong> ${new Date(quote.valid_until).toLocaleDateString('sv-SE')}</p>` : ''}
            
            <p>För att acceptera denna offert eller om du har frågor, kontakta oss gärna:</p>
            <ul>
              <li><strong>E-post:</strong> info@fixco.se</li>
              <li><strong>Telefon:</strong> 08-123 45 67</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Med vänliga hälsningar,<br>Fixco Team</p>
            <p><em>Detta är ett automatiskt genererat e-postmeddelande.</em></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Fixco <noreply@fixco.se>",
      to: [customerEmail],
      subject: `Offert ${quote.quote_number} från Fixco`,
      html: emailHtml,
    });

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