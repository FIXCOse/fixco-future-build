import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// Validering schema
const requestSchema = z.object({
  customer_type: z.enum(['private', 'company', 'brf']).default('private'),
  name: z.string().min(2, "Namn måste vara minst 2 bokstäver").max(100),
  email: z.string().email("Ogiltig e-postadress").max(255),
  phone: z.string().regex(/^(\+46|0)[-\s]?7[0-9][-\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2}$/, "Ogiltigt svenskt telefonnummer"),
  personnummer: z.string().optional(),
  company_name: z.string().optional(),
  brf_name: z.string().optional(),
  org_number: z.string().optional(),
  service_slug: z.string().min(1, "service_slug krävs"),
  mode: z.enum(['quote', 'book']),
  address: z.string().optional(),
  fields: z.record(z.any()).optional(),
  fileUrls: z.array(z.string().url()).optional(),
}).refine(
  (data) => {
    if (data.customer_type === 'company') {
      return !!(data.company_name && data.org_number);
    }
    if (data.customer_type === 'brf') {
      return !!(data.brf_name && data.org_number);
    }
    return true;
  },
  {
    message: 'Företagsnamn/BRF-namn och organisationsnummer krävs',
  }
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { headers: { ...cors, "Content-Type": "application/json" }, status });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method === "GET") return json({ ok: true, ping: true });

  try {
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return json({ error: "Use application/json" }, 415);

    const body = await req.json();

    // Server-side validering med Zod
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      console.error("Validation error:", validation.error.issues);
      return json({ 
        ok: false, 
        error: 'Ogiltig data', 
        details: validation.error.issues 
      }, 400);
    }

    const {
      customer_type = 'private',
      name,
      email,
      phone,
      personnummer,
      company_name,
      brf_name,
      org_number,
      address = "",
      service_slug,
      mode,
      fields = {},
      fileUrls = [],
    } = validation.data;

    console.log("[create-booking-with-quote] Validerad data:", { 
      customer_type, 
      name, 
      email, 
      phone, 
      service_slug, 
      mode 
    });

    // --- 1) Upsert kund ---
    const customerData: any = { 
      email, 
      name, 
      phone, 
      address,
      customer_type,
    };

    // Lägg till personnummer för privat
    if (customer_type === 'private' && personnummer) {
      customerData.personnummer = personnummer;
    }

    // Lägg till företagsnamn och orgnummer för företag
    if (customer_type === 'company') {
      customerData.company_name = company_name;
      customerData.org_number = org_number;
    }

    // Lägg till BRF-namn och orgnummer för BRF
    if (customer_type === 'brf') {
      customerData.brf_name = brf_name;
      customerData.org_number = org_number;
    }

    const { data: customer, error: custErr } = await admin
      .from("customers")
      .upsert(customerData, { onConflict: "email" })
      .select("*")
      .single();
    if (custErr) {
      console.error("customers.upsert", custErr);
      return json({ error: `customers.upsert: ${custErr.message}` }, 400);
    }

    // --- 2) Get authenticated user (if any) ---
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;
    
    if (authHeader) {
      try {
        const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
          global: { headers: { authorization: authHeader } },
          auth: { persistSession: false }
        });
        const { data: { user } } = await userClient.auth.getUser();
        userId = user?.id ?? null;
      } catch (e) {
        console.warn("Could not get user from auth:", e);
      }
    }

    // --- 3) Insert i bookings (customer_id ska vara user ID från auth, inte customers.id) ---
    const bookingRow = {
      customer_id: userId, // User ID from auth.users (can be null for guests)
      service_slug,
      mode,
      status: "new",
      payload: {
        ...fields,
        // Store customer details in payload for reference
        email,
        name,
        phone,
        address,
      },
      file_urls: fileUrls ?? [],
    };
    const { data: booking, error: bookErr } = await admin
      .from("bookings")
      .insert(bookingRow)
      .select("*")
      .single();
    if (bookErr) {
      console.error("bookings.insert", bookErr);
      return json({ error: `bookings.insert: ${bookErr.message}` }, 400);
    }

    console.log("[create-booking-with-quote] Bokning skapad:", booking.id);
    console.log("[create-booking-with-quote] Mode:", mode);

    return json({ 
      ok: true, 
      bookingId: booking.id,
      message: mode === 'quote' 
        ? 'Förfrågan mottagen. Vi återkommer med offert inom kort.'
        : 'Bokning mottagen. Vi kontaktar dig för bekräftelse.'
    });
  } catch (e: any) {
    console.error("FUNCTION ERROR", e);
    return json({ error: e?.message ?? String(e) }, 400);
  }
});
