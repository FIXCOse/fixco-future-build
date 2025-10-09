import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const ct = req.headers.get('content-type') || '';
    
    // Only accept JSON for now
    if (!ct.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Use application/json content-type' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 415,
        }
      );
    }

    const body = await req.json();
    const { 
      name, 
      email, 
      phone, 
      address, 
      service_slug, 
      mode = 'quote', 
      fields = {}, 
      fileUrls = [] 
    } = body;

    console.log('Received request:', { name, email, service_slug, mode });

    // Validate required fields
    if (!email || !service_slug) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email and service_slug' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // 1) Upsert customer
    const { data: customer, error: custErr } = await supabase
      .from('customers')
      .upsert(
        { email, name, phone, address },
        { onConflict: 'email' }
      )
      .select('*')
      .single();

    if (custErr) {
      console.error('Customer error:', custErr);
      throw new Error(`customers.upsert: ${custErr.message}`);
    }

    console.log('Customer upserted:', customer.id);

    // 2) Create booking
    const bookingRow = {
      customer_id: customer.id,
      service_slug,
      mode,
      status: 'new',
      payload: fields,
      file_urls: fileUrls,
    };

    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .insert(bookingRow)
      .select('*')
      .single();

    if (bookErr) {
      console.error('Booking error:', bookErr);
      throw new Error(`bookings.insert: ${bookErr.message}`);
    }

    console.log('Booking created:', booking.id);

    // 3) Create draft quote if mode is 'quote'
    let quoteId = null;
    if (mode === 'quote') {
      const { data: qid, error: rpcErr } = await supabase
        .rpc('create_draft_quote_for_booking', { booking_id: booking.id });

      if (rpcErr) {
        console.error('RPC error:', rpcErr);
        throw new Error(`create_draft_quote_for_booking: ${rpcErr.message}`);
      }

      quoteId = qid;
      console.log('Quote created:', quoteId);
    }

    return new Response(
      JSON.stringify({ 
        ok: true, 
        bookingId: booking.id,
        quoteId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
