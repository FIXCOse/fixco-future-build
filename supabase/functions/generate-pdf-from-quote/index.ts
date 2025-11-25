import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateQuoteHTML } from '../_shared/pdf-html-templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { quoteId } = await req.json();
    console.log('Generating PDF for quote:', quoteId);

    // Fetch quote data
    const { data: quote, error: quoteError } = await supabaseClient
      .from('quotes_new')
      .select(`
        *,
        customer:customers(*)
      `)
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      console.error('Quote fetch error:', quoteError);
      throw new Error('Quote not found');
    }

    console.log('Quote fetched successfully:', quote.number);

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
    const html = generateQuoteHTML(quote, logoBase64);
    console.log('HTML generated, calling PDFBolt API...');

    // Convert HTML to PDF using PDFBolt
    const pdfBoltResponse = await fetch('https://api.pdfbolt.com/v1/direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API_KEY': Deno.env.get('PDFBOLT_API_KEY') ?? '',
      },
      body: JSON.stringify({
        html: btoa(html), // Base64 encode the HTML
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
    const fileName = `quote-${quote.number}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('quotes')
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
      .from('quotes')
      .getPublicUrl(uploadData.path);

    const pdfUrl = urlData.publicUrl;
    console.log('Public URL:', pdfUrl);

    // Update quote with PDF URL
    const { error: updateError } = await supabaseClient
      .from('quotes_new')
      .update({ pdf_url: pdfUrl })
      .eq('id', quoteId);

    if (updateError) {
      console.error('Quote update error:', updateError);
      throw new Error(`Failed to update quote: ${updateError.message}`);
    }

    console.log('Quote updated with PDF URL');

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
    console.error('Error in generate-pdf-from-quote:', error);
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
