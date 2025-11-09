import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  project_id: string;
}

interface TranslateBulkRequest {
  project_ids?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => r.role === 'admin' || r.role === 'owner');
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json() as TranslateRequest | TranslateBulkRequest;
    const deeplApiKey = Deno.env.get('DEEPL_API_KEY');

    if (!deeplApiKey) {
      throw new Error('DEEPL_API_KEY not configured');
    }

    // Helper function to translate text
    const translateText = async (text: string): Promise<string> => {
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: [text],
          source_lang: 'SV',
          target_lang: 'EN-US',
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepL API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.translations[0].text;
    };

    // Helper function to translate a single project
    const translateProject = async (projectId: string) => {
      console.log(`Translating project ${projectId}...`);

      // Fetch project Swedish data
      const { data: project, error: fetchError } = await supabaseClient
        .from('reference_projects')
        .select('title_sv, description_sv, location_sv, category_sv, features_sv')
        .eq('id', projectId)
        .single();

      if (fetchError || !project) {
        throw new Error(`Failed to fetch project: ${fetchError?.message}`);
      }

      // Translate all fields
      const [title_en, description_en, location_en, category_en] = await Promise.all([
        translateText(project.title_sv),
        translateText(project.description_sv),
        translateText(project.location_sv),
        translateText(project.category_sv),
      ]);

      // Translate features array
      const features_en = project.features_sv
        ? await Promise.all(project.features_sv.map((f: string) => translateText(f)))
        : [];

      // Update project with English translations
      const { error: updateError } = await supabaseClient
        .from('reference_projects')
        .update({
          title_en,
          description_en,
          location_en,
          category_en,
          features_en,
        })
        .eq('id', projectId);

      if (updateError) {
        throw new Error(`Failed to update project: ${updateError.message}`);
      }

      console.log(`✓ Project ${projectId} translated successfully`);
      return {
        project_id: projectId,
        success: true,
      };
    };

    // Handle single project translation
    if ('project_id' in body && body.project_id) {
      const result = await translateProject(body.project_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle bulk translation
    if ('project_ids' in body) {
      let projectIds = body.project_ids;

      // If no IDs provided, get all projects without English translations
      if (!projectIds || projectIds.length === 0) {
        const { data: projects, error: fetchError } = await supabaseClient
          .from('reference_projects')
          .select('id')
          .is('title_en', null)
          .eq('is_active', true);

        if (fetchError) {
          throw new Error(`Failed to fetch projects: ${fetchError.message}`);
        }

        projectIds = projects?.map(p => p.id) || [];
      }

      console.log(`Starting bulk translation of ${projectIds.length} projects...`);

      // Translate projects one by one to avoid rate limits
      const results = [];
      for (const projectId of projectIds) {
        try {
          const result = await translateProject(projectId);
          results.push(result);
          // Small delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to translate project ${projectId}:`, error);
          results.push({
            project_id: projectId,
            success: false,
            error: error.message,
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      console.log(`Bulk translation completed: ${successCount}/${projectIds.length} successful`);

      return new Response(JSON.stringify({
        total: projectIds.length,
        successful: successCount,
        failed: projectIds.length - successCount,
        results,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
