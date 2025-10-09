import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const bookingData = await req.json();
    console.log('Creating booking with data:', bookingData);

    // Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (bookingError) {
      console.error('Booking error:', bookingError);
      throw bookingError;
    }

    console.log('Booking created:', booking.id);

    // If mode is 'quote', create draft quote
    let quoteId = null;
    if (booking.mode === 'quote') {
      console.log('Creating draft quote for booking:', booking.id);
      
      // Generate quote number
      const { data: quoteNumber } = await supabase.rpc('generate_quote_number_new');
      const { data: publicToken } = await supabase.rpc('generate_public_token');

      const { data: quote, error: quoteError } = await supabase
        .from('quotes_new')
        .insert({
          customer_id: booking.customer_id,
          request_id: booking.id,
          number: quoteNumber,
          public_token: publicToken,
          title: booking.service_name || 'Offert',
          description: booking.description,
          status: 'draft',
          customer_name: booking.contact_name,
          customer_email: booking.contact_email,
          customer_phone: booking.contact_phone,
          customer_address: booking.address,
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          line_items: [],
          subtotal: 0,
          tax_rate: 0.25,
          tax_amount: 0,
          total_amount: 0
        })
        .select()
        .single();

      if (quoteError) {
        console.error('Quote error:', quoteError);
      } else {
        quoteId = quote?.id;
        console.log('Quote created:', quoteId);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        bookingId: booking.id,
        quoteId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
