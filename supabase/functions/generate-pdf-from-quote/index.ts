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

    // ============= ELEGANT PREMIUM HEADER =============
    const headerHeight = 160;
    const gradientSteps = 40;

    // Create smooth elegant gradient (dark blue to medium blue)
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const r = 0.09 + (0.12 - 0.09) * ratio;
      const g = 0.19 + (0.26 - 0.19) * ratio;
      const b = 0.33 + (0.42 - 0.33) * ratio;
      
      page.drawRectangle({
        x: 0,
        y: height - headerHeight + (i * headerHeight / gradientSteps),
        width: width,
        height: (headerHeight / gradientSteps) + 1,
        color: rgb(r, g, b),
      });
    }

    // Subtle glow effect under header
    page.drawRectangle({
      x: 0,
      y: height - headerHeight - 8,
      width: width,
      height: 8,
      color: rgb(0.09, 0.19, 0.33),
      opacity: 0.05,
    });

    // === LARGER, MORE VISIBLE LOGO ===
    if (logoData) {
      try {
        const logoBytes = await logoData.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.25);
        
        page.drawImage(logoImage, {
          x: 50,
          y: height - 110,
          width: logoDims.width,
          height: logoDims.height,
        });
      } catch (error) {
        console.warn('Failed to embed logo:', error);
      }
    }

    // === ELEGANT COMPANY INFO (RIGHT SIDE) ===
    let infoY = height - 70;
    const infoX = width - 220;
    const lineSpacing = 18;

    page.drawText('FIXCO AB', {
      x: infoX,
      y: infoY,
      size: 16,
      font: boldFont,
      color: rgb(1, 1, 1),
      opacity: 0.95,
    });

    infoY -= lineSpacing;
    page.drawText('Org.nr: 559123-4567', {
      x: infoX,
      y: infoY,
      size: 10,
      font: font,
      color: rgb(0.9, 0.9, 0.9),
      opacity: 0.85,
    });

    infoY -= lineSpacing;
    page.drawText('info@fixco.se', {
      x: infoX,
      y: infoY,
      size: 10,
      font: font,
      color: rgb(0.9, 0.9, 0.9),
      opacity: 0.85,
    });

    infoY -= lineSpacing;
    page.drawText('073-123 45 67', {
      x: infoX,
      y: infoY,
      size: 10,
      font: font,
      color: rgb(0.9, 0.9, 0.9),
      opacity: 0.85,
    });

    infoY -= lineSpacing;
    page.drawText('fixco.se', {
      x: infoX,
      y: infoY,
      size: 10,
      font: font,
      color: rgb(0.9, 0.9, 0.9),
      opacity: 0.85,
    });

    // === PROMINENT TITLE WITH SUBTLE BACKGROUND ===
    yPos = height - 190;

    // Subtle background for title
    page.drawRectangle({
      x: 40,
      y: yPos - 10,
      width: 320,
      height: 50,
      color: rgb(0.98, 0.99, 1),
      opacity: 0.5,
    });

    page.drawText(`OFFERT ${quote.number}`, {
      x: 50,
      y: yPos,
      size: 36,
      font: boldFont,
      color: rgb(0.09, 0.19, 0.33),
    });

    // === CUSTOMER INFO WITH ELEGANT BOX ===
    yPos -= 70;

    // Box for customer section
    page.drawRectangle({
      x: 40,
      y: yPos - 100,
      width: 250,
      height: 120,
      color: rgb(0.98, 0.99, 1),
      borderColor: rgb(0.92, 0.94, 0.96),
      borderWidth: 1,
    });

    // Accent bar
    page.drawRectangle({
      x: 50,
      y: yPos + 5,
      width: 6,
      height: 20,
      color: rgb(0.09, 0.19, 0.33),
    });

    page.drawText('KUND', {
      x: 65,
      y: yPos,
      size: 11,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    yPos -= 20;
    const customerName = quote.customer?.name || 'Okänd kund';
    page.drawText(customerName, {
      x: 65,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    if (quote.customer?.email) {
      yPos -= 18;
      page.drawText(quote.customer.email, {
        x: 65,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    if (quote.customer?.phone) {
      yPos -= 16;
      page.drawText(quote.customer.phone, {
        x: 65,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    // === QUOTE DETAILS BOX (RIGHT COLUMN) ===
    let detailsY = height - 260;
    const detailsX = width - 250;

    // Box for details section
    page.drawRectangle({
      x: detailsX - 10,
      y: detailsY - 80,
      width: 230,
      height: 100,
      color: rgb(0.98, 0.99, 1),
      borderColor: rgb(0.92, 0.94, 0.96),
      borderWidth: 1,
    });

    // Accent bar
    page.drawRectangle({
      x: detailsX,
      y: detailsY + 5,
      width: 6,
      height: 20,
      color: rgb(0.09, 0.19, 0.33),
    });

    page.drawText('OFFERTDETALJER', {
      x: detailsX + 15,
      y: detailsY,
      size: 11,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    detailsY -= 20;
    page.drawText('Offertnummer:', {
      x: detailsX + 15,
      y: detailsY,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(quote.number, {
      x: detailsX + 120,
      y: detailsY,
      size: 10,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    detailsY -= 18;
    page.drawText('Datum:', {
      x: detailsX + 15,
      y: detailsY,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(new Date(quote.created_at).toLocaleDateString('sv-SE'), {
      x: detailsX + 120,
      y: detailsY,
      size: 10,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });

    detailsY -= 18;
    page.drawText('Giltig till:', {
      x: detailsX + 15,
      y: detailsY,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(new Date(quote.valid_until).toLocaleDateString('sv-SE'), {
      x: detailsX + 120,
      y: detailsY,
      size: 10,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });

    // === MODERN LINE ITEMS TABLE ===
    yPos -= 60;

    page.drawText('SPECIFIKATION', {
      x: 50,
      y: yPos,
      size: 13,
      font: boldFont,
      color: rgb(0.09, 0.19, 0.33),
    });

    yPos -= 30;
    const tableY = yPos;
    const tableWidth = width - 80;
    
    // Table header with gradient
    for (let i = 0; i < 10; i++) {
      const ratio = i / 10;
      const r = 0.09 + (0.11 - 0.09) * ratio;
      const g = 0.19 + (0.22 - 0.19) * ratio;
      const b = 0.33 + (0.38 - 0.33) * ratio;
      
      page.drawRectangle({
        x: 40,
        y: tableY - 5 + (i * 30 / 10),
        width: tableWidth,
        height: 30 / 10 + 1,
        color: rgb(r, g, b),
      });
    }

    page.drawText('Beskrivning', {
      x: 50,
      y: yPos + 2,
      size: 11,
      font: boldFont,
      color: rgb(1, 1, 1),
      opacity: 0.95,
    });

    page.drawText('Antal', {
      x: 320,
      y: yPos + 2,
      size: 11,
      font: boldFont,
      color: rgb(1, 1, 1),
      opacity: 0.95,
    });

    page.drawText('Enhet', {
      x: 375,
      y: yPos + 2,
      size: 11,
      font: boldFont,
      color: rgb(1, 1, 1),
      opacity: 0.95,
    });

    page.drawText('Pris/enhet', {
      x: 430,
      y: yPos + 2,
      size: 11,
      font: boldFont,
      color: rgb(1, 1, 1),
      opacity: 0.95,
    });

    page.drawText('Totalt', {
      x: 500,
      y: yPos + 2,
      size: 11,
      font: boldFont,
      color: rgb(1, 1, 1),
      opacity: 0.95,
    });

    // Table rows with improved styling
    yPos -= 25;
    const items = quote.items || [];
    let rowIndex = 0;
    
    for (const item of items) {
      // Alternating row background (more subtle)
      if (rowIndex % 2 === 1) {
        page.drawRectangle({
          x: 40,
          y: yPos - 5,
          width: tableWidth,
          height: 20,
          color: rgb(0.985, 0.99, 0.995),
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

    // === ELEGANT SUMMARY BOX ===
    yPos -= 20;
    const summaryX = width - 260;
    const summaryBoxWidth = 240;

    // Subtle shadow
    page.drawRectangle({
      x: summaryX - 6,
      y: yPos - 94,
      width: summaryBoxWidth,
      height: 90,
      color: rgb(0, 0, 0),
      opacity: 0.03,
    });

    // Main summary box
    page.drawRectangle({
      x: summaryX - 10,
      y: yPos - 90,
      width: summaryBoxWidth,
      height: 90,
      color: rgb(0.99, 0.99, 1),
      borderColor: rgb(0.90, 0.92, 0.95),
      borderWidth: 1,
    });

    page.drawLine({
      start: { x: summaryX - 10, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    yPos -= 25;
    page.drawText('Arbetskostnad:', {
      x: summaryX,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(`${(quote.subtotal_work_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: width - 110,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });

    yPos -= 18;
    page.drawText('Material:', {
      x: summaryX,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(`${(quote.subtotal_mat_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: width - 110,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });

    yPos -= 18;
    page.drawText('Moms (25%):', {
      x: summaryX,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(`${(quote.vat_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: width - 110,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });

    // === ROT-AVDRAG WITH ENHANCED STYLING ===
    if (quote.rot_deduction_sek && quote.rot_deduction_sek > 0) {
      yPos -= 24;
      
      // Glow effect
      page.drawRectangle({
        x: summaryX - 12,
        y: yPos - 7,
        width: summaryBoxWidth + 4,
        height: 28,
        color: rgb(0.1, 0.7, 0.1),
        opacity: 0.1,
      });

      // Green highlight box for ROT
      page.drawRectangle({
        x: summaryX - 10,
        y: yPos - 5,
        width: summaryBoxWidth,
        height: 24,
        color: rgb(0.95, 0.99, 0.95),
        borderColor: rgb(0.2, 0.8, 0.3),
        borderWidth: 1.5,
      });

      // Icon circle
      page.drawCircle({
        x: summaryX + 5,
        y: yPos + 7,
        size: 8,
        color: rgb(0.1, 0.7, 0.1),
      });

      page.drawText(`ROT-avdrag (${quote.rot_percentage || 30}%):`, {
        x: summaryX + 20,
        y: yPos,
        size: 11,
        font: boldFont,
        color: rgb(0.1, 0.5, 0.1),
      });
      page.drawText(`-${quote.rot_deduction_sek.toLocaleString('sv-SE')} kr`, {
        x: width - 110,
        y: yPos,
        size: 11,
        font: boldFont,
        color: rgb(0.1, 0.5, 0.1),
      });
    }

    // === HERO TOTAL BOX ===
    yPos -= 34;

    // Subtle outer glow
    page.drawRectangle({
      x: summaryX - 14,
      y: yPos - 48,
      width: summaryBoxWidth + 8,
      height: 50,
      color: rgb(0.09, 0.19, 0.33),
      opacity: 0.15,
    });

    // Gradient background for total
    for (let i = 0; i < 15; i++) {
      const ratio = i / 15;
      const r = 0.09 + (0.12 - 0.09) * ratio;
      const g = 0.19 + (0.23 - 0.19) * ratio;
      const b = 0.33 + (0.40 - 0.33) * ratio;
      
      page.drawRectangle({
        x: summaryX - 10,
        y: yPos - 42 + (i * 42 / 15),
        width: summaryBoxWidth,
        height: 42 / 15 + 1,
        color: rgb(r, g, b),
      });
    }

    page.drawText('TOTALT ATT BETALA', {
      x: summaryX,
      y: yPos + 2,
      size: 10,
      font: font,
      color: rgb(0.9, 0.9, 0.9),
    });

    page.drawText(`${(quote.total_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: summaryX,
      y: yPos - 22,
      size: 20,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // === PROFESSIONAL FOOTER ===
    const footerY = 100;
    const footerHeight = 90;

    // Gradient footer background
    for (let i = 0; i < 10; i++) {
      const ratio = i / 10;
      const brightness = 0.97 - (0.02 * ratio);
      
      page.drawRectangle({
        x: 0,
        y: footerY - footerHeight + (i * footerHeight / 10),
        width: width,
        height: footerHeight / 10 + 1,
        color: rgb(brightness, brightness, brightness),
      });
    }

    // Top border with accent
    page.drawLine({
      start: { x: 0, y: footerY },
      end: { x: width, y: footerY },
      thickness: 3,
      color: rgb(0.09, 0.19, 0.33),
    });

    // Decorative line
    page.drawLine({
      start: { x: 0, y: footerY - 2 },
      end: { x: width, y: footerY - 2 },
      thickness: 1,
      color: rgb(0.3, 0.5, 0.7),
      opacity: 0.3,
    });

    yPos = footerY - 25;

    page.drawText('FIXCO AB | Org.nr: 559123-4567 | Bankgiro: 1234-5678', {
      x: 50,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPos -= 16;
    
    // Email icon (circle)
    page.drawCircle({
      x: 42,
      y: yPos + 3,
      size: 4,
      color: rgb(0.09, 0.19, 0.33),
    });
    
    page.drawText('info@fixco.se', {
      x: 50,
      y: yPos,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Phone icon (circle)
    page.drawCircle({
      x: 142,
      y: yPos + 3,
      size: 4,
      color: rgb(0.09, 0.19, 0.33),
    });

    page.drawText('073-123 45 67', {
      x: 150,
      y: yPos,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Web icon (circle)
    page.drawCircle({
      x: 242,
      y: yPos + 3,
      size: 4,
      color: rgb(0.09, 0.19, 0.33),
    });

    page.drawText('fixco.se', {
      x: 250,
      y: yPos,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    yPos -= 16;
    page.drawText('Betalningsvillkor: 30 dagar netto. Dröjsmålsränta enligt lag.', {
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