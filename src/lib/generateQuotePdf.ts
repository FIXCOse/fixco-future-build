import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { getQuoteNew } from '@/lib/api/quotes-new';

function buildQuoteHTML(quote: any): string {
  const items = Array.isArray(quote.items) ? quote.items : JSON.parse(quote.items || '[]');
  const workItems = items.filter((item: any) => item.type === 'work');
  const materialItems = items.filter((item: any) => item.type === 'material');
  const materialMeta = items.find((item: any) => item.type === '_meta' && item.key === 'material_included');
  const materialNotIncluded = materialMeta && materialMeta.value === false;

  const daysLeft = quote.valid_until
    ? Math.ceil((new Date(quote.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpired = quote.valid_until && new Date(quote.valid_until) < new Date();

  const formatNum = (n: number) => n.toLocaleString('sv-SE');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #0f172a; background: #f8fafc; padding: 24px; max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: linear-gradient(135deg, #1e3a5f, #2d4a6f); border-radius: 12px; margin-bottom: 12px;">
          <span style="color: white; font-weight: 700; font-size: 16px;">F</span>
        </div>
        <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 4px;">Offert ${quote.number}</h1>
        <p style="font-size: 12px; color: #64748b; margin: 0;">Från Fixco AB</p>
        ${isExpired ? '<p style="margin-top: 12px;"><span style="background: #fee2e2; color: #991b1b; padding: 6px 12px; border-radius: 9999px; font-size: 12px;">⏰ Utgången</span></p>' :
          daysLeft !== null && daysLeft > 0 ? `<p style="margin-top: 12px;"><span style="background: #f1f5f9; color: #475569; padding: 6px 12px; border-radius: 9999px; font-size: 12px;">⏰ ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagar'} kvar</span></p>` : ''}
      </div>

      <!-- Main Card -->
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); padding: 24px; margin-bottom: 16px;">
        <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0; margin-bottom: 24px;">
          <h2 style="font-size: 24px; font-weight: 700; margin: 0;">${quote.title}</h2>
        </div>

        <!-- Customer & Date -->
        <div style="display: flex; gap: 24px; margin-bottom: 24px;">
          <div style="flex: 1;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 4px; font-weight: 500;">MOTTAGARE</p>
            <p style="font-weight: 600; margin: 0;">${quote.customer?.name || 'Okänd kund'}</p>
          </div>
          <div style="flex: 1;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 4px; font-weight: 500;">GILTIG TILL</p>
            <p style="font-weight: 600; margin: 0;">${quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('sv-SE') : '—'}</p>
          </div>
        </div>

        <!-- Items -->
        ${workItems.length > 0 || materialItems.length > 0 ? `
        <div style="padding: 24px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px;">
            <div style="width: 24px; height: 24px; background: rgba(30,58,95,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 12px;">📋</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 600; margin: 0;">Vad ingår i offerten</h3>
          </div>

          ${workItems.length > 0 ? `
          <div style="margin-bottom: 16px;">
            <p style="font-size: 14px; font-weight: 500; margin: 0 0 12px; display: flex; align-items: center; gap: 8px;">🔧 Arbete</p>
            ${workItems.map((item: any) => `
              <div style="margin-left: 24px; margin-bottom: 8px; font-size: 14px;">
                <div style="display: flex; justify-content: space-between; gap: 16px;">
                  <span>${item.description} (${item.quantity} ${item.unit || 'st'} × ${formatNum(item.price)} kr)</span>
                  <span style="font-weight: 600; white-space: nowrap;">${formatNum(item.quantity * item.price)} kr</span>
                </div>
              </div>
            `).join('')}
          </div>` : ''}

          ${materialItems.length > 0 ? `
          <div style="margin-bottom: 16px;">
            <p style="font-size: 14px; font-weight: 500; margin: 0 0 12px; display: flex; align-items: center; gap: 8px;">📦 Material</p>
            ${materialItems.map((item: any) => `
              <div style="margin-left: 24px; margin-bottom: 8px; font-size: 14px;">
                <div style="display: flex; justify-content: space-between; gap: 16px;">
                  <span>${item.description} (${item.quantity} ${item.unit || 'st'} × ${formatNum(item.price)} kr)</span>
                  <span style="font-weight: 600; white-space: nowrap;">${formatNum(item.quantity * item.price)} kr</span>
                </div>
              </div>
            `).join('')}
          </div>` : ''}

          ${materialNotIncluded ? `
          <div style="margin-top: 12px; display: flex; align-items: flex-start; gap: 12px; border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 8px; padding: 12px;">
            <span>📦</span>
            <p style="font-size: 13px; color: #1e40af; margin: 0;">Material ingår ej i denna offert och faktureras separat efter slutfört arbete.</p>
          </div>` : ''}
        </div>` : ''}

        <!-- Cost Breakdown -->
        <div style="padding-top: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px;">
            <div style="width: 24px; height: 24px; background: rgba(30,58,95,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-weight: 700; font-size: 12px; color: #1e3a5f;">kr</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 600; margin: 0;">Kostnadsspecifikation</h3>
          </div>

          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
            <span style="color: #64748b;">Arbetskostnad</span>
            <span style="font-weight: 600;">${formatNum(quote.subtotal_work_sek)} kr</span>
          </div>

          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
            <span style="color: #64748b;">Materialkostnad</span>
            <span style="font-weight: 600;">${formatNum(quote.subtotal_mat_sek)} kr</span>
          </div>

          ${quote.discount_amount_sek && quote.discount_amount_sek > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 12px 16px; background: #f0fdf4; border-radius: 8px; margin: 0 -16px; border-bottom: 1px solid #bbf7d0; font-size: 14px;">
            <span style="color: #15803d; font-weight: 500;">Rabatt ${quote.discount_type === 'percentage' ? `(${quote.discount_value}%)` : ''}</span>
            <span style="color: #15803d; font-weight: 600;">−${formatNum(quote.discount_amount_sek)} kr</span>
          </div>` : ''}

          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
            <span style="color: #64748b;">Moms (25%)</span>
            <span style="font-weight: 600;">${formatNum(quote.vat_sek)} kr</span>
          </div>

          ${quote.rot_deduction_sek > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 12px 16px; background: #f0fdf4; border-radius: 8px; margin: 0 -16px; border-bottom: 1px solid #bbf7d0; font-size: 14px;">
            <span style="color: #15803d; font-weight: 500;">ROT-avdrag (${quote.rot_percentage || 30}%)</span>
            <span style="color: #15803d; font-weight: 600;">−${formatNum(quote.rot_deduction_sek)} kr</span>
          </div>` : ''}

          <div style="background: linear-gradient(135deg, #1e3a5f, #2d4a6f); border-radius: 12px; padding: 20px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 18px; font-weight: 700; color: white;">Totalt att betala</span>
            <span style="font-size: 28px; font-weight: 700; color: white;">${formatNum(quote.total_sek)} kr</span>
          </div>
        </div>

        <!-- Info Cards -->
        <div style="display: flex; gap: 16px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <p style="font-size: 14px; font-weight: 600; margin: 0 0 8px;">💳 Betalning</p>
            <div style="font-size: 12px; color: #64748b; line-height: 1.8;">
              <p style="margin: 0;">• Faktura efter slutfört arbete</p>
              <p style="margin: 0;">• Kortbetalning & Swish</p>
              <p style="margin: 0;">• ROT-avdrag hanteras automatiskt</p>
            </div>
          </div>
          <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <p style="font-size: 14px; font-weight: 600; margin: 0 0 8px;">🛡️ Trygg handel</p>
            <div style="font-size: 12px; color: #64748b; line-height: 1.8;">
              <p style="margin: 0;">• Org.nr: 559240-3418</p>
              <p style="margin: 0;">• F-skatt & försäkring</p>
              <p style="margin: 0;">• 2 års garanti på arbete</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Signature -->
      <div style="margin-top: 40px; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 16px;">Godkännande</h3>
        <div style="border-bottom: 2px solid #cbd5e1; padding-bottom: 40px; margin-bottom: 8px;"></div>
        <p style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">Namn och datum</p>
      </div>

      <!-- Footer -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e2e8f0; text-align: center;">
        <p style="font-size: 18px; font-weight: 700; color: #1e3a5f; margin: 0 0 8px;">FIXCO AB</p>
        <div style="font-size: 12px; color: #64748b; line-height: 1.8;">
          <p style="margin: 0;">Org.nr: 559240-3418 | info@fixco.se | Tel: 073-123 45 67</p>
          <p style="margin: 0;">Besöksadress: Testgatan 1, 123 45 Stockholm</p>
        </div>
      </div>
    </div>
  `;
}

export async function generateQuotePdfClientSide(quoteId: string): Promise<string> {
  // 1. Fetch quote data
  const quote = await getQuoteNew(quoteId);
  if (!quote) throw new Error('Quote not found');

  // 2. Build HTML
  const html = buildQuoteHTML(quote);

  // 3. Render to canvas
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.background = 'white';
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#f8fafc',
    });

    // 4. Create PDF
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const pdfBlob = pdf.output('blob');

    // 5. Upload to Supabase Storage
    const fileName = `quote-${quote.number}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('quotes')
      .upload(fileName, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 6. Get public URL
    const { data: urlData } = supabase.storage
      .from('quotes')
      .getPublicUrl(uploadData.path);

    const pdfUrl = urlData.publicUrl;

    // 7. Update quote record
    const { error: updateError } = await supabase
      .from('quotes_new')
      .update({ pdf_url: pdfUrl })
      .eq('id', quoteId);

    if (updateError) throw updateError;

    return pdfUrl;
  } finally {
    document.body.removeChild(container);
  }
}
