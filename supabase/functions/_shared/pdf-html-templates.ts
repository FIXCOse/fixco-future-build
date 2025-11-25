// HTML templates for PDF generation using PDFBolt

interface QuoteData {
  number: string;
  valid_until: string;
  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    price: number;
    type?: string;
    supplier?: string;
  }>;
  subtotal_work_sek: number;
  subtotal_mat_sek: number;
  vat_sek: number;
  rot_deduction_sek?: number;
  rot_percentage?: number;
  total_sek: number;
  customer?: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  created_at?: string;
}

interface InvoiceData {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
    category?: string;
    supplier?: string;
  }>;
  subtotal: number;
  vat_amount: number;
  rot_amount?: number;
  rut_amount?: number;
  total_amount: number;
  customer?: {
    name?: string;
    company_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    postal_code?: string;
    city?: string;
    org_number?: string;
  };
}

// Clean minimalist design matching QuotePublic.tsx
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
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
  }

  /* Header with centered logo */
  .header {
    text-align: center;
    padding: 30px 0;
    border-bottom: 2px solid #1e3a5f;
    margin-bottom: 30px;
  }

  .logo {
    max-width: 120px;
    height: auto;
    margin-bottom: 15px;
  }

  .doc-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e3a5f;
    margin-top: 10px;
  }

  /* Info Grid - 2 columns */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 40px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .info-section h3 {
    font-size: 11px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  .info-section p {
    font-size: 14px;
    margin: 5px 0;
    color: #1a1a1a;
  }

  /* Items Section */
  .items-section {
    margin-bottom: 30px;
  }

  .items-section h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #ddd;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .items-table th {
    background: #1e3a5f;
    color: white;
    padding: 12px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
  }

  .items-table th:last-child,
  .items-table td:last-child {
    text-align: right;
  }

  .items-table td {
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
    font-size: 13px;
  }

  .items-table tbody tr:nth-child(even) {
    background: #f8f9fa;
  }

  /* Cost Breakdown */
  .cost-breakdown {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 2px solid #ddd;
  }

  .cost-breakdown h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 20px;
  }

  .cost-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 14px;
  }

  .cost-row.subtotal {
    font-weight: 600;
    padding-top: 15px;
  }

  .cost-row.discount {
    color: #16a34a;
    font-weight: 600;
  }

  .cost-row.total {
    background: #1e3a5f;
    color: white;
    padding: 20px;
    margin-top: 15px;
    border-radius: 4px;
    font-size: 20px;
    font-weight: 700;
  }

  /* Signature Section */
  .signature-section {
    margin-top: 50px;
    padding: 25px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f8f9fa;
  }

  .signature-section h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #1e3a5f;
  }

  .signature-section p {
    font-size: 14px;
    color: #666;
    margin-bottom: 25px;
  }

  .signature-line {
    display: flex;
    gap: 40px;
    margin-top: 30px;
  }

  .signature-field {
    flex: 1;
  }

  .signature-field label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }

  .signature-field .line {
    border-bottom: 2px solid #333;
    height: 35px;
  }

  /* Footer */
  .footer {
    margin-top: 50px;
    padding-top: 25px;
    border-top: 1px solid #ddd;
    text-align: center;
    font-size: 12px;
    color: #666;
    line-height: 1.8;
  }

  .footer p {
    margin: 4px 0;
  }
