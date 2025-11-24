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

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = height - 60;

    // Header
    page.drawText('FAKTURA', {
      x: 50,
      y: yPosition,
      size: 24,
      font: fontBold,
      color: rgb(0.2, 0.3, 0.5),
    });

    page.drawText('Fixco AB', {
      x: width - 150,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(0.2, 0.3, 0.5),
    });

    yPosition -= 15;
    page.drawText('Org.nr: 559123-4567', {
      x: width - 150,
      y: yPosition,
      size: 9,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    yPosition -= 12;
    page.drawText('info@fixco.se', {
      x: width - 150,
      y: yPosition,
      size: 9,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    yPosition -= 30;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    yPosition -= 30;

    // Invoice details
    page.drawText(`Fakturanummer: ${invoice.invoice_number}`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: fontBold,
    });

    yPosition -= 20;
    page.drawText(`Fakturadatum: ${new Date(invoice.issue_date).toLocaleDateString('sv-SE')}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font,
    });

    yPosition -= 15;
    page.drawText(`Förfallodatum: ${new Date(invoice.due_date).toLocaleDateString('sv-SE')}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font,
    });

    yPosition -= 40;

    // Customer info
    page.drawText('KUND', {
      x: 50,
      y: yPosition,
      size: 11,
      font: fontBold,
    });

    yPosition -= 20;
    const customer = invoice.customer;
    if (customer) {
      const customerName = customer.company_name || customer.name || 'Okänd kund';
      page.drawText(customerName, {
        x: 50,
        y: yPosition,
        size: 10,
        font,
      });

      if (customer.org_number) {
        yPosition -= 15;
        page.drawText(`Org.nr: ${customer.org_number}`, {
          x: 50,
          y: yPosition,
          size: 9,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      if (customer.address) {
        yPosition -= 15;
        page.drawText(customer.address, {
          x: 50,
          y: yPosition,
          size: 9,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      if (customer.postal_code && customer.city) {
        yPosition -= 15;
        page.drawText(`${customer.postal_code} ${customer.city}`, {
          x: 50,
          y: yPosition,
          size: 9,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }
    }

    yPosition -= 40;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    yPosition -= 30;

    // Line items table header
    page.drawText('Beskrivning', { x: 50, y: yPosition, size: 10, font: fontBold });
    page.drawText('Antal', { x: 300, y: yPosition, size: 10, font: fontBold });
    page.drawText('Pris', { x: 370, y: yPosition, size: 10, font: fontBold });
    page.drawText('Belopp', { x: 470, y: yPosition, size: 10, font: fontBold });

    yPosition -= 5;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 0.5,
      color: rgb(0.6, 0.6, 0.6),
    });

    yPosition -= 20;

    // Line items
    const lineItems = invoice.line_items as Array<{
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }>;

    for (const item of lineItems) {
      if (yPosition < 100) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        yPosition = height - 60;
      }

      page.drawText(item.description || '', {
        x: 50,
        y: yPosition,
        size: 9,
        font,
        maxWidth: 230,
      });

      page.drawText(item.quantity?.toString() || '1', {
        x: 300,
        y: yPosition,
        size: 9,
        font,
      });

      page.drawText(
        `${(item.unit_price || 0).toLocaleString('sv-SE')} kr`,
        { x: 370, y: yPosition, size: 9, font }
      );

      page.drawText(
        `${(item.amount || 0).toLocaleString('sv-SE')} kr`,
        { x: 470, y: yPosition, size: 9, font }
      );

      yPosition -= 20;
    }

    yPosition -= 10;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 0.5,
      color: rgb(0.6, 0.6, 0.6),
    });

    yPosition -= 30;

    // Summary
    const drawSummaryLine = (label: string, amount: number, bold = false) => {
      page.drawText(label, {
        x: 350,
        y: yPosition,
        size: 10,
        font: bold ? fontBold : font,
      });

      page.drawText(`${amount.toLocaleString('sv-SE')} kr`, {
        x: 470,
        y: yPosition,
        size: 10,
        font: bold ? fontBold : font,
      });

      yPosition -= 20;
    };

    drawSummaryLine('Delsumma:', invoice.subtotal);
    drawSummaryLine('Moms (25%):', invoice.vat_amount);

    if (invoice.rot_amount && invoice.rot_amount > 0) {
      drawSummaryLine('ROT-avdrag:', -invoice.rot_amount);
    }

    if (invoice.rut_amount && invoice.rut_amount > 0) {
      drawSummaryLine('RUT-avdrag:', -invoice.rut_amount);
    }

    if (invoice.discount_amount && invoice.discount_amount > 0) {
      drawSummaryLine('Rabatt:', -invoice.discount_amount);
    }

    yPosition -= 5;
    page.drawLine({
      start: { x: 350, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1.5,
      color: rgb(0.2, 0.3, 0.5),
    });

    yPosition -= 25;
    drawSummaryLine('ATT BETALA:', invoice.total_amount, true);

    // Footer
    yPosition = 80;
    page.drawText('Betalningsvillkor: 30 dagar netto', {
      x: 50,
      y: yPosition,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    yPosition -= 12;
    page.drawText('Vid frågor kontakta oss på info@fixco.se eller 08-123 456 78', {
      x: 50,
      y: yPosition,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
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
        pdf_url: urlData.publicUrl,
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
