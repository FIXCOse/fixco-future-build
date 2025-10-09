import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

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
    const {
      name = "",
      email = "",
      phone = "",
      address = "",
      service_slug,
      mode = "quote",
      fields = {},
      fileUrls = [],
    } = body ?? {};

    // --- Validering ---
    if (!email) return json({ error: "Missing email" }, 400);
    if (!service_slug) return json({ error: "Missing service_slug" }, 400);
    if (!["quote", "book"].includes(mode)) return json({ error: "Invalid mode" }, 400);

    // --- 1) Upsert kund ---
    const { data: customer, error: custErr } = await admin
      .from("customers")
      .upsert({ email, name, phone, address }, { onConflict: "email" })
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
        customer_email: email,
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
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

    // --- 4) Skapa draft-offert kopplad till booking ---
    let quoteId: string | null = null;
    if (mode === "quote") {
      const { data: rpcRes, error: rpcErr } = await admin
        .rpc("create_draft_quote_for_booking", { booking_id: booking.id });

      if (!rpcErr && rpcRes) {
        quoteId = rpcRes as unknown as string;
      } else {
        // Fallback: direkt INSERT i quotes_new
        console.warn("RPC fallback (create_draft_quote_for_booking):", rpcErr?.message);
        
        // Generate number and token via RPC calls
        const { data: genNumber } = await admin.rpc('generate_quote_number_new');
        const { data: genToken } = await admin.rpc('generate_public_token');
        
        const { data: qInsert, error: qErr } = await admin
          .from("quotes_new")
          .insert({
            number: genNumber || `Q-${Date.now()}`, // fallback if RPC fails
            public_token: genToken || crypto.randomUUID(),
            customer_id: customer.id, // Use customer ID from customers table for quotes
            request_id: booking.id,
            title: `Offert – ${service_slug}`,
            items: [],
            subtotal_work_sek: 0,
            subtotal_mat_sek: 0,
            vat_sek: 0,
            rot_deduction_sek: 0,
            total_sek: 0,
            status: "draft",
            valid_until: null,
            pdf_url: null,
          })
          .select("id")
          .single();

        if (qErr) {
          console.error("quotes_new.insert", qErr);
          return json({ error: `quotes_new.insert: ${qErr.message}` }, 400);
        }
        quoteId = qInsert!.id;
      }
    }

    return json({ ok: true, bookingId: booking.id, quoteId });
  } catch (e: any) {
    console.error("FUNCTION ERROR", e);
    return json({ error: e?.message ?? String(e) }, 400);
  }
});
