import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendInvoiceRequest {
  invoiceId: string;
  toEmail?: string; // Optional override
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(
    amount || 0
  );

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("sv-SE");

function generateInvoiceHTML(invoice: any, customer: any, property: any, publicUrl?: string) {
  const lineItemsHtml = (invoice?.line_items ?? [])
    .map((item: any) => {
      const qty = Number(item.quantity ?? 1);
      const unit = Number(
        item.unit_price ?? (item.amount != null ? Number(item.amount) / qty : 0)
      );
      const total = Number(
        item.total_price ?? item.amount ?? unit * qty
      );
      return `
        <tr>
          <td>${item.description || "Arbete"}</td>
          <td>${qty}</td>
          <td class="amount">${formatCurrency(unit)}</td>
          <td class="amount">${formatCurrency(total)}</td>
        </tr>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Faktura ${invoice.invoice_number}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin:0; padding:20px; background:#0b0b0c; color:#e5e7eb; }
    .invoice-container { max-width: 800px; margin: 0 auto; background: #111318; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); overflow: hidden; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 36px; text-align: center; }
    .content { padding: 32px; }
    .invoice-details { display:flex; justify-content:space-between; gap:24px; }
    .section-title { font-weight:600; color:#a5b4fc; margin-bottom:8px; }
    .info-line { color:#cbd5e1; }
    .invoice-meta, .totals { background:#0f172a; border:1px solid #1f2937; padding:16px; border-radius:8px; margin:24px 0; }
    .items-table { width:100%; border-collapse: collapse; margin-top:8px; }
    .items-table th, .items-table td { padding:10px 12px; border-bottom:1px solid #1f2937; }
    .items-table th { text-align:left; color:#cbd5e1; background:#0b1220; }
    .amount { text-align:right; }
    .total-line { display:flex; justify-content:space-between; padding:6px 0; }
    .total-line.final { border-top:2px solid #6366f1; margin-top:10px; padding-top:12px; font-weight:700; color:#a5b4fc; }
    .footer { padding: 20px; text-align:center; color:#94a3b8; background:#0b1220; }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1 style="margin:0">FAKTURA</h1>
      <p style="margin:6px 0 0 0">${invoice.invoice_number}</p>
    </div>
    <div class="content">
      <div class="invoice-details">
        <div>
          <div class="section-title">Från</div>
          <div class="info-line"><strong>Fixco AB</strong></div>
          <div class="info-line">Hantverkargatan 123</div>
          <div class="info-line">118 21 Stockholm</div>
          <div class="info-line">Org.nr: 556789-0123</div>
          <div class="info-line">info@fixco.se</div>
          <div class="info-line">08-123 45 67</div>
        </div>
        <div style="text-align:right">
          <div class="section-title">Till</div>
          <div class="info-line"><strong>${
            [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
            customer?.email || "Kund"
          }</strong></div>
          ${customer?.company_name ? `<div class="info-line">${customer.company_name}</div>` : ''}
          ${customer?.org_number ? `<div class="info-line">Org.nr: ${customer.org_number}</div>` : ''}
          ${property ? `<div class="info-line">${property.address}</div>` : ''}
          ${property ? `<div class="info-line">${property.postal_code} ${property.city}</div>` : ''}
          <div class="info-line">${customer?.email || ''}</div>
        </div>
      </div>
      <div class="invoice-meta">
        <div class="total-line"><span>Fakturadatum:</span><span>${formatDate(invoice.issue_date)}</span></div>
        <div class="total-line"><span>Förfallodatum:</span><span>${formatDate(invoice.due_date)}</span></div>
      </div>
      <div>
        <div class="section-title">Specifikation</div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Beskrivning</th>
              <th>Antal</th>
              <th class="amount">Enhetspris</th>
              <th class="amount">Total</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHtml}
          </tbody>
        </table>
      </div>
      <div class="totals">
        <div class="total-line"><span>Subtotal:</span><span>${formatCurrency(Number(invoice.subtotal || 0))}</span></div>
        ${Number(invoice.discount_amount || 0) > 0 ? `<div class="total-line"><span>Rabatt:</span><span>- ${formatCurrency(Number(invoice.discount_amount || 0))}</span></div>` : ''}
        <div class="total-line"><span>Moms (25%):</span><span>${formatCurrency(Number(invoice.vat_amount || 0))}</span></div>
        <div class="total-line final"><span>Att betala:</span><span>${formatCurrency(Number(invoice.total_amount || 0))}</span></div>
      </div>
      <div class="footer">
        ${publicUrl ? `
        <div style="margin-bottom:20px">
          <a href="${publicUrl}" style="display:inline-block; padding:12px 24px; background:#6366f1; color:white; text-decoration:none; border-radius:6px; font-weight:600;">
            Visa faktura online
          </a>
        </div>
        ` : ''}
        <p>Tack för att du valde Fixco!</p>
        <p>www.fixco.se | info@fixco.se | 08-123 45 67</p>
      </div>
    </div>
  </div>
</body>
</html>`;
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
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: SendInvoiceRequest = await req.json();
    if (!body.invoiceId) {
      return new Response(
        JSON.stringify({ error: "invoiceId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: inv, error: invError } = await supabaseService
      .from('invoices')
      .select(`*, customer:profiles(*), property:properties(*)`)
      .eq('id', body.invoiceId)
      .single();

    if (invError || !inv) {
      return new Response(
        JSON.stringify({ error: 'Invoice not found', details: invError?.message }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate public URL if token exists
    const publicUrl = inv.public_token 
      ? `https://fixco.se/invoice/${inv.public_token}`
      : undefined;

    const html = generateInvoiceHTML(inv, inv.customer, inv.property, publicUrl);

    const to = body.toEmail || inv.customer?.email;
    if (!to) {
      return new Response(
        JSON.stringify({ error: 'Recipient email missing', previewHtml: html }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try sending via Resend, fallback to returning preview HTML
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing RESEND_API_KEY', previewHtml: html }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Fixco <noreply@fixco.se>',
        to: [to],
        subject: `Faktura ${inv.invoice_number}`,
        html
      })
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Resend error:', errText);
      return new Response(
        JSON.stringify({ error: 'Email send failed', previewHtml: html }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Optionally log event
    await supabaseService.from('events').insert({
      user_id: userData.user.id,
      event_type: 'invoice_emailed',
      event_data: { invoice_id: inv.id, invoice_number: inv.invoice_number }
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error('send-invoice-email error:', e);
    return new Response(
      JSON.stringify({ error: e?.message || 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
