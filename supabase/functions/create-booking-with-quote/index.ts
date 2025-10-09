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
    let payload: any = {};
    let fileUrls: string[] = [];

    if (ct.includes('application/json')) {
      payload = await req.json();
      fileUrls = payload.fileUrls ?? [];
      console.log('JSON payload received:', payload);
    } else if (ct.includes('multipart/form-data')) {
      const form = await req.formData();
      payload = {
        name: form.get('name') ?? '',
        email: form.get('email') ?? '',
        phone: form.get('phone') ?? '',
        address: form.get('address') ?? '',
        city: form.get('city') ?? '',
        postal_code: form.get('postal_code') ?? '',
        service_id: form.get('service_id') ?? '',
        service_name: form.get('service_name') ?? '',
        mode: form.get('mode') ?? 'quote',
        description: form.get('description') ?? '',
        fields: JSON.parse(String(form.get('fields') ?? '{}')),
      };

      // Upload files to storage
      const files = form.getAll('files') as File[];
      for (const f of files) {
        const path = `bookings/${crypto.randomUUID()}_${f.name}`;
        const buf = new Uint8Array(await f.arrayBuffer());
        const { data, error } = await supabase.storage
          .from('booking-attachments')
          .upload(path, buf, { contentType: f.type, upsert: false });
        if (error) {
          console.error('File upload error:', error);
          throw error;
        }
        const { data: pub } = supabase.storage.from('booking-attachments').getPublicUrl(data.path);
        fileUrls.push(pub.publicUrl);
      }
      console.log('Multipart payload received:', payload);
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported Content-Type' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 415,
      });
    }

    // Ensure customer exists
    let customerId = payload.customer_id;
    if (!customerId && payload.email) {
      const { data: cust, error: custErr } = await supabase
        .from('customers')
        .upsert(
          { 
            email: payload.email, 
            name: payload.name || payload.contact_name, 
            phone: payload.phone || payload.contact_phone,
            address: payload.address 
          },
          { onConflict: 'email' }
        )
        .select('*')
        .single();
      
      if (custErr) {
        console.error('Customer upsert error:', custErr);
      } else {
        customerId = cust.id;
      }
    }

    // Create booking
    const bookingRow = {
      customer_id: customerId,
      service_id: payload.service_id || payload.service_slug,
      service_name: payload.service_name,
      mode: payload.mode ?? 'quote',
      status: payload.mode === 'book' ? 'pending' : 'new',
      contact_name: payload.name || payload.contact_name,
      contact_email: payload.email || payload.contact_email,
      contact_phone: payload.phone || payload.contact_phone,
      name: payload.name || payload.contact_name,
      email: payload.email || payload.contact_email,
      phone: payload.phone || payload.contact_phone,
      address: payload.address,
      city: payload.city,
      postal_code: payload.postal_code,
      description: payload.description || payload.beskrivning || '',
      price_type: payload.price_type || 'fixed',
      base_price: payload.base_price || 0,
      final_price: payload.final_price || 0,
      rot_eligible: payload.rot_eligible !== undefined ? payload.rot_eligible : true,
      payload: payload.fields || payload.payload || {},
      source: payload.source || 'service_page'
    };

    console.log('Creating booking with data:', bookingRow);

    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert(bookingRow)
      .select('*')
      .single();

    if (bookingErr) {
      console.error('Booking insert error:', bookingErr);
      throw bookingErr;
    }

    console.log('Booking created successfully:', booking.id);

    // Create draft quote if mode is 'quote'
    let quoteId = null;
    if (booking.mode === 'quote') {
      console.log('Creating draft quote for booking:', booking.id);
      
      try {
        const { data: quoteData, error: quoteErr } = await supabase
          .rpc('create_draft_quote_for_booking', { p_booking_id: booking.id });

        if (quoteErr) {
          console.error('Quote RPC error:', quoteErr);
        } else {
          quoteId = quoteData;
          console.log('Draft quote created:', quoteId);
        }
      } catch (rpcError) {
        console.error('RPC call failed:', rpcError);
      }
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
    console.error('Error in create-booking-with-quote:', error);
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
