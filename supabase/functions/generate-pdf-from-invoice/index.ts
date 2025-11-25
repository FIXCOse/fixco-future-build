import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
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

    // Fetch logo from storage
    const { data: logoData, error: logoError } = await supabaseClient.storage
      .from('assets')
      .download('fixco-logo-white.png');

    if (logoError) {
      console.warn('Logo not found, continuing without logo:', logoError);
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = height - 50;

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
      font: fontBold,
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
    yPosition = height - 130;

    page.drawText('FAKTURA', {
      x: 50,
      y: yPosition,
      size: 36,
      font: fontBold,
      color: rgb(0.20, 0.40, 0.70), // Primary blue
    });

    // Two-column layout for invoice details
    yPosition -= 50;
    
    // Left column - Invoice details
    page.drawText(`Fakturanummer: ${invoice.invoice_number}`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;
    page.drawText(`Fakturadatum: ${new Date(invoice.issue_date).toLocaleDateString('sv-SE')}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    yPosition -= 16;
    page.drawText(`Förfallodatum: ${new Date(invoice.due_date).toLocaleDateString('sv-SE')}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.8, 0.2, 0.2), // Red for due date
    });

    // Right column - Payment terms
    let rightColY = height - 220;
    page.drawText('BETALNINGSVILLKOR', {
      x: 350,
      y: rightColY,
      size: 11,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    rightColY -= 20;
    page.drawText('30 dagar netto', {
      x: 350,
      y: rightColY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    rightColY -= 16;
    page.drawText('Dröjsmålsränta enligt räntelagen', {
      x: 350,
      y: rightColY,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    // === ELEGANT CUSTOMER INFO BOX ===
    yPosition -= 65;

    // Modern card with border
    page.drawRectangle({
      x: 40,
      y: yPosition - 115,
      width: 260,
      height: 130,
      color: rgb(0.99, 0.99, 1),
      borderColor: rgb(0.90, 0.92, 0.94),
      borderWidth: 1,
    });

    // Accent bar (brand color)
    page.drawRectangle({
      x: 50,
      y: yPosition + 5,
      width: 6,
      height: 22,
      color: rgb(0.10, 0.60, 0.90), // Electric blue
    });

    page.drawText('KUND', {
      x: 65,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0.40, 0.42, 0.45), // Text gray
    });

    yPosition -= 22;
    const customer = invoice.customer;
    if (customer) {
      const customerName = customer.company_name || customer.name || 'Okänd kund';
      page.drawText(customerName, {
        x: 65,
        y: yPosition,
        size: 13,
        font: fontBold,
        color: rgb(0.10, 0.10, 0.12), // Text dark
      });

      if (customer.org_number) {
        yPosition -= 18;
        page.drawText(`Org.nr: ${customer.org_number}`, {
          x: 65,
          y: yPosition,
          size: 10,
          font,
          color: rgb(0.40, 0.42, 0.45),
        });
      }

      if (customer.address) {
        yPosition -= 17;
        page.drawText(customer.address, {
          x: 65,
          y: yPosition,
          size: 10,
          font,
          color: rgb(0.40, 0.42, 0.45),
        });
      }

      if (customer.postal_code && customer.city) {
        yPosition -= 17;
        page.drawText(`${customer.postal_code} ${customer.city}`, {
          x: 65,
          y: yPosition,
          size: 10,
          font,
          color: rgb(0.40, 0.42, 0.45),
        });
      }
    }

    // === CLEAN TABLE SECTION ===
    yPosition -= 55;
    page.drawText('SPECIFIKATION', {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0.20, 0.40, 0.70),
    });

    // Clean table header (no gradient)
    yPosition -= 25;
    const tableHeaderY = yPosition;
    const tableWidth = width - 80;
    
    page.drawRectangle({
      x: 40,
      y: tableHeaderY - 5,
      width: tableWidth,
      height: 25,
      color: rgb(0.98, 0.99, 1),
      borderColor: rgb(0.90, 0.92, 0.94),
      borderWidth: 1,
    });

    page.drawText('Beskrivning', { 
      x: 50, 
      y: yPosition + 2, 
      size: 10, 
      font: fontBold,
      color: rgb(0.10, 0.10, 0.12),
    });
    
    page.drawText('Antal', { 
      x: 300, 
      y: yPosition + 2, 
      size: 10, 
      font: fontBold,
      color: rgb(0.10, 0.10, 0.12),
    });
    
    page.drawText('Pris', { 
      x: 370, 
      y: yPosition + 2, 
      size: 10, 
      font: fontBold,
      color: rgb(0.10, 0.10, 0.12),
    });
    
    page.drawText('Belopp', { 
      x: 470, 
      y: yPosition + 2, 
      size: 10, 
      font: fontBold,
      color: rgb(0.10, 0.10, 0.12),
    });

    yPosition -= 25;

    // Clean line items (no zebra-striping)
    const lineItems = invoice.line_items as Array<{
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }>;

    for (const item of lineItems) {
      if (yPosition < 200) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        yPosition = height - 60;
      }

      page.drawText(item.description || '', {
        x: 50,
        y: yPosition,
        size: 10,
        font,
        maxWidth: 230,
        color: rgb(0.10, 0.10, 0.12),
      });

      page.drawText(item.quantity?.toString() || '1', {
        x: 300,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.10, 0.10, 0.12),
      });

      page.drawText(
        `${(item.unit_price || 0).toLocaleString('sv-SE')} kr`,
        { x: 370, y: yPosition, size: 10, font, color: rgb(0.10, 0.10, 0.12) }
      );

      page.drawText(
        `${(item.amount || 0).toLocaleString('sv-SE')} kr`,
        { x: 470, y: yPosition, size: 10, font, color: rgb(0.10, 0.10, 0.12) }
      );

      yPosition -= 22;
    }

    // === ELEGANT SUMMARY BOX WITH SHADOW ===
    yPosition -= 30;
    const summaryBoxX = 340;
    const summaryBoxWidth = width - 390;
    const summaryBoxHeight = 175;
    
    // Soft shadow effect
    page.drawRectangle({
      x: summaryBoxX + 3,
      y: yPosition - summaryBoxHeight + 3,
      width: summaryBoxWidth,
      height: summaryBoxHeight,
      color: rgb(0.06, 0.12, 0.24),
      opacity: 0.05,
    });
    
    // Main summary box
    page.drawRectangle({
      x: summaryBoxX,
      y: yPosition - summaryBoxHeight,
      width: summaryBoxWidth,
      height: summaryBoxHeight,
      color: rgb(0.99, 0.99, 1),
      borderColor: rgb(0.90, 0.92, 0.94),
      borderWidth: 1,
    });
    
    // Gradient accent bar on left
    for (let i = 0; i < 20; i++) {
      const ratio = i / 20;
      const r = 0.10 + (0.20 - 0.10) * ratio;
      const g = 0.60 + (0.40 - 0.60) * ratio;
      const b = 0.90 + (0.70 - 0.90) * ratio;
      
      page.drawRectangle({
        x: summaryBoxX,
        y: yPosition - summaryBoxHeight + (i * summaryBoxHeight / 20),
        width: 5,
        height: summaryBoxHeight / 20 + 1,
        color: rgb(r, g, b),
      });
    }

    const drawSummaryLine = (label: string, amount: number, bold = false, color = rgb(0, 0, 0)) => {
      page.drawText(label, {
        x: 360,
        y: yPosition,
        size: 10,
        font: bold ? fontBold : font,
        color,
      });

      page.drawText(`${amount.toLocaleString('sv-SE')} kr`, {
        x: 480,
        y: yPosition,
        size: 10,
        font: bold ? fontBold : font,
        color,
      });

      yPosition -= 20;
    };

    yPosition -= 10;
    drawSummaryLine('Delsumma:', invoice.subtotal);
    drawSummaryLine('Moms (25%):', invoice.vat_amount);

    if (invoice.rot_amount && invoice.rot_amount > 0) {
      drawSummaryLine('ROT-avdrag:', -invoice.rot_amount, false, rgb(0.1, 0.6, 0.1));
    }

    if (invoice.rut_amount && invoice.rut_amount > 0) {
      drawSummaryLine('RUT-avdrag:', -invoice.rut_amount, false, rgb(0.1, 0.6, 0.1));
    }

    if (invoice.discount_amount && invoice.discount_amount > 0) {
      drawSummaryLine('Rabatt:', -invoice.discount_amount);
    }

    yPosition -= 8;
    // Gradient separator line
    for (let i = 0; i < 30; i++) {
      const ratio = i / 30;
      const r = 0.06 + (0.10 - 0.06) * ratio;
      const g = 0.12 + (0.60 - 0.12) * ratio;
      const b = 0.24 + (0.90 - 0.24) * ratio;
      
      page.drawRectangle({
        x: 350 + (i * (width - 400) / 30),
        y: yPosition,
        width: (width - 400) / 30 + 1,
        height: 2,
        color: rgb(r, g, b),
      });
    }

    // === HERO TOTAL BOX - GRADIENT (LILA → CYAN → ROSA) ===
    yPosition -= 30;
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
        y: yPosition - totalBoxHeight + (i * totalBoxHeight / gradientSteps),
        width: totalBoxWidth,
        height: (totalBoxHeight / gradientSteps) + 1,
        color: rgb(r, g, b),
      });
    }

    page.drawText('ATT BETALA', {
      x: totalBoxX + 15,
      y: yPosition - 15,
      size: 11,
      font: font,
      color: rgb(1, 1, 1),
    });

    page.drawText(`${invoice.total_amount.toLocaleString('sv-SE')} kr`, {
      x: totalBoxX + 15,
      y: yPosition - 40,
      size: 22,
      font: fontBold,
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

    yPosition = footerY - 18;
    
    page.drawText('FIXCO AB | Org.nr: 559123-4567 | Bankgiro: 1234-5678', {
      x: (width - 300) / 2,
      y: yPosition,
      size: 8,
      font,
      color: rgb(0.40, 0.42, 0.45),
    });

    yPosition -= 12;
    page.drawText('info@fixco.se | 073-123 45 67 | fixco.se', {
      x: (width - 230) / 2,
      y: yPosition,
      size: 8,
      font,
      color: rgb(0.40, 0.42, 0.45),
    });

    yPosition -= 12;
    page.drawText('Betalningsvillkor: 30 dagar netto. Dröjsmålsränta enligt lag.', {
      x: (width - 330) / 2,
      y: yPosition,
      size: 8,
      font,
      color: rgb(0.52, 0.54, 0.56),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Upload to Supabase Storage
    const fileName = `invoice-${invoice.invoice_number}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('invoices')
      .upload(fileName, pdfBlob, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    console.log('PDF uploaded successfully:', fileName);

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('invoices')
      .getPublicUrl(fileName);

    // Add cache-busting parameter to force browser reload
    const cacheBustedUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    // Update invoice with pdf_url
    const { error: updateError } = await supabaseClient
      .from('invoices')
      .update({ pdf_url: urlData.publicUrl })
      .eq('id', invoiceId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Failed to update invoice: ${updateError.message}`);
    }

    console.log('Invoice updated with PDF URL');

    return new Response(
      JSON.stringify({
        success: true,
        pdf_url: cacheBustedUrl,
        message: 'PDF generated successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate PDF',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});