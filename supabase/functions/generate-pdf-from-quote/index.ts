import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1';

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

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPos = height - 50;

    // Header with gradient background (simulated with rectangles)
    page.drawRectangle({
      x: 0,
      y: height - 120,
      width: width,
      height: 120,
      color: rgb(0.1, 0.2, 0.4),
    });

    // Company name
    page.drawText('FIXCO', {
      x: 50,
      y: height - 60,
      size: 32,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText('Professionella hantverkstjänster', {
      x: 50,
      y: height - 85,
      size: 12,
      font: font,
      color: rgb(0.9, 0.9, 0.9),
    });

    // Quote title
    yPos = height - 150;
    page.drawText(`OFFERT ${quote.number}`, {
      x: 50,
      y: yPos,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.2, 0.4),
    });

    // Customer information
    yPos -= 40;
    page.drawText('KUND', {
      x: 50,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    yPos -= 20;
    const customerName = quote.customer?.name || 'Okänd kund';
    page.drawText(customerName, {
      x: 50,
      y: yPos,
      size: 11,
      font: font,
      color: rgb(0, 0, 0),
    });

    if (quote.customer?.email) {
      yPos -= 16;
      page.drawText(quote.customer.email, {
        x: 50,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    if (quote.customer?.phone) {
      yPos -= 16;
      page.drawText(quote.customer.phone, {
        x: 50,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    // Quote details (dates)
    yPos -= 35;
    page.drawText('OFFERTDETALJER', {
      x: 50,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    yPos -= 20;
    page.drawText(`Datum: ${new Date(quote.created_at).toLocaleDateString('sv-SE')}`, {
      x: 50,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    yPos -= 16;
    page.drawText(`Giltig till: ${new Date(quote.valid_until).toLocaleDateString('sv-SE')}`, {
      x: 50,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Line items table
    yPos -= 40;
    page.drawText('SPECIFIKATION', {
      x: 50,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Table header
    yPos -= 25;
    page.drawRectangle({
      x: 40,
      y: yPos - 5,
      width: width - 80,
      height: 20,
      color: rgb(0.95, 0.95, 0.95),
    });

    page.drawText('Beskrivning', {
      x: 50,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    page.drawText('Antal', {
      x: 320,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    page.drawText('Enhet', {
      x: 380,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    page.drawText('Pris/enhet', {
      x: 430,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    page.drawText('Totalt', {
      x: 500,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Table rows
    yPos -= 20;
    const items = quote.items || [];
    
    for (const item of items) {
      const quantity = item.quantity || 0;
      const price = item.price || 0;
      const total = quantity * price;

      page.drawText(item.description || '', {
        x: 50,
        y: yPos,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: 250,
      });

      page.drawText(quantity.toString(), {
        x: 320,
        y: yPos,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      page.drawText(item.unit || 'st', {
        x: 380,
        y: yPos,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${price.toLocaleString('sv-SE')} kr`, {
        x: 430,
        y: yPos,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${total.toLocaleString('sv-SE')} kr`, {
        x: 500,
        y: yPos,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });

      yPos -= 20;

      // Add new page if needed
      if (yPos < 150) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        yPos = height - 50;
      }
    }

    // Summary section
    yPos -= 30;
    page.drawLine({
      start: { x: 350, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });

    yPos -= 20;
    page.drawText('Arbetskostnad:', {
      x: 350,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });
    page.drawText(`${(quote.subtotal_work_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    yPos -= 16;
    page.drawText('Material:', {
      x: 350,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });
    page.drawText(`${(quote.subtotal_mat_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    yPos -= 16;
    page.drawText('Moms (25%):', {
      x: 350,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });
    page.drawText(`${(quote.vat_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    if (quote.rot_deduction_sek && quote.rot_deduction_sek > 0) {
      yPos -= 16;
      page.drawText(`ROT-avdrag (${quote.rot_percentage || 30}%):`, {
        x: 350,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.1, 0.6, 0.1),
      });
      page.drawText(`-${quote.rot_deduction_sek.toLocaleString('sv-SE')} kr`, {
        x: 480,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.1, 0.6, 0.1),
      });
    }

    yPos -= 20;
    page.drawLine({
      start: { x: 350, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 2,
      color: rgb(0.1, 0.2, 0.4),
    });

    yPos -= 25;
    page.drawText('TOTALT ATT BETALA:', {
      x: 350,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.2, 0.4),
    });
    page.drawText(`${(quote.total_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.2, 0.4),
    });

    // Footer
    yPos = 80;
    page.drawText('FIXCO AB |Org.nr: 123456-7890', {
      x: 50,
      y: yPos,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    yPos -= 12;
    page.drawText('info@fixco.se | +46 70 123 45 67 | www.fixco.se', {
      x: 50,
      y: yPos,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated, size:', pdfBytes.length);

    // Upload to Supabase Storage
    const fileName = `quote_${quote.number}_${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('quotes')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    console.log('PDF uploaded:', fileName);

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('quotes')
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);

    // Update quote with PDF URL
    const { error: updateError } = await supabaseClient
      .from('quotes_new')
      .update({ pdf_url: publicUrl })
      .eq('id', quoteId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Failed to update quote: ${updateError.message}`);
    }

    console.log('Quote updated with PDF URL');

    return new Response(
      JSON.stringify({ 
        success: true, 
        pdfUrl: publicUrl,
        message: 'PDF genererad och sparad' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in generate-pdf-from-quote:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate PDF',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
