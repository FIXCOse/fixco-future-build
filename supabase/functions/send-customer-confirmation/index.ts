import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CustomerConfirmationRequest {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  serviceName: string;
  serviceSlug?: string;
  mode: string;
  description?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  desiredTime?: string;
}

function getModeLabel(mode: string): string {
  switch (mode) {
    case 'quote': return 'Offertförfrågan';
    case 'home_visit': return 'Hembesök';
    case 'booking': return 'Bokning';
    default: return 'Förfrågan';
  }
}

function getEmailSubject(mode: string): string {
  switch (mode) {
    case 'quote': return 'Bekräftelse - Vi har mottagit din offertförfrågan';
    case 'home_visit': return 'Bekräftelse - Hembesök bokat hos Fixco';
    case 'booking': return 'Bekräftelse - Din bokning hos Fixco';
    default: return 'Bekräftelse - Vi har mottagit din förfrågan';
  }
}

function getUrgencyText(desiredTime?: string): string {
  switch (desiredTime) {
    case 'asap': return 'Så snart som möjligt';
    case 'this_week': return 'Inom denna vecka';
    case 'this_month': return 'Inom denna månad';
    case 'flexible': return 'Flexibel';
    default: return 'Ej specificerat';
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: CustomerConfirmationRequest = await req.json();
    
    console.log("Sending customer confirmation email to:", data.customerEmail);

    const modeLabel = getModeLabel(data.mode);
    const subject = getEmailSubject(data.mode);
    const urgencyText = getUrgencyText(data.desiredTime);

    const addressSection = data.address ? `
      <tr>
        <td style="padding: 8px 0; color: #666; width: 140px;">Adress:</td>
        <td style="padding: 8px 0; color: #333;">${data.address}${data.postalCode ? `, ${data.postalCode}` : ''}${data.city ? ` ${data.city}` : ''}</td>
      </tr>
    ` : '';

    const descriptionSection = data.description ? `
      <div style="margin-top: 24px;">
        <h3 style="color: #333; font-size: 16px; margin: 0 0 12px 0;">Din beskrivning</h3>
        <p style="color: #666; margin: 0; padding: 16px; background: #f8f9fa; border-radius: 8px; line-height: 1.6;">
          ${data.description}
        </p>
      </div>
    ` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          
          <!-- Header with Logo (dark-mode robust) -->
          <div style="text-align: center; margin-bottom: 32px; background: #000000; padding: 24px; border-radius: 16px;">
            <div style="display: inline-block; background: #808080; padding: 14px 18px; border-radius: 14px;">
              <img src="https://fnzjgohubvaxwpmnvwdq.supabase.co/storage/v1/object/public/assets/fixco-logo-white.png" 
                   alt="Fixco" 
                   width="150"
                   style="display: block; margin: 0 auto; max-width: 150px; height: auto;" />
            </div>
            <p style="color: #d4d4d8; margin: 14px 0 0 0; font-size: 14px;">Hantverkare du kan lita på</p>
          </div>

          <!-- Main Card -->
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            
            <!-- Confirmation Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                ✓ ${modeLabel} mottagen
              </div>
            </div>

            <h2 style="color: #18181b; font-size: 20px; margin: 0 0 16px 0; text-align: center;">
              Tack ${data.customerName}!
            </h2>
            
            <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
              Vi har tagit emot din förfrågan och återkommer till dig så snart som möjligt.
            </p>

            <!-- Booking Details -->
            <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #333; font-size: 16px; margin: 0 0 16px 0;">Sammanfattning</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 140px;">Tjänst:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: 500;">${data.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Typ:</td>
                  <td style="padding: 8px 0; color: #333;">${modeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Önskad tid:</td>
                  <td style="padding: 8px 0; color: #333;">${urgencyText}</td>
                </tr>
                ${addressSection}
              </table>
            </div>

            <!-- Contact Info -->
            <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #333; font-size: 16px; margin: 0 0 16px 0;">Dina kontaktuppgifter</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 140px;">Namn:</td>
                  <td style="padding: 8px 0; color: #333;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">E-post:</td>
                  <td style="padding: 8px 0; color: #333;">${data.customerEmail}</td>
                </tr>
                ${data.customerPhone ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Telefon:</td>
                  <td style="padding: 8px 0; color: #333;">${data.customerPhone}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            ${descriptionSection}

            <!-- What Happens Next -->
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <h3 style="color: #333; font-size: 16px; margin: 0 0 12px 0;">Vad händer nu?</h3>
              <ol style="color: #666; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Vi granskar din förfrågan</li>
                <li>En av våra specialister kontaktar dig inom kort</li>
                <li>Vi bokar in ett lämpligt datum som passar dig</li>
              </ol>
            </div>

          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px; color: #71717a; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Har du frågor? Kontakta oss:</p>
            <p style="margin: 0;">
              <a href="mailto:info@fixco.se" style="color: #2563eb; text-decoration: none;">info@fixco.se</a>
              &nbsp;|&nbsp;
              <a href="tel:+46812345678" style="color: #2563eb; text-decoration: none;">08-123 456 78</a>
            </p>
            <p style="margin: 16px 0 0 0; color: #a1a1aa; font-size: 12px;">
              © ${new Date().getFullYear()} Fixco. Alla rättigheter förbehållna.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Fixco <info@fixco.se>",
      to: [data.customerEmail],
      subject: subject,
      html: html,
    });

    console.log("Customer confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending customer confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
