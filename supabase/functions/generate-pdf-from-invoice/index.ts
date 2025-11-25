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

    // === CLEAN TITLE SECTION ===
    yPosition = height - 130;

    page.drawText(`Faktura #${invoice.invoice_number}`, {
      x: 50,
      y: yPosition,
      size: 24,
      font: fontBold,
      color: rgb(0.20, 0.40, 0.70), // Primary blue
    });

    // Thin separator
    yPosition -= 15;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    // === INFO GRID (Two Columns - Clean) ===
    yPosition -= 35;
    const customer = invoice.customer;
    const customerName = customer?.company_name || customer?.name || 'Okänd kund';
    
    // Left column - MOTTAGARE
    page.drawText('MOTTAGARE', {
      x: 50,
      y: yPosition,
      size: 10,
      font: fontBold,
      color: rgb(0.52, 0.54, 0.56), // Muted
    });

    yPosition -= 18;
    page.drawText(customerName, {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0.10, 0.10, 0.12),
    });

    if (customer?.email) {
      yPosition -= 16;
      page.drawText(customer.email, {
        x: 50,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.40, 0.42, 0.45),
      });
    }

    // Right column - DATUM & FÖRFALLODATUM
    let rightY = height - 163;
    
    page.drawText('FAKTURADATUM', {
      x: 350,
      y: rightY,
      size: 10,
      font: font,
      color: rgb(0.52, 0.54, 0.56),
    });

    rightY -= 18;
    page.drawText(new Date(invoice.issue_date).toLocaleDateString('sv-SE'), {
      x: 350,
      y: rightY,
      size: 12,
      font: fontBold,
      color: rgb(0.10, 0.10, 0.12),
    });

    rightY -= 24;
    page.drawText('FÖRFALLODATUM', {
      x: 350,
      y: rightY,
      size: 10,
      font: font,
      color: rgb(0.52, 0.54, 0.56),
    });

    rightY -= 18;
    page.drawText(new Date(invoice.due_date).toLocaleDateString('sv-SE'), {
      x: 350,
      y: rightY,
      size: 12,
      font: fontBold,
      color: rgb(0.80, 0.20, 0.20), // Red for due date
    });

    // === SECTION-BASED LINE ITEMS (NO TABLE!) ===
    yPosition -= 65;
    
    page.drawText('VAD INGÅR I FAKTURAN', {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0.20, 0.40, 0.70),
    });

    // Separator
    yPosition -= 8;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    yPosition -= 25;

    // Process line items by category
    const lineItems = invoice.line_items as Array<{
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
      category?: string;
      supplier?: string;
    }>;

    // Group items by category
    const workItems = lineItems.filter(item => !item.category || item.category === 'work');
    const materialItems = lineItems.filter(item => item.category === 'material');

    // 🔧 ARBETE Section
    if (workItems.length > 0) {
      page.drawText('ARBETE', {
        x: 50,
        y: yPosition,
        size: 11,
        font: fontBold,
        color: rgb(0.10, 0.10, 0.12),
      });

      yPosition -= 20;

      for (const item of workItems) {
        if (yPosition < 150) {
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          yPosition = height - 60;
        }

        // Item row
        const itemDesc = `${item.description} (${item.quantity} st × ${item.unit_price.toLocaleString('sv-SE')} kr)`;
        page.drawText(itemDesc, {
          x: 65,
          y: yPosition,
          size: 10,
          font,
          color: rgb(0.10, 0.10, 0.12),
          maxWidth: 360,
        });

        // Amount (right-aligned)
        page.drawText(`${item.amount.toLocaleString('sv-SE')} kr`, {
          x: 480,
          y: yPosition,
          size: 10,
          font: fontBold,
          color: rgb(0.10, 0.10, 0.12),
        });

        yPosition -= 16;

        // Supplier info (if available)
        if (item.supplier) {
          page.drawText(`Leverantör: ${item.supplier}`, {
            x: 80,
            y: yPosition,
            size: 8,
            font,
            color: rgb(0.52, 0.54, 0.56), // Muted
          });
          yPosition -= 14;
        } else {
          yPosition -= 6;
        }
      }

      yPosition -= 10;
    }

    // 📦 MATERIAL Section
    if (materialItems.length > 0) {
      page.drawText('MATERIAL', {
        x: 50,
        y: yPosition,
        size: 11,
        font: fontBold,
        color: rgb(0.10, 0.10, 0.12),
      });

      yPosition -= 20;

      for (const item of materialItems) {
        if (yPosition < 150) {
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          yPosition = height - 60;
        }

        // Item row
        const itemDesc = `${item.description} (${item.quantity} st × ${item.unit_price.toLocaleString('sv-SE')} kr)`;
        page.drawText(itemDesc, {
          x: 65,
          y: yPosition,
          size: 10,
          font,
          color: rgb(0.10, 0.10, 0.12),
          maxWidth: 360,
        });

        // Amount (right-aligned)
        page.drawText(`${item.amount.toLocaleString('sv-SE')} kr`, {
          x: 480,
          y: yPosition,
          size: 10,
          font: fontBold,
          color: rgb(0.10, 0.10, 0.12),
        });

        yPosition -= 16;

        // Supplier info (if available)
        if (item.supplier) {
          page.drawText(`Leverantör: ${item.supplier}`, {
            x: 80,
            y: yPosition,
            size: 8,
            font,
            color: rgb(0.52, 0.54, 0.56),
          });
          yPosition -= 14;
        } else {
          yPosition -= 6;
        }
      }

      yPosition -= 10;
    }

    // === CLEAN COST SPECIFICATION ===
    yPosition -= 35;
    
    page.drawText('KOSTNADSSPECIFIKATION', {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0.20, 0.40, 0.70),
    });

    // Separator
    yPosition -= 8;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    yPosition -= 25;
    const costX = 350;

    // Subtotal row
    page.drawText('Delsumma', {
      x: costX,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.40, 0.42, 0.45),
    });
    page.drawText(`${invoice.subtotal.toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.10, 0.10, 0.12),
    });

    yPosition -= 14;
    page.drawLine({
      start: { x: costX - 10, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    // VAT row
    yPosition -= 14;
    page.drawText('Moms (25%)', {
      x: costX,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.40, 0.42, 0.45),
    });
    page.drawText(`${invoice.vat_amount.toLocaleString('sv-SE')} kr`, {
      x: 480,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.10, 0.10, 0.12),
    });

    yPosition -= 14;
    page.drawLine({
      start: { x: costX - 10, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    // ROT-avdrag (GREEN BOX if applicable)
    if (invoice.rot_amount && invoice.rot_amount > 0) {
      yPosition -= 18;
      
      // Green background box
      page.drawRectangle({
        x: costX - 12,
        y: yPosition - 4,
        width: width - costX - 38,
        height: 20,
        color: rgb(0.96, 0.99, 0.96), // Light green bg
        borderColor: rgb(0.60, 0.80, 0.60), // Green border
        borderWidth: 1,
      });

      page.drawText('ROT-avdrag (30%)', {
        x: costX,
        y: yPosition,
        size: 10,
        font: fontBold,
        color: rgb(0.13, 0.55, 0.13), // Green text
      });
      page.drawText(`-${invoice.rot_amount.toLocaleString('sv-SE')} kr`, {
        x: 480,
        y: yPosition,
        size: 10,
        font: fontBold,
        color: rgb(0.13, 0.55, 0.13),
      });

      yPosition -= 18;
      page.drawLine({
        start: { x: costX - 10, y: yPosition },
        end: { x: width - 50, y: yPosition },
        thickness: 0.5,
        color: rgb(0.90, 0.92, 0.94),
      });
    }

    // RUT-avdrag (GREEN BOX if applicable)
    if (invoice.rut_amount && invoice.rut_amount > 0) {
      yPosition -= 18;
      
      page.drawRectangle({
        x: costX - 12,
        y: yPosition - 4,
        width: width - costX - 38,
        height: 20,
        color: rgb(0.96, 0.99, 0.96),
        borderColor: rgb(0.60, 0.80, 0.60),
        borderWidth: 1,
      });

      page.drawText('RUT-avdrag (30%)', {
        x: costX,
        y: yPosition,
        size: 10,
        font: fontBold,
        color: rgb(0.13, 0.55, 0.13),
      });
      page.drawText(`-${invoice.rut_amount.toLocaleString('sv-SE')} kr`, {
        x: 480,
        y: yPosition,
        size: 10,
        font: fontBold,
        color: rgb(0.13, 0.55, 0.13),
      });

      yPosition -= 18;
      page.drawLine({
        start: { x: costX - 10, y: yPosition },
        end: { x: width - 50, y: yPosition },
        thickness: 0.5,
        color: rgb(0.90, 0.92, 0.94),
      });
    }

    // Discount (if applicable)
    if (invoice.discount_amount && invoice.discount_amount > 0) {
      yPosition -= 14;
      page.drawText('Rabatt', {
        x: costX,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.40, 0.42, 0.45),
      });
      page.drawText(`-${invoice.discount_amount.toLocaleString('sv-SE')} kr`, {
        x: 480,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.10, 0.10, 0.12),
      });

      yPosition -= 14;
      page.drawLine({
        start: { x: costX - 10, y: yPosition },
        end: { x: width - 50, y: yPosition },
        thickness: 0.5,
        color: rgb(0.90, 0.92, 0.94),
      });
    }

    // === HERO TOTAL BOX - LARGE GRADIENT (LILA → CYAN → ROSA) ===
    yPosition -= 30;
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
        y: yPosition - totalBoxHeight + (i * totalBoxHeight / gradientSteps),
        width: totalBoxWidth,
        height: (totalBoxHeight / gradientSteps) + 1,
        color: rgb(r, g, b),
      });
    }

    // White text on gradient
    page.drawText('TOTALT ATT BETALA', {
      x: totalBoxX + 20,
      y: yPosition - 20,
      size: 14,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText(`${invoice.total_amount.toLocaleString('sv-SE')} kr`, {
      x: totalBoxX + 20,
      y: yPosition - 50,
      size: 26,
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