import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  rot_eligible: boolean;
  rut_eligible: boolean;
  labor_share: number;
}

interface CreateQuoteRequest {
  propertyId: string;
  organizationId?: string;
  title: string;
  description?: string;
  lineItems: LineItem[];
  validDays?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseServiceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Unauthorized");
    }

    const user = userData.user;
    const requestData: CreateQuoteRequest = await req.json();

    console.log("Creating quote for user:", user.id);
    console.log("Request data:", requestData);

    // Validate required fields
    if (!requestData.propertyId || !requestData.title || !requestData.lineItems?.length) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify property ownership
    const { data: property, error: propertyError } = await supabaseClient
      .from('properties')
      .select('*')
      .eq('id', requestData.propertyId)
      .single();

    if (propertyError || !property) {
      return new Response(
        JSON.stringify({ error: "Property not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate totals
    const subtotal = requestData.lineItems.reduce((sum, item) => sum + item.total_price, 0);
    
    // Apply discounts
    let discountPercent = 0;
    
    // Check for organization discounts
    if (requestData.organizationId) {
      const { data: org } = await supabaseClient
        .from('organizations')
        .select('contract_discount')
        .eq('id', requestData.organizationId)
        .single();
      
      if (org) {
        discountPercent = Number(org.contract_discount) || 0;
      }
    }

    // Check for loyalty discounts
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('loyalty_tier')
      .eq('id', user.id)
      .single();

    if (profile) {
      const loyaltyDiscounts = {
        bronze: 0,
        silver: 5,
        gold: 10,
        platinum: 15
      };
      const loyaltyDiscount = loyaltyDiscounts[profile.loyalty_tier as keyof typeof loyaltyDiscounts] || 0;
      discountPercent = Math.max(discountPercent, loyaltyDiscount);
    }

    const discountAmount = (subtotal * discountPercent) / 100;
    const discountedTotal = subtotal - discountAmount;

    // Calculate ROT/RUT amounts
    let rotAmount = 0;
    let rutAmount = 0;

    requestData.lineItems.forEach(item => {
      const itemDiscountedPrice = item.total_price * (1 - discountPercent / 100);
      
      if (item.rot_eligible) {
        const rotEligibleAmount = itemDiscountedPrice * item.labor_share;
        rotAmount += rotEligibleAmount * 0.3; // 30% ROT deduction
      }
      
      if (item.rut_eligible) {
        const rutEligibleAmount = itemDiscountedPrice * item.labor_share;
        rutAmount += rutEligibleAmount * 0.5; // 50% RUT deduction
      }
    });

    // Calculate VAT (25% on the discounted amount)
    const vatAmount = discountedTotal * 0.25;
    const totalAmount = discountedTotal + vatAmount;

    // Set valid until date
    const validDays = requestData.validDays || 30;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    // Create quote using service role to bypass RLS
    const { data: quote, error: quoteError } = await supabaseServiceClient
      .from('quotes')
      .insert({
        customer_id: user.id,
        property_id: requestData.propertyId,
        organization_id: requestData.organizationId || null,
        title: requestData.title,
        description: requestData.description || null,
        line_items: requestData.lineItems,
        subtotal: subtotal,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        rot_amount: rotAmount,
        rut_amount: rutAmount,
        vat_amount: vatAmount,
        total_amount: totalAmount,
        valid_until: validUntil.toISOString().split('T')[0],
        status: 'draft'
      })
      .select()
      .single();

    if (quoteError) {
      console.error("Error creating quote:", quoteError);
      return new Response(
        JSON.stringify({ error: "Failed to create quote" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log event for analytics
    await supabaseServiceClient
      .from('events')
      .insert({
        user_id: user.id,
        event_type: 'quote_created',
        event_data: {
          quote_id: quote.id,
          quote_number: quote.quote_number,
          total_amount: totalAmount,
          discount_percent: discountPercent,
          rot_amount: rotAmount,
          rut_amount: rutAmount,
          line_items_count: requestData.lineItems.length
        },
        page_url: req.headers.get('referer') || '',
        user_agent: req.headers.get('user-agent') || ''
      });

    console.log("Quote created successfully:", quote.quote_number);

    return new Response(
      JSON.stringify({
        success: true,
        quote: quote,
        message: "Offert skapad framgångsrikt"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in create-quote function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});