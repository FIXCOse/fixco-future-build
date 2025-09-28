import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  service_id?: string;
  text_to_translate?: string;
  target_lang?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting translation request...');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const deepLApiKey = Deno.env.get('DEEPL_API_KEY');
    
    if (!deepLApiKey) {
      console.error('DEEPL_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Translation service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { service_id, text_to_translate, target_lang = 'EN' }: TranslateRequest = await req.json();

    let result;

    if (service_id) {
      // Translate a specific service
      result = await translateService(supabase, deepLApiKey, service_id);
    } else if (text_to_translate) {
      // Translate arbitrary text
      result = await translateText(deepLApiKey, text_to_translate, target_lang);
    } else {
      return new Response(
        JSON.stringify({ error: 'Either service_id or text_to_translate is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in translate-service function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function translateService(supabase: any, deepLApiKey: string, serviceId: string) {
  console.log(`Translating service: ${serviceId}`);

  // Get the service from database
  const { data: service, error: fetchError } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single();

  if (fetchError || !service) {
    throw new Error(`Service not found: ${serviceId}`);
  }

  // Skip if already translated
  if (service.title_en && service.description_en && service.translation_status === 'completed') {
    console.log(`Service ${serviceId} already translated`);
    return { message: 'Service already translated', service };
  }

  // Mark as translation in progress
  await supabase
    .from('services')
    .update({ translation_status: 'pending' })
    .eq('id', serviceId);

  try {
    // Translate title and description
    const [titleTranslation, descriptionTranslation] = await Promise.all([
      translateText(deepLApiKey, service.title_sv, 'EN'),
      translateText(deepLApiKey, service.description_sv, 'EN')
    ]);

    // Update service with translations
    const { error: updateError } = await supabase
      .from('services')
      .update({
        title_en: titleTranslation.translated_text,
        description_en: descriptionTranslation.translated_text,
        translation_status: 'completed'
      })
      .eq('id', serviceId);

    if (updateError) {
      throw new Error(`Failed to update service: ${updateError.message}`);
    }

    console.log(`Successfully translated service: ${serviceId}`);
    return {
      message: 'Service translated successfully',
      service_id: serviceId,
      translations: {
        title: titleTranslation.translated_text,
        description: descriptionTranslation.translated_text
      }
    };

  } catch (translationError) {
    console.error(`Translation failed for service ${serviceId}:`, translationError);
    
    // Mark as failed
    await supabase
      .from('services')
      .update({ translation_status: 'failed' })
      .eq('id', serviceId);

    throw translationError;
  }
}

async function translateText(deepLApiKey: string, text: string, targetLang: string) {
  console.log(`Translating text: "${text.substring(0, 50)}..." to ${targetLang}`);

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${deepLApiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'text': text,
      'target_lang': targetLang,
      'source_lang': 'SV'
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('DeepL API error:', response.status, errorText);
    throw new Error(`DeepL API error: ${response.status}`);
  }

  const data = await response.json();
  const translatedText = data.translations[0].text;
  
  console.log(`Translation completed: "${translatedText.substring(0, 50)}..."`);
  
  return {
    original_text: text,
    translated_text: translatedText,
    source_lang: 'SV',
    target_lang: targetLang
  };
}