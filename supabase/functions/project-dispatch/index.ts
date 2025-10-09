import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, strategy, workerId, notes } = await req.json();

    if (!projectId || !strategy) {
      return new Response(
        JSON.stringify({ error: 'projectId och strategy krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (strategy === 'manual' && !workerId) {
      return new Response(
        JSON.stringify({ error: 'workerId krävs för manuell tilldelning' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const dispatchStatus = strategy === 'manual' ? 'assigned' : 'invited';

    // Skapa dispatch queue entry
    const { error: dispatchError } = await supabase
      .from('dispatch_queue')
      .insert({
        project_id: projectId,
        strategy,
        status: dispatchStatus,
        notes
      });

    if (dispatchError) {
      console.error('Failed to create dispatch:', dispatchError);
      throw new Error('Kunde inte skapa dispatch');
    }

    // Om manuell tilldelning, uppdatera projekt
    if (strategy === 'manual' && workerId) {
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          assigned_to: workerId,
          status: 'assigned'
        })
        .eq('id', projectId);

      if (projectError) {
        console.error('Failed to assign project:', projectError);
        throw new Error('Kunde inte tilldela projekt');
      }
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Serverfel' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
