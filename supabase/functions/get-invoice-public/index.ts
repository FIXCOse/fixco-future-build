import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token är obligatoriskt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[get-invoice-public] Looking up invoice with token: ${token}`);

    const { data: invoice, error: invoiceError } = await supabaseService
      .from("invoices")
      .select(`
        id,
        invoice_number,
        status,
        issue_date,
        due_date,
        line_items,
        subtotal,
        discount_amount,
        vat_amount,
        total_amount,
        pdf_url,
        paid_at,
        customer_id
      `)
      .eq("public_token", token)
      .maybeSingle();

    if (invoiceError) {
      console.error("[get-invoice-public] Error fetching invoice:", invoiceError);
      return new Response(
        JSON.stringify({ error: "Kunde inte hämta faktura" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!invoice) {
      console.log("[get-invoice-public] Invoice not found");
      return new Response(
        JSON.stringify({ error: "Fakturan hittades inte" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch customer data
    let customer = null;
    if (invoice.customer_id) {
      const { data: customerData } = await supabaseService
        .from("profiles")
        .select("first_name, last_name, email, phone, full_name, company_name, org_number")
        .eq("id", invoice.customer_id)
        .maybeSingle();

      if (customerData) {
        customer = {
          name: customerData.full_name || 
                `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim() || 
                customerData.email,
          email: customerData.email,
          phone: customerData.phone,
          company_name: customerData.company_name,
          org_number: customerData.org_number
        };
      }
    }

    // Auto-update status from draft to sent when first viewed
    if (invoice.status === "draft") {
      console.log(`[get-invoice-public] Updating invoice ${invoice.id} status to sent`);
      await supabaseService
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", invoice.id);
      
      invoice.status = "sent";
    }

    console.log(`[get-invoice-public] Successfully fetched invoice ${invoice.invoice_number}`);

    return new Response(
      JSON.stringify({
        invoice,
        customer
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[get-invoice-public] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Ett oväntat fel inträffade" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});