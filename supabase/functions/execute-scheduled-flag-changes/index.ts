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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔍 Checking for scheduled flag changes...');

    // Hitta alla scheduled changes som ska köras nu
    const { data: scheduledChanges, error: fetchError } = await supabase
      .from('scheduled_feature_flag_changes')
      .select('*')
      .lte('scheduled_for', new Date().toISOString())
      .eq('executed', false)
      .eq('cancelled', false);

    if (fetchError) {
      console.error('Error fetching scheduled changes:', fetchError);
      throw fetchError;
    }

    if (!scheduledChanges || scheduledChanges.length === 0) {
      console.log('✅ No scheduled changes to execute');
      return new Response(
        JSON.stringify({ message: 'No scheduled changes', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`📋 Found ${scheduledChanges.length} scheduled changes to execute`);

    const results = [];
    
    for (const change of scheduledChanges) {
      try {
        console.log(`🔧 Executing: ${change.flag_key} → ${change.target_enabled ? 'ENABLED' : 'DISABLED'}`);
        
        // Kör toggle_feature_flag function
        const { error: toggleError } = await supabase.rpc('toggle_feature_flag', {
          flag_key: change.flag_key,
          new_enabled: change.target_enabled,
          change_reason: `Scheduled change executed: ${change.reason || 'No reason provided'}`
        });

        if (toggleError) {
          console.error(`❌ Failed to toggle ${change.flag_key}:`, toggleError);
          results.push({ id: change.id, success: false, error: toggleError.message });
          continue;
        }

        // Markera som executed
        const { error: updateError } = await supabase
          .from('scheduled_feature_flag_changes')
          .update({ 
            executed: true, 
            executed_at: new Date().toISOString() 
          })
          .eq('id', change.id);

        if (updateError) {
          console.error(`⚠️ Failed to mark ${change.id} as executed:`, updateError);
        }

        console.log(`✅ Successfully executed: ${change.flag_key}`);
        results.push({ id: change.id, success: true, flag_key: change.flag_key });
        
      } catch (err) {
        console.error(`❌ Error executing change ${change.id}:`, err);
        results.push({ id: change.id, success: false, error: String(err) });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`🎉 Executed ${successCount}/${scheduledChanges.length} scheduled changes`);

    return new Response(
      JSON.stringify({ 
        message: `Executed ${successCount}/${scheduledChanges.length} scheduled changes`,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('💥 Fatal error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
