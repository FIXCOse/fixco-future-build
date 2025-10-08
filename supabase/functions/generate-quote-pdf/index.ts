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
    const { service, estimate, quantity, material } = await req.json();
    
    // Generate simple HTML for PDF
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
          .quote-details { margin: 30px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .total { font-size: 18px; font-weight: bold; }
          .rot-highlight { color: #28a745; font-weight: bold; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">FIXCO</div>
          <p>Uppsala & Stockholm<br>Telefon: 08-123 456 78<br>info@fixco.se</p>
        </div>
        
        <h1>Preliminär Offert</h1>
        <p><strong>Datum:</strong> ${new Date().toLocaleDateString('sv-SE')}</p>
        
        <div class="quote-details">
          <h2>${service.name}</h2>
          <p>${service.description}</p>
          
          <table>
            <tr>
              <th>Beskrivning</th>
              <th>Antal</th>
              <th>Á-pris</th>
              <th>Totalt</th>
            </tr>
            <tr>
              <td>Arbete</td>
              <td>${quantity} ${service.unit}</td>
              <td>${service.base_price_sek.toLocaleString('sv-SE')} kr</td>
              <td>${estimate.workSek.toLocaleString('sv-SE')} kr</td>
            </tr>
            ${material > 0 ? `
            <tr>
              <td>Material</td>
              <td>-</td>
              <td>-</td>
              <td>${estimate.materialSek.toLocaleString('sv-SE')} kr</td>
            </tr>
            ` : ''}
            <tr>
              <td colspan="3"><strong>Delsumma (exkl. moms)</strong></td>
              <td><strong>${estimate.subtotalSek.toLocaleString('sv-SE')} kr</strong></td>
            </tr>
            <tr>
              <td colspan="3">Moms (25%)</td>
              <td>${estimate.vatSek.toLocaleString('sv-SE')} kr</td>
            </tr>
            <tr>
              <td colspan="3"><strong>Totalt inkl. moms</strong></td>
              <td><strong>${estimate.totalInclVatSek.toLocaleString('sv-SE')} kr</strong></td>
            </tr>
            ${estimate.rotEligible && estimate.rotDeductionSek > 0 ? `
            <tr class="rot-highlight">
              <td colspan="3"><strong>Indikativt ROT-avdrag (30% på arbete)</strong></td>
              <td><strong>−${estimate.rotDeductionSek.toLocaleString('sv-SE')} kr</strong></td>
            </tr>
            <tr class="total">
              <td colspan="3"><strong>Ditt pris efter ROT</strong></td>
              <td><strong>${estimate.totalAfterRotSek.toLocaleString('sv-SE')} kr</strong></td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div class="footer">
          <p><strong>Viktiga upplysningar:</strong></p>
          <ul>
            <li>Detta är en preliminär offert baserad på uppgiven information</li>
            <li>Slutligt pris fastställs efter en kostnadsfri platsbesiktning</li>
            <li>ROT-avdrag görs direkt på fakturan enligt Skatteverkets regler</li>
            <li>Priset inkluderar arbetskostnad, ej ställning eller specialverktyg</li>
            <li>Offertenär giltig i 30 dagar</li>
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

    // In a real implementation, you'd use a PDF generation service
    // For now, we'll return the HTML and suggest using a browser print-to-PDF
    // or integrate with a service like PDFShift, DocRaptor, or similar

    // Store HTML in Supabase Storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fileName = `quote-${Date.now()}.html`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('invoices')
      .upload(fileName, html, {
        contentType: 'text/html',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase
      .storage
      .from('invoices')
      .getPublicUrl(fileName);

    return new Response(JSON.stringify({ 
      pdfUrl: publicUrl,
      html 
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
