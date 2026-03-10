import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { Resend } from 'npm:resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const copy = {
  sv: {
    subject: (num: string) => `Fixco har en fråga om offert ${num}`,
    badge: '💬 Fråga från Fixco',
    greeting: (name: string) => `Hej ${name}!`,
    intro: (num: string, title: string) => `Vi har en fråga angående offert <strong>${num}</strong>${title ? ` – ${title}` : ''}.`,
    questionLabel: 'Vår fråga',
    cta: 'Se offerten och svara',
    footer: 'Har du fler frågor? Kontakta oss:',
    rights: (year: number) => `© ${year} Fixco. Alla rättigheter förbehållna.`,
  },
  en: {
    subject: (num: string) => `Fixco has a question about quote ${num}`,
    badge: '💬 Question from Fixco',
    greeting: (name: string) => `Hi ${name}!`,
    intro: (num: string, title: string) => `We have a question regarding quote <strong>${num}</strong>${title ? ` – ${title}` : ''}.`,
    questionLabel: 'Our question',
    cta: 'View quote and reply',
    footer: 'Have more questions? Contact us:',
    rights: (year: number) => `© ${year} Fixco. All rights reserved.`,
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quote_id, question } = await req.json();

    if (!quote_id || !question) {
      return new Response(
        JSON.stringify({ error: 'quote_id och question krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: quote, error: fetchError } = await supabase
      .from('quotes_new')
      .select('id, number, title, public_token, locale, customer:customers(name, email)')
      .eq('id', quote_id)
      .single();

    if (fetchError || !quote) {
      return new Response(
        JSON.stringify({ error: 'Offert hittades inte' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert admin question
    const { error: insertError } = await supabase
      .from('quote_questions')
      .insert({
        quote_id: quote.id,
        question,
        customer_name: 'Fixco',
        customer_email: null,
        asked_by: 'admin',
        answered: false,
      });

    if (insertError) throw insertError;

    // Send email to customer
    const customerEmail = quote.customer?.email;
    const customerName = quote.customer?.name || 'Kund';

    if (customerEmail) {
      try {
        const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
        const locale = (quote.locale || 'sv') as 'sv' | 'en';
        const t = copy[locale] || copy.sv;
        const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://fixco.se';
        const quoteUrl = `${frontendUrl}/q/${quote.number}/${quote.public_token}`;

        const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px 0;">
      <tr>
        <td align="center" style="padding: 0;">
          <img src="https://fixco.se/assets/fixco-logo-black.png" alt="Fixco" width="180" style="display: block; border: 0;" />
          <div style="height: 10px;">&nbsp;</div>
        </td>
      </tr>
    </table>

    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
          ${t.badge}
        </div>
      </div>

      <h2 style="color: #18181b; font-size: 20px; margin: 0 0 16px 0; text-align: center;">
        ${t.greeting(customerName)}
      </h2>
      
      <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
        ${t.intro(quote.number, quote.title || '')}
      </p>

      <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 24px; border-top: 3px solid #2563eb;">
        <div style="font-size: 13px; color: #1e40af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">${t.questionLabel}</div>
        <p style="color: #18181b; font-size: 15px; line-height: 1.6; margin: 0;">${question}</p>
      </div>

      <div style="text-align: center; margin-top: 28px;">
        <a href="${quoteUrl}" style="display: inline-block; background: #18181b; color: #ffffff !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
          ${t.cta}
        </a>
      </div>
    </div>

    <div style="text-align: center; margin-top: 32px; color: #71717a; font-size: 14px;">
      <p style="margin: 0 0 8px 0;">${t.footer}</p>
      <p style="margin: 0;">
        <a href="mailto:info@fixco.se" style="color: #2563eb; text-decoration: none;">info@fixco.se</a>
      </p>
      <p style="margin: 16px 0 0 0; color: #a1a1aa; font-size: 12px;">
        ${t.rights(new Date().getFullYear())}
      </p>
    </div>
  </div>
</body>
</html>`;

        await resend.emails.send({
          from: 'Fixco <info@fixco.se>',
          to: [customerEmail],
          subject: t.subject(quote.number),
          html,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
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
