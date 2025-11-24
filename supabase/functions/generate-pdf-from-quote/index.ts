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

    // Fetch logo from storage
    const { data: logoData, error: logoError } = await supabaseClient.storage
      .from('assets')
      .download('fixco-logo-white.png');

    if (logoError) {
      console.warn('Logo not found, continuing without logo:', logoError);
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPos = height - 50;

    // Premium header with gradient background
    page.drawRectangle({
      x: 0,
      y: height - 130,
      width: width,
      height: 130,
      color: rgb(0.1, 0.21, 0.36), // Mörk blå #1a365d
    });

    // Embed and draw logo if available
    if (logoData) {
      try {
        const logoBytes = await logoData.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.15);
        
        page.drawImage(logoImage, {
          x: 50,
          y: height - 100,
          width: logoDims.width,
          height: logoDims.height,
        });
      } catch (error) {
        console.warn('Failed to embed logo:', error);
      }
    }

    // Company info (right side of header)
    page.drawText('FIXCO AB', {
      x: width - 200,
      y: height - 55,
      size: 14,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText('Org.nr: 559123-4567', {
      x: width - 200,
      y: height - 72,
      size: 9,
      font: font,
      color: rgb(0.85, 0.85, 0.85),
    });

    page.drawText('info@fixco.se', {
      x: width - 200,
      y: height - 86,
      size: 9,
      font: font,
      color: rgb(0.85, 0.85, 0.85),
    });

    page.drawText('+46 70 123 45 67', {
      x: width - 200,
      y: height - 100,
      size: 9,
      font: font,
      color: rgb(0.85, 0.85, 0.85),
    });

    page.drawText('www.fixco.se', {
      x: width - 200,
      y: height - 114,
      size: 9,
      font: font,
      color: rgb(0.85, 0.85, 0.85),
    });

    // Quote title
    yPos = height - 170;
    page.drawText(`OFFERT ${quote.number}`, {
      x: 50,
      y: yPos,
      size: 28,
      font: boldFont,
      color: rgb(0.1, 0.21, 0.36),
    });

    // Two-column layout for customer and quote details
    yPos -= 50;
    
    // Left column - Customer information
    page.drawText('KUND', {
      x: 50,
      y: yPos,
      size: 11,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPos -= 20;
    const customerName = quote.customer?.name || 'Okänd kund';
    page.drawText(customerName, {
      x: 50,
      y: yPos,
      size: 11,
      font: boldFont,
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

    // Right column - Quote details
    let rightColY = height - 220;
    page.drawText('OFFERTDETALJER', {
      x: 350,
      y: rightColY,
      size: 11,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    rightColY -= 20;
    page.drawText(`Datum: ${new Date(quote.created_at).toLocaleDateString('sv-SE')}`, {
      x: 350,
      y: rightColY,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    rightColY -= 16;
    page.drawText(`Giltig till: ${new Date(quote.valid_until).toLocaleDateString('sv-SE')}`, {
      x: 350,
      y: rightColY,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Line items table
    yPos -= 60;
    page.drawText('SPECIFIKATION', {
      x: 50,
      y: yPos,
      size: 13,
      font: boldFont,
      color: rgb(0.1, 0.21, 0.36),
    });

    // Table header with background
    yPos -= 30;
    page.drawRectangle({
      x: 40,
      y: yPos - 5,
      width: width - 80,
      height: 22,
      color: rgb(0.1, 0.21, 0.36),
    });

    page.drawText('Beskrivning', {
      x: 50,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText('Antal', {
      x: 320,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText('Enhet', {
      x: 375,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText('Pris/enhet', {
      x: 430,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText('Totalt', {
      x: 500,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // Table rows with alternating background
    yPos -= 25;
    const items = quote.items || [];
    let rowIndex = 0;
    
    for (const item of items) {
      // Alternating row background
      if (rowIndex % 2 === 1) {
        page.drawRectangle({
          x: 40,
          y: yPos - 5,
          width: width - 80,
          height: 20,
          color: rgb(0.97, 0.97, 0.97),
        });
      }

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
        x: 375,
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
      rowIndex++;

      // Add new page if needed
      if (yPos < 200) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        yPos = height - 50;
      }
    }

    // Summary section with background
    yPos -= 20;
    page.drawRectangle({
      x: 340,
      y: yPos - 120,
      width: width - 390,
      height: 130,
      color: rgb(0.98, 0.98, 0.98),
    });

    page.drawLine({
      start: { x: 350, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    yPos -= 25;
    page.drawText('Arbetskostnad:', {
      x: 360,
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

    yPos -= 18;
    page.drawText('Material:', {
      x: 360,
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

    yPos -= 18;
    page.drawText('Moms (25%):', {
      x: 360,
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
      yPos -= 18;
      page.drawText(`ROT-avdrag (${quote.rot_percentage || 30}%):`, {
        x: 360,
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

    yPos -= 22;
    page.drawLine({
      start: { x: 350, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 2,
      color: rgb(0.1, 0.21, 0.36),
    });

    yPos -= 28;
    page.drawText('TOTALT ATT BETALA:', {
      x: 360,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.21, 0.36),
    });
    page.drawText(`${(quote.total_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.21, 0.36),
    });

    // Professional footer with separator
    yPos = 100;
    page.drawLine({
      start: { x: 50, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });

    yPos -= 20;
    page.drawText('FIXCO AB | Org.nr: 559123-4567 | Bankgiro: 1234-5678', {
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

    // Add cache-busting parameter to force browser reload
    const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
    console.log('Public URL:', cacheBustedUrl);

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
        pdfUrl: cacheBustedUrl,
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