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
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .content {
            padding: 40px;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .company-info, .customer-info {
            flex: 1;
        }
        .customer-info {
            text-align: right;
        }
        .section-title {
            font-size: 1.2em;
            font-weight: 600;
            margin-bottom: 10px;
            color: #6366f1;
        }
        .info-line {
            margin: 5px 0;
            line-height: 1.5;
        }
        .invoice-meta {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 30px 0;
        }
        .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .line-items {
            margin: 30px 0;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .items-table th,
        .items-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .items-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #374151;
        }
        .items-table .amount {
            text-align: right;
        }
        .totals {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 30px 0;
        }
        .total-line {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 5px 0;
        }
        .total-line.final {
            border-top: 2px solid #6366f1;
            font-weight: 700;
            font-size: 1.2em;
            color: #6366f1;
            margin-top: 15px;
            padding-top: 15px;
        }
        .rot-rut-info {
            background: #ecfdf5;
            border: 1px solid #10b981;
            border-radius: 6px;
            padding: 20px;
            margin: 30px 0;
        }
        .rot-rut-title {
            color: #059669;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .terms {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
            font-size: 0.9em;
            color: #6b7280;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 0.9em;
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
            <h1>FAKTURA</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.2em;">${invoice.invoice_number}</p>
        </div>
        
        <div class="content">
            <div class="invoice-details">
                <div class="company-info">
                    <div class="section-title">Från</div>
                    <div class="info-line"><strong>Fixco AB</strong></div>
                    <div class="info-line">Hantverkargatan 123</div>
                    <div class="info-line">118 21 Stockholm</div>
                    <div class="info-line">Org.nr: 556789-0123</div>
                    <div class="info-line">info@fixco.se</div>
                    <div class="info-line">08-123 45 67</div>
                </div>
                
                <div class="customer-info">
                    <div class="section-title">Till</div>
                    <div class="info-line"><strong>${customer.first_name} ${customer.last_name}</strong></div>
                     ${customer.company_name ? `<div class="info-line">${customer.company_name}</div>` : ''}
                     ${customer.org_number ? `<div class="info-line">Org.nr: ${customer.org_number}</div>` : ''}
                     ${property ? `<div class="info-line">${property.address}</div>` : ''}
                     ${property ? `<div class="info-line">${property.postal_code} ${property.city}</div>` : ''}
                     <div class="info-line">${customer.email}</div>
                </div>
            </div>
            
            <div class="invoice-meta">
                <div class="meta-grid">
                    <div>
                        <strong>Fakturadatum:</strong> ${formatDate(invoice.issue_date)}
                    </div>
                    <div>
                        <strong>Förfallodatum:</strong> ${formatDate(invoice.due_date)}
                    </div>
                </div>
            </div>
            
            <div class="line-items">
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
                        ${invoice.line_items.map((item: any) => `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td class="amount">${formatCurrency(item.unit_price)}</td>
                                <td class="amount">${formatCurrency(item.total_price)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="totals">
                <div class="total-line">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(invoice.subtotal)}</span>
                </div>
                ${invoice.discount_amount > 0 ? `
                    <div class="total-line">
                        <span>Rabatt:</span>
                        <span>-${formatCurrency(invoice.discount_amount)}</span>
                    </div>
                ` : ''}
                <div class="total-line">
                    <span>Moms (25%):</span>
                    <span>${formatCurrency(invoice.vat_amount)}</span>
                </div>
                <div class="total-line final">
                    <span>Att betala:</span>
                    <span>${formatCurrency(invoice.total_amount)}</span>
                </div>
            </div>
            
            ${(invoice.rot_amount > 0 || invoice.rut_amount > 0) ? `
                <div class="rot-rut-info">
                    <div class="rot-rut-title">🎉 ROT/RUT-avdrag</div>
                    ${invoice.rot_amount > 0 ? `<div>ROT-avdrag: ${formatCurrency(invoice.rot_amount)}</div>` : ''}
                    ${invoice.rut_amount > 0 ? `<div>RUT-avdrag: ${formatCurrency(invoice.rut_amount)}</div>` : ''}
                    <div style="margin-top: 10px; font-size: 0.9em;">
                        <strong>Viktigt:</strong> ROT/RUT-avdragen hanteras direkt av Skatteverket och dras av från din slutskatt. 
                        Denna faktura ska betalas till fullo.
                    </div>
                </div>
            ` : ''}
            
            <div class="terms">
                <div class="section-title">Betalningsvillkor</div>
                <p>Betalning sker inom 30 dagar från fakturadatum via bankgiro eller Swish.</p>
                <p><strong>Bankgiro:</strong> 123-4567 | <strong>Swish:</strong> 123 456 78 90</p>
                <p>Vid frågor om fakturan, kontakta oss på info@fixco.se eller 08-123 45 67.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Tack för att du valde Fixco! Vi ser fram emot att hjälpa dig igen.</p>
            <p>www.fixco.se | info@fixco.se | 08-123 45 67</p>
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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});