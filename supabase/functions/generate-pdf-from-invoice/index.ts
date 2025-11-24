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
      font: fontBold,
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

    // Invoice title
    yPosition = height - 170;
    page.drawText('FAKTURA', {
      x: 50,
      y: yPosition,
      size: 28,
      font: fontBold,
      color: rgb(0.1, 0.21, 0.36),
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

    // Customer info section
    yPosition -= 40;
    page.drawText('KUND', {
      x: 50,
      y: yPosition,
      size: 11,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    yPosition -= 20;
    const customer = invoice.customer;
    if (customer) {
      const customerName = customer.company_name || customer.name || 'Okänd kund';
      page.drawText(customerName, {
        x: 50,
        y: yPosition,
        size: 11,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      if (customer.org_number) {
        yPosition -= 16;
        page.drawText(`Org.nr: ${customer.org_number}`, {
          x: 50,
          y: yPosition,
          size: 9,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      if (customer.address) {
        yPosition -= 16;
        page.drawText(customer.address, {
          x: 50,
          y: yPosition,
          size: 9,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      if (customer.postal_code && customer.city) {
        yPosition -= 16;
        page.drawText(`${customer.postal_code} ${customer.city}`, {
          x: 50,
          y: yPosition,
          size: 9,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }
    }

    // Line items table
    yPosition -= 50;
    page.drawText('SPECIFIKATION', {
      x: 50,
      y: yPosition,
      size: 13,
      font: fontBold,
      color: rgb(0.1, 0.21, 0.36),
    });

    // Table header with background
    yPosition -= 30;
    page.drawRectangle({
      x: 40,
      y: yPosition - 5,
      width: width - 80,
      height: 22,
      color: rgb(0.1, 0.21, 0.36),
    });

    page.drawText('Beskrivning', { 
      x: 50, 
      y: yPosition, 
      size: 10, 
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    
    page.drawText('Antal', { 
      x: 300, 
      y: yPosition, 
      size: 10, 
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    
    page.drawText('Pris', { 
      x: 370, 
      y: yPosition, 
      size: 10, 
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    
    page.drawText('Belopp', { 
      x: 470, 
      y: yPosition, 
      size: 10, 
      font: fontBold,
      color: rgb(1, 1, 1),
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

      // Alternating row background
      if (rowIndex % 2 === 1) {
        page.drawRectangle({
          x: 40,
          y: yPosition - 5,
          width: width - 80,
          height: 20,
          color: rgb(0.97, 0.97, 0.97),
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

    // Summary section with background
    yPosition -= 20;
    page.drawRectangle({
      x: 340,
      y: yPosition - 160,
      width: width - 390,
      height: 170,
      color: rgb(0.98, 0.98, 0.98),
    });

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

    yPosition -= 5;
    page.drawLine({
      start: { x: 350, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 2,
      color: rgb(0.1, 0.21, 0.36),
    });

    yPosition -= 28;
    page.drawText('ATT BETALA:', {
      x: 360,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0.1, 0.21, 0.36),
    });
    page.drawText(`${invoice.total_amount.toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0.1, 0.21, 0.36),
    });

    // Professional footer with separator
    yPosition = 100;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });

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