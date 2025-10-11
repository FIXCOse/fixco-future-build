import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import {
  corsHeaders,
  errorResponse,
  successResponse,
  validateRequest,
  checkRateLimit,
  getClientIp,
  getUserAgent,
  sanitizeString,
} from '../_shared/validation.ts';

// Validation schema for booking creation
const createBookingSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  serviceId: z.string().min(1, 'Service ID required').max(100),
  serviceName: z.string().min(1).max(200),
  serviceVariant: z.string().max(100).optional(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  scheduledTimeStart: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  scheduledTimeEnd: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  basePrice: z.number().positive().max(1000000, 'Price too high'),
  laborShare: z.number().min(0).max(1).optional(),
  rotEligible: z.boolean().optional(),
  rutEligible: z.boolean().optional(),
  description: z.string().max(5000).optional(),
  organizationId: z.string().uuid().optional(),
});

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
    if (!authHeader) {
      return errorResponse("Unauthorized", 401);
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      return errorResponse("Unauthorized", 401);
    }

    const user = userData.user;

    // Rate limiting - max 10 bookings per hour
    const clientIp = getClientIp(req);
    const rateLimitKey = `${user.id}:create-booking`;
    const isAllowed = await checkRateLimit(supabaseServiceClient, rateLimitKey, 'create-booking', 10, 60);
    
    if (!isAllowed) {
      return errorResponse("Too many booking attempts. Please try again later.", 429);
    }

    // Parse and validate request
    const rawData = await req.json();
    const validation = validateRequest(createBookingSchema, rawData);
    
    if (!validation.success) {
      return errorResponse(validation.error, 400);
    }
    
    const requestData = validation.data;

    // Sanitize text inputs
    if (requestData.description) {
      requestData.description = sanitizeString(requestData.description);
    }

    console.log("Creating booking for user:", user.id);
    console.log("Request data validated:", requestData);

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

    // Log to security audit
    await supabaseServiceClient.rpc('log_admin_action', {
      p_action: 'CREATE_BOOKING',
      p_target_table: 'bookings',
      p_target_id: booking.id,
      p_changes: {
        service_name: requestData.serviceName,
        final_price: finalPrice,
        user_id: user.id
      }
    });

    return successResponse({
      success: true,
      booking: booking,
      pointsEarned: pointsEarned,
      message: "Bokning skapad framgångsrikt"
    });

  } catch (error) {
    console.error("Error in create-booking function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return errorResponse(errorMessage, 500);
  }
});