import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  id?: string;
  sv_path?: string;
  sv_json: any;
  type: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!DEEPL_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { id, sv_path, sv_json, type }: TranslateRequest = await req.json();
    
    console.log('Translating content:', { id, sv_path, type });

    // Get existing content record
    let contentQuery = supabase.from('content').select('*');
    if (id) {
      contentQuery = contentQuery.eq('id', id);
    } else if (sv_path) {
      contentQuery = contentQuery.eq('sv_path', sv_path);
    } else {
      throw new Error('Either id or sv_path is required');
    }

    const { data: existingContent, error: fetchError } = await contentQuery.single();
    
    if (fetchError) {
      throw new Error(`Failed to fetch content: ${fetchError.message}`);
    }

    // Check if content is locked
    if (existingContent.en_status === 'locked') {
      console.log('Content is locked, skipping translation');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Content is locked and cannot be auto-translated' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DeepL Glossary for Fixco terms
    const glossaryTerms = {
      'ROT': 'ROT deduction',
      'RUT': 'RUT deduction', 
      'Offert': 'Quote',
      'Fastpris': 'Fixed price',
      'Timpris': 'Hourly rate',
      'Jour': 'Emergency service',
      'BRF': 'Housing co-op (BRF)',
      'Hemtjänst': 'Home services',
      'Hantverkare': 'Craftsmen',
      'Fixco': 'Fixco',
      'Begär offert': 'Request quote',
      'Boka nu': 'Book now',
      'Ring oss': 'Call us'
    };

    // Translate text function using DeepL
    const translateText = async (text: string): Promise<string> => {
      if (!text || typeof text !== 'string') return text;
      
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          source_lang: 'SV',
          target_lang: 'EN',
          formality: 'default'
        }),
      });

      if (!response.ok) {
        console.error('DeepL API error:', await response.text());
        throw new Error(`DeepL translation failed: ${response.status}`);
      }

      const result = await response.json();
      return result.translations[0].text;
    };

    // Recursively translate JSON object
    const translateObject = async (obj: any): Promise<any> => {
      if (typeof obj === 'string') {
        return await translateText(obj);
      } else if (Array.isArray(obj)) {
        return await Promise.all(obj.map(translateObject));
      } else if (obj && typeof obj === 'object') {
        const translated: any = {};
        for (const [key, value] of Object.entries(obj)) {
          translated[key] = await translateObject(value);
        }
        return translated;
      }
      return obj;
    };

    // Translate the Swedish JSON
    const en_draft_json = await translateObject(sv_json);

    // Update the content record
    const { error: updateError } = await supabase
      .from('content')
      .update({
        en_draft_json,
        en_status: 'needs_review',
        changed_at: new Date().toISOString(),
        version: existingContent.version + 1
      })
      .eq('id', existingContent.id);

    if (updateError) {
      throw new Error(`Failed to update content: ${updateError.message}`);
    }

    console.log('Translation completed successfully for:', existingContent.sv_path);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Content translated successfully',
        en_draft_json
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