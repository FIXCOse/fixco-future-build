import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { Resend } from 'npm:resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question_id, answer, customer_email, answer_name } = await req.json();

    if (!question_id || !answer) {
      return new Response(
        JSON.stringify({ error: 'Fråge-ID och svar krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hämta frågan och offerten
    const { data: question, error: fetchError } = await supabase
      .from('quote_questions')
      .select(`
        *,
        quote:quotes_new!inner(
          id,
          number,
          title,
          public_token,
          locale,
          customer:customers(name, email)
        )
      `)
      .eq('id', question_id)
      .single();

    if (fetchError || !question) {
      return new Response(
        JSON.stringify({ error: 'Fråga hittades inte' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Uppdatera frågan med svar
    const { error: updateError } = await supabase
      .from('quote_questions')
      .update({
        answered: true,
        answer: answer,
        answered_at: new Date().toISOString()
      })
      .eq('id', question_id);

    if (updateError) throw updateError;

    const isAdminQuestion = question.asked_by === 'admin';
    
    if (isAdminQuestion) {
      // Customer answered an admin question → notify admin
      try {
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
        if (RESEND_API_KEY) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Fixco <info@fixco.se>',
              to: ['imedashviliomar@gmail.com'],
              subject: `💬 Kund svarade på fråga – offert ${question.quote.number}`,
              html: `<h2>Kundsvar mottaget</h2>
              <p><strong>Offert:</strong> ${question.quote.number} – ${question.quote.title || ''}</p>
              <p><strong>Kund:</strong> ${question.quote.customer?.name || 'Okänd'}</p>
              <p><strong>Din fråga:</strong> ${question.question}</p>
              <p><strong>Kundens svar:</strong> ${answer}</p>
              <p><strong>Tidpunkt:</strong> ${new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}</p>`,
            }),
          });
        }
      } catch (emailError) {
        console.error('Failed to notify admin:', emailError);
      }
    } else {
      // Admin answered a customer question → notify customer
      const emailToSend = customer_email || question.quote.customer?.email || question.customer_email;
      
      if (emailToSend) {
        try {
          const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
          const quoteUrl = `https://fixco.se/q/${question.quote.number}/${question.quote.public_token}`;

          const html = `<!DOCTYPE html>
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
          <div style="font-size: 14px; color: #52525b; margin: 0;">Hantverkare du kan lita på</div>
        </td>
      </tr>
    </table>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      
      <!-- Badge -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
          💬 Svar på din fråga
        </div>
      </div>

      <h2 style="color: #18181b; font-size: 20px; margin: 0 0 16px 0; text-align: center;">
        Hej ${question.customer_name}!
      </h2>
      
      <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
        Vi har svarat på din fråga om offert <strong>${question.quote.number}</strong>${question.quote.title ? ` – ${question.quote.title}` : ''}.
      </p>

      <!-- Question Box -->
      <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 16px; border-top: 3px solid #a1a1aa;">
        <div style="font-size: 13px; color: #71717a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Din fråga</div>
        <p style="color: #18181b; font-size: 15px; line-height: 1.6; margin: 0;">${question.question}</p>
      </div>

      <!-- Answer Box -->
      <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 24px; border-top: 3px solid #2563eb;">
        <div style="font-size: 13px; color: #1e40af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Vårt svar</div>
        <p style="color: #18181b; font-size: 15px; line-height: 1.6; margin: 0;">${answer}</p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 28px;">
        <a href="${quoteUrl}" style="display: inline-block; background: #18181b; color: #ffffff !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Se offerten
        </a>
      </div>

      <!-- What happens next -->
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #52525b; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
          Har du fler frågor? Besök offerten och ställ nya frågor eller kontakta oss direkt.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; color: #71717a; font-size: 14px;">
      <p style="margin: 0 0 8px 0;">Har du frågor? Kontakta oss:</p>
      <p style="margin: 0;">
        <a href="mailto:info@fixco.se" style="color: #2563eb; text-decoration: none;">info@fixco.se</a>
      </p>
      <p style="margin: 16px 0 0 0; color: #a1a1aa; font-size: 12px;">
        © ${new Date().getFullYear()} Fixco. Alla rättigheter förbehållna.
      </p>
    </div>

  </div>
</body>
</html>`;

          await resend.emails.send({
            from: 'Fixco <info@fixco.se>',
            to: [emailToSend],
            subject: `Svar på din fråga om offert ${question.quote.number}`,
            html
          });
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Serverfel' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
