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

    // ============= MINIMAL CLEAN HEADER =============

    // === CLEAN LOGO (smaller) ===
    if (logoData) {
      try {
        const logoBytes = await logoData.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.22);
        
        page.drawImage(logoImage, {
          x: 50,
          y: height - 65,
          width: logoDims.width,
          height: logoDims.height,
        });
      } catch (error) {
        console.warn('Failed to embed logo:', error);
      }
    }

    // === MINIMAL COMPANY INFO (RIGHT SIDE) ===
    const infoX = width - 180;
    let infoY = height - 45;
    const lineSpacing = 14;

    page.drawText('FIXCO AB', {
      x: infoX,
      y: infoY,
      size: 11,
      font: boldFont,
      color: rgb(0.10, 0.10, 0.12),
    });

    infoY -= lineSpacing;
    page.drawText('Org.nr: 559123-4567', {
      x: infoX,
      y: infoY,
      size: 9,
      font: font,
      color: rgb(0.40, 0.42, 0.45),
    });

    infoY -= lineSpacing;
    page.drawText('info@fixco.se', {
      x: infoX,
      y: infoY,
      size: 9,
      font: font,
      color: rgb(0.40, 0.42, 0.45),
    });

    infoY -= lineSpacing;
    page.drawText('073-123 45 67', {
      x: infoX,
      y: infoY,
      size: 9,
      font: font,
      color: rgb(0.40, 0.42, 0.45),
    });
    
    // Thin separator under header
    page.drawLine({
      start: { x: 40, y: height - 90 },
      end: { x: width - 40, y: height - 90 },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    // === PROMINENT TITLE (CLEAN) ===
    yPos = height - 130;

    page.drawText(`OFFERT ${quote.number}`, {
      x: 50,
      y: yPos,
      size: 36,
      font: boldFont,
      color: rgb(0.20, 0.40, 0.70), // Primary blue
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
      color: rgb(0.10, 0.60, 0.90), // Electric blue
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
      color: rgb(0.10, 0.60, 0.90), // Electric blue
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

    // === CLEAN LINE ITEMS TABLE ===
    yPos -= 60;

    page.drawText('VAD INGÅR I OFFERTEN', {
      x: 50,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.20, 0.40, 0.70),
    });

    yPos -= 25;
    const tableY = yPos;
    const tableWidth = width - 80;
    
    // Clean table header (no gradient)
    page.drawRectangle({
      x: 40,
      y: tableY - 5,
      width: tableWidth,
      height: 25,
      color: rgb(0.98, 0.99, 1),
      borderColor: rgb(0.90, 0.92, 0.94),
      borderWidth: 1,
    });

    page.drawText('Beskrivning', {
      x: 50,
      y: yPos + 2,
      size: 10,
      font: boldFont,
      color: rgb(0.10, 0.10, 0.12),
    });

    page.drawText('Antal', {
      x: 320,
      y: yPos + 2,
      size: 10,
      font: boldFont,
      color: rgb(0.10, 0.10, 0.12),
    });

    page.drawText('Enhet', {
      x: 375,
      y: yPos + 2,
      size: 10,
      font: boldFont,
      color: rgb(0.10, 0.10, 0.12),
    });

    page.drawText('Pris/enhet', {
      x: 430,
      y: yPos + 2,
      size: 10,
      font: boldFont,
      color: rgb(0.10, 0.10, 0.12),
    });

    page.drawText('Totalt', {
      x: 500,
      y: yPos + 2,
      size: 10,
      font: boldFont,
      color: rgb(0.10, 0.10, 0.12),
    });

    // Clean table rows (no zebra-striping)
    yPos -= 25;
    const items = quote.items || [];
    
    for (const item of items) {
      const quantity = item.quantity || 0;
      const price = item.price || 0;
      const total = quantity * price;

      page.drawText(item.description || '', {
        x: 50,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.10, 0.10, 0.12),
        maxWidth: 250,
      });

      page.drawText(quantity.toString(), {
        x: 320,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.10, 0.10, 0.12),
      });

      page.drawText(item.unit || 'st', {
        x: 375,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.10, 0.10, 0.12),
      });

      page.drawText(`${price.toLocaleString('sv-SE')} kr`, {
        x: 430,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.10, 0.10, 0.12),
      });

      page.drawText(`${total.toLocaleString('sv-SE')} kr`, {
        x: 500,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.10, 0.10, 0.12),
      });

      yPos -= 22;

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

    // === HERO TOTAL BOX - GRADIENT (LILA → CYAN → ROSA) ===
    yPos -= 34;
    const totalBoxWidth = 200;
    const totalBoxHeight = 60;
    const totalBoxX = width - totalBoxWidth - 50;

    // Smooth 3-color gradient (LILA → CYAN → ROSA)
    const gradientSteps = 40;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / (gradientSteps - 1);
      
      let r, g, b;
      
      if (ratio < 0.5) {
        // First half: LILA → CYAN (0 → 0.5)
        const localRatio = ratio * 2; // 0 → 1
        r = 0.52 + (0.00 - 0.52) * localRatio;  // 0.52 → 0.00
        g = 0.20 + (0.75 - 0.20) * localRatio;  // 0.20 → 0.75
        b = 0.90 + (1.00 - 0.90) * localRatio;  // 0.90 → 1.00
      } else {
        // Second half: CYAN → ROSA (0.5 → 1.0)
        const localRatio = (ratio - 0.5) * 2; // 0 → 1
        r = 0.00 + (1.00 - 0.00) * localRatio;  // 0.00 → 1.00
        g = 0.75 + (0.30 - 0.75) * localRatio;  // 0.75 → 0.30
        b = 1.00 + (0.90 - 1.00) * localRatio;  // 1.00 → 0.90
      }
      
      page.drawRectangle({
        x: totalBoxX,
        y: yPos - totalBoxHeight + (i * totalBoxHeight / gradientSteps),
        width: totalBoxWidth,
        height: (totalBoxHeight / gradientSteps) + 1,
        color: rgb(r, g, b),
      });
    }

    page.drawText('TOTALT ATT BETALA', {
      x: totalBoxX + 15,
      y: yPos - 15,
      size: 11,
      font: font,
      color: rgb(1, 1, 1),
    });

    page.drawText(`${(quote.total_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: totalBoxX + 15,
      y: yPos - 40,
      size: 22,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // === MINIMAL FOOTER ===
    const footerY = 80;
    
    // Thin separator line
    page.drawLine({
      start: { x: 50, y: footerY },
      end: { x: width - 50, y: footerY },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    yPos = footerY - 18;
    
    page.drawText('FIXCO AB | Org.nr: 559123-4567 | Bankgiro: 1234-5678', {
      x: (width - 300) / 2,
      y: yPos,
      size: 8,
      font: font,
      color: rgb(0.40, 0.42, 0.45),
    });

    yPos -= 12;
    page.drawText('info@fixco.se | 073-123 45 67 | fixco.se', {
      x: (width - 230) / 2,
      y: yPos,
      size: 8,
      font: font,
      color: rgb(0.40, 0.42, 0.45),
    });

    yPos -= 12;
    page.drawText('Betalningsvillkor: 30 dagar netto. Dröjsmålsränta enligt lag.', {
      x: (width - 330) / 2,
      y: yPos,
      size: 8,
      font: font,
      color: rgb(0.52, 0.54, 0.56),
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