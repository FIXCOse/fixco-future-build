import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CATEGORY_PROMPTS: Record<string, { before: string; after: string }> = {
  bathroom: {
    before: "Ultra-realistic photograph of a worn-out Swedish bathroom from the 1970s-1980s era. Yellowed tiles, old bathtub with stains, dated fixtures, cracked grout, fluorescent lighting, linoleum floor showing wear. Natural daylight from a small window. The room looks tired and in desperate need of renovation. Shot with a wide-angle lens, interior photography style, 8K resolution, photorealistic.",
    after: "Transform this exact room into a beautifully renovated modern Scandinavian bathroom. Keep the same room dimensions, window positions, and camera angle. Replace old tiles with clean white large-format tiles, add walk-in rainfall shower with glass partition, floating vanity with wooden accents, LED mirror cabinet, heated towel rail, modern chrome fixtures, recessed spotlights. Bright and airy atmosphere. Interior design magazine quality, 8K resolution, photorealistic."
  },
  kitchen: {
    before: "Ultra-realistic photograph of an outdated Swedish kitchen from the 1970s-1980s. Brown/orange laminate cabinets, old linoleum countertop, yellowed backsplash tiles, dated appliances, poor lighting, worn vinyl floor. Cluttered and cramped feeling. Natural daylight from window. Interior photography, 8K resolution, photorealistic.",
    after: "Transform this exact kitchen into a professionally renovated modern Scandinavian kitchen. Keep the same room layout, window positions, and camera angle. Replace with white handleless cabinets, quartz countertop, subway tile backsplash, integrated LED under-cabinet lighting, stainless steel appliances, wooden breakfast bar, herringbone oak floor. Clean and spacious. Interior design magazine quality, 8K resolution, photorealistic."
  },
  facade: {
    before: "Ultra-realistic photograph of a weathered Swedish house exterior. Faded and peeling paint on wooden siding (panel), cracked window frames, moss on the roof, overgrown garden, dated front door, general neglect visible. Overcast Nordic light. Architectural exterior photography, 8K resolution, photorealistic.",
    after: "Transform this exact house exterior after professional renovation. Keep the same house shape, proportions, and camera angle. Show freshly painted Falu red wooden siding (or modern gray), new white window frames and trim, new front door, clean roof, maintained garden with gravel path, outdoor lighting. Bright Nordic summer light. Architectural photography, 8K resolution, photorealistic."
  },
  wardrobe: {
    before: "Ultra-realistic photograph of an old Swedish hallway or bedroom with outdated storage. Old freestanding wardrobe taking up too much space, cluttered shoes and coats, poor organization, dated wallpaper, cramped feeling. Natural indoor lighting. Interior photography, 8K resolution, photorealistic.",
    after: "Transform this exact room with custom-built sliding door wardrobes. Keep the same room dimensions and camera angle. Show floor-to-ceiling white sliding doors with soft-close mechanism, built-in LED lighting inside, organized shelving and drawers, shoe rack, coat hooks. Clean and spacious feeling. Interior design magazine quality, 8K resolution, photorealistic."
  },
  flooring: {
    before: "Ultra-realistic photograph of a Swedish living room with worn-out flooring. Scratched and faded parquet from the 1970s, gaps between boards, some water damage, dated baseboards. Furniture moved to show the floor condition. Natural daylight. Interior photography, 8K resolution, photorealistic.",
    after: "Transform this exact room with brand new herringbone oak flooring. Keep the same room dimensions, windows, and camera angle. Show beautiful natural wood grain, new white baseboards, floor perfectly level and sealed. Warm Scandinavian interior styling. Interior design magazine quality, 8K resolution, photorealistic."
  },
  painting: {
    before: "Ultra-realistic photograph of a Swedish room interior with tired walls. Yellowed and cracked paint, nail holes, water stains on ceiling, scuffed baseboards, peeling wallpaper in patches. Dated color scheme. Natural indoor lighting. Interior photography, 8K resolution, photorealistic.",
    after: "Transform this exact room after professional painting. Keep the same room layout and camera angle. Show perfectly smooth walls in modern Scandinavian white/light gray, crisp edges where wall meets ceiling, freshly painted baseboards and door frames, clean and bright atmosphere. Interior design magazine quality, 8K resolution, photorealistic."
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { category, style, sourceImageUrl } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const categoryPrompts = CATEGORY_PROMPTS[category];
    if (!categoryPrompts) {
      throw new Error(`Unknown category: ${category}`);
    }

    const prompt = style === 'before' ? categoryPrompts.before : categoryPrompts.after;

    // Build message content: multimodal if sourceImageUrl provided (for after-images)
    let messageContent: any;
    if (sourceImageUrl && style === 'after') {
      messageContent = [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: sourceImageUrl } }
      ];
      console.log(`Generating AFTER image based on source image for category: ${category}`);
    } else {
      messageContent = prompt;
      console.log(`Generating ${style} image from text for category: ${category}`);
    }

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
            messages: [{ role: 'user', content: messageContent }],
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
            return new Response(JSON.stringify({ error: 'AI-krediter slut.' }), {
              status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          if ((response.status === 503 || response.status === 502) && attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt - 1), 5000)));
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
        const base64Data = generatedImage.includes(',') ? generatedImage.split(',')[1] : generatedImage;
        const blob = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        const fileName = `ai-${category}-${style}-${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage
          .from('reference-projects')
          .upload(`ai-generated/${fileName}`, blob, { contentType: 'image/png', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('reference-projects')
          .getPublicUrl(`ai-generated/${fileName}`);

        console.log(`Successfully generated and uploaded: ${publicUrl}`);

        return new Response(JSON.stringify({ url: publicUrl, category, style }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          console.log(`Error on attempt ${attempt}, retrying:`, error);
          await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt - 1), 5000)));
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');

  } catch (error) {
    console.error('AI image generation error:', error);
    return new Response(JSON.stringify({ 
      error: `Kunde inte generera bild: ${error instanceof Error ? error.message : 'Okänt fel'}`
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
