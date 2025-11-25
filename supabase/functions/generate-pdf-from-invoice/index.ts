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
    console.log('Generating modern PDF for invoice:', invoiceId);

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
      throw new Error(`Failed to fetch invoice: ${invoiceError?.message}`);
    }

    // Fetch logo
    const { data: logoData } = await supabaseClient.storage
      .from('assets')
      .download('fixco-logo-white.png');

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // ============================================================
    // HELPER FUNCTIONS (Modern Design System)
    // ============================================================

    const drawText = (text: string, x: number, y: number, size: number, bold = false, color = rgb(0, 0, 0)) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: bold ? fontBold : font,
        color,
      });
    };

    const drawGradientRect = (x: number, y: number, w: number, h: number, colors: any[]) => {
      const steps = 40;
      for (let i = 0; i < steps; i++) {
        const ratio = i / (steps - 1);
        const r = colors[0].red + ratio * (colors[2].red - colors[0].red);
        const g = colors[0].green + ratio * (colors[2].green - colors[0].green);
        const b = colors[0].blue + ratio * (colors[2].blue - colors[0].blue);

        page.drawRectangle({
          x: x + (ratio * w),
          y,
          width: w / steps,
          height: h,
          color: rgb(r, g, b),
        });
      }
    };

    const drawCard = (x: number, y: number, w: number, h: number) => {
      // Shadow
      page.drawRectangle({
        x: x + 2,
        y: y - 2,
        width: w,
        height: h,
        color: rgb(0.88, 0.88, 0.90),
      });
      // Card
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        color: rgb(0.98, 0.98, 0.99),
      });
    };

    const drawDotPattern = (x: number, y: number, count = 60) => {
      for (let i = 0; i < count; i++) {
        page.drawCircle({
          x: x + i * 8,
          y,
          size: 1.5,
          color: rgb(0.75, 0.75, 0.78),
          opacity: 0.3,
        });
      }
    };

    const gradientFixco = [
      rgb(176 / 255, 68 / 255, 255 / 255),   // LILA
      rgb(28 / 255, 206 / 255, 255 / 255),   // CYAN
      rgb(255 / 255, 91 / 255, 234 / 255),   // ROSA
    ];

    // ============================================================
    // HERO HEADER
    // ============================================================

    let yPos = height - 70;

    // Logo
    if (logoData) {
      try {
        const logoBytes = await logoData.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.28);
        
        page.drawImage(logoImage, {
          x: 60,
          y: height - 75,
          width: logoDims.width,
          height: logoDims.height,
        });
      } catch (e) {
        drawText('FIXCO', 60, height - 70, 32, true);
      }
    } else {
      drawText('FIXCO', 60, height - 70, 32, true);
    }

    // Dot pattern under logo
    drawDotPattern(60, height - 95, 60);

    // ============================================================
    // ASYMMETRISK TITEL + DATUM CARDS
    // ============================================================

    yPos = height - 150;
    drawText('FAKTURA', 60, yPos, 38, true, rgb(0.10, 0.10, 0.12));
    yPos -= 30;
    drawText(`#${invoice.invoice_number}`, 60, yPos, 18, false, rgb(0.45, 0.45, 0.48));

    // Right cards - FAKTURADATUM & FÖRFALLODATUM
    const card1X = width - 390;
    const card2X = width - 190;
    const cardY = height - 135;
    const cardW = 170;
    const cardH = 70;

    // Fakturadatum card
    drawCard(card1X, cardY, cardW, cardH);
    drawText('FAKTURADATUM', card1X + 15, cardY + 45, 10, true, rgb(0.50, 0.50, 0.53));
    drawText(
      new Date(invoice.issue_date).toLocaleDateString('sv-SE'),
      card1X + 15,
      cardY + 25,
      13,
      true,
      rgb(0.10, 0.10, 0.12)
    );

    // Förfallodatum card
    drawCard(card2X, cardY, cardW, cardH);
    drawText('FÖRFALLODATUM', card2X + 15, cardY + 45, 10, true, rgb(0.50, 0.50, 0.53));
    drawText(
      new Date(invoice.due_date).toLocaleDateString('sv-SE'),
      card2X + 15,
      cardY + 25,
      13,
      true,
      rgb(0.90, 0.20, 0.20)
    );

    // ============================================================
    // KUND-CARD MED GRADIENT ACCENT
    // ============================================================

    yPos -= 60;
    const custX = 60;
    const custY = yPos - 100;
    const custW = width - 120;
    const custH = 100;

    drawCard(custX, custY, custW, custH);

    // 4px gradient accent bar
    drawGradientRect(custX, custY, 4, custH, gradientFixco);

    const customer = invoice.customer;
    const customerName = customer?.company_name || customer?.name || 'Okänd kund';

    drawText('MOTTAGARE', custX + 20, custY + 75, 11, true, rgb(0.50, 0.50, 0.53));
    drawText(customerName, custX + 20, custY + 55, 12, true, rgb(0.10, 0.10, 0.12));
    
    if (customer?.email) {
      drawText(customer.email, custX + 20, custY + 35, 11, false, rgb(0.40, 0.40, 0.43));
    }
    
    if (customer?.phone) {
      drawText(customer.phone, custX + 20, custY + 18, 11, false, rgb(0.40, 0.40, 0.43));
    }

    // ============================================================
    // LINE ITEMS MED GRADIENT HEADER
    // ============================================================

    yPos = custY - 50;
    drawText('VAD INGÅR I FAKTURAN', 60, yPos, 15, true, rgb(0.10, 0.10, 0.12));
    
    // Thin line
    yPos -= 10;
    page.drawLine({
      start: { x: 60, y: yPos },
      end: { x: width - 60, y: yPos },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.87),
    });

    yPos -= 30;
    let tableY = yPos;

    // Gradient header
    const headerH = 28;
    drawGradientRect(60, tableY, width - 120, headerH, gradientFixco);

    drawText('BESKRIVNING', 70, tableY + 10, 11, true, rgb(1, 1, 1));
    drawText('ANTAL', 280, tableY + 10, 11, true, rgb(1, 1, 1));
    drawText('PRIS', 360, tableY + 10, 11, true, rgb(1, 1, 1));
    drawText('BELOPP', 460, tableY + 10, 11, true, rgb(1, 1, 1));

    tableY -= 20;

    // Line items with zebra rows
    const lineItems = invoice.line_items as Array<{
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
      category?: string;
    }>;

    const workItems = lineItems.filter(item => !item.category || item.category === 'work');
    const materialItems = lineItems.filter(item => item.category === 'material');

    let itemIndex = 0;

    // ARBETE
    if (workItems.length > 0) {
      tableY -= 10;
      drawText('ARBETE', 70, tableY, 10, true, rgb(0.30, 0.30, 0.33));
      tableY -= 18;

      for (const item of workItems) {
        if (tableY < 200) {
          page = pdfDoc.addPage([595, 842]);
          tableY = height - 60;
        }

        const isEven = itemIndex % 2 === 0;
        const rowH = 24;

        page.drawRectangle({
          x: 60,
          y: tableY,
          width: width - 120,
          height: rowH,
          color: isEven ? rgb(1, 1, 1) : rgb(0.97, 0.97, 0.98),
        });

        drawText(item.description || '', 70, tableY + 8, 10, false, rgb(0.10, 0.10, 0.12));
        drawText(`${item.quantity}`, 280, tableY + 8, 10, false, rgb(0.10, 0.10, 0.12));
        drawText(`${item.unit_price.toLocaleString('sv-SE')} kr`, 360, tableY + 8, 10, false, rgb(0.10, 0.10, 0.12));
        drawText(`${item.amount.toLocaleString('sv-SE')} kr`, 460, tableY + 8, 10, true, rgb(0.10, 0.10, 0.12));

        tableY -= rowH;
        itemIndex++;
      }
    }

    // MATERIAL
    if (materialItems.length > 0) {
      tableY -= 10;
      drawText('MATERIAL', 70, tableY, 10, true, rgb(0.30, 0.30, 0.33));
      tableY -= 18;

      for (const item of materialItems) {
        if (tableY < 200) {
          page = pdfDoc.addPage([595, 842]);
          tableY = height - 60;
        }

        const isEven = itemIndex % 2 === 0;
        const rowH = 24;

        page.drawRectangle({
          x: 60,
          y: tableY,
          width: width - 120,
          height: rowH,
          color: isEven ? rgb(1, 1, 1) : rgb(0.97, 0.97, 0.98),
        });

        drawText(item.description || '', 70, tableY + 8, 10, false, rgb(0.10, 0.10, 0.12));
        drawText(`${item.quantity}`, 280, tableY + 8, 10, false, rgb(0.10, 0.10, 0.12));
        drawText(`${item.unit_price.toLocaleString('sv-SE')} kr`, 360, tableY + 8, 10, false, rgb(0.10, 0.10, 0.12));
        drawText(`${item.amount.toLocaleString('sv-SE')} kr`, 460, tableY + 8, 10, true, rgb(0.10, 0.10, 0.12));

        tableY -= rowH;
        itemIndex++;
      }
    }

    // ============================================================
    // KOSTNADSSPECIFIKATION (Mini Cards)
    // ============================================================

    tableY -= 40;
    drawText('KOSTNADSSPECIFIKATION', 60, tableY, 13, true, rgb(0.10, 0.10, 0.12));
    tableY -= 30;

    const costX = width - 280;

    // Subtotal
    drawText('Delsumma', costX, tableY, 10, false, rgb(0.40, 0.40, 0.43));
    drawText(
      `${invoice.subtotal.toLocaleString('sv-SE')} kr`,
      width - 110,
      tableY,
      10,
      false,
      rgb(0.10, 0.10, 0.12)
    );
    tableY -= 20;

    // VAT
    drawText('Moms (25%)', costX, tableY, 10, false, rgb(0.40, 0.40, 0.43));
    drawText(
      `${invoice.vat_amount.toLocaleString('sv-SE')} kr`,
      width - 110,
      tableY,
      10,
      false,
      rgb(0.10, 0.10, 0.12)
    );
    tableY -= 20;

    // ROT deduction (if any)
    if (invoice.rot_amount && invoice.rot_amount > 0) {
      page.drawRectangle({
        x: costX - 5,
        y: tableY - 3,
        width: 190,
        height: 18,
        color: rgb(0.93, 0.98, 0.93),
        borderColor: rgb(0.50, 0.80, 0.50),
        borderWidth: 1,
      });

      drawText('ROT-avdrag (30%)', costX, tableY, 10, true, rgb(0.13, 0.60, 0.13));
      drawText(
        `-${invoice.rot_amount.toLocaleString('sv-SE')} kr`,
        width - 110,
        tableY,
        10,
        true,
        rgb(0.13, 0.60, 0.13)
      );
      tableY -= 25;
    }

    // RUT deduction (if any)
    if (invoice.rut_amount && invoice.rut_amount > 0) {
      page.drawRectangle({
        x: costX - 5,
        y: tableY - 3,
        width: 190,
        height: 18,
        color: rgb(0.93, 0.98, 0.93),
        borderColor: rgb(0.50, 0.80, 0.50),
        borderWidth: 1,
      });

      drawText('RUT-avdrag (30%)', costX, tableY, 10, true, rgb(0.13, 0.60, 0.13));
      drawText(
        `-${invoice.rut_amount.toLocaleString('sv-SE')} kr`,
        width - 110,
        tableY,
        10,
        true,
        rgb(0.13, 0.60, 0.13)
      );
      tableY -= 25;
    }

    // ============================================================
    // HERO TOTAL BOX (300×120px!)
    // ============================================================

    tableY -= 20;
    const totalBoxW = 300;
    const totalBoxH = 110;
    const totalBoxX = width - totalBoxW - 50;
    const totalBoxY = tableY - totalBoxH;

    drawGradientRect(totalBoxX, totalBoxY, totalBoxW, totalBoxH, gradientFixco);

    drawText('TOTALT ATT BETALA', totalBoxX + 20, totalBoxY + 80, 13, true, rgb(1, 1, 1));
    drawText(
      `${invoice.total_amount.toLocaleString('sv-SE')} kr`,
      totalBoxX + 20,
      totalBoxY + 45,
      30,
      true,
      rgb(1, 1, 1)
    );
    drawText('inkl. moms', totalBoxX + 20, totalBoxY + 20, 12, false, rgb(1, 1, 1));

    // ============================================================
    // FOOTER
    // ============================================================

    const footerY = 70;
    drawDotPattern(60, footerY, 60);

    // Gradient line
    drawGradientRect(60, footerY - 10, width - 120, 2, gradientFixco);

    drawText('Fixco AB • Org.nr: 559123-4567 • Bankgiro: 1234-5678', 60, footerY - 30, 9);
    drawText('info@fixco.se • 073-123 45 67 • fixco.se', 60, footerY - 45, 9);

    // ============================================================
    // SAVE & UPLOAD PDF
    // ============================================================

    const pdfBytes = await pdfDoc.save();

    const fileName = `invoice-${invoice.invoice_number}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('invoices')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabaseClient.storage
      .from('invoices')
      .getPublicUrl(fileName);

    const pdfUrl = publicUrlData.publicUrl;

    await supabaseClient
      .from('invoices')
      .update({ pdf_url: pdfUrl })
      .eq('id', invoiceId);

    return new Response(
      JSON.stringify({
        success: true,
        pdf_url: pdfUrl,
        message: 'Modern invoice PDF generated successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Invoice PDF generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
