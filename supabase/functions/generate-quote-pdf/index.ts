import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Received request body:', JSON.stringify(body));
    
    const { quoteId } = body;
    
    if (!quoteId) {
      throw new Error('Quote ID is required');
    }

    console.log('Fetching quote with ID:', quoteId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch quote data from database (customer can be null for migrated quote_requests)
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select(`
        *,
        customer:profiles(first_name, last_name, email),
        property:properties(address, city, postal_code)
      `)
      .eq('id', quoteId)
      .maybeSingle();

    if (quoteError) {
      console.error('Error fetching quote:', quoteError);
      throw quoteError;
    }
    if (!quote) {
      console.error('Quote not found with ID:', quoteId);
      throw new Error('Quote not found');
    }

    console.log('Quote fetched successfully:', quote.quote_number);

    // Parse description if it's JSON
    let description = quote.description || '';
    try {
      const parsed = JSON.parse(description);
      description = parsed.beskrivning || parsed.description || description;
    } catch {
      // Keep as is if not JSON
    }

    // Parse line items
    const lineItems = Array.isArray(quote.line_items) ? quote.line_items : [];
    
    // Generate HTML for PDF
    const html = `
      <!DOCTYPE html>
      <html lang="sv">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1a1a1a; }
          .header { border-bottom: 3px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
          .company { font-size: 24px; font-weight: bold; color: #0066cc; }
          .quote-info { margin: 30px 0; }
          .customer-info { background: #f8f9fa; padding: 20px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .amount { text-align: right; }
          .total-row { font-size: 18px; font-weight: bold; background: #f8f9fa; }
          .rot-highlight { color: #28a745; font-weight: bold; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">FIXCO</div>
          <p>Uppsala & Stockholm<br>Telefon: 08-123 456 78<br>info@fixco.se</p>
        </div>
        
        <h1>Offert</h1>
        <div class="quote-info">
          <p><strong>Offertnummer:</strong> ${quote.quote_number}</p>
          <p><strong>Datum:</strong> ${new Date(quote.created_at).toLocaleDateString('sv-SE')}</p>
          ${quote.valid_until ? `<p><strong>Giltig till:</strong> ${new Date(quote.valid_until).toLocaleDateString('sv-SE')}</p>` : ''}
        </div>

        ${quote.customer_name || quote.customer ? `
        <div class="customer-info">
          <h3>Kund</h3>
          <p><strong>${quote.customer_name || (quote.customer ? `${quote.customer.first_name || ''} ${quote.customer.last_name || ''}`.trim() : '')}</strong></p>
          ${quote.customer_email ? `<p>Email: ${quote.customer_email}</p>` : ''}
          ${quote.customer_phone ? `<p>Telefon: ${quote.customer_phone}</p>` : ''}
          ${quote.customer_address ? `<p>${quote.customer_address}${quote.customer_postal_code ? `, ${quote.customer_postal_code}` : ''}${quote.customer_city ? ` ${quote.customer_city}` : ''}</p>` : ''}
        </div>
        ` : ''}

        <div>
          <h2>${quote.title}</h2>
          ${description ? `<p>${description}</p>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Beskrivning</th>
              <th class="amount">Antal</th>
              <th class="amount">Á-pris</th>
              <th class="amount">Totalt</th>
            </tr>
          </thead>
          <tbody>
            ${lineItems.map(item => `
              <tr>
                <td>${item.description || item.name || ''}</td>
                <td class="amount">${item.quantity || 1}</td>
                <td class="amount">${(item.unit_price || 0).toLocaleString('sv-SE')} kr</td>
                <td class="amount">${((item.quantity || 1) * (item.unit_price || 0)).toLocaleString('sv-SE')} kr</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3"><strong>Delsumma</strong></td>
              <td class="amount"><strong>${(quote.subtotal || 0).toLocaleString('sv-SE')} kr</strong></td>
            </tr>
            ${quote.discount_amount > 0 ? `
            <tr>
              <td colspan="3">Rabatt ${quote.discount_percent ? `(${quote.discount_percent}%)` : ''}</td>
              <td class="amount">−${(quote.discount_amount || 0).toLocaleString('sv-SE')} kr</td>
            </tr>
            ` : ''}
            <tr>
              <td colspan="3">Moms (25%)</td>
              <td class="amount">${(quote.vat_amount || 0).toLocaleString('sv-SE')} kr</td>
            </tr>
            <tr class="total-row">
              <td colspan="3">Totalt inkl. moms</td>
              <td class="amount">${(quote.total_amount || 0).toLocaleString('sv-SE')} kr</td>
            </tr>
            ${quote.rot_amount > 0 ? `
            <tr class="rot-highlight">
              <td colspan="3"><strong>ROT-avdrag (30%)</strong></td>
              <td class="amount"><strong>−${(quote.rot_amount || 0).toLocaleString('sv-SE')} kr</strong></td>
            </tr>
            <tr class="total-row rot-highlight">
              <td colspan="3"><strong>Ditt pris efter ROT</strong></td>
              <td class="amount"><strong>${((quote.total_amount || 0) - (quote.rot_amount || 0)).toLocaleString('sv-SE')} kr</strong></td>
            </tr>
            ` : ''}
            ${quote.rut_amount > 0 ? `
            <tr class="rot-highlight">
              <td colspan="3"><strong>RUT-avdrag (50%)</strong></td>
              <td class="amount"><strong>−${(quote.rut_amount || 0).toLocaleString('sv-SE')} kr</strong></td>
            </tr>
            <tr class="total-row rot-highlight">
              <td colspan="3"><strong>Ditt pris efter RUT</strong></td>
              <td class="amount"><strong>${((quote.total_amount || 0) - (quote.rut_amount || 0)).toLocaleString('sv-SE')} kr</strong></td>
            </tr>
            ` : ''}
          </tbody>
        </table>
        
        <div class="footer">
          <p><strong>Viktiga upplysningar:</strong></p>
          <ul>
            <li>Priset inkluderar arbetskostnad och material enligt specifikation</li>
            <li>Eventuella tillkommande kostnader redovisas separat</li>
            ${quote.rot_amount > 0 || quote.rut_amount > 0 ? '<li>ROT/RUT-avdrag görs direkt på fakturan enligt Skatteverkets regler</li>' : ''}
            <li>Betalningsvillkor: 30 dagar netto</li>
          </ul>
          <p style="margin-top: 20px;">
            <strong>Fixco AB</strong><br>
            Org.nr: 123456-7890<br>
            info@fixco.se | 08-123 456 78
          </p>
        </div>
      </body>
      </html>
    `;

    // Return HTML directly instead of storing
    console.log('Quote PDF HTML generated successfully for:', quote.quote_number);

    return new Response(JSON.stringify({ 
      success: true,
      html,
      quote_number: quote.quote_number
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
