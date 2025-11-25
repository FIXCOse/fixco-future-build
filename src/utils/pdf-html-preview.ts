// Frontend copy of PDF HTML templates for live preview
// This is a copy of supabase/functions/_shared/pdf-html-templates.ts
// Keep in sync when updating PDF templates

interface QuoteItem {
  description: string;
  quantity: number;
  price: number;
  unit?: string;
  type?: 'work' | 'material';
}

interface QuoteData {
  number: string;
  created_at: string;
  valid_until: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  items: QuoteItem[];
  subtotal_work_sek: number;
  subtotal_mat_sek: number;
  vat_sek: number;
  rot_deduction_sek: number;
  rot_percentage?: number;
  total_sek: number;
}

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit?: string;
  type?: 'work' | 'material';
}

interface InvoiceData {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  customer_org_number?: string;
  line_items: InvoiceLineItem[];
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  rot_amount?: number;
  rut_amount?: number;
  discount_amount?: number;
}

// MINIMALIST PROFESSIONAL PDF DESIGN
const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: white;
    color: #1a1a1a;
    font-size: 14px;
    line-height: 1.5;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  /* Header */
  .header {
    text-align: center;
    padding: 20px 0;
    border-bottom: 2px solid #1e3a5f;
    margin-bottom: 20px;
  }

  .logo {
    max-width: 120px;
    height: auto;
    margin-bottom: 10px;
  }

  .doc-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e3a5f;
    margin-top: 10px;
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .info-section h3 {
    font-size: 12px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .info-section p {
    font-size: 14px;
    margin: 4px 0;
  }

  /* Items Section */
  .items-section {
    margin-bottom: 20px;
  }

  .items-section h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }

  .items-table th {
    background: #1e3a5f;
    color: white;
    padding: 10px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
  }

  .items-table th:last-child,
  .items-table td:last-child {
    text-align: right;
  }

  .items-table td {
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    font-size: 13px;
  }

  .items-table tbody tr:nth-child(even) {
    background: #f8f9fa;
  }

  /* Cost Breakdown */
  .cost-breakdown {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #ddd;
  }

  .cost-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 14px;
  }

  .cost-row.subtotal {
    font-weight: 600;
    padding-top: 15px;
  }

  .cost-row.total {
    background: #1e3a5f;
    color: white;
    padding: 15px 20px;
    margin-top: 10px;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 700;
  }

  .cost-row.discount {
    color: #16a34a;
    font-weight: 600;
  }

  /* Signature Section */
  .signature-section {
    margin-top: 40px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .signature-section h3 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .signature-line {
    display: flex;
    gap: 30px;
    margin-top: 30px;
  }

  .signature-field {
    flex: 1;
  }

  .signature-field label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
  }

  .signature-field .line {
    border-bottom: 1px solid #333;
    height: 30px;
  }

  /* Footer */
  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    text-align: center;
    font-size: 12px;
    color: #666;
  }

  .footer p {
    margin: 3px 0;
  }
