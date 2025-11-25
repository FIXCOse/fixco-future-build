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

    // === CLEAN TITLE SECTION ===
    yPos = height - 130;

    page.drawText(`Offert #${quote.number}`, {
      x: 50,
      y: yPos,
      size: 24,
      font: boldFont,
      color: rgb(0.20, 0.40, 0.70), // Primary blue
    });

    // Thin separator
    yPos -= 15;
    page.drawLine({
      start: { x: 50, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    // === INFO GRID (Two Columns - Clean) ===
    yPos -= 35;
    const customerName = quote.customer?.name || 'Okänd kund';
    
    // Left column - MOTTAGARE
    page.drawText('MOTTAGARE', {
      x: 50,
      y: yPos,
      size: 10,
      font: boldFont,
      color: rgb(0.52, 0.54, 0.56), // Muted
    });

    yPos -= 18;
    page.drawText(customerName, {
      x: 50,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.10, 0.10, 0.12),
    });

    if (quote.customer?.email) {
      yPos -= 16;
      page.drawText(quote.customer.email, {
        x: 50,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.40, 0.42, 0.45),
      });
    }

    // Right column - GILTIG TILL
    let rightY = height - 163;
    
    page.drawText('GILTIG TILL', {
      x: 350,
      y: rightY,
      size: 10,
      font: font,
      color: rgb(0.52, 0.54, 0.56),
    });

    rightY -= 18;
    page.drawText(new Date(quote.valid_until).toLocaleDateString('sv-SE'), {
      x: 350,
      y: rightY,
      size: 12,
      font: boldFont,
      color: rgb(0.10, 0.10, 0.12),
    });

    // === SECTION-BASED LINE ITEMS (NO TABLE!) ===
    yPos -= 65;
    
    page.drawText('VAD INGÅR I OFFERTEN', {
      x: 50,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.20, 0.40, 0.70),
    });

    // Separator
    yPos -= 8;
    page.drawLine({
      start: { x: 50, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    yPos -= 25;

    // Process line items by category
    const items = quote.items || [];

    // Group items by type
    const workItems = items.filter((item: any) => item.type === 'work' || !item.type);
    const materialItems = items.filter((item: any) => item.type === 'material');

    // 🔧 ARBETE Section
    if (workItems.length > 0) {
      page.drawText('ARBETE', {
        x: 50,
        y: yPos,
        size: 11,
        font: boldFont,
        color: rgb(0.10, 0.10, 0.12),
      });

      yPos -= 20;

      for (const item of workItems) {
        if (yPos < 150) {
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          yPos = height - 60;
        }

        const quantity = item.quantity || 0;
        const price = item.price || 0;
        const total = quantity * price;

        // Item row
        const itemDesc = `${item.description} (${quantity} ${item.unit || 'st'} × ${price.toLocaleString('sv-SE')} kr)`;
        page.drawText(itemDesc, {
          x: 65,
          y: yPos,
          size: 10,
          font: font,
          color: rgb(0.10, 0.10, 0.12),
          maxWidth: 360,
        });

        // Amount (right-aligned)
        page.drawText(`${total.toLocaleString('sv-SE')} kr`, {
          x: 480,
          y: yPos,
          size: 10,
          font: boldFont,
          color: rgb(0.10, 0.10, 0.12),
        });

        yPos -= 16;

        // Supplier info (if available)
        if (item.supplier) {
          page.drawText(`Leverantör: ${item.supplier}`, {
            x: 80,
            y: yPos,
            size: 8,
            font: font,
            color: rgb(0.52, 0.54, 0.56), // Muted
          });
          yPos -= 14;
        } else {
          yPos -= 6;
        }
      }

      yPos -= 10;
    }

    // 📦 MATERIAL Section
    if (materialItems.length > 0) {
      page.drawText('MATERIAL', {
        x: 50,
        y: yPos,
        size: 11,
        font: boldFont,
        color: rgb(0.10, 0.10, 0.12),
      });

      yPos -= 20;

      for (const item of materialItems) {
        if (yPos < 150) {
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          yPos = height - 60;
        }

        const quantity = item.quantity || 0;
        const price = item.price || 0;
        const total = quantity * price;

        // Item row
        const itemDesc = `${item.description} (${quantity} ${item.unit || 'st'} × ${price.toLocaleString('sv-SE')} kr)`;
        page.drawText(itemDesc, {
          x: 65,
          y: yPos,
          size: 10,
          font: font,
          color: rgb(0.10, 0.10, 0.12),
          maxWidth: 360,
        });

        // Amount (right-aligned)
        page.drawText(`${total.toLocaleString('sv-SE')} kr`, {
          x: 480,
          y: yPos,
          size: 10,
          font: boldFont,
          color: rgb(0.10, 0.10, 0.12),
        });

        yPos -= 16;

        // Supplier info (if available)
        if (item.supplier) {
          page.drawText(`Leverantör: ${item.supplier}`, {
            x: 80,
            y: yPos,
            size: 8,
            font: font,
            color: rgb(0.52, 0.54, 0.56),
          });
          yPos -= 14;
        } else {
          yPos -= 6;
        }
      }

      yPos -= 10;
    }

    // === CLEAN COST SPECIFICATION ===
    yPos -= 35;
    
    page.drawText('KOSTNADSSPECIFIKATION', {
      x: 50,
      y: yPos,
      size: 12,
      font: boldFont,
      color: rgb(0.20, 0.40, 0.70),
    });

    // Separator
    yPos -= 8;
    page.drawLine({
      start: { x: 50, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    yPos -= 25;
    const costX = 350;

    // Work cost row
    page.drawText('Arbetskostnad', {
      x: costX,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.40, 0.42, 0.45),
    });
    page.drawText(`${(quote.subtotal_work_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.10, 0.10, 0.12),
    });

    yPos -= 14;
    page.drawLine({
      start: { x: costX - 10, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    // Material cost row
    yPos -= 14;
    page.drawText('Material', {
      x: costX,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.40, 0.42, 0.45),
    });
    page.drawText(`${(quote.subtotal_mat_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.10, 0.10, 0.12),
    });

    yPos -= 14;
    page.drawLine({
      start: { x: costX - 10, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    // VAT row
    yPos -= 14;
    page.drawText('Moms (25%)', {
      x: costX,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.40, 0.42, 0.45),
    });
    page.drawText(`${(quote.vat_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.10, 0.10, 0.12),
    });

    yPos -= 14;
    page.drawLine({
      start: { x: costX - 10, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    // ROT-avdrag (GREEN BOX if applicable)
    if (quote.rot_deduction_sek && quote.rot_deduction_sek > 0) {
      yPos -= 18;
      
      // Green background box
      page.drawRectangle({
        x: costX - 12,
        y: yPos - 4,
        width: width - costX - 38,
        height: 20,
        color: rgb(0.96, 0.99, 0.96), // Light green bg
        borderColor: rgb(0.60, 0.80, 0.60), // Green border
        borderWidth: 1,
      });

      page.drawText(`ROT-avdrag (${quote.rot_percentage || 30}%)`, {
        x: costX,
        y: yPos,
        size: 10,
        font: boldFont,
        color: rgb(0.13, 0.55, 0.13), // Green text
      });
      page.drawText(`-${quote.rot_deduction_sek.toLocaleString('sv-SE')} kr`, {
        x: 480,
        y: yPos,
        size: 10,
        font: boldFont,
        color: rgb(0.13, 0.55, 0.13),
      });

      yPos -= 18;
      page.drawLine({
        start: { x: costX - 10, y: yPos },
        end: { x: width - 50, y: yPos },
        thickness: 0.5,
        color: rgb(0.90, 0.92, 0.94),
      });
    }

    // === HERO TOTAL BOX - LARGE GRADIENT (LILA → CYAN → ROSA) ===
    yPos -= 30;
    const totalBoxWidth = 250; // STÖRRE!
    const totalBoxHeight = 70; // STÖRRE!
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

    // White text on gradient
    page.drawText('TOTALT ATT BETALA', {
      x: totalBoxX + 20,
      y: yPos - 20,
      size: 14,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText(`${(quote.total_sek || 0).toLocaleString('sv-SE')} kr`, {
      x: totalBoxX + 20,
      y: yPos - 50,
      size: 26,
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