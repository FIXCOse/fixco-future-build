import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationKey {
  namespace: string;
  key: string;
  default_text: string;
  checksum: string;
}

interface DeepLResponse {
  translations: Array<{
    text: string;
    detected_source_language: string;
  }>;
}

const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY');
const DEEPL_GLOSSARY_ID = Deno.env.get('DEEPL_GLOSSARY_ID');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function translateWithDeepL(texts: string[], targetLang: string = 'EN'): Promise<string[]> {
  if (!DEEPL_API_KEY) {
    console.error('DEEPL_API_KEY not configured');
    return texts; // Return original texts as fallback
  }

  try {
    const formData = new FormData();
    
    texts.forEach(text => {
      formData.append('text', text);
    });
    
    formData.append('target_lang', targetLang);
    formData.append('source_lang', 'SV');
    formData.append('preserve_formatting', '1');
    
    if (DEEPL_GLOSSARY_ID) {
      formData.append('glossary_id', DEEPL_GLOSSARY_ID);
    }

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepL API error:', response.status, errorText);
      return texts; // Return original texts as fallback
    }

    const data: DeepLResponse = await response.json();
    return data.translations.map(t => t.text);
  } catch (error) {
    console.error('Translation error:', error);
    return texts; // Return original texts as fallback
  }
}

async function upsertTranslationKeys(keys: TranslationKey[]) {
  const { data, error } = await supabase
    .from('translation_keys')
    .upsert(
      keys.map(k => ({
        namespace: k.namespace,
        key: k.key,
        default_text: k.default_text,
        checksum: k.checksum,
        updated_at: new Date().toISOString()
      })),
      { 
        onConflict: 'namespace,key',
        ignoreDuplicates: false 
      }
    )
    .select();

  if (error) {
    console.error('Error upserting translation keys:', error);
    throw error;
  }

  return data;
}

async function getKeysNeedingTranslation(keys: TranslationKey[]) {
  // Get existing translations
  const { data: existingTranslations } = await supabase
    .from('translation_locales')
    .select(`
      translation_keys!inner(namespace, key, checksum),
      locale,
      text,
      status
    `)
    .eq('locale', 'en');

  const existingMap = new Map();
  existingTranslations?.forEach(t => {
    const key = `${t.translation_keys.namespace}.${t.translation_keys.key}`;
    existingMap.set(key, {
      checksum: t.translation_keys.checksum,
      text: t.text,
      status: t.status
    });
  });

  return keys.filter(k => {
    const keyId = `${k.namespace}.${k.key}`;
    const existing = existingMap.get(keyId);
    
    // Need translation if:
    // 1. No English translation exists
    // 2. Checksum changed (Swedish text updated) and not locked
    return !existing || 
           (existing.checksum !== k.checksum && existing.status !== 'locked');
  });
}

async function saveTranslations(keysToTranslate: TranslationKey[], translations: string[]) {
  // First get the key IDs
  const { data: keyData } = await supabase
    .from('translation_keys')
    .select('id, namespace, key')
    .in('namespace', [...new Set(keysToTranslate.map(k => k.namespace))])
    .in('key', [...new Set(keysToTranslate.map(k => k.key))]);

  if (!keyData) return;

  const keyMap = new Map();
  keyData.forEach(k => {
    keyMap.set(`${k.namespace}.${k.key}`, k.id);
  });

  const translationRecords = keysToTranslate.map((k, index) => {
    const keyId = keyMap.get(`${k.namespace}.${k.key}`);
    if (!keyId) return null;

    return {
      key_id: keyId,
      locale: 'en',
      text: translations[index] || k.default_text, // Fallback to Swedish if translation failed
      status: 'auto',
      updated_at: new Date().toISOString()
    };
  }).filter(Boolean);

  const { error } = await supabase
    .from('translation_locales')
    .upsert(translationRecords, { 
      onConflict: 'key_id,locale',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('Error saving translations:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { keys }: { keys: TranslationKey[] } = await req.json();

    if (!Array.isArray(keys) || keys.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid keys array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing ${keys.length} translation keys`);

    // Step 1: Upsert all keys (Swedish defaults)
    await upsertTranslationKeys(keys);

    // Step 2: Find keys that need English translation
    const keysNeedingTranslation = await getKeysNeedingTranslation(keys);
    
    console.log(`${keysNeedingTranslation.length} keys need translation`);

    if (keysNeedingTranslation.length > 0) {
      // Step 3: Translate with DeepL (batch)
      const textsToTranslate = keysNeedingTranslation.map(k => k.default_text);
      const translations = await translateWithDeepL(textsToTranslate);

      // Step 4: Save translations
      await saveTranslations(keysNeedingTranslation, translations);
    }

    return new Response(JSON.stringify({ 
      success: true,
      processed: keys.length,
      translated: keysNeedingTranslation.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Translation ingest error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});