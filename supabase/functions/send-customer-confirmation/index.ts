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
        <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Adress</td>
        <td style="padding: 12px 0; color: #1f2937; font-size: 14px;">${data.address}${data.postalCode ? `, ${data.postalCode}` : ''}${data.city ? ` ${data.city}` : ''}</td>
      </tr>
    ` : '';

    const descriptionSection = data.description ? `
      <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #f3f4f6;">
        <h3 style="color: #1e3a5f; font-size: 14px; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Din beskrivning</h3>
        <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.7;">
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
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fafaf9;">
        <div style="max-width: 600px; margin: 0 auto; padding: 48px 24px;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%); border-radius: 12px;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">FIXCO</h1>
            </div>
            <p style="color: #6b7280; margin: 16px 0 0 0; font-size: 15px; font-weight: 400;">Professionella hantverkare</p>
          </div>

          <!-- Main Card -->
          <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.04);">
            
            <!-- Confirmation Badge -->
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: #f0fdf4; color: #166534; padding: 10px 20px; border-radius: 24px; font-size: 14px; font-weight: 600; border: 1px solid #bbf7d0;">
                ✓ ${modeLabel} mottagen
              </div>
            </div>

            <h2 style="color: #1e3a5f; font-size: 24px; margin: 0 0 12px 0; text-align: center; font-weight: 600;">
              Tack för din förfrågan, ${data.customerName}!
            </h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.7; margin: 0 0 32px 0; text-align: center;">
              Vi har tagit emot din förfrågan och återkommer till dig så snart som möjligt.
            </p>

            <!-- Divider -->
            <div style="height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); margin-bottom: 32px;"></div>

            <!-- Booking Details -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #f3f4f6;">
              <h3 style="color: #1e3a5f; font-size: 14px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Sammanfattning</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; color: #6b7280; width: 130px; font-size: 14px; border-bottom: 1px solid #f3f4f6;">Tjänst</td>
                  <td style="padding: 12px 0; color: #1f2937; font-weight: 500; font-size: 14px; border-bottom: 1px solid #f3f4f6;">${data.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #6b7280; font-size: 14px; border-bottom: 1px solid #f3f4f6;">Typ</td>
                  <td style="padding: 12px 0; color: #1f2937; font-size: 14px; border-bottom: 1px solid #f3f4f6;">${modeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #6b7280; font-size: 14px;${data.address ? ' border-bottom: 1px solid #f3f4f6;' : ''}">Önskad tid</td>
                  <td style="padding: 12px 0; color: #1f2937; font-size: 14px;${data.address ? ' border-bottom: 1px solid #f3f4f6;' : ''}">${urgencyText}</td>
                </tr>
                ${addressSection}
              </table>
            </div>

            <!-- Contact Info -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #f3f4f6;">
              <h3 style="color: #1e3a5f; font-size: 14px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Dina kontaktuppgifter</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; color: #6b7280; width: 130px; font-size: 14px; border-bottom: 1px solid #f3f4f6;">Namn</td>
                  <td style="padding: 12px 0; color: #1f2937; font-size: 14px; border-bottom: 1px solid #f3f4f6;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #6b7280; font-size: 14px;${data.customerPhone ? ' border-bottom: 1px solid #f3f4f6;' : ''}">E-post</td>
                  <td style="padding: 12px 0; color: #1f2937; font-size: 14px;${data.customerPhone ? ' border-bottom: 1px solid #f3f4f6;' : ''}">${data.customerEmail}</td>
                </tr>
                ${data.customerPhone ? `
                <tr>
                  <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Telefon</td>
                  <td style="padding: 12px 0; color: #1f2937; font-size: 14px;">${data.customerPhone}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            ${descriptionSection}

            <!-- What Happens Next -->
            <div style="margin-top: 32px; padding: 28px; background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border-radius: 12px; border: 1px solid #fef08a;">
              <h3 style="color: #854d0e; font-size: 14px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Vad händer nu?</h3>
              
              <div style="display: flex; margin-bottom: 16px;">
                <div style="flex-shrink: 0; width: 28px; height: 28px; background: #fef08a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 14px; border: 2px solid #eab308;">
                  <span style="color: #854d0e; font-size: 13px; font-weight: 700;">1</span>
                </div>
                <div style="padding-top: 4px;">
                  <p style="color: #713f12; font-size: 14px; margin: 0; line-height: 1.5;">Vi granskar din förfrågan noggrant</p>
                </div>
              </div>
              
              <div style="display: flex; margin-bottom: 16px;">
                <div style="flex-shrink: 0; width: 28px; height: 28px; background: #fef08a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 14px; border: 2px solid #eab308;">
                  <span style="color: #854d0e; font-size: 13px; font-weight: 700;">2</span>
                </div>
                <div style="padding-top: 4px;">
                  <p style="color: #713f12; font-size: 14px; margin: 0; line-height: 1.5;">En specialist kontaktar dig inom kort</p>
                </div>
              </div>
              
              <div style="display: flex;">
                <div style="flex-shrink: 0; width: 28px; height: 28px; background: #fef08a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 14px; border: 2px solid #eab308;">
                  <span style="color: #854d0e; font-size: 13px; font-weight: 700;">3</span>
                </div>
                <div style="padding-top: 4px;">
                  <p style="color: #713f12; font-size: 14px; margin: 0; line-height: 1.5;">Vi bokar tid som passar dig</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0;">Har du frågor? Vi finns här för dig:</p>
            <p style="margin: 0 0 8px 0;">
              <a href="mailto:info@fixco.se" style="color: #1e3a5f; text-decoration: none; font-weight: 500; font-size: 14px;">info@fixco.se</a>
              <span style="color: #d1d5db; margin: 0 12px;">|</span>
              <a href="tel:+46812345678" style="color: #1e3a5f; text-decoration: none; font-weight: 500; font-size: 14px;">08-123 456 78</a>
            </p>
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Fixco AB. Alla rättigheter förbehållna.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">
                Organisationsnummer: 559XXX-XXXX
              </p>
            </div>
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
