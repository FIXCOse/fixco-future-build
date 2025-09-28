import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateBookingRequest {
  propertyId: string;
  serviceId: string;
  serviceName: string;
  serviceVariant?: string;
  scheduledDate: string;
  scheduledTimeStart: string;
  scheduledTimeEnd: string;
  basePrice: number;
  laborShare?: number;
  rotEligible?: boolean;
  rutEligible?: boolean;
  description?: string;
  organizationId?: string;
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
    const requestData: CreateBookingRequest = await req.json();

    console.log("Creating booking for user:", user.id);
    console.log("Request data:", requestData);

    // Validate required fields
    if (!requestData.propertyId || !requestData.serviceId || !requestData.serviceName) {
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

    // Check for availability conflicts
    const { data: conflictingBookings } = await supabaseServiceClient
      .from('bookings')
      .select('*')
      .eq('scheduled_date', requestData.scheduledDate)
      .not('status', 'eq', 'cancelled')
      .or(`scheduled_time_start.lte.${requestData.scheduledTimeEnd},scheduled_time_end.gte.${requestData.scheduledTimeStart}`);

    if (conflictingBookings && conflictingBookings.length > 0) {
      console.log("Scheduling conflict detected:", conflictingBookings);
      return new Response(
        JSON.stringify({ 
          error: "Scheduling conflict detected",
          conflicts: conflictingBookings 
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate pricing
    const laborShare = requestData.laborShare || 0.7;
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
      .select('loyalty_tier, loyalty_points')
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

    const discountAmount = (requestData.basePrice * discountPercent) / 100;
    const finalPrice = requestData.basePrice - discountAmount;

    // Create booking using service role to bypass RLS
    const { data: booking, error: bookingError } = await supabaseServiceClient
      .from('bookings')
      .insert({
        customer_id: user.id,
        property_id: requestData.propertyId,
        organization_id: requestData.organizationId || null,
        service_id: requestData.serviceId,
        service_name: requestData.serviceName,
        service_variant: requestData.serviceVariant || null,
        scheduled_date: requestData.scheduledDate,
        scheduled_time_start: requestData.scheduledTimeStart,
        scheduled_time_end: requestData.scheduledTimeEnd,
        base_price: requestData.basePrice,
        labor_share: laborShare,
        rot_eligible: requestData.rotEligible ?? true,
        rut_eligible: requestData.rutEligible ?? false,
        discount_percent: discountPercent,
        final_price: finalPrice,
        description: requestData.description || null,
        status: 'pending'
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Error creating booking:", bookingError);
      return new Response(
        JSON.stringify({ error: "Failed to create booking" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Award loyalty points (1 point per 100 SEK spent)
    const pointsEarned = Math.floor(finalPrice / 100);
    if (pointsEarned > 0) {
      await supabaseServiceClient
        .from('loyalty_transactions')
        .insert({
          user_id: user.id,
          points_change: pointsEarned,
          reason: `Bokning - ${requestData.serviceName}`,
          booking_id: booking.id
        });

      // Update user's total points
      await supabaseServiceClient
        .from('profiles')
        .update({
          loyalty_points: (profile?.loyalty_points || 0) + pointsEarned
        })
        .eq('id', user.id);
    }

    // Log event for analytics
    await supabaseServiceClient
      .from('events')
      .insert({
        user_id: user.id,
        event_type: 'booking_created',
        event_data: {
          booking_id: booking.id,
          service_id: requestData.serviceId,
          service_name: requestData.serviceName,
          final_price: finalPrice,
          discount_percent: discountPercent,
          points_earned: pointsEarned
        },
        page_url: req.headers.get('referer') || '',
        user_agent: req.headers.get('user-agent') || ''
      });

    console.log("Booking created successfully:", booking.id);

    return new Response(
      JSON.stringify({
        success: true,
        booking: booking,
        pointsEarned: pointsEarned,
        message: "Bokning skapad framgångsrikt"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in create-booking function:", error);
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