import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  applicantName: string;
  status: 'confirmation' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  interviewDate?: string;
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, applicantName, status, interviewDate, rejectionReason }: EmailRequest = await req.json();

    let subject = "";
    let html = "";

    switch (status) {
      case 'confirmation':
        subject = "Tack för din ansökan till Fixco";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Tack för din ansökan, ${applicantName}!</h1>
            <p>Vi har tagit emot din ansökan och kommer att granska den inom kort.</p>
            <p>Du kommer att få uppdateringar via e-post om status på din ansökan.</p>
            <p><strong>Nästa steg:</strong></p>
            <ul>
              <li>Vi granskar din ansökan och kompetenser</li>
              <li>Om vi är intresserade kontaktar vi dig för en intervju</li>
              <li>Vanligtvis hör du från oss inom 5-7 arbetsdagar</li>
            </ul>
            <p>Med vänliga hälsningar,<br><strong>Fixco Rekrytering</strong></p>
          </div>
        `;
        break;

      case 'reviewing':
        subject = "Fixco granskar din ansökan";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Vi granskar din ansökan</h1>
            <p>Hej ${applicantName},</p>
            <p>Din ansökan är nu under granskning av vårt rekryteringsteam.</p>
            <p>Vi återkommer inom kort med mer information.</p>
            <p>Med vänliga hälsningar,<br><strong>Fixco Rekrytering</strong></p>
          </div>
        `;
        break;

      case 'interview':
        subject = "Fixco vill träffa dig för intervju!";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Vi vill träffa dig, ${applicantName}!</h1>
            <p>Grattis! Vi är imponerade av din ansökan och skulle gärna vilja träffa dig för en intervju.</p>
            ${interviewDate ? `<p><strong>Datum och tid:</strong> ${interviewDate}</p>` : ''}
            <p>Vi kommer att kontakta dig inom kort för att bekräfta tid och plats.</p>
            <p>Med vänliga hälsningar,<br><strong>Fixco Rekrytering</strong></p>
          </div>
        `;
        break;

      case 'accepted':
        subject = "Välkommen till Fixco-familjen! 🎉";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Välkommen till Fixco, ${applicantName}!</h1>
            <p>Vi är glada att kunna erbjuda dig en plats i vårt team!</p>
            <p><strong>Nästa steg:</strong></p>
            <ul>
              <li>Vi kommer att kontakta dig inom 1-2 dagar för att påbörja onboarding-processen</li>
              <li>Du kommer att få tillgång till vårt digitala system</li>
              <li>Vi bokar in en introduktionsdag</li>
            </ul>
            <p>Välkommen till Fixco-familjen! 🚀</p>
            <p>Med vänliga hälsningar,<br><strong>Fixco Rekrytering</strong></p>
          </div>
        `;
        break;

      case 'rejected':
        subject = "Angående din ansökan till Fixco";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Tack för ditt intresse, ${applicantName}</h1>
            <p>Tack för att du sökte till Fixco. Efter noggrann övervägning har vi tyvärr valt att gå vidare med andra kandidater för tillfället.</p>
            ${rejectionReason ? `<p>${rejectionReason}</p>` : ''}
            <p>Vi uppskattar verkligen ditt intresse för Fixco och önskar dig all lycka i din fortsatta karriär.</p>
            <p>Du är alltid välkommen att ansöka igen i framtiden!</p>
            <p>Med vänliga hälsningar,<br><strong>Fixco Rekrytering</strong></p>
          </div>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "Fixco <info@fixco.se>",
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Application email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-application-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
