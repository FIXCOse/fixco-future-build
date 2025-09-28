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

    // Get the job ID from the request
    const { jobId, customerId } = await req.json();

    if (!jobId) {
      throw new Error("Job ID is required");
    }

    console.log("Creating invoice for job:", jobId);

    // Get invoice data from the job
    const { data: invoiceData, error: invoiceError } = await supabaseAdmin
      .rpc('prepare_invoice_from_job', { p_job_id: jobId });

    if (invoiceError) {
      console.error("Error preparing invoice data:", invoiceError);
      throw invoiceError;
    }

    console.log("Invoice data prepared:", invoiceData);

    // Calculate totals
    const subtotal = invoiceData.subtotal || 0;
    const vatPercent = 25; // Swedish VAT
    const vatAmount = subtotal * (vatPercent / 100);
    const totalAmount = subtotal + vatAmount;

    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Create line items
    const lineItems = [];

    // Add labor/time line item
    if (invoiceData.pricing_mode === 'hourly' && invoiceData.hours > 0) {
      lineItems.push({
        type: 'labor',
        description: 'Arbetstimmar',
        quantity: invoiceData.hours,
        unit_price: invoiceData.hourly_rate || 0,
        total: invoiceData.hours * (invoiceData.hourly_rate || 0)
      });
    } else if (invoiceData.pricing_mode === 'fixed') {
      lineItems.push({
        type: 'labor',
        description: 'Arbete (fast pris)',
        quantity: 1,
        unit_price: invoiceData.fixed_price || 0,
        total: invoiceData.fixed_price || 0
      });
    }

    // Add materials line item if any
    if (invoiceData.materials > 0) {
      lineItems.push({
        type: 'materials',
        description: 'Material och delar',
        quantity: 1,
        unit_price: invoiceData.materials,
        total: invoiceData.materials
      });
    }

    // Add expenses line item if any
    if (invoiceData.expenses > 0) {
      lineItems.push({
        type: 'expenses',
        description: 'Utlägg och övriga kostnader',
        quantity: 1,
        unit_price: invoiceData.expenses,
        total: invoiceData.expenses
      });
    }

    // Create the invoice record
    const { data: invoice, error: createError } = await supabaseAdmin
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        customer_id: customerId,
        subtotal: subtotal,
        vat_amount: vatAmount,
        total_amount: totalAmount,
        line_items: lineItems,
        status: 'draft',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        rot_amount: invoiceData.rot_rut?.rot_amount || 0,
        rut_amount: invoiceData.rot_rut?.rut_amount || 0
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating invoice:", createError);
      throw createError;
    }

    console.log("Invoice created successfully:", invoice.id);

    // Update job status to invoiced
    await supabaseAdmin
      .from('jobs')
      .update({ status: 'invoiced' })
      .eq('id', jobId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        invoice: invoice,
        invoiceData: invoiceData
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