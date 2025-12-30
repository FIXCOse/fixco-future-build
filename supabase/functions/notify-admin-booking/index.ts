import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin emails to notify
const ADMIN_EMAILS = ["imedashviliomar@gmail.com"];

interface BookingNotificationRequest {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceSlug: string;
  mode: string;
  address?: string;
  city?: string;
  postalCode?: string;
  desiredTime?: string;
  description?: string;
}

function getUrgencyLabel(desiredTime?: string): string {
  switch (desiredTime) {
    case 'asap': return '🔥 ASAP - Brådskande!';
    case '1-2days': return '⚡ Inom 1-2 dagar';
    case 'week': return '📅 Inom veckan';
    case 'month': return '🗓️ Nästa månad';
    default: return '📋 Ingen tidsönskan angiven';
  }
}

function getModeLabel(mode: string): string {
  switch (mode) {
    case 'home_visit': return '🏠 Hembesök';
    case 'quote': return '📋 Offertförfrågan';
    case 'book': return '📅 Bokning';
    default: return mode;
  }
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: BookingNotificationRequest = await req.json();
    
    console.log("[notify-admin-booking] Skickar notifiering för bokning:", data.bookingId);

    const urgencyLabel = getUrgencyLabel(data.desiredTime);
    const modeLabel = getModeLabel(data.mode);
    
    // Check if this is urgent (ASAP)
    const isUrgent = data.desiredTime === 'asap';
    const subjectPrefix = isUrgent ? '🔥 BRÅDSKANDE: ' : '';
    
    const adminUrl = `https://preview--fixco-v4.lovable.app/admin/quotes?new=${data.bookingId}`;

    const emailResponse = await resend.emails.send({
      from: "Fixco <notiser@fixco.se>",
      to: ADMIN_EMAILS,
      subject: `${subjectPrefix}Ny bokningsförfrågan från ${data.customerName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${isUrgent ? '#dc2626' : '#2563eb'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: 600; width: 140px; color: #6b7280; }
            .info-value { flex: 1; }
            .urgency-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: 600; margin-top: 8px; }
            .urgency-asap { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
            .urgency-soon { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
            .urgency-normal { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
            .cta { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${isUrgent ? '🔥 Brådskande förfrågan!' : '📬 Ny bokningsförfrågan'}</h1>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="info-label">Kund:</span>
                <span class="info-value"><strong>${data.customerName}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">E-post:</span>
                <span class="info-value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></span>
              </div>
              <div class="info-row">
                <span class="info-label">Telefon:</span>
                <span class="info-value"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></span>
              </div>
              <div class="info-row">
                <span class="info-label">Tjänst:</span>
                <span class="info-value">${data.serviceSlug}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Typ:</span>
                <span class="info-value">${modeLabel}</span>
              </div>
              ${data.address ? `
              <div class="info-row">
                <span class="info-label">Adress:</span>
                <span class="info-value">${data.address}${data.postalCode ? `, ${data.postalCode}` : ''} ${data.city || ''}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="info-label">Tidsönskan:</span>
                <span class="info-value">
                  <span class="urgency-badge ${data.desiredTime === 'asap' ? 'urgency-asap' : data.desiredTime === '1-2days' ? 'urgency-soon' : 'urgency-normal'}">
                    ${urgencyLabel}
                  </span>
                </span>
              </div>
              ${data.description ? `
              <div class="info-row">
                <span class="info-label">Beskrivning:</span>
                <span class="info-value">${data.description}</span>
              </div>
              ` : ''}
              
              <a href="${adminUrl}" class="cta">Öppna i Admin →</a>
            </div>
            <div class="footer">
              <p>Detta mail skickades automatiskt från Fixco när en ny förfrågan kom in.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[notify-admin-booking] Email skickat:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[notify-admin-booking] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
