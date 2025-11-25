import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReacceptEmailRequest {
  quoteId: string;
  customerEmail: string;
  customerName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { quoteId, customerEmail, customerName }: ReacceptEmailRequest = await req.json();
    console.log('Skickar re-accept email för quote:', quoteId);

    // Fetch quote data
    const { data: quote, error: quoteError } = await supabaseClient
      .from('quotes_new')
      .select('number, public_token, total_sek')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      console.error('Quote fetch error:', quoteError);
      throw new Error('Quote not found');
    }

    console.log('Quote fetched:', quote.number);

    // Create public URL
    const publicUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovableproject.com')}/q/${quote.number}/${quote.public_token}`;

    // Send email
    const emailResponse = await resend.emails.send({
      from: 'Fixco <no-reply@fixco.se>',
      to: [customerEmail],
      subject: `⚠️ Din offert har uppdaterats - ${quote.number}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0;">Fixco</h1>
              </div>

              <!-- Main Content Card -->
              <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #e2e8f0;">
                
                <!-- Warning Badge -->
                <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 12px 16px; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 20px;">⚠️</span>
                  <span style="color: #92400e; font-size: 13px; font-weight: 600;">Din offert har uppdaterats</span>
                </div>

                <p style="font-size: 15px; margin: 0 0 15px 0;">Hej ${customerName},</p>
                
                <p style="font-size: 15px; margin: 0 0 20px 0; color: #475569;">
                  Vi har gjort ändringar i din offert <strong>${quote.number}</strong> efter din acceptans.
                </p>

                <p style="font-size: 15px; margin: 0 0 25px 0; color: #475569;">
                  För att fortsätta behöver vi att du godkänner de nya ändringarna.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${publicUrl}" style="display: inline-block; background: #1e3a5f; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                    Visa och acceptera ändringarna
                  </a>
                </div>

                <!-- Quote Details -->
                <div style="background: #f8fafc; border-radius: 6px; padding: 16px; margin-top: 25px; border: 1px solid #f1f5f9;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #64748b; font-size: 13px;">Offertnummer:</span>
                    <strong style="color: #1e293b; font-size: 13px;">${quote.number}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b; font-size: 13px;">Totalt:</span>
                    <strong style="color: #1e293b; font-size: 14px;">${quote.total_sek?.toLocaleString('sv-SE')} kr</strong>
                  </div>
                </div>

                <p style="font-size: 13px; color: #64748b; margin: 25px 0 0 0; line-height: 1.5;">
                  Har du frågor? Kontakta oss på <a href="mailto:info@fixco.se" style="color: #1e3a5f;">info@fixco.se</a> eller ring 010-551 72 40
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Fixco AB - Professionella hantverkare i Stockholm
                </p>
              </div>

            </div>
          </body>
        </html>
      `
    });

    console.log('Re-accept email sent:', emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Re-accept email sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-reaccept-email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
