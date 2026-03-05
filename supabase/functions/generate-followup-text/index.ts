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
    const { quoteId, type } = await req.json(); // type: 'body' | 'subject'
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: quote, error: quoteError } = await supabase
      .from('quotes_new')
      .select(`*, customer:customers!customer_id(id, name, email, phone)`)
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) throw new Error("Kunde inte hämta offerten");

    const customerName = quote.customer?.name || 'Kund';
    const quoteTitle = quote.title || 'Offert';
    const totalSek = quote.total_sek?.toLocaleString('sv-SE') || '0';

    const systemPrompt = type === 'subject'
      ? `Du är copywriter för Fixco, ett svenskt hantverksföretag. Skriv en kort, säljande ämnesrad (max 60 tecken) för ett uppföljningsmail om en offert. Ämnesraden ska vara personlig, skapa nyfikenhet och uppmuntra kunden att öppna mailet. Svara BARA med ämnesraden, inget annat.`
      : `Du är copywriter för Fixco, ett svenskt hantverksföretag som erbjuder hantverkstjänster av högsta kvalitet. 

Skriv ett uppföljningsmail till en kund som har fått en offert. Texten ska vara:
- Extremt säljande och övertygande
- Professionell men varm och personlig
- Skapa en känsla av att kunden gör helt rätt val genom att välja Fixco
- Betona kvalitet, trygghet och professionalism
- Nämna att kunden kan ställa frågor via mail (info@fixco.se) eller direkt på offertsidan
- Nämna att de kan begära ändringar om något inte stämmer
- Skapa viss brådska utan att vara påträngande
- Avsluta med en tydlig uppmaning att granska offerten

Skriv BARA brödtexten (ren text, inga HTML-taggar). Använd radbrytningar för läsbarhet. Börja med "Hej ${customerName}!" och avsluta med "Med vänliga hälsningar, Fixco-teamet".`;

    const userPrompt = type === 'subject'
      ? `Kundnamn: ${customerName}. Offert: "${quoteTitle}". Totalt: ${totalSek} kr.`
      : `Kundnamn: ${customerName}
Offertens titel: "${quoteTitle}"
Totalt belopp: ${totalSek} kr
${quote.rot_deduction_sek > 0 ? `ROT-avdrag: ${quote.rot_deduction_sek?.toLocaleString('sv-SE')} kr (kunden sparar pengar!)` : ''}
${quote.valid_until ? `Giltig till: ${new Date(quote.valid_until).toLocaleDateString('sv-SE')}` : ''}`;

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
