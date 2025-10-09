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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Räkna offerter
    const { count: changeRequestedCount } = await supabase
      .from('quotes_new')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'change_requested');

    const { count: acceptedQuotesCount } = await supabase
      .from('quotes_new')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'accepted');

    // Räkna projekt
    const { count: pendingProjectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: scheduledProjectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled');

    // Hämta senaste 10 notifications
    const { data: changeRequests } = await supabase
      .from('quotes_new')
      .select('id, number, title, change_req_at')
      .eq('status', 'change_requested')
      .order('change_req_at', { ascending: false })
      .limit(5);

    const { data: acceptedQuotes } = await supabase
      .from('quotes_new')
      .select('id, number, title, accepted_at')
      .eq('status', 'accepted')
      .order('accepted_at', { ascending: false })
      .limit(5);

    const notifications = [
      ...(changeRequests || []).map(q => ({
        type: 'change_requested',
        id: q.id,
        title: `Ändring begärd: ${q.title}`,
        number: q.number,
        timestamp: q.change_req_at,
        link: `/admin/quotes?status=change_requested`
      })),
      ...(acceptedQuotes || []).map(q => ({
        type: 'accepted',
        id: q.id,
        title: `Offert accepterad: ${q.title}`,
        number: q.number,
        timestamp: q.accepted_at,
        link: `/admin/ongoing-projects`
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    const counts = {
      changeRequested: changeRequestedCount || 0,
      acceptedQuotes: acceptedQuotesCount || 0,
      pendingProjects: pendingProjectsCount || 0,
      scheduledProjects: scheduledProjectsCount || 0,
      total: (changeRequestedCount || 0) + (acceptedQuotesCount || 0) + 
             (pendingProjectsCount || 0) + (scheduledProjectsCount || 0)
    };

    return new Response(
      JSON.stringify({ counts, notifications }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Serverfel', counts: {}, notifications: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
