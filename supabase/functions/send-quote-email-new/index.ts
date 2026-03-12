import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── Bilingual copy for quote emails ────────────────────────
const quoteCopy = {
  sv: {
    subject: (num: string) => `Offert ${num} från Fixco`,
    updatedSubject: (num: string) => `Uppdaterad offert ${num} från Fixco`,
    testSubject: (num: string) => `[TEST] Offert ${num} från Fixco`,
    testUpdatedSubject: (num: string) => `[TEST] Uppdaterad offert ${num} från Fixco`,
    title: 'Offert från Fixco',
    updatedTitle: 'Uppdaterad offert från Fixco',
    quoteNumber: 'Offertnummer',
    greeting: (name: string) => `Hej ${name}!`,
    intro: 'Tack för ditt intresse. Din offert är nu klar att granska.',
    updatedIntro: 'Vi har uppdaterat din offert. Vänligen granska den nya versionen nedan.',
    updatedBanner: (oldNum: string) => `📋 Detta är en uppdaterad offert som ersätter din tidigare offert ${oldNum}`,
    work: 'Arbete:',
    material: 'Material:',
    discount: 'Rabatt:',
    vat: 'Moms (25%):',
    rotDeduction: (pct: number) => `ROT-avdrag (${pct}%):`,
    totalToPay: 'Totalt att betala:',
    validUntil: 'Giltig till:',
    cta: 'Visa och acceptera offert',
    footer: 'Du kan även begära ändringar direkt via länken ovan.',
    regards: 'Med vänliga hälsningar,',
    questionsNote: 'Vi har även ställt frågor i offerten som vi önskar att du besvarar.',
    questionsLabel: 'Våra frågor till dig:',
    imagesRequestedLabel: '📸 Vi önskar bilder från dig',
    imagesRequestedNote: 'Vänligen ladda upp relevanta bilder via offertsidan så kan vi ge dig bästa möjliga service.',
  },
  en: {
    subject: (num: string) => `Quote ${num} from Fixco`,
    updatedSubject: (num: string) => `Updated quote ${num} from Fixco`,
    testSubject: (num: string) => `[TEST] Quote ${num} from Fixco`,
    testUpdatedSubject: (num: string) => `[TEST] Updated quote ${num} from Fixco`,
    title: 'Quote from Fixco',
    updatedTitle: 'Updated quote from Fixco',
    quoteNumber: 'Quote number',
    greeting: (name: string) => `Hi ${name}!`,
    intro: 'Thank you for your interest. Your quote is now ready for review.',
    updatedIntro: 'We have updated your quote. Please review the new version below.',
    updatedBanner: (oldNum: string) => `📋 This is an updated quote replacing your previous quote ${oldNum}`,
    work: 'Labour:',
    material: 'Material:',
    discount: 'Discount:',
    vat: 'VAT (25%):',
    rotDeduction: (pct: number) => `ROT deduction (${pct}%):`,
    totalToPay: 'Total to pay:',
    validUntil: 'Valid until:',
    cta: 'View and accept quote',
    footer: 'You can also request changes directly via the link above.',
    regards: 'Kind regards,',
    questionsNote: 'We have also included questions in the quote that we would like you to answer.',
    questionsLabel: 'Our questions for you:',
    imagesRequestedLabel: '📸 We would like photos from you',
    imagesRequestedNote: 'Please upload relevant images via the quote page so we can provide you with the best possible service.',
  },
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, testEmail, copyEmails, isCopy } = await req.json();

    const isTest = !!testEmail;
    const isCopyMode = !!isCopy && Array.isArray(copyEmails) && copyEmails.length > 0;
    console.log(`${isTest ? '🧪 TEST' : isCopyMode ? '📋 COPY' : '📧'} Sending quote email for quoteId:`, quoteId, isTest ? `(override to: ${testEmail})` : isCopyMode ? `(copy to: ${copyEmails.join(', ')})` : '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Hämta offert MED kundinfo via JOIN
    const { data: quote, error: quoteError } = await supabase
      .from('quotes_new')
      .select(`
        *,
        customer:customers!customer_id(id, name, email, phone),
        replaces:replaces_quote_id(number)
      `)
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      console.error("Error fetching quote:", quoteError);
      throw new Error("Kunde inte hämta offerten");
    }

    // Determine locale from quote, fallback to customer preference, then 'sv'
    const locale = (quote.locale || quote.customer?.preferred_locale || 'sv') as 'sv' | 'en';
    const t = quoteCopy[locale] || quoteCopy.sv;

    const customerEmail = quote.customer?.email;
    const customerName = quote.customer?.name;

    if (!customerEmail) {
      console.error("No customer email found for quote:", quoteId);
      throw new Error("Ingen e-postadress hittades för kunden");
    }

    const recipientEmails = isCopyMode ? copyEmails : [isTest ? testEmail : customerEmail];
    console.log("Recipients:", recipientEmails, isTest ? '(TEST override)' : isCopyMode ? '(COPY mode)' : '', "locale:", locale);
    const displayName = customerName || (locale === 'en' ? 'Customer' : 'Kund');
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://fixco.se';
    const publicUrl = `${frontendUrl}/q/${quote.number}/${quote.public_token}`;

    // Check for pending admin questions
    const { data: adminQuestions } = await supabase
      .from('quote_questions')
      .select('question')
      .eq('quote_id', quoteId)
      .eq('asked_by', 'admin')
      .eq('answered', false);

    const hasAdminQuestions = adminQuestions && adminQuestions.length > 0;

    // Check for images_requested meta flag in items
    let hasImagesRequested = false;
    try {
      const items = Array.isArray(quote.items) ? quote.items : JSON.parse(quote.items || '[]');
      const imagesMeta = items.find((item: any) => item.type === '_meta' && item.key === 'images_requested');
      hasImagesRequested = !!imagesMeta?.value;
    } catch (e) {
      console.error('Error parsing items for images_requested:', e);
    }

    // Check if this is a replacement quote
    const isReplacement = !!quote.replaces;
    const oldQuoteNumber = quote.replaces?.number || '';
    const emailTitle = isReplacement ? t.updatedTitle : t.title;
    const emailIntro = isReplacement ? t.updatedIntro : t.intro;

    const updatedBannerHtml = isReplacement ? `
            <div style="background: #dbeafe; padding: 16px; border-radius: 8px; margin: 0 0 16px 0; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; font-weight: 700; color: #1e40af;">${t.updatedBanner(oldQuoteNumber)}</p>
            </div>
    ` : '';

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
            <div class="title">${emailTitle}</div>
            <div style="color:#c7d2fe; font-size: 13px; margin-top:4px;">${t.quoteNumber}: ${quote.number}</div>
          </div>
          
          <div class="card">
            ${updatedBannerHtml}
            <h2>${t.greeting(displayName)}</h2>
            <p>${emailIntro}</p>
            
            <p><strong>${quote.title}</strong></p>
            
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>${t.work}</strong> ${quote.subtotal_work_sek.toLocaleString('sv-SE')} kr</p>
              <p style="margin: 4px 0;"><strong>${t.material}</strong> ${quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr</p>
              ${quote.discount_amount_sek > 0 ? `<p style="margin: 4px 0; color: #059669;"><strong>${t.discount}</strong> -${quote.discount_amount_sek.toLocaleString('sv-SE')} kr</p>` : ''}
              <p style="margin: 4px 0;"><strong>${t.vat}</strong> ${quote.vat_sek.toLocaleString('sv-SE')} kr</p>
              ${quote.rot_deduction_sek > 0 ? `<p style="margin: 4px 0; color: #059669;"><strong>${t.rotDeduction(quote.rot_percentage)}:</strong> -${quote.rot_deduction_sek.toLocaleString('sv-SE')} kr</p>` : ''}
              <p style="margin: 12px 0 4px; font-size: 18px; font-weight: 700;"><strong>${t.totalToPay}</strong> ${quote.total_sek.toLocaleString('sv-SE')} kr</p>
            </div>
            
            ${quote.valid_until ? `<p><strong>${t.validUntil}</strong> ${new Date(quote.valid_until).toLocaleDateString('sv-SE')}</p>` : ''}
            
            ${hasAdminQuestions ? `
            <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #2563eb;">
              <p style="margin: 0 0 8px 0; font-weight: 700; color: #1e40af;">💬 ${t.questionsLabel}</p>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #374151;">${t.questionsNote}</p>
              ${adminQuestions!.map(q => `<p style="margin: 4px 0; font-size: 14px; color: #1e3a5f;">• ${q.question}</p>`).join('')}
            </div>
            ` : ''}
            
            ${hasImagesRequested ? `
            <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0 0 8px 0; font-weight: 700; color: #92400e;">${t.imagesRequestedLabel}</p>
              <p style="margin: 0; font-size: 14px; color: #78350f;">${t.imagesRequestedNote}</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 24px;">
              <a class="cta" href="${publicUrl}" target="_blank" style="display:inline-block;background:#4f46e5;color:#ffffff !important;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;">${t.cta}</a>
            </div>
            
            <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
              ${t.footer}
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 16px;">
            <p>${t.regards}<br><strong>Fixco Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const baseSubject = isTest 
      ? (isReplacement ? t.testUpdatedSubject(quote.number) : t.testSubject(quote.number))
      : (isReplacement ? t.updatedSubject(quote.number) : t.subject(quote.number));
    const emailSubject = isCopyMode ? `[Kopia] ${baseSubject}` : baseSubject;

    const emailResponse = await resend.emails.send({
      from: "Fixco <info@fixco.se>",
      to: recipientEmails,
      subject: emailSubject,
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

    // Uppdatera status (skippa vid test)
    if (!isTest) {
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
    } else {
      console.log('🧪 TEST mode — skipping status update to "sent"');
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