`;

export function generateQuoteHTML(quote: QuoteData, logoBase64?: string): string {
  // Separate items by type
  const workItems = quote.items.filter(item => item.type === 'work');
  const materialItems = quote.items.filter(item => item.type === 'material');
  const otherItems = quote.items.filter(item => !item.type || (item.type !== 'work' && item.type !== 'material'));

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" class="logo" />` : '<div style="font-size: 20px; font-weight: bold; color: #1e3a5f;">FIXCO AB</div>'}
    <div class="doc-title">OFFERT ${quote.number}</div>
  </div>

  <div class="info-grid">
    <div class="info-section">
      <h3>Kund</h3>
      <p><strong>${quote.customer_name}</strong></p>
      ${quote.customer_email ? `<p>${quote.customer_email}</p>` : ''}
      ${quote.customer_phone ? `<p>${quote.customer_phone}</p>` : ''}
      ${quote.customer_address ? `<p>${quote.customer_address}</p>` : ''}
    </div>
    <div class="info-section">
      <h3>Datum & Giltighetstid</h3>
      <p><strong>Skapad:</strong> ${new Date(quote.created_at).toLocaleDateString('sv-SE')}</p>
      <p><strong>Giltig till:</strong> ${new Date(quote.valid_until).toLocaleDateString('sv-SE')}</p>
    </div>
  </div>

  ${workItems.length > 0 ? `
    <div class="items-section">
      <h3>Arbete</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Beskrivning</th>
            <th style="width: 80px;">Antal</th>
            <th style="width: 100px;">à-pris</th>
            <th style="width: 120px;">Summa</th>
          </tr>
        </thead>
        <tbody>
          ${workItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity} ${item.unit || 'st'}</td>
              <td>${item.price.toLocaleString('sv-SE')} kr</td>
              <td><strong>${(item.quantity * item.price).toLocaleString('sv-SE')} kr</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  ${materialItems.length > 0 ? `
    <div class="items-section">
      <h3>Material</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Beskrivning</th>
            <th style="width: 80px;">Antal</th>
            <th style="width: 100px;">à-pris</th>
            <th style="width: 120px;">Summa</th>
          </tr>
        </thead>
        <tbody>
          ${materialItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity} ${item.unit || 'st'}</td>
              <td>${item.price.toLocaleString('sv-SE')} kr</td>
              <td><strong>${(item.quantity * item.price).toLocaleString('sv-SE')} kr</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  ${otherItems.length > 0 ? `
    <div class="items-section">
      <h3>Övriga poster</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Beskrivning</th>
            <th style="width: 80px;">Antal</th>
            <th style="width: 100px;">à-pris</th>
            <th style="width: 120px;">Summa</th>
          </tr>
        </thead>
        <tbody>
          ${otherItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity} ${item.unit || 'st'}</td>
              <td>${item.price.toLocaleString('sv-SE')} kr</td>
              <td><strong>${(item.quantity * item.price).toLocaleString('sv-SE')} kr</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  <div class="cost-breakdown">
    <div class="cost-row">
      <span>Arbetskostnad:</span>
      <strong>${quote.subtotal_work_sek.toLocaleString('sv-SE')} kr</strong>
    </div>
    <div class="cost-row">
      <span>Materialkostnad:</span>
      <strong>${quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr</strong>
    </div>
    <div class="cost-row">
      <span>Moms (25%):</span>
      <strong>${quote.vat_sek.toLocaleString('sv-SE')} kr</strong>
    </div>
    ${quote.rot_deduction_sek > 0 ? `
      <div class="cost-row discount">
        <span>ROT-avdrag (${quote.rot_percentage || 30}%):</span>
        <strong>−${quote.rot_deduction_sek.toLocaleString('sv-SE')} kr</strong>
      </div>
    ` : ''}
    <div class="cost-row total">
      <span>ATT BETALA:</span>
      <span>${quote.total_sek.toLocaleString('sv-SE')} kr</span>
    </div>
  </div>

  <div class="signature-section">
    <h3>Godkännande</h3>
    <p>Jag godkänner offerten och accepterar villkoren.</p>
    <div class="signature-line">
      <div class="signature-field">
        <label>Underskrift</label>
        <div class="line"></div>
      </div>
      <div class="signature-field">
        <label>Datum</label>
        <div class="line"></div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p><strong>Fixco AB</strong></p>
    <p>Org.nr: 559240-3418 | Bankgiro: 5260-9469</p>
    <p>E-post: info@fixco.se | Telefon: 08-123 456 78</p>
    <p>Adress: Vasagatan 10, 111 20 Stockholm</p>
  </div>
</body>
</html>
  `.trim();
}

export function generateInvoiceHTML(invoice: InvoiceData, logoBase64?: string): string {
  // Separate items by type
  const workItems = invoice.line_items.filter(item => item.type === 'work');
  const materialItems = invoice.line_items.filter(item => item.type === 'material');
  const otherItems = invoice.line_items.filter(item => !item.type || (item.type !== 'work' && item.type !== 'material'));

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" class="logo" />` : '<div style="font-size: 20px; font-weight: bold; color: #1e3a5f;">FIXCO AB</div>'}
    <div class="doc-title">FAKTURA ${invoice.invoice_number}</div>
  </div>

  <div class="info-grid">
    <div class="info-section">
      <h3>Kund</h3>
      <p><strong>${invoice.customer_name}</strong></p>
      ${invoice.customer_email ? `<p>${invoice.customer_email}</p>` : ''}
      ${invoice.customer_phone ? `<p>${invoice.customer_phone}</p>` : ''}
      ${invoice.customer_address ? `<p>${invoice.customer_address}</p>` : ''}
      ${invoice.customer_org_number ? `<p>Org.nr: ${invoice.customer_org_number}</p>` : ''}
    </div>
    <div class="info-section">
      <h3>Fakturainformation</h3>
      <p><strong>Fakturadatum:</strong> ${new Date(invoice.issue_date).toLocaleDateString('sv-SE')}</p>
      <p><strong>Förfallodatum:</strong> ${new Date(invoice.due_date).toLocaleDateString('sv-SE')}</p>
      <p><strong>Betalningsvillkor:</strong> 30 dagar</p>
    </div>
  </div>

  ${workItems.length > 0 ? `
    <div class="items-section">
      <h3>Utfört arbete</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Beskrivning</th>
            <th style="width: 80px;">Antal</th>
            <th style="width: 100px;">à-pris</th>
            <th style="width: 120px;">Summa</th>
          </tr>
        </thead>
        <tbody>
          ${workItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity} ${item.unit || 'tim'}</td>
              <td>${item.unit_price.toLocaleString('sv-SE')} kr</td>
              <td><strong>${item.total_price.toLocaleString('sv-SE')} kr</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  ${materialItems.length > 0 ? `
    <div class="items-section">
      <h3>Material</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Beskrivning</th>
            <th style="width: 80px;">Antal</th>
            <th style="width: 100px;">à-pris</th>
            <th style="width: 120px;">Summa</th>
          </tr>
        </thead>
        <tbody>
          ${materialItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity} ${item.unit || 'st'}</td>
              <td>${item.unit_price.toLocaleString('sv-SE')} kr</td>
              <td><strong>${item.total_price.toLocaleString('sv-SE')} kr</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  ${otherItems.length > 0 ? `
    <div class="items-section">
      <h3>Övriga poster</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Beskrivning</th>
            <th style="width: 80px;">Antal</th>
            <th style="width: 100px;">à-pris</th>
            <th style="width: 120px;">Summa</th>
          </tr>
        </thead>
        <tbody>
          ${otherItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity} ${item.unit || 'st'}</td>
              <td>${item.unit_price.toLocaleString('sv-SE')} kr</td>
              <td><strong>${item.total_price.toLocaleString('sv-SE')} kr</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  <div class="cost-breakdown">
    <div class="cost-row">
      <span>Delsumma:</span>
      <strong>${invoice.subtotal.toLocaleString('sv-SE')} kr</strong>
    </div>
    <div class="cost-row">
      <span>Moms (25%):</span>
      <strong>${invoice.vat_amount.toLocaleString('sv-SE')} kr</strong>
    </div>
    ${invoice.rot_amount && invoice.rot_amount > 0 ? `
      <div class="cost-row discount">
        <span>ROT-avdrag:</span>
        <strong>−${invoice.rot_amount.toLocaleString('sv-SE')} kr</strong>
      </div>
    ` : ''}
    ${invoice.rut_amount && invoice.rut_amount > 0 ? `
      <div class="cost-row discount">
        <span>RUT-avdrag:</span>
        <strong>−${invoice.rut_amount.toLocaleString('sv-SE')} kr</strong>
      </div>
    ` : ''}
    ${invoice.discount_amount && invoice.discount_amount > 0 ? `
      <div class="cost-row discount">
        <span>Rabatt:</span>
        <strong>−${invoice.discount_amount.toLocaleString('sv-SE')} kr</strong>
      </div>
    ` : ''}
    <div class="cost-row total">
      <span>ATT BETALA:</span>
      <span>${invoice.total_amount.toLocaleString('sv-SE')} kr</span>
    </div>
  </div>

  <div class="signature-section">
    <h3>Betalningsinformation</h3>
    <p><strong>Bankgiro:</strong> 5260-9469</p>
    <p><strong>OCR:</strong> ${invoice.invoice_number.replace(/[^0-9]/g, '')}</p>
    <p><strong>Förfallodatum:</strong> ${new Date(invoice.due_date).toLocaleDateString('sv-SE')}</p>
    <p style="margin-top: 10px; font-size: 12px; color: #666;">
      Vänligen ange OCR-nummer vid betalning.
    </p>
  </div>

  <div class="footer">
    <p><strong>Fixco AB</strong></p>
    <p>Org.nr: 559240-3418 | Bankgiro: 5260-9469</p>
    <p>F-skatt | Momsregistrerad</p>
    <p>E-post: info@fixco.se | Telefon: 08-123 456 78</p>
    <p>Adress: Vasagatan 10, 111 20 Stockholm</p>
  </div>
</body>
</html>
  `.trim();
}
