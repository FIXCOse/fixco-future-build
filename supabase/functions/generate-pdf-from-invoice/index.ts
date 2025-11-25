import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { generateInvoiceHTML } from '../_shared/pdf-html-templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function for UTF-8 safe base64 encoding
function utf8ToBase64(str: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { invoiceId } = await req.json();
    console.log('Generating PDF for invoice:', invoiceId);

    if (!invoiceId) {
      throw new Error('invoiceId is required');
    }

    // Fetch invoice data
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('invoices')
      .select(`
        *,
        customer:customers(name, email, phone, address, postal_code, city, org_number, company_name)
      `)
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      console.error('Invoice fetch error:', invoiceError);
      throw new Error(`Failed to fetch invoice: ${invoiceError?.message}`);
    }

    console.log('Invoice fetched successfully:', invoice.invoice_number);

    // Fetch logo from storage and convert to base64
    let logoBase64: string | undefined;
    try {
      const { data: logoData, error: logoError } = await supabaseClient.storage
        .from('assets')
        .download('fixco-logo-white.png');

      if (logoData && !logoError) {
        const logoBytes = await logoData.arrayBuffer();
        logoBase64 = btoa(String.fromCharCode(...new Uint8Array(logoBytes)));
      }
    } catch (error) {
      console.warn('Logo fetch failed, continuing without logo:', error);
    }

    // Generate HTML from template
    const html = generateInvoiceHTML(invoice, logoBase64);
    console.log('HTML generated, calling PDFBolt API...');

    // Convert HTML to PDF using PDFBolt
    const pdfBoltResponse = await fetch('https://api.pdfbolt.com/v1/direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API_KEY': Deno.env.get('PDFBOLT_API_KEY') ?? '',
      },
      body: JSON.stringify({
        html: utf8ToBase64(html), // UTF-8 safe base64 encode the HTML
        options: {
          format: 'A4',
          printBackground: true,
          margin: {
            top: '15mm',
            bottom: '15mm',
            left: '15mm',
            right: '15mm'
          }
        }
      })
    });

    if (!pdfBoltResponse.ok) {
      const errorText = await pdfBoltResponse.text();
      console.error('PDFBolt API error:', errorText);
      throw new Error(`PDFBolt API failed: ${pdfBoltResponse.status} - ${errorText}`);
    }

    const pdfBuffer = await pdfBoltResponse.arrayBuffer();
    console.log('PDF generated successfully, size:', pdfBuffer.byteLength);

    // Upload PDF to Supabase Storage
    const fileName = `invoice-${invoice.invoice_number}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('invoices')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    console.log('PDF uploaded to storage:', uploadData.path);

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('invoices')
      .getPublicUrl(uploadData.path);

    const pdfUrl = urlData.publicUrl;
    console.log('Public URL:', pdfUrl);

    // Update invoice with PDF URL
    const { error: updateError } = await supabaseClient
      .from('invoices')
      .update({ pdf_url: pdfUrl })
      .eq('id', invoiceId);

    if (updateError) {
      console.error('Invoice update error:', updateError);
      throw new Error(`Failed to update invoice: ${updateError.message}`);
    }

    console.log('Invoice updated with PDF URL');

    return new Response(
      JSON.stringify({
        success: true,
        pdfUrl,
        message: 'PDF generated successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-pdf-from-invoice:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
