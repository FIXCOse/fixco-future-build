import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CATEGORY_PROMPTS: Record<string, { before: string; after: string }> = {
  bathroom: {
    before: "Ultra-realistic photograph of a worn-out Swedish bathroom from the 1970s-1980s era. Yellowed tiles, old bathtub with stains, dated fixtures, cracked grout, fluorescent lighting, linoleum floor showing wear. Natural daylight from a small window. The room looks tired and in desperate need of renovation. Shot with a wide-angle lens, interior photography style, 8K resolution, photorealistic.",
    after: "Ultra-realistic photograph of a beautifully renovated modern Scandinavian bathroom. Clean white large-format tiles, walk-in rainfall shower with glass partition, floating vanity with wooden accents, LED mirror cabinet, heated towel rail, underfloor heating, modern chrome fixtures, recessed spotlights. Same room dimensions and window position. Bright and airy atmosphere. Interior design magazine quality, 8K resolution, photorealistic."
  },
  kitchen: {
    before: "Ultra-realistic photograph of an outdated Swedish kitchen from the 1970s-1980s. Brown/orange laminate cabinets, old linoleum countertop, yellowed backsplash tiles, dated appliances, poor lighting, worn vinyl floor. Cluttered and cramped feeling. Natural daylight from window. Interior photography, 8K resolution, photorealistic.",
    after: "Ultra-realistic photograph of a professionally renovated modern Scandinavian kitchen. White handleless cabinets, quartz countertop, subway tile backsplash, integrated LED under-cabinet lighting, stainless steel appliances, wooden breakfast bar, herringbone oak floor. Same room layout and window. Clean and spacious. Interior design magazine quality, 8K resolution, photorealistic."
  },
  facade: {
    before: "Ultra-realistic photograph of a weathered Swedish house exterior. Faded and peeling paint on wooden siding (panel), cracked window frames, moss on the roof, overgrown garden, dated front door, general neglect visible. Overcast Nordic light. Architectural exterior photography, 8K resolution, photorealistic.",
    after: "Ultra-realistic photograph of the same Swedish house after professional renovation. Freshly painted Falu red wooden siding (or modern gray), new white window frames and trim, new front door, clean roof, maintained garden with gravel path, outdoor lighting. Same house shape and proportions. Bright Nordic summer light. Architectural photography, 8K resolution, photorealistic."
  },
  wardrobe: {
    before: "Ultra-realistic photograph of an old Swedish hallway or bedroom with outdated storage. Old freestanding wardrobe taking up too much space, cluttered shoes and coats, poor organization, dated wallpaper, cramped feeling. Natural indoor lighting. Interior photography, 8K resolution, photorealistic.",
    after: "Ultra-realistic photograph of the same hallway or bedroom with custom-built sliding door wardrobes. Floor-to-ceiling white sliding doors with soft-close mechanism, built-in LED lighting inside, organized shelving and drawers, shoe rack, coat hooks. Clean and spacious feeling. Same room dimensions. Interior design magazine quality, 8K resolution, photorealistic."
  },
  flooring: {
    before: "Ultra-realistic photograph of a Swedish living room with worn-out flooring. Scratched and faded parquet from the 1970s, gaps between boards, some water damage, dated baseboards. Furniture moved to show the floor condition. Natural daylight. Interior photography, 8K resolution, photorealistic.",
    after: "Ultra-realistic photograph of the same Swedish living room with brand new herringbone oak flooring. Beautiful natural wood grain, new white baseboards, floor perfectly level and sealed. Same room dimensions and windows. Warm Scandinavian interior styling. Interior design magazine quality, 8K resolution, photorealistic."
  },
  painting: {
    before: "Ultra-realistic photograph of a Swedish room interior with tired walls. Yellowed and cracked paint, nail holes, water stains on ceiling, scuffed baseboards, peeling wallpaper in patches. Dated color scheme. Natural indoor lighting. Interior photography, 8K resolution, photorealistic.",
    after: "Ultra-realistic photograph of the same room after professional painting. Perfectly smooth walls in modern Scandinavian white/light gray, crisp edges where wall meets ceiling, freshly painted baseboards and door frames, clean and bright atmosphere. Same room layout. Interior design magazine quality, 8K resolution, photorealistic."
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { category, style, customPrompt } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build prompt
    let prompt: string;
    if (customPrompt) {
      prompt = customPrompt;
    } else {
      const categoryPrompts = CATEGORY_PROMPTS[category];
      if (!categoryPrompts) {
        throw new Error(`Unknown category: ${category}. Available: ${Object.keys(CATEGORY_PROMPTS).join(', ')}`);
      }
      prompt = style === 'before' ? categoryPrompts.before : categoryPrompts.after;
    }

    console.log(`Generating ${style} image for category: ${category}`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);

    // Call AI Gateway with Pro model for best quality
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-3-pro-image-preview',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI gateway error (attempt ${attempt}):`, response.status, errorText);
          
          if (response.status === 429) {
            return new Response(JSON.stringify({ error: 'Rate limit nådd. Försök igen om en stund.' }), {
              status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          if (response.status === 402) {
            return new Response(JSON.stringify({ error: 'AI-krediter slut. Lägg till krediter i Settings → Workspace → Usage.' }), {
              status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          if ((response.status === 503 || response.status === 502) && attempt < maxRetries) {
            const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          throw new Error(`AI gateway error: ${response.status}`);
        }

        const data = await response.json();
        const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!generatedImage) {
          console.error('No image in response:', JSON.stringify(data).substring(0, 500));
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          throw new Error('AI kunde inte generera bild. Försök igen.');
        }

        // Upload to Supabase Storage
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        const base64Data = generatedImage.includes(',') 
          ? generatedImage.split(',')[1] 
          : generatedImage;
        const blob = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        const fileName = `ai-${category}-${style}-${Date.now()}.png`;
        const { error: uploadError } = await supabase
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

        console.log(`Successfully generated and uploaded: ${publicUrl}`);

        return new Response(JSON.stringify({ 
          url: publicUrl,
          category,
          style 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`Error on attempt ${attempt}, retrying in ${waitTime}ms:`, error);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');

  } catch (error) {
    console.error('AI image generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Okänt fel';
    
    return new Response(JSON.stringify({ 
      error: `Kunde inte generera bild: ${errorMessage}`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
