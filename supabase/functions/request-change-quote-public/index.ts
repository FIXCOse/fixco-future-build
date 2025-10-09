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
    const formData = await req.formData();
    const token = formData.get('token') as string;
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];

    if (!token || !message) {
      return new Response(
        JSON.stringify({ error: 'Token och meddelande krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hitta offert via token
    const { data: quote, error: quoteError } = await supabase
      .from('quotes_new')
      .select('id')
      .eq('public_token', token)
      .single();

    if (quoteError || !quote) {
      return new Response(
        JSON.stringify({ error: 'Offert hittades inte' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ladda upp filer till storage
    const fileUrls: string[] = [];
    for (const file of files) {
      if (file.size > 0) {
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('quote-messages')
          .upload(`${quote.id}/${fileName}`, file);

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('quote-messages')
            .getPublicUrl(uploadData.path);
          fileUrls.push(publicUrl);
        }
      }
    }

    // Skapa meddelande
    const { error: messageError } = await supabase
      .from('quote_messages')
      .insert({
        quote_id: quote.id,
        author: 'customer',
        message,
        files: fileUrls
      });

    if (messageError) {
      console.error('Failed to create message:', messageError);
      throw new Error('Kunde inte skapa meddelande');
    }

    // Uppdatera offert status
    const { error: updateError } = await supabase
      .from('quotes_new')
      .update({
        status: 'change_requested',
        change_req_at: new Date().toISOString()
      })
      .eq('id', quote.id);

    if (updateError) {
      console.error('Failed to update quote:', updateError);
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
