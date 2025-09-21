import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  ns: string;
  key: string;
  svValue: string;
  forceRetranslate?: boolean;
}

// Fixco glossary for consistent terminology
const FIXCO_GLOSSARY: Record<string, string> = {
  'ROT': 'ROT',
  'RUT': 'RUT', 
  'Fixco': 'Fixco',
  'offert': 'quote',
  'offertförfrågan': 'quote request',
  'fastpris': 'fixed price',
  'timpris': 'hourly rate',
  'hembesök': 'home visit',
  'kostnadsfri': 'free',
  'hantverkare': 'craftsman',
  'kvalitetsgaranti': 'quality guarantee',
  'försäkrad': 'insured',
  'garanterad': 'guaranteed',
  'projekttid': 'project time',
  'slutbesiktning': 'final inspection',
  'material': 'materials',
  'arbetskostnad': 'labor cost',
  'moms': 'VAT',
  'miljöbetyg': 'eco score',
  'energieffektiv': 'energy efficient',
  'smarta hem': 'smart home',
  'hemautomation': 'home automation'
};

async function translateWithDeepL(text: string, targetLang: 'EN' | 'SV' = 'EN'): Promise<string> {
  const deeplApiKey = Deno.env.get('DEEPL_API_KEY');
  if (!deeplApiKey) {
    throw new Error('DeepL API key not configured');
  }

  // Apply glossary replacements before translation
  let processedText = text;
  Object.entries(FIXCO_GLOSSARY).forEach(([sv, en]) => {
    const regex = new RegExp(`\\b${sv}\\b`, 'gi');
    if (targetLang === 'EN') {
      processedText = processedText.replace(regex, `<GLOSSARY>${en}</GLOSSARY>`);
    }
  });

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text: processedText,
      source_lang: targetLang === 'EN' ? 'SV' : 'EN',
      target_lang: targetLang,
      preserve_formatting: '1',
      tag_handling: 'xml'
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('DeepL API error:', response.status, errorText);
    throw new Error(`DeepL translation failed: ${response.status}`);
  }

  const result = await response.json();
  let translatedText = result.translations[0].text;

  // Remove glossary tags and restore terms
  translatedText = translatedText.replace(/<GLOSSARY>(.*?)<\/GLOSSARY>/g, '$1');

  return translatedText;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { ns, key, svValue, forceRetranslate = false }: TranslateRequest = await req.json();

    console.log(`Translating: ns=${ns}, key=${key}, force=${forceRetranslate}`);

    // Check if English translation already exists
    if (!forceRetranslate) {
      const { data: existing } = await supabase
        .from('i18n_resources')
        .select('value')
        .eq('ns', ns)
        .eq('key', key)
        .eq('locale', 'en')
        .single();

      if (existing) {
        console.log('Translation already exists, skipping');
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Translation already exists',
          value: existing.value 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Translate Swedish to English
    const enValue = await translateWithDeepL(svValue, 'EN');

    // Store Swedish value (upsert)
    await supabase
      .from('i18n_resources')
      .upsert({
        ns,
        key,
        locale: 'sv',
        value: svValue,
      });

    // Store English translation
    await supabase
      .from('i18n_resources')
      .upsert({
        ns,
        key,
        locale: 'en',
        value: enValue,
      });

    console.log(`Translation completed: "${svValue}" -> "${enValue}"`);

    return new Response(JSON.stringify({ 
      success: true, 
      enValue,
      message: 'Translation completed successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in translate-resource function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});