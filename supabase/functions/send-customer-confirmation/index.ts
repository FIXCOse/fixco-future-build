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
  locale?: string;
}

// ─── Bilingual copy ────────────────────────────────────────
const copy = {
  sv: {
    modeLabel: { quote: 'Offertförfrågan', home_visit: 'Hembesök', booking: 'Bokning', default: 'Förfrågan' },
    subject: { quote: 'Bekräftelse - Vi har mottagit din offertförfrågan', home_visit: 'Bekräftelse - Hembesök bokat hos Fixco', booking: 'Bekräftelse - Din bokning hos Fixco', default: 'Bekräftelse - Vi har mottagit din förfrågan' },
    urgency: { asap: 'Så snart som möjligt', this_week: 'Inom denna vecka', this_month: 'Inom denna månad', flexible: 'Flexibel', default: 'Ej specificerat' },
    tagline: 'Hantverkare du kan lita på',
    received: 'mottagen',
    thankYou: 'Tack',
    weHaveReceived: 'Vi har tagit emot din förfrågan och återkommer till dig så snart som möjligt.',
    summary: 'Sammanfattning',
    service: 'Tjänst:',
    type: 'Typ:',
    desiredTime: 'Önskad tid:',
    addressLabel: 'Adress:',
    contactDetails: 'Dina kontaktuppgifter',
    nameLabel: 'Namn:',
    emailLabel: 'E-post:',
    phoneLabel: 'Telefon:',
    yourDescription: 'Din beskrivning',
    whatHappensNext: 'Vad händer nu?',
    step1: 'Vi granskar din förfrågan',
    step2: 'En av våra specialister kontaktar dig inom kort',
    step3: 'Vi bokar in ett lämpligt datum som passar dig',
    questionsContact: 'Har du frågor? Kontakta oss:',
    allRights: 'Alla rättigheter förbehållna.',
  },
  en: {
    modeLabel: { quote: 'Quote request', home_visit: 'Home visit', booking: 'Booking', default: 'Request' },
    subject: { quote: 'Confirmation - We have received your quote request', home_visit: 'Confirmation - Home visit booked with Fixco', booking: 'Confirmation - Your booking with Fixco', default: 'Confirmation - We have received your request' },
    urgency: { asap: 'As soon as possible', this_week: 'Within this week', this_month: 'Within this month', flexible: 'Flexible', default: 'Not specified' },
    tagline: 'Craftsmen you can trust',
    received: 'received',
    thankYou: 'Thank you',
    weHaveReceived: 'We have received your request and will get back to you as soon as possible.',
    summary: 'Summary',
    service: 'Service:',
    type: 'Type:',
    desiredTime: 'Desired time:',
    addressLabel: 'Address:',
    contactDetails: 'Your contact details',
    nameLabel: 'Name:',
    emailLabel: 'Email:',
    phoneLabel: 'Phone:',
    yourDescription: 'Your description',
    whatHappensNext: 'What happens next?',
    step1: 'We review your request',
    step2: 'One of our specialists will contact you shortly',
    step3: 'We schedule a suitable date that works for you',
    questionsContact: 'Have questions? Contact us:',
    allRights: 'All rights reserved.',
  },
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: CustomerConfirmationRequest = await req.json();
    const locale = (data.locale === 'en' ? 'en' : 'sv') as 'sv' | 'en';
    const t = copy[locale];

    console.log("Sending customer confirmation email to:", data.customerEmail, "locale:", locale);

    const modeLabel = t.modeLabel[data.mode as keyof typeof t.modeLabel] || t.modeLabel.default;
    const subject = t.subject[data.mode as keyof typeof t.subject] || t.subject.default;
    const urgencyText = t.urgency[data.desiredTime as keyof typeof t.urgency] || t.urgency.default;

    const addressSection = data.address ? `
      <tr>
        <td style="padding: 8px 0; color: #666; width: 140px;">${t.addressLabel}</td>
        <td style="padding: 8px 0; color: #333;">${data.address}${data.postalCode ? `, ${data.postalCode}` : ''}${data.city ? ` ${data.city}` : ''}</td>
      </tr>
    ` : '';

    const descriptionSection = data.description ? `
      <div style="margin-top: 24px;">
        <h3 style="color: #333; font-size: 16px; margin: 0 0 12px 0;">${t.yourDescription}</h3>
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
          
          <!-- Header -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px 0;">
            <tr>
              <td align="center" style="padding: 0;">
                <img src="https://fixco.se/assets/fixco-logo-black.png" 
                     alt="Fixco" 
                     width="180"
                     style="display: block; border: 0; outline: none; text-decoration: none; height: auto;" />
                <div style="height: 10px; line-height: 10px;">&nbsp;</div>
                <div style="font-size: 14px; color: #52525b; margin: 0;">${t.tagline}</div>
              </td>
            </tr>
          </table>

          <!-- Main Card -->
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            
            <!-- Confirmation Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                ✓ ${modeLabel} ${t.received}
              </div>
            </div>

            <h2 style="color: #18181b; font-size: 20px; margin: 0 0 16px 0; text-align: center;">
              ${t.thankYou} ${data.customerName}!
            </h2>
            
            <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
              ${t.weHaveReceived}
            </p>

            <!-- Booking Details -->
            <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #333; font-size: 16px; margin: 0 0 16px 0;">${t.summary}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 140px;">${t.service}</td>
                  <td style="padding: 8px 0; color: #333; font-weight: 500;">${data.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">${t.type}</td>
                  <td style="padding: 8px 0; color: #333;">${modeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">${t.desiredTime}</td>
                  <td style="padding: 8px 0; color: #333;">${urgencyText}</td>
                </tr>
                ${addressSection}
              </table>
            </div>

            <!-- Contact Info -->
            <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #333; font-size: 16px; margin: 0 0 16px 0;">${t.contactDetails}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 140px;">${t.nameLabel}</td>
                  <td style="padding: 8px 0; color: #333;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">${t.emailLabel}</td>
                  <td style="padding: 8px 0; color: #333;">${data.customerEmail}</td>
                </tr>
                ${data.customerPhone ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">${t.phoneLabel}</td>
                  <td style="padding: 8px 0; color: #333;">${data.customerPhone}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            ${descriptionSection}

            <!-- What Happens Next -->
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <h3 style="color: #333; font-size: 16px; margin: 0 0 12px 0;">${t.whatHappensNext}</h3>
              <ol style="color: #666; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>${t.step1}</li>
                <li>${t.step2}</li>
                <li>${t.step3}</li>
              </ol>
            </div>

          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px; color: #71717a; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">${t.questionsContact}</p>
            <p style="margin: 0;">
              <a href="mailto:info@fixco.se" style="color: #2563eb; text-decoration: none;">info@fixco.se</a>
            </p>
            <p style="margin: 16px 0 0 0; color: #a1a1aa; font-size: 12px;">
              © ${new Date().getFullYear()} Fixco. ${t.allRights}
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
