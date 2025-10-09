import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, customerEmail, customerName } = await req.json();

    console.log("Sending quote email for:", { quoteId, customerEmail, customerName });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Hämta offert
    const { data: quote, error: quoteError } = await supabase
      .from('quotes_new')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      console.error("Error fetching quote:", quoteError);
      throw new Error("Kunde inte hämta offerten");
    }

    const displayName = customerName || 'Kund';
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://fixco.se';
    const publicUrl = `${frontendUrl}/quote/${quote.public_token}`;

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
            <div class="title">Offert från Fixco</div>
            <div style="color:#c7d2fe; font-size: 13px; margin-top:4px;">Offertnummer: ${quote.number}</div>
          </div>
          
          <div class="card">
            <h2>Hej ${displayName}!</h2>
            <p>Tack för ditt intresse. Din offert är nu klar att granska.</p>
            
            <p><strong>${quote.title}</strong></p>
            
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Arbete:</strong> ${quote.subtotal_work_sek.toLocaleString('sv-SE')} kr</p>
              <p style="margin: 4px 0;"><strong>Material:</strong> ${quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr</p>
              ${quote.discount_amount_sek > 0 ? `<p style="margin: 4px 0; color: #059669;"><strong>Rabatt:</strong> -${quote.discount_amount_sek.toLocaleString('sv-SE')} kr</p>` : ''}
              <p style="margin: 4px 0;"><strong>Moms (25%):</strong> ${quote.vat_sek.toLocaleString('sv-SE')} kr</p>
              ${quote.rot_deduction_sek > 0 ? `<p style="margin: 4px 0; color: #059669;"><strong>ROT-avdrag (${quote.rot_percentage}%):</strong> -${quote.rot_deduction_sek.toLocaleString('sv-SE')} kr</p>` : ''}
              <p style="margin: 12px 0 4px; font-size: 18px; font-weight: 700;"><strong>Totalt att betala:</strong> ${quote.total_sek.toLocaleString('sv-SE')} kr</p>
            </div>
            
            ${quote.valid_until ? `<p><strong>Giltig till:</strong> ${new Date(quote.valid_until).toLocaleDateString('sv-SE')}</p>` : ''}
            
            <div style="text-align: center; margin-top: 24px;">
              <a class="cta" href="${publicUrl}" target="_blank">Visa och acceptera offert</a>
            </div>
            
            <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
              Du kan även begära ändringar direkt via länken ovan.
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 16px;">
            <p>Med vänliga hälsningar,<br><strong>Fixco Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Fixco <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Offert ${quote.number} från Fixco`,
      html: emailHtml,
      replyTo: ["info@fixco.se"],
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: emailResponse.error.message || 'E-post kunde inte skickas',
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Uppdatera status
    const { error: updateError } = await supabase
      .from('quotes_new')
      .update({ 
        status: 'sent', 
        sent_at: new Date().toISOString() 
      })
      .eq('id', quoteId);

    if (updateError) {
      console.error('Error updating quote status:', updateError);
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Offerten har skickats via e-post"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-quote-email-new function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Kunde inte skicka e-post"
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
