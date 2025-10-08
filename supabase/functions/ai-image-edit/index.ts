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
    const { image, instruction } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Retry logic for transient errors
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} of ${maxRetries}`);
        
        // Call Lovable AI image editing (Nano Banana)
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Redigera denna bild: ${instruction}. 
                           Behåll rumsstrukturen och perspektivet. 
                           Gör realistiska förändringar som matchar svensk byggstandard och estetik.`
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: image // base64 eller URL
                    }
                  }
                ]
              }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI gateway error (attempt ${attempt}):`, response.status, errorText);
          
          if (response.status === 429) {
            return new Response(JSON.stringify({ 
              error: 'Rate limit nådd. Försök igen om en stund.' 
            }), {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          if (response.status === 402) {
            return new Response(JSON.stringify({ 
              error: 'AI-krediter slut. Kontakta support.' 
            }), {
              status: 402,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          // Retry on 503 or 502 (gateway errors)
          if ((response.status === 503 || response.status === 502) && attempt < maxRetries) {
            const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          throw new Error(`AI gateway error: ${response.status}`);
        }

        const data = await response.json();
        console.log('AI response:', JSON.stringify(data));
        
        const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!generatedImage) {
          console.error('No image in response. Full data:', JSON.stringify(data));
          throw new Error('AI kunde inte generera bild. Försök med en enklare beskrivning eller en annan bild.');
        }

        // Upload to Supabase Storage
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Convert base64 to blob
        const base64Data = generatedImage.split(',')[1];
        const blob = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        const fileName = `ai-edit-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('reference-projects')
          .upload(`ai-generated/${fileName}`, blob, {
            contentType: 'image/png',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase
          .storage
          .from('reference-projects')
          .getPublicUrl(`ai-generated/${fileName}`);

        return new Response(JSON.stringify({ 
          url: publicUrl 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`Error on attempt ${attempt}, waiting ${waitTime}ms before retry:`, error);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    // If we got here, all retries failed
    throw lastError || new Error('All retry attempts failed');


  } catch (error) {
    console.error('AI image edit final error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Okänt fel uppstod';
    
    return new Response(JSON.stringify({ 
      error: `Kunde inte generera bild: ${errorMessage}. Tjänsten kan vara temporärt otillgänglig, försök igen om en stund.`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
