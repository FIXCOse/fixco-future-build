import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { quoteId } = await req.json();

    if (!quoteId) {
      return new Response(
        JSON.stringify({ error: 'quoteId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch quote with customer info
    const { data: quote, error: quoteError } = await supabase
      .from('quotes_new')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      return new Response(
        JSON.stringify({ error: 'Quote not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if quote is accepted
    if (quote.status !== 'accepted') {
      return new Response(
        JSON.stringify({ error: 'Quote must be accepted before creating invoice' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invoice already exists for this quote
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('id')
      .eq('quote_id', quoteId)
      .single();

    if (existingInvoice) {
      return new Response(
        JSON.stringify({ error: 'Invoice already exists for this quote', invoiceId: existingInvoice.id }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate invoice number
    const { data: lastInvoice } = await supabase
      .from('invoices')
      .select('invoice_number')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let invoiceNumber = 'INV-2025-0001';
    if (lastInvoice?.invoice_number) {
      const match = lastInvoice.invoice_number.match(/INV-(\d{4})-(\d{4})/);
      if (match) {
        const year = new Date().getFullYear();
        const lastNum = parseInt(match[2]);
        const newNum = (lastNum + 1).toString().padStart(4, '0');
        invoiceNumber = `INV-${year}-${newNum}`;
      }
    }

    // Calculate due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        quote_id: quoteId,
        booking_id: quote.source_booking_id,
        customer_id: quote.customer_id,
        organization_id: quote.organization_id,
        invoice_number: invoiceNumber,
        status: 'draft',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        line_items: quote.line_items,
        subtotal: quote.subtotal_work_sek + quote.subtotal_mat_sek,
        discount_amount: quote.discount_sek || 0,
        rot_amount: quote.rot_deduction_sek || 0,
        rut_amount: quote.rut_deduction_sek || 0,
        vat_amount: (quote.subtotal_work_sek + quote.subtotal_mat_sek - (quote.discount_sek || 0)) * 0.25,
        total_amount: quote.total_sek,
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      return new Response(
        JSON.stringify({ error: invoiceError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log event
    await supabase.from('events').insert({
      event_type: 'invoice_created',
      event_data: {
        invoice_id: invoice.id,
        quote_id: quoteId,
        invoice_number: invoiceNumber,
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        invoiceId: invoice.id,
        invoiceNumber: invoiceNumber 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
