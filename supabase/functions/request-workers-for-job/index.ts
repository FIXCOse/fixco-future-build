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

    const { jobId, workerIds, message } = await req.json();

    if (!jobId || !workerIds || !Array.isArray(workerIds)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: jobId, workerIds' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating job requests for job ${jobId} with ${workerIds.length} workers (using user_id directly)`);

    // Create job_requests for each worker - workerIds are user_id (auth.uid())
    const requests = workerIds.map((workerId: string) => ({
      job_id: jobId,
      worker_id: workerId, // Changed from staff_id - now uses user_id directly
      message: message || 'Du har fått en ny jobbförfrågan',
      status: 'pending',
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48h
    }));

    const { error } = await supabase.from('job_requests').insert(requests);

    if (error) {
      console.error('Error creating job requests:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created ${requests.length} job requests for job ${jobId}`);

    return new Response(
      JSON.stringify({ success: true, count: requests.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in request-workers-for-job:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
