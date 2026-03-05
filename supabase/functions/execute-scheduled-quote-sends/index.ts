import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Find all pending scheduled sends that are due
    const { data: pending, error: fetchError } = await supabase
      .from('scheduled_quote_sends')
      .select('id, quote_id')
      .eq('executed', false)
      .eq('cancelled', false)
      .lte('scheduled_for', new Date().toISOString());

    if (fetchError) {
      console.error('Error fetching scheduled sends:', fetchError);
      throw fetchError;
    }

    if (!pending || pending.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Processing ${pending.length} scheduled quote send(s)...`);

    let processed = 0;
    const errors: string[] = [];

    for (const item of pending) {
      try {
        // Call send-quote-email-new internally
        const sendRes = await fetch(
          `${supabaseUrl}/functions/v1/send-quote-email-new`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({ quoteId: item.quote_id }),
          }
        );

        const sendResult = await sendRes.json();

        if (sendResult.success) {
          // Mark as executed
          await supabase
            .from('scheduled_quote_sends')
            .update({ executed: true, executed_at: new Date().toISOString() })
            .eq('id', item.id);
          
          processed++;
          console.log(`✅ Sent scheduled quote ${item.quote_id}`);

          // Send confirmation email to admin
          try {
            const { data: quote } = await supabase
              .from('quotes_new')
              .select('number, title, customer:customers!customer_id(name, email)')
              .eq('id', item.quote_id)
              .single();

            const custName = quote?.customer?.name || 'Okänd kund';
            const custEmail = quote?.customer?.email || 'okänd';
            const quoteNum = quote?.number || item.quote_id;
            const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });

            await resend.emails.send({
              from: "Fixco <info@fixco.se>",
              to: ["imedashviliomar@gmail.com"],
              subject: `✅ Offert ${quoteNum} skickad till ${custName}`,
              html: `<p>Hej Omar!</p>
<p>Det schemalagda offertmailet har skickats:</p>
<ul>
  <li><strong>Offert:</strong> ${quoteNum} – ${quote?.title || ''}</li>
  <li><strong>Kund:</strong> ${custName} (${custEmail})</li>
  <li><strong>Skickat:</strong> ${now}</li>
</ul>
<p>/ Fixco System</p>`,
            });
            console.log(`📧 Admin confirmation sent for quote ${quoteNum}`);
          } catch (confirmErr) {
            console.error('Failed to send admin confirmation:', confirmErr);
          }
        } else {
          console.error(`❌ Failed to send quote ${item.quote_id}:`, sendResult.error);
          errors.push(`Quote ${item.quote_id}: ${sendResult.error}`);
        }
      } catch (err) {
        console.error(`❌ Error processing scheduled send ${item.id}:`, err);
        errors.push(`Item ${item.id}: ${err.message}`);
      }
    }

    return new Response(JSON.stringify({ processed, errors }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in execute-scheduled-quote-sends:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
