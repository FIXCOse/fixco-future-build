import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  content_id: string;
  sv_text: string;
  content_type: string;
  styles?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const { content_id, sv_text, content_type, styles }: TranslateRequest = await req.json();
    
    console.log('Translating content:', { content_id, content_type });

    // Translate using Lovable AI (Google Gemini)
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a professional Swedish to English translator for Fixco, a home services company.
            
CRITICAL RULES:
- Translate naturally and professionally
- Keep brand terms unchanged: Fixco, ROT, RUT
- Maintain formatting (line breaks, punctuation)
- Return ONLY the translated text, no explanations
- Use British English spelling
- Keep the same tone and formality level

TERMINOLOGY:
- ROT = ROT deduction (tax deduction for renovation)
- RUT = RUT deduction (tax deduction for household services)
- Offert = Quote
- Boka = Book
- Ring oss = Call us
- Begär offert = Request quote`
          },
          {
            role: 'user',
            content: `Translate this Swedish text to English:\n\n${sv_text}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (aiResponse.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to your workspace.');
      }
      
      throw new Error(`Translation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const en_text = aiData.choices?.[0]?.message?.content?.trim();

    if (!en_text) {
      throw new Error('No translation returned from AI');
    }

    console.log('Translation successful:', { content_id, en_text: en_text.substring(0, 50) + '...' });

    // Save both Swedish and English versions to database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Upsert Swedish version
    const { error: svError } = await supabase
      .from('site_content')
      .upsert({
        content_id,
        content_type,
        value: sv_text,
        styles: styles || {},
        locale: 'sv'
      }, {
        onConflict: 'content_id,locale'
      });

    if (svError) {
      console.error('Error saving Swedish content:', svError);
      throw new Error(`Failed to save Swedish content: ${svError.message}`);
    }

    // Upsert English version
    const { error: enError } = await supabase
      .from('site_content')
      .upsert({
        content_id,
        content_type,
        value: en_text,
        styles: styles || {},
        locale: 'en'
      }, {
        onConflict: 'content_id,locale'
      });

    if (enError) {
      console.error('Error saving English content:', enError);
      throw new Error(`Failed to save English content: ${enError.message}`);
    }

    console.log('Both translations saved successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        sv_text,
        en_text,
        message: 'Content translated and saved for both languages'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
