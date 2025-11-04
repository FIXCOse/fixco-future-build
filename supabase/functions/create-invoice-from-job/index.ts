import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get the job ID and optional custom data from the request
    const { 
      jobId, 
      customerId,
      lineItems,
      discountType,
      discountValue,
      discountAmount,
      vatEnabled,
      vatAmount,
      subtotal,
      totalAmount,
      customerNotes,
      internalNotes,
      paymentTerms
    } = await req.json();

    if (!jobId) {
      throw new Error("Job ID is required");
    }

    console.log("Creating invoice for job:", jobId);

    // If custom line items provided, use them; otherwise get from job
    let finalLineItems = lineItems;
    let finalSubtotal = subtotal;
    let finalVatAmount = vatAmount;
    let finalTotalAmount = totalAmount;
    let finalDiscountAmount = discountAmount || 0;

    // Get job details to find source
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('source_type, source_id')
      .eq('id', jobId)
      .single();

    if (jobError) {
      console.error("Error fetching job:", jobError);
      throw jobError;
    }

    console.log("Job source:", job?.source_type, job?.source_id);

    if (!finalLineItems || finalLineItems.length === 0) {
      // Get invoice data from the job
      const { data: invoiceData, error: invoiceError } = await supabaseAdmin
        .rpc('prepare_invoice_from_job', { p_job_id: jobId });

      if (invoiceError) {
        console.error("Error preparing invoice data:", invoiceError);
        throw invoiceError;
      }

      console.log("Invoice data prepared:", invoiceData);

      // Calculate totals
      finalSubtotal = invoiceData.subtotal || 0;
      const vatPercent = vatEnabled !== false ? 25 : 0; // Swedish VAT
      finalVatAmount = finalSubtotal * (vatPercent / 100);
      finalTotalAmount = finalSubtotal + finalVatAmount;

      // Create line items
      finalLineItems = [];

      // Add labor/time line item
      if (invoiceData.pricing_mode === 'hourly' && invoiceData.hours > 0) {
        finalLineItems.push({
          description: 'Arbetstimmar',
          quantity: invoiceData.hours,
          unit_price: invoiceData.hourly_rate || 0,
          amount: invoiceData.hours * (invoiceData.hourly_rate || 0)
        });
      } else if (invoiceData.pricing_mode === 'fixed') {
        finalLineItems.push({
          description: 'Arbete (fast pris)',
          quantity: 1,
          unit_price: invoiceData.fixed_price || 0,
          amount: invoiceData.fixed_price || 0
        });
      }

      // Add materials line item if any
      if (invoiceData.materials > 0) {
        finalLineItems.push({
          description: 'Material och delar',
          quantity: 1,
          unit_price: invoiceData.materials,
          amount: invoiceData.materials
        });
      }

      // Add expenses line item if any
      if (invoiceData.expenses > 0) {
        finalLineItems.push({
          description: 'Utlägg och övriga kostnader',
          quantity: 1,
          unit_price: invoiceData.expenses,
          amount: invoiceData.expenses
        });
      }
    }

    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    // Generate public token for sharing
    const publicToken = crypto.randomUUID();

    // Prepare invoice record data
    const invoiceData: any = {
      invoice_number: invoiceNumber,
      customer_id: customerId,
      // Set relationship based on job source
      quote_id: job?.source_type === 'quote' ? job.source_id : null,
      booking_id: job?.source_type === 'booking' ? job.source_id : null,
      subtotal: finalSubtotal,
      vat_amount: finalVatAmount,
      total_amount: finalTotalAmount,
      discount_amount: finalDiscountAmount,
      line_items: finalLineItems,
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      rot_amount: 0,
      rut_amount: 0,
      public_token: publicToken
    };

    // Create the invoice record
    const { data: invoice, error: createError } = await supabaseAdmin
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single();

    if (createError) {
      console.error("Error creating invoice:", createError);
      throw createError;
    }

    console.log("Invoice created successfully:", invoice.id);

    // Update job status to invoiced
    const { error: jobUpdateError } = await supabaseAdmin
      .from('jobs')
      .update({ status: 'invoiced' })
      .eq('id', jobId);

    if (jobUpdateError) {
      console.error("Failed to update job status:", jobUpdateError);
      // Don't throw - invoice was created successfully
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        invoice: invoice
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in create-invoice-from-job:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});