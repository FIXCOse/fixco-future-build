import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify caller is authenticated admin/owner
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
    if (!roles?.some((r: any) => ['admin', 'owner'].includes(r.role))) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { quoteId, type, locale: requestLocale, adminInstructions } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { data: quote, error: quoteError } = await supabase
      .from('quotes_new')
      .select(`*, customer:customers!customer_id(id, name, email, phone)`)
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) throw new Error("Kunde inte hämta offerten");

    const lang = requestLocale || quote.locale || 'sv';
    const isEn = lang === 'en';
    const customerName = quote.customer?.name || (isEn ? 'Customer' : 'Kund');
    const quoteTitle = quote.title || (isEn ? 'Quote' : 'Offert');
    const totalSek = quote.total_sek?.toLocaleString('sv-SE') || '0';
    
    // Calculate days until expiry
    let daysUntilExpiry: number | null = null;
    if (quote.valid_until) {
      const validDate = new Date(quote.valid_until);
      const now = new Date();
      daysUntilExpiry = Math.ceil((validDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    let systemPrompt: string;

    if (type === 'subject') {
      systemPrompt = isEn
        ? `You are a copywriter for Fixco, a Swedish construction & handyman company. Write a short subject line (max 50 chars) for a REMINDER email about a quote the customer hasn't responded to yet. It should clearly signal "reminder" — not a new email or follow-up. Reply ONLY with the subject line, nothing else. Start with "Reminder:" or similar.`
        : `Du är copywriter för Fixco, ett svenskt hantverksföretag. Skriv en kort ämnesrad (max 50 tecken) för ett PÅMINNELSEMAIL om en offert som kunden inte svarat på ännu. Det ska tydligt signalera "påminnelse" — inte ett nytt mail eller uppföljning. Svara BARA med ämnesraden, inget annat. Börja med "Påminnelse:" eller liknande.`;
    } else {
      const expiryContext = daysUntilExpiry !== null
        ? (isEn 
            ? `The quote expires in ${daysUntilExpiry} days (${new Date(quote.valid_until).toLocaleDateString('en-GB')}).`
            : `Offerten går ut om ${daysUntilExpiry} dagar (${new Date(quote.valid_until).toLocaleDateString('sv-SE')}).`)
        : '';

      systemPrompt = isEn
        ? `You write on behalf of Fixco, a Swedish construction & handyman company. Write a short REMINDER email (max 5-6 sentences) to a customer who received a quote but hasn't responded.

This is a REMINDER, not a follow-up. The tone should be:
- Direct and clear — "we want to remind you about your quote"
- Helpful, not pushy — offer to answer questions
- Create natural urgency if the quote has an expiry date
${expiryContext ? `- ${expiryContext} Mention this clearly.` : ''}

STRICT RULES (NEVER break these):
- NEVER mention the quote's title or name in the text
- NEVER write email addresses in the text — they're in the sender field
- Do NOT mention specific amounts, prices or ROT deductions
- No clichés

Content:
- Start by reminding them about the quote they received
${daysUntilExpiry !== null && daysUntilExpiry <= 14 ? '- Emphasize the quote expires soon and they should act quickly' : '- Mention the quote has a validity period'}
- Offer to answer any questions — they can reply to this email
- End with a clear call to action to review and respond

Write ONLY the body text (plain text, no HTML). Use line breaks. Start with "Hi ${customerName}!" and end with "Best regards,\\nThe Fixco Team".`
        : `Du skriver på uppdrag av Fixco, ett svenskt hantverksföretag. Skriv ett kort PÅMINNELSEMAIL (max 5-6 meningar) till en kund som fått en offert men inte svarat.

Detta är en PÅMINNELSE, inte en uppföljning. Tonen ska vara:
- Direkt och tydlig — "vi vill påminna dig om din offert"
- Hjälpsam, inte pushig — erbjud att svara på frågor
- Skapa naturlig urgency om offerten har ett utgångsdatum
${expiryContext ? `- ${expiryContext} Nämn detta tydligt.` : ''}

STRIKTA REGLER (bryt ALDRIG dessa):
- Nämn ALDRIG offertens titel eller namn i texten
- Skriv ALDRIG e-postadresser i texten — de finns i avsändarfältet
- Nämn INTE specifika belopp, priser eller ROT-avdrag
- Inga klyschor

Innehåll:
- Börja med att påminna om offerten de fått
${daysUntilExpiry !== null && daysUntilExpiry <= 14 ? '- Betona att offerten snart går ut och att de bör agera snabbt' : '- Nämn att offerten har en giltighetstid'}
- Erbjud att svara på frågor — de kan svara direkt på mailet
- Avsluta med en tydlig uppmaning att titta på offerten och återkomma

Skriv BARA brödtexten (ren text, inga HTML-taggar). Använd radbrytningar. Börja med "Hej ${customerName}!" och avsluta med "Med vänliga hälsningar,\\nFixco-teamet".`;
    }

    // Append admin instructions if provided
    if (adminInstructions) {
      systemPrompt += `\n\nADMIN INSTRUCTIONS (follow these closely):\n${adminInstructions}`;
    }

    const userPrompt = type === 'subject'
      ? `${isEn ? 'Customer name' : 'Kundnamn'}: ${customerName}. ${isEn ? 'Quote' : 'Offert'}: "${quoteTitle}". ${isEn ? 'Total' : 'Totalt'}: ${totalSek} kr.${daysUntilExpiry !== null ? ` ${isEn ? 'Expires in' : 'Går ut om'} ${daysUntilExpiry} ${isEn ? 'days' : 'dagar'}.` : ''}`
      : `${isEn ? 'Customer name' : 'Kundnamn'}: ${customerName}
${isEn ? 'Quote title' : 'Offertens titel'}: "${quoteTitle}"
${isEn ? 'Total amount' : 'Totalt belopp'}: ${totalSek} kr
${quote.rot_deduction_sek > 0 ? `ROT-${isEn ? 'deduction' : 'avdrag'}: ${quote.rot_deduction_sek?.toLocaleString('sv-SE')} kr` : ''}
${quote.valid_until ? `${isEn ? 'Valid until' : 'Giltig till'}: ${new Date(quote.valid_until).toLocaleDateString(isEn ? 'en-GB' : 'sv-SE')}` : ''}
${daysUntilExpiry !== null ? `${isEn ? 'Days until expiry' : 'Dagar till utgång'}: ${daysUntilExpiry}` : ''}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "För många förfrågningar, vänta en stund." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI-krediter slut." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error: " + response.status);
    }

    const result = await response.json();
    const generatedText = result.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ success: true, text: generatedText }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in generate-reminder-text:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Kunde inte generera text" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
