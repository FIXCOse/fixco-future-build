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

    // ============= MODERN PREMIUM HEADER WITH SMOOTH GRADIENT =============
    const headerHeight = 160;
    const gradientSteps = 50;

    // Elegant smooth gradient (navy dark → electric blue)
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const r = 0.06 + (0.10 - 0.06) * ratio;
      const g = 0.12 + (0.60 - 0.12) * ratio;
      const b = 0.24 + (0.90 - 0.24) * ratio;
      
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
      y: height - headerHeight - 10,
      width: width,
      height: 10,
      color: rgb(0.06, 0.12, 0.24),
      opacity: 0.08,
    });

    // === LARGER, PREMIUM LOGO ===
    if (logoData) {
      try {
        const logoBytes = await logoData.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.30); // Större logotyp!
        
        page.drawImage(logoImage, {
          x: 50,
          y: height - 115,
          width: logoDims.width,
          height: logoDims.height,
        });
      } catch (error) {
        console.warn('Failed to embed logo:', error);
      }
    }

    // === ELEGANT COMPANY INFO (RIGHT SIDE) ===
    const infoX = width - 220;
    let infoY = height - 70;
    const lineSpacing = 18;

    page.drawText('FIXCO AB', {
      x: infoX,
      y: infoY,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1),
      opacity: 0.98,
    });

    infoY -= lineSpacing;
    page.drawText('Org.nr: 559123-4567', {
      x: infoX,
      y: infoY,
      size: 10,
      font: font,
      color: rgb(0.95, 0.95, 0.95),
      opacity: 0.9,
    });

    infoY -= lineSpacing;
    page.drawText('info@fixco.se', {
      x: infoX,
      y: infoY,
      size: 10,
      font: font,
      color: rgb(0.95, 0.95, 0.95),
      opacity: 0.9,
    });

    infoY -= lineSpacing;
    page.drawText('073-123 45 67', {
      x: infoX,
      y: infoY,
      size: 10,
      font: font,
      color: rgb(0.95, 0.95, 0.95),
      opacity: 0.9,
    });

    infoY -= lineSpacing;
    page.drawText('fixco.se', {
      x: infoX,
      y: infoY,
      size: 10,
      font: font,
      color: rgb(0.95, 0.95, 0.95),
      opacity: 0.9,
    });

    // === PROMINENT TITLE WITH ELEGANT BACKGROUND BOX ===
    yPosition = height - 195;

    // Subtle background box for title
    page.drawRectangle({
      x: 40,
      y: yPosition - 12,
      width: 350,
      height: 55,
      color: rgb(0.99, 0.99, 1),
      opacity: 0.6,
    });

    // Accent bar next to title
    page.drawRectangle({
      x: 50,
      y: yPosition - 8,
      width: 6,
      height: 45,
      color: rgb(0.10, 0.60, 0.90), // Electric blue
    });

    page.drawText('FAKTURA', {
      x: 70,
      y: yPosition,
      size: 40,
      font: fontBold,
      color: rgb(0.06, 0.12, 0.24), // Navy dark
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

    // === PREMIUM TABLE SECTION ===
    yPosition -= 55;
    page.drawText('SPECIFIKATION', {
      x: 50,
      y: yPosition,
      size: 14,
      font: fontBold,
      color: rgb(0.06, 0.12, 0.24), // Navy dark
    });

    // Table header with smooth gradient
    yPosition -= 30;
    const tableHeaderY = yPosition;
    const tableWidth = width - 80;
    
    for (let i = 0; i < 15; i++) {
      const ratio = i / 15;
      const r = 0.06 + (0.09 - 0.06) * ratio;
      const g = 0.12 + (0.19 - 0.12) * ratio;
      const b = 0.24 + (0.33 - 0.24) * ratio;
      
      page.drawRectangle({
        x: 40,
        y: tableHeaderY - 5 + (i * 30 / 15),
        width: tableWidth,
        height: 30 / 15 + 1,
        color: rgb(r, g, b),
      });
    }

    // Subtle shadow under header
    page.drawRectangle({
      x: 40,
      y: tableHeaderY - 38,
      width: tableWidth,
      height: 3,
      color: rgb(0.06, 0.12, 0.24),
      opacity: 0.08,
    });

    page.drawText('Beskrivning', { 
      x: 50, 
      y: yPosition + 2, 
      size: 11, 
      font: fontBold,
      color: rgb(1, 1, 1),
      opacity: 0.98,
    });
    
    page.drawText('Antal', { 
      x: 300, 
      y: yPosition + 2, 
      size: 11, 
      font: fontBold,
      color: rgb(1, 1, 1),
      opacity: 0.98,
    });
    
    page.drawText('Pris', { 
      x: 370, 
      y: yPosition + 2, 
      size: 11, 
      font: fontBold,
      color: rgb(1, 1, 1),
      opacity: 0.98,
    });
    
    page.drawText('Belopp', { 
      x: 470, 
      y: yPosition + 2, 
      size: 11, 
      font: fontBold,
      color: rgb(1, 1, 1),
      opacity: 0.98,
    });

    yPosition -= 25;

    // Line items with alternating background
    const lineItems = invoice.line_items as Array<{
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }>;

    let rowIndex = 0;
    for (const item of lineItems) {
      if (yPosition < 200) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        yPosition = height - 60;
      }

      // Subtle alternating row background (zebra-striping)
      if (rowIndex % 2 === 1) {
        page.drawRectangle({
          x: 40,
          y: yPosition - 5,
          width: width - 80,
          height: 22,
          color: rgb(0.985, 0.99, 0.995), // Mycket subtil
        });
      }

      page.drawText(item.description || '', {
        x: 50,
        y: yPosition,
        size: 9,
        font,
        maxWidth: 230,
        color: rgb(0, 0, 0),
      });

      page.drawText(item.quantity?.toString() || '1', {
        x: 300,
        y: yPosition,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(
        `${(item.unit_price || 0).toLocaleString('sv-SE')} kr`,
        { x: 370, y: yPosition, size: 9, font, color: rgb(0, 0, 0) }
      );

      page.drawText(
        `${(item.amount || 0).toLocaleString('sv-SE')} kr`,
        { x: 470, y: yPosition, size: 9, font, color: rgb(0, 0, 0) }
      );

      yPosition -= 20;
      rowIndex++;
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

    yPosition -= 30;
    page.drawText('ATT BETALA:', {
      x: 360,
      y: yPosition,
      size: 14,
      font: fontBold,
      color: rgb(0.06, 0.12, 0.24), // Navy dark
    });
    page.drawText(`${invoice.total_amount.toLocaleString('sv-SE')} kr`, {
      x: 475,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0.10, 0.60, 0.90), // Electric blue
    });

    // === MODERN FOOTER WITH GRADIENT SEPARATOR ===
    yPosition = 100;
    
    // Gradient separator line
    for (let i = 0; i < 50; i++) {
      const ratio = i / 50;
      const opacity = 0.15 + (0.35 - 0.15) * Math.sin(ratio * Math.PI);
      
      page.drawRectangle({
        x: 50 + (i * (width - 100) / 50),
        y: yPosition,
        width: (width - 100) / 50 + 1,
        height: 0.8,
        color: rgb(0.20, 0.40, 0.70),
        opacity: opacity,
      });
    }

    yPosition -= 20;
    page.drawText('FIXCO AB | Org.nr: 559123-4567 | Bankgiro: 1234-5678', {
      x: 50,
      y: yPosition,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    yPosition -= 12;
    page.drawText('info@fixco.se | +46 70 123 45 67 | www.fixco.se', {
      x: 50,
      y: yPosition,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
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