`;

export function generateQuoteHTML(quote: QuoteData, logoBase64?: string): string {
  // Separate items by type
  const workItems = quote.items.filter(item => item.type === 'work' || !item.type);
  const materialItems = quote.items.filter(item => item.type === 'material');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Fixco Logo" class="logo" />` : '<div style="font-size: 22px; font-weight: bold; color: #1e3a5f;">FIXCO AB</div>'}
    <div class="doc-title">OFFERT ${quote.number}</div>
  </div>

  <div class="info-grid">
    <div class="info-section">
      <h3>Kund</h3>
      <p><strong>${quote.customer?.name || 'Okänd kund'}</strong></p>
      ${quote.customer?.email ? `<p>${quote.customer.email}</p>` : ''}
      ${quote.customer?.phone ? `<p>${quote.customer.phone}</p>` : ''}
      ${quote.customer?.address ? `<p>${quote.customer.address}</p>` : ''}
    </div>
    <div class="info-section">
      <h3>Datum & Giltighet</h3>
      ${quote.created_at ? `<p><strong>Skapad:</strong> ${new Date(quote.created_at).toLocaleDateString('sv-SE')}</p>` : ''}
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
            <th style="width: 100px;">Antal</th>
            <th style="width: 120px;">à-pris</th>
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
            <th style="width: 100px;">Antal</th>
            <th style="width: 120px;">à-pris</th>
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

  <div class="cost-breakdown">
    <h3>Kostnadsspecifikation</h3>
    
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
    ${quote.rot_deduction_sek && quote.rot_deduction_sek > 0 ? `
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
    <p>Vasagatan 10, 111 20 Stockholm</p>
  </div>
</body>
</html>
  `.trim();
}

export function generateInvoiceHTML(invoice: InvoiceData, logoBase64?: string): string {
  // Separate items by type
  const workItems = invoice.line_items.filter(item => !item.category || item.category === 'work');
  const materialItems = invoice.line_items.filter(item => item.category === 'material');
  const customer = invoice.customer;
  const customerName = customer?.company_name || customer?.name || 'Okänd kund';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Fixco Logo" class="logo" />` : '<div style="font-size: 22px; font-weight: bold; color: #1e3a5f;">FIXCO AB</div>'}
    <div class="doc-title">FAKTURA ${invoice.invoice_number}</div>
  </div>

  <div class="info-grid">
    <div class="info-section">
      <h3>Kund</h3>
      <p><strong>${customerName}</strong></p>
      ${customer?.email ? `<p>${customer.email}</p>` : ''}
      ${customer?.phone ? `<p>${customer.phone}</p>` : ''}
      ${customer?.address ? `<p>${customer.address}</p>` : ''}
      ${customer?.postal_code || customer?.city ? `<p>${customer?.postal_code || ''} ${customer?.city || ''}</p>` : ''}
      ${customer?.org_number ? `<p>Org.nr: ${customer.org_number}</p>` : ''}
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
            <th style="width: 100px;">Antal</th>
            <th style="width: 120px;">à-pris</th>
            <th style="width: 120px;">Summa</th>
          </tr>
        </thead>
        <tbody>
          ${workItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity} st</td>
              <td>${item.unit_price.toLocaleString('sv-SE')} kr</td>
              <td><strong>${item.amount.toLocaleString('sv-SE')} kr</strong></td>
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
            <th style="width: 100px;">Antal</th>
            <th style="width: 120px;">à-pris</th>
            <th style="width: 120px;">Summa</th>
          </tr>
        </thead>
        <tbody>
          ${materialItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity} st</td>
              <td>${item.unit_price.toLocaleString('sv-SE')} kr</td>
              <td><strong>${item.amount.toLocaleString('sv-SE')} kr</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  <div class="cost-breakdown">
    <h3>Kostnadsspecifikation</h3>
    
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
        <span>ROT-avdrag (30%):</span>
        <strong>−${invoice.rot_amount.toLocaleString('sv-SE')} kr</strong>
      </div>
    ` : ''}
    ${invoice.rut_amount && invoice.rut_amount > 0 ? `
      <div class="cost-row discount">
        <span>RUT-avdrag (30%):</span>
        <strong>−${invoice.rut_amount.toLocaleString('sv-SE')} kr</strong>
      </div>
    ` : ''}
    <div class="cost-row total">
      <span>ATT BETALA:</span>
      <span>${invoice.total_amount.toLocaleString('sv-SE')} kr</span>
    </div>
  </div>

  <div class="footer">
    <p><strong>Fixco AB</strong></p>
    <p>Org.nr: 559240-3418 | Bankgiro: 5260-9469</p>
    <p>E-post: info@fixco.se | Telefon: 08-123 456 78</p>
    <p>Vasagatan 10, 111 20 Stockholm</p>
  </div>
</body>
</html>
  `.trim();
}
