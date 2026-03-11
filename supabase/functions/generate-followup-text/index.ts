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

    let systemPrompt: string;

    if (type === 'subject') {
      systemPrompt = isEn
        ? `You are a copywriter for Fixco, a Swedish construction & handyman company. Write a short, friendly subject line (max 50 chars) for a follow-up email about a quote. Natural and personal — not salesy. Reply ONLY with the subject line, nothing else.`
        : `Du är copywriter för Fixco, ett svenskt hantverksföretag. Skriv en kort, vänlig ämnesrad (max 50 tecken) för ett uppföljningsmail om en offert. Ämnesraden ska kännas naturlig och personlig — inte säljig. Svara BARA med ämnesraden, inget annat.`;
    } else {
      systemPrompt = isEn
        ? `You write on behalf of Fixco, a Swedish construction & handyman company. Write a short follow-up email (max 6-8 sentences) to a customer who received a quote.

Tone:
- Friendly and professional, with clear urgency — the schedule is filling up fast
- NOT salesy or pushy, but the customer should feel it's smart to act soon
- Short and to the point

STRICT RULES (NEVER break these):
- NEVER mention the quote's title or name in the text (e.g. "Quote – Carpenter Tyresö")
- NEVER write email addresses in parentheses — write e.g. "reply to this email" or "email us at info@fixco.se"
- Do NOT mention specific amounts, prices or ROT deductions (they're already in the quote)
- NEVER include any email address (e.g. info@fixco.se) in the text — it's already in the sender field
- No clichés like "make your dreams come true", "generations of craftsmanship", etc.

Content:
- Greet and mention you'd like to follow up on the quote they received
- Create urgency: mention the schedule is filling up fast for spring/the season, that planning ahead is important, and it's wise to secure their spot
- Mention that if anything needs adjusting or they have questions, they can reply directly to this email or write via the quote page
- End with a clear call to action to review the quote and get back to you

Write ONLY the body text (plain text, no HTML tags). Use line breaks for readability. Start with "Hi ${customerName}!" and end with "Best regards,\nThe Fixco Team".`
        : `Du skriver på uppdrag av Fixco, ett svenskt hantverksföretag. Skriv ett kort uppföljningsmail (max 6-8 meningar) till en kund som fått en offert.

Tonläge:
- Vänlig och professionell, men med tydlig urgency — schemat fylls på snabbt
- INTE säljigt eller skrämmande, men kunden ska känna att det är smart att agera snart
- Kort och rakt på sak

STRIKTA REGLER (bryt ALDRIG dessa):
- Nämn ALDRIG offertens titel, namn eller rubrik i texten (t.ex. "Offert – Snickare Tyresö")
- Skriv ALDRIG e-postadresser inom parentes — skriv t.ex. "svara på detta mail till info@fixco.se" eller "maila oss på info@fixco.se"
- Nämn INTE specifika belopp, priser eller ROT-avdrag (det finns redan i offerten)
- Inkludera ALDRIG någon e-postadress (t.ex. info@fixco.se) i texten — den finns redan i mailets avsändarfält
- Inga klyschor som "förverkliga drömmar", "hantverk i generationer", "hantverksstolthet" etc.

Innehåll:
- Hälsa och nämn att du vill stämma av kring offerten de fått
- Skapa urgency: nämn att schemat fylls på snabbt inför våren/säsongen, att ni behöver planera i god tid, och att det är klokt att säkra sin plats
- Nämn att om något behöver justeras eller om kunden har frågor kan de svara direkt på detta mail eller skriva via offertsidan
- Avsluta med en tydlig uppmaning att kika på offerten och återkomma

Skriv BARA brödtexten (ren text, inga HTML-taggar). Använd radbrytningar för läsbarhet. Börja med "Hej ${customerName}!" och avsluta med "Med vänliga hälsningar,\nFixco-teamet".`;
    }

    // Append admin instructions if provided
    if (adminInstructions) {
      systemPrompt += `\n\nADMIN INSTRUCTIONS (follow these closely):\n${adminInstructions}`;
    }

    const userPrompt = type === 'subject'
      ? `${isEn ? 'Customer name' : 'Kundnamn'}: ${customerName}. ${isEn ? 'Quote' : 'Offert'}: "${quoteTitle}". ${isEn ? 'Total' : 'Totalt'}: ${totalSek} kr.`
      : `${isEn ? 'Customer name' : 'Kundnamn'}: ${customerName}
${isEn ? 'Quote title' : 'Offertens titel'}: "${quoteTitle}"
${isEn ? 'Total amount' : 'Totalt belopp'}: ${totalSek} kr
${quote.rot_deduction_sek > 0 ? `ROT-${isEn ? 'deduction' : 'avdrag'}: ${quote.rot_deduction_sek?.toLocaleString('sv-SE')} kr` : ''}
${quote.valid_until ? `${isEn ? 'Valid until' : 'Giltig till'}: ${new Date(quote.valid_until).toLocaleDateString(isEn ? 'en-GB' : 'sv-SE')}` : ''}`;

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
    console.error("Error in generate-followup-text:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Kunde inte generera text" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
