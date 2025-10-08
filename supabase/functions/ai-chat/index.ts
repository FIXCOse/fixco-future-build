import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, tools } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Initialize Supabase client for tool calls
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Define available tools
    const availableTools = [
      {
        type: "function",
        function: {
          name: "get_services",
          description: "Hämtar alla aktiva tjänster från databasen med priser och beskrivningar",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        }
      },
      {
        type: "function",
        function: {
          name: "estimate_quote",
          description: "Beräknar preliminär offert med ROT-avdrag. ROT är 30% på arbetskostnad (ej material).",
          parameters: {
            type: "object",
            properties: {
              serviceName: { type: "string", description: "Namn på tjänsten" },
              quantity: { type: "number", description: "Antal timmar eller m²" },
              unit: { type: "string", enum: ["timme", "m²", "löpmeter", "st"], description: "Enhet" },
              materialSek: { type: "number", description: "Materialkostnad i kr" },
              hourlySek: { type: "number", description: "Timpris eller m²-pris i kr" },
              rotEligible: { type: "boolean", description: "Om tjänsten är ROT-berättigad" }
            },
            required: ["serviceName", "quantity", "unit"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "create_lead",
          description: "Sparar kontaktinformation och intresse som en lead i databasen",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "Kundens namn" },
              email: { type: "string", description: "E-postadress" },
              phone: { type: "string", description: "Telefonnummer" },
              address: { type: "string", description: "Adress" },
              message: { type: "string", description: "Meddelande eller beskrivning" },
              serviceInterest: { type: "string", description: "Vilken tjänst kunden är intresserad av" },
              estimatedQuote: { type: "object", description: "Beräknad offert om tillgänglig" }
            },
            required: []
          }
        }
      }
    ];

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        tools: availableTools,
        tool_choice: 'auto'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0].message;

    // Handle tool calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolResults = [];

      for (const toolCall of message.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        console.log(`Executing tool: ${functionName}`, args);

        let result;
        switch (functionName) {
          case 'get_services':
            const { data: services, error: servicesError } = await supabase
              .from('services')
              .select('*')
              .eq('is_active', true)
              .order('sort_order');
            
            if (servicesError) throw servicesError;
            result = services;
            break;

          case 'estimate_quote':
            const hourly = args.hourlySek ?? 950;
            const work = hourly * args.quantity;
            const material = args.materialSek ?? 0;
            const subtotal = work + material;
            const vat = subtotal * 0.25;
            const totalInclVat = subtotal + vat;
            const rotEligible = args.rotEligible ?? true;
            const rotDeduction = rotEligible ? Math.round(work * 0.30) : 0;
            const totalAfterRot = Math.max(0, totalInclVat - rotDeduction);

            result = {
              serviceName: args.serviceName,
              quantity: args.quantity,
              unit: args.unit,
              workSek: Math.round(work),
              materialSek: Math.round(material),
              subtotalSek: Math.round(subtotal),
              vatSek: Math.round(vat),
              totalInclVatSek: Math.round(totalInclVat),
              rotDeductionSek: rotDeduction,
              totalAfterRotSek: Math.round(totalAfterRot),
              rotEligible
            };
            break;

          case 'create_lead':
            const { data: lead, error: leadError } = await supabase
              .from('leads')
              .insert({
                name: args.name,
                email: args.email,
                phone: args.phone,
                address: args.address,
                message: args.message,
                service_interest: args.serviceInterest,
                estimated_quote: args.estimatedQuote,
                source: 'ai_concierge'
              })
              .select()
              .single();

            if (leadError) throw leadError;
            result = { success: true, leadId: lead.id };
            break;

          default:
            result = { error: `Unknown tool: ${functionName}` };
        }

        toolResults.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(result)
        });
      }

      // Call AI again with tool results
      const followUpMessages = [
        ...messages,
        message,
        ...toolResults
      ];

      const followUpResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: followUpMessages
        }),
      });

      if (!followUpResponse.ok) {
        throw new Error(`AI follow-up error: ${followUpResponse.status}`);
      }

      const followUpData = await followUpResponse.json();
      return new Response(JSON.stringify({
        messages: [followUpData.choices[0].message]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      content: message.content,
      messages: [message]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
