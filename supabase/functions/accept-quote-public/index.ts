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
    const url = new URL(req.url);
    const token = url.pathname.split('/').pop();
    
    // Get body for signature
    const body = req.method === 'POST' ? await req.json() : {};
    const { signature_name, terms_accepted } = body;

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token saknas' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hämta offert med token
    const { data: quote, error: fetchError } = await supabase
      .from('quotes_new')
      .select('id, status, valid_until, customer_id, title, accepted_at, deleted_at')
      .eq('public_token', token)
      .single();

    if (fetchError || !quote) {
      console.error('Quote not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Offert hittades inte' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hämta customer för att få user_id
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, user_id')
      .eq('id', quote.customer_id)
      .maybeSingle();
    
    if (customerError) {
      console.error('Error fetching customer:', customerError);
    }

    // Kontrollera om offerten är raderad
    if ((quote as any).deleted_at) {
      return new Response(
        JSON.stringify({ error: 'deleted', message: 'Denna offert har raderats och kan inte accepteras' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validera giltighet
    if (quote.valid_until && new Date(quote.valid_until) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'expired', message: 'Offerten har gått ut' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Om redan accepterad (men inte pending_reaccept)
    if (quote.status === 'accepted') {
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('quote_id', quote.id)
        .maybeSingle();

      console.log('Quote already accepted, project and job should exist');

      return new Response(
        JSON.stringify({ ok: true, already: true, projectId: existingProject?.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Om pending_reaccept - uppdatera bara status, skippa projekt-skapande
    if (quote.status === 'pending_reaccept') {
      const updateData: any = {
        status: 'accepted',
        accepted_at: new Date().toISOString()
      };

      if (signature_name) {
        updateData.signature_name = signature_name;
        updateData.signature_date = new Date().toISOString();
      }
      
      if (terms_accepted !== undefined) {
        updateData.terms_accepted = terms_accepted;
      }

      const { error: updateError } = await supabase
        .from('quotes_new')
        .update(updateData)
        .eq('id', quote.id);

      if (updateError) {
        console.error('Failed to update quote:', updateError);
        throw new Error('Kunde inte uppdatera offert');
      }

      // Hämta befintligt projekt
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('quote_id', quote.id)
        .maybeSingle();

      console.log('Quote re-accepted, project already exists');

      return new Response(
        JSON.stringify({ ok: true, reaccepted: true, projectId: existingProject?.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sätt status accepterad med signatur och villkor
    const updateData: any = {
      status: 'accepted',
      accepted_at: new Date().toISOString()
    };

    if (signature_name) {
      updateData.signature_name = signature_name;
      updateData.signature_date = new Date().toISOString();
    }
    
    if (terms_accepted !== undefined) {
      updateData.terms_accepted = terms_accepted;
    }

    const { error: updateError } = await supabase
      .from('quotes_new')
      .update(updateData)
      .eq('id', quote.id);

    if (updateError) {
      console.error('Failed to update quote:', updateError);
      throw new Error('Kunde inte uppdatera offert');
    }

    // Skapa projekt med korrekt customer_id (user_id från customers table)
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        quote_id: quote.id,
        customer_id: customer?.user_id || null,
        title: quote.title,
        status: 'pending'
      })
      .select('id')
      .single();

    if (projectError) {
      console.error('Failed to create project:', projectError);
      console.error('Project error details:', JSON.stringify(projectError, null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'project_creation_failed',
          message: 'Offerten accepterades men projektet kunde inte skapas. Vi kontaktar dig inom kort.',
          projectId: null
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Jobbet skapas automatiskt av trigger när status ändras till 'accepted'
    console.log('Project created, job will be created automatically by trigger');

    return new Response(
      JSON.stringify({ ok: true, projectId: project.id }),
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
