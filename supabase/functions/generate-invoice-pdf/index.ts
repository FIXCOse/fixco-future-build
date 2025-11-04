import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateInvoiceRequest {
  quoteId?: string;
  bookingId?: string;
  customData?: {
    title: string;
    lineItems: any[];
    dueDate?: string;
  };
}

const generateInvoiceHTML = (invoice: any, customer: any, property: any, company: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  return `
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faktura ${invoice.invoice_number}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #1a1a1a;
        line-height: 1.6;
        background: #ffffff;
      }
      
      .invoice-container {
        max-width: 850px;
        margin: 0 auto;
        padding: 0;
        background: white;
      }
      
      .header {
        padding: 50px 40px;
        background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #8b5cf6 100%);
        color: white;
        margin-bottom: 0;
      }
      
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: start;
      }
      
      .company-info h1 {
        font-size: 56px;
        font-weight: 800;
        letter-spacing: -1px;
        margin-bottom: 15px;
        color: white;
      }
      
      .company-info h2 {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 8px;
        color: rgba(255, 255, 255, 0.95);
      }
      
      .company-info p {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }
      
      .invoice-meta {
        text-align: right;
        color: white;
      }
      
      .invoice-meta .status {
        display: inline-block;
        padding: 10px 20px;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 15px;
      }
      
      .content {
        padding: 40px;
      }
      
      .details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
        padding: 30px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
        border-radius: 12px;
      }
      
      .details-section h3 {
        font-size: 18px;
        color: #8b5cf6;
        margin-bottom: 15px;
        font-weight: 700;
      }
      
      .details-section p {
        margin-bottom: 8px;
        color: #475569;
        font-size: 14px;
      }
      
      .details-section strong {
        color: #1e293b;
        font-weight: 600;
      }
      
      .line-items {
        margin-bottom: 40px;
      }
      
      .line-items h3 {
        font-size: 20px;
        margin-bottom: 20px;
        color: #1e293b;
        font-weight: 700;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
      }
      
      thead {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
      }
      
      th {
        text-align: left;
        padding: 16px;
        font-weight: 700;
        font-size: 14px;
        color: #1e293b;
        border-bottom: 2px solid #e2e8f0;
      }
      
      th:last-child,
      td:last-child {
        text-align: right;
      }
      
      td {
        padding: 16px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
        color: #475569;
      }
      
      tbody tr:hover {
        background: #f8fafc;
      }
      
      tbody tr:last-child td {
        border-bottom: none;
      }
      
      .totals {
        margin-top: 30px;
        padding: 30px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%);
        border-radius: 12px;
      }
      
      .totals-content {
        max-width: 400px;
        margin-left: auto;
      }
      
      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 15px;
      }
      
      .total-row.final {
        padding-top: 15px;
        border-top: 3px solid #8b5cf6;
        margin-top: 15px;
        font-size: 22px;
        font-weight: 800;
        color: #8b5cf6;
      }
      
      .total-row span:first-child {
        color: #64748b;
        font-weight: 500;
      }
      
      .total-row span:last-child {
        font-weight: 700;
        color: #1e293b;
      }
      
      .total-row.final span {
        color: #8b5cf6;
      }
      
      .rot-rut-info {
        margin-top: 30px;
        padding: 25px;
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        border-radius: 8px;
      }
      
      .rot-rut-info h3 {
        color: #92400e;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 700;
      }
      
      .rot-rut-info p {
        color: #78350f;
        font-size: 13px;
        margin-bottom: 6px;
      }
      
      .terms {
        margin-top: 40px;
        padding: 25px;
        background: #f1f5f9;
        border-radius: 12px;
        font-size: 14px;
        color: #475569;
      }
      
      .terms strong {
        color: #1e293b;
      }
      
      .footer {
        margin-top: 60px;
        text-align: center;
        font-size: 12px;
        color: #94a3b8;
        padding-top: 30px;
        border-top: 2px solid #e2e8f0;
      }
      
      @media print {
        body { background: white; }
        .invoice-container { box-shadow: none; }
      }
    </style>
</head>
<body>
    <div class="invoice-container">
      <div class="header">
        <div class="header-content">
          <div class="company-info">
            <h1>FIXCO</h1>
            <h2>Faktura</h2>
            <p>${invoice.invoice_number}</p>
          </div>
          <div class="invoice-meta">
            <div class="status">${invoice.status === 'paid' ? 'BETALD' : invoice.status === 'sent' ? 'SKICKAD' : 'UTKAST'}</div>
            <p><strong>Datum:</strong> ${formatDate(invoice.issue_date)}</p>
            <p><strong>Förfallodatum:</strong> ${formatDate(invoice.due_date)}</p>
          </div>
        </div>
      </div>
      
      <div class="content">
        <div class="details">
          <div class="details-section">
            <h3>Från:</h3>
            <p><strong>Fixco AB</strong></p>
            <p>Hantverkargatan 123</p>
            <p>118 21 Stockholm</p>
            <p>Org.nr: 556789-0123</p>
            <p>Momsreg.nr: SE556789012301</p>
            <p>📧 info@fixco.se</p>
            <p>📞 08-123 45 67</p>
          </div>
          <div class="details-section">
            <h3>Till:</h3>
            <p><strong>${customer.first_name ? `${customer.first_name} ${customer.last_name}` : 'Okänd kund'}</strong></p>
            ${customer.company_name ? `<p>${customer.company_name}</p>` : ''}
            ${customer.org_number ? `<p>Org.nr: ${customer.org_number}</p>` : ''}
            ${property ? `<p>${property.address}</p>` : customer.address ? `<p>${customer.address}</p>` : ''}
            ${property ? `<p>${property.postal_code} ${property.city}</p>` : (customer.postal_code && customer.city) ? `<p>${customer.postal_code} ${customer.city}</p>` : ''}
            ${customer.email ? `<p>📧 ${customer.email}</p>` : ''}
          </div>
        </div>
            
        <div class="line-items">
          <h3>Specifikation</h3>
          <table>
            <thead>
              <tr>
                <th>Beskrivning</th>
                <th>Antal</th>
                <th>À-pris</th>
                <th>Summa</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.line_items.map((item: any) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.unit_price)}</td>
                  <td>${formatCurrency(item.total_price)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div class="totals-content">
            <div class="total-row">
              <span>Delsumma:</span>
              <span>${formatCurrency(invoice.subtotal)}</span>
            </div>
            ${invoice.discount_amount > 0 ? `
              <div class="total-row">
                <span>Rabatt:</span>
                <span>-${formatCurrency(invoice.discount_amount)}</span>
              </div>
            ` : ''}
            <div class="total-row">
              <span>Moms (25%):</span>
              <span>${formatCurrency(invoice.vat_amount)}</span>
            </div>
            <div class="total-row final">
              <span>Totalt att betala:</span>
              <span>${formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </div>
            
        ${(invoice.rot_amount > 0 || invoice.rut_amount > 0) ? `
          <div class="rot-rut-info">
            <h3>🎉 ROT/RUT-avdrag</h3>
            ${invoice.rot_amount > 0 ? `<p>ROT-avdrag: ${formatCurrency(invoice.rot_amount)}</p>` : ''}
            ${invoice.rut_amount > 0 ? `<p>RUT-avdrag: ${formatCurrency(invoice.rut_amount)}</p>` : ''}
            <p style="margin-top: 10px;">
              <strong>Viktigt:</strong> ROT/RUT-avdragen hanteras direkt av Skatteverket och dras av från din slutskatt. 
              Denna faktura ska betalas till fullo.
            </p>
          </div>
        ` : ''}
        
        <div class="terms">
          <p><strong>Betalningsvillkor</strong></p>
          <p>Betalning sker inom 30 dagar från fakturadatum via bankgiro eller Swish.</p>
          <p><strong>Bankgiro:</strong> 123-4567 | <strong>Swish:</strong> 123 456 78 90</p>
          <p>Vid frågor om fakturan, kontakta oss på info@fixco.se eller 08-123 45 67.</p>
        </div>
        
        <div class="footer">
          <p><strong>Tack för ditt förtroende!</strong></p>
          <p>Vid frågor, kontakta oss på info@fixco.se</p>
          <p>Fixco AB • 08-123 45 67 • info@fixco.se</p>
        </div>
      </div>
    </div>
</body>
</html>`;
};

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
    const requestData: GenerateInvoiceRequest = await req.json();

    console.log("Generating invoice PDF for user:", user.id);

    let invoice;
    let customer;
    let property;

    if (requestData.quoteId) {
      // Generate invoice from quote
      console.log("Looking for quote with ID:", requestData.quoteId);
      
      const { data: quote, error: quoteError } = await supabaseServiceClient
        .from('quotes')
        .select(`
          *,
          customer:profiles(*),
          property:properties(*)
        `)
        .eq('id', requestData.quoteId)
        .single();

      console.log("Quote query result:", { quote: !!quote, error: quoteError });

      if (quoteError || !quote) {
        console.error("Quote not found:", quoteError);
        return new Response(
          JSON.stringify({ error: "Quote not found or access denied", details: quoteError?.message }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create invoice from quote
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      const { data: newInvoice, error: invoiceError } = await supabaseServiceClient
        .from('invoices')
        .insert({
          quote_id: quote.id,
          customer_id: quote.customer_id,
          organization_id: quote.organization_id,
          line_items: quote.line_items,
          subtotal: quote.subtotal,
          discount_amount: quote.discount_amount,
          rot_amount: quote.rot_amount,
          rut_amount: quote.rut_amount,
          vat_amount: quote.vat_amount,
          total_amount: quote.total_amount,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'draft'
        })
        .select()
        .single();

      if (invoiceError) {
        throw new Error("Failed to create invoice from quote");
      }

      invoice = newInvoice;
      // Prefer joined profile/property, but fall back to denormalized fields on the quote
      customer = quote.customer || {
        first_name: (quote.customer_name || '').split(' ')[0] || 'Kund',
        last_name: (quote.customer_name || '').split(' ').slice(1).join(' ') || '',
        email: quote.customer_email || 'info@example.com',
        company_name: null,
        org_number: null,
      };
      property = quote.property || (quote.customer_address || quote.customer_city ? {
        address: quote.customer_address || '',
        postal_code: quote.customer_postal_code || '',
        city: quote.customer_city || '',
      } : null);


    } else if (requestData.bookingId) {
      // Generate invoice from booking
      const { data: booking, error: bookingError } = await supabaseServiceClient
        .from('bookings')
        .select(`
          *,
          customer:profiles(*),
          property:properties(*)
        `)
        .eq('id', requestData.bookingId)
        .single();

      if (bookingError || !booking) {
        return new Response(
          JSON.stringify({ error: "Booking not found or access denied" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create invoice from booking
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      const lineItems = [{
        id: "1",
        description: `${booking.service_name}${booking.service_variant ? ` - ${booking.service_variant}` : ''}`,
        quantity: 1,
        unit_price: booking.final_price,
        total_price: booking.final_price,
        rot_eligible: booking.rot_eligible,
        rut_eligible: booking.rut_eligible,
        labor_share: booking.labor_share
      }];

      const subtotal = booking.final_price;
      const vatAmount = subtotal * 0.25;
      const totalAmount = subtotal + vatAmount;

      // Calculate ROT/RUT amounts
      let rotAmount = 0;
      let rutAmount = 0;

      if (booking.rot_eligible) {
        rotAmount = (subtotal * booking.labor_share) * 0.3;
      }
      if (booking.rut_eligible) {
        rutAmount = (subtotal * booking.labor_share) * 0.5;
      }

      const { data: newInvoice, error: invoiceError } = await supabaseServiceClient
        .from('invoices')
        .insert({
          booking_id: booking.id,
          customer_id: booking.customer_id,
          organization_id: booking.organization_id,
          line_items: lineItems,
          subtotal: subtotal,
          discount_amount: 0,
          rot_amount: rotAmount,
          rut_amount: rutAmount,
          vat_amount: vatAmount,
          total_amount: totalAmount,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'draft'
        })
        .select()
        .single();

      if (invoiceError) {
        throw new Error("Failed to create invoice from booking");
      }

      invoice = newInvoice;
      customer = booking.customer;
      property = booking.property;

    } else {
      return new Response(
        JSON.stringify({ error: "Either quoteId or bookingId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate HTML content
    const htmlContent = generateInvoiceHTML(invoice, customer, property, {
      name: "Fixco AB",
      address: "Hantverkargatan 123",
      postal_code: "118 21",
      city: "Stockholm",
      org_number: "556789-0123"
    });

    // For now, return the HTML content directly
    // In a production environment, you would use a PDF generation service
    // like Puppeteer or a PDF API service

    // Update invoice status to 'sent'
    await supabaseServiceClient
      .from('invoices')
      .update({ status: 'sent' })
      .eq('id', invoice.id);

    // Log event for analytics
    await supabaseServiceClient
      .from('events')
      .insert({
        user_id: user.id,
        event_type: 'invoice_generated',
        event_data: {
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          total_amount: invoice.total_amount,
          generation_method: requestData.quoteId ? 'from_quote' : 'from_booking'
        }
      });

    console.log("Invoice generated successfully:", invoice.invoice_number);

    return new Response(
      JSON.stringify({
        success: true,
        invoice: invoice,
        html_content: htmlContent,
        message: "Faktura genererad framgångsrikt"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in generate-invoice-pdf function:", error);
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