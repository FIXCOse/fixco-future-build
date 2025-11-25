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
  };
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
  };
}

const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding: 40px;
    color: #1a1a1f;
    font-size: 10pt;
    line-height: 1.4;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e6ebf0;
  }
  
  .logo {
    width: 80px;
    height: auto;
  }
  
  .company-info {
    text-align: right;
    font-size: 9pt;
  }
  
  .company-info strong {
    display: block;
    font-size: 11pt;
    margin-bottom: 8px;
    color: #1a1a1f;
  }
  
  .company-info div {
    color: #666a70;
    margin-bottom: 3px;
  }
  
  .title {
    font-size: 24pt;
    font-weight: bold;
    color: #3368cc;
    margin-bottom: 10px;
  }
  
  .separator {
    height: 1px;
    background: #e6ebf0;
    margin: 15px 0;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }
  
  .info-block h3 {
    font-size: 9pt;
    font-weight: 600;
    text-transform: uppercase;
    color: #858a8f;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
  }
  
  .info-block p {
    font-size: 10pt;
    margin-bottom: 6px;
  }
  
  .info-block strong {
    font-size: 12pt;
    color: #1a1a1f;
  }
  
  .due-date {
    color: #cc3333;
    font-weight: bold;
  }
  
  .section-title {
    font-size: 12pt;
    font-weight: bold;
    color: #3368cc;
    margin: 35px 0 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .section-title::after {
    content: '';
    display: block;
    height: 1px;
    background: #e6ebf0;
    margin-top: 8px;
  }
  
  .category-header {
    font-size: 11pt;
    font-weight: bold;
    color: #1a1a1f;
    margin: 20px 0 12px;
  }
  
  .line-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f5f7fa;
  }
  
  .line-item-desc {
    flex: 1;
    padding-right: 20px;
  }
  
  .line-item-amount {
    font-weight: bold;
    white-space: nowrap;
  }
  
  .supplier {
    font-size: 8pt;
    color: #858a8f;
    margin-top: 4px;
    padding-left: 15px;
  }
  
  .cost-spec {
    margin-top: 40px;
  }
  
  .cost-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    margin-left: 50%;
  }
  
  .cost-row.separator {
    border-bottom: 1px solid #e6ebf0;
  }
  
  .cost-row span:first-child {
    color: #666a70;
  }
  
  .rot-box, .rut-box {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border: 2px solid #86efac;
    border-radius: 8px;
    padding: 12px 20px;
    color: #166534;
    font-weight: bold;
    margin: 15px 0;
    margin-left: 50%;
    display: flex;
    justify-content: space-between;
  }
  
  .total-box {
    background: linear-gradient(135deg, #8533E6 0%, #00BFFF 50%, #FF4DE6 100%);
    color: white;
    padding: 25px 35px;
    border-radius: 12px;
    text-align: right;
    margin-top: 30px;
    margin-left: 40%;
    box-shadow: 0 10px 30px -10px rgba(133, 51, 230, 0.4);
  }
  
  .total-label {
    font-size: 10pt;
    opacity: 0.9;
    margin-bottom: 8px;
    letter-spacing: 1px;
  }
  
  .total-amount {
    font-size: 32pt;
    font-weight: bold;
    letter-spacing: -0.5px;
  }
  
  footer {
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid #e6ebf0;
    text-align: center;
    font-size: 9pt;
    color: #858a8f;
  }
`;

export function generateQuoteHTML(quote: QuoteData, logoBase64?: string): string {
  const workItems = quote.items.filter(item => item.type === 'work' || !item.type);
  const materialItems = quote.items.filter(item => item.type === 'material');
  
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offert ${quote.number}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" class="logo" alt="FIXCO Logo">` : '<div></div>'}
    <div class="company-info">
      <strong>FIXCO AB</strong>
      <div>Org.nr: 559123-4567</div>
      <div>info@fixco.se</div>
      <div>073-123 45 67</div>
    </div>
  </div>

  <h1 class="title">Offert #${quote.number}</h1>
  
  <div class="info-grid">
    <div class="info-block">
      <h3>MOTTAGARE</h3>
      <strong>${quote.customer?.name || 'Okänd kund'}</strong>
      ${quote.customer?.email ? `<p>${quote.customer.email}</p>` : ''}
      ${quote.customer?.phone ? `<p>${quote.customer.phone}</p>` : ''}
    </div>
    <div class="info-block">
      <h3>GILTIG TILL</h3>
      <strong>${new Date(quote.valid_until).toLocaleDateString('sv-SE')}</strong>
    </div>
  </div>

  <h2 class="section-title">Vad ingår i offerten</h2>

  ${workItems.length > 0 ? `
    <div class="category-header">🔧 ARBETE</div>
    ${workItems.map(item => {
      const total = item.quantity * item.price;
      return `
        <div class="line-item">
          <div class="line-item-desc">
            <div>${item.description} (${item.quantity} ${item.unit} × ${item.price.toLocaleString('sv-SE')} kr)</div>
            ${item.supplier ? `<div class="supplier">Leverantör: ${item.supplier}</div>` : ''}
          </div>
          <div class="line-item-amount">${total.toLocaleString('sv-SE')} kr</div>
        </div>
      `;
    }).join('')}
  ` : ''}

  ${materialItems.length > 0 ? `
    <div class="category-header">📦 MATERIAL</div>
    ${materialItems.map(item => {
      const total = item.quantity * item.price;
      return `
        <div class="line-item">
          <div class="line-item-desc">
            <div>${item.description} (${item.quantity} ${item.unit} × ${item.price.toLocaleString('sv-SE')} kr)</div>
            ${item.supplier ? `<div class="supplier">Leverantör: ${item.supplier}</div>` : ''}
          </div>
          <div class="line-item-amount">${total.toLocaleString('sv-SE')} kr</div>
        </div>
      `;
    }).join('')}
  ` : ''}

  <div class="cost-spec">
    <h2 class="section-title">Kostnadsspecifikation</h2>
    
    <div class="cost-row separator">
      <span>Arbetskostnad</span>
      <span>${quote.subtotal_work_sek.toLocaleString('sv-SE')} kr</span>
    </div>
    
    <div class="cost-row separator">
      <span>Material</span>
      <span>${quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr</span>
    </div>
    
    <div class="cost-row separator">
      <span>Moms (25%)</span>
      <span>${quote.vat_sek.toLocaleString('sv-SE')} kr</span>
    </div>

    ${quote.rot_deduction_sek && quote.rot_deduction_sek > 0 ? `
      <div class="rot-box">
        <span>ROT-avdrag (${quote.rot_percentage || 30}%)</span>
        <span>-${quote.rot_deduction_sek.toLocaleString('sv-SE')} kr</span>
      </div>
    ` : ''}

    <div class="total-box">
      <div class="total-label">TOTALT ATT BETALA</div>
      <div class="total-amount">${quote.total_sek.toLocaleString('sv-SE')} kr</div>
    </div>
  </div>

  <footer>
    FIXCO AB | Org.nr: 559123-4567 | info@fixco.se | 073-123 45 67<br>
    Betalningsvillkor: 30 dagar netto
  </footer>
</body>
</html>
  `.trim();
}

export function generateInvoiceHTML(invoice: InvoiceData, logoBase64?: string): string {
  const workItems = invoice.line_items.filter(item => !item.category || item.category === 'work');
  const materialItems = invoice.line_items.filter(item => item.category === 'material');
  const customer = invoice.customer;
  const customerName = customer?.company_name || customer?.name || 'Okänd kund';
  
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Faktura ${invoice.invoice_number}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" class="logo" alt="FIXCO Logo">` : '<div></div>'}
    <div class="company-info">
      <strong>FIXCO AB</strong>
      <div>Org.nr: 559123-4567</div>
      <div>info@fixco.se</div>
      <div>073-123 45 67</div>
    </div>
  </div>

  <h1 class="title">Faktura #${invoice.invoice_number}</h1>
  
  <div class="info-grid">
    <div class="info-block">
      <h3>MOTTAGARE</h3>
      <strong>${customerName}</strong>
      ${customer?.email ? `<p>${customer.email}</p>` : ''}
      ${customer?.phone ? `<p>${customer.phone}</p>` : ''}
      ${customer?.address ? `<p>${customer.address}</p>` : ''}
      ${customer?.postal_code || customer?.city ? `<p>${customer?.postal_code || ''} ${customer?.city || ''}</p>` : ''}
    </div>
    <div class="info-block">
      <h3>FAKTURADATUM</h3>
      <strong>${new Date(invoice.issue_date).toLocaleDateString('sv-SE')}</strong>
      <h3 style="margin-top: 20px;">FÖRFALLODATUM</h3>
      <strong class="due-date">${new Date(invoice.due_date).toLocaleDateString('sv-SE')}</strong>
    </div>
  </div>

  <h2 class="section-title">Vad ingår i fakturan</h2>

  ${workItems.length > 0 ? `
    <div class="category-header">🔧 ARBETE</div>
    ${workItems.map(item => `
      <div class="line-item">
        <div class="line-item-desc">
          <div>${item.description} (${item.quantity} st × ${item.unit_price.toLocaleString('sv-SE')} kr)</div>
          ${item.supplier ? `<div class="supplier">Leverantör: ${item.supplier}</div>` : ''}
        </div>
        <div class="line-item-amount">${item.amount.toLocaleString('sv-SE')} kr</div>
      </div>
    `).join('')}
  ` : ''}

  ${materialItems.length > 0 ? `
    <div class="category-header">📦 MATERIAL</div>
    ${materialItems.map(item => `
      <div class="line-item">
        <div class="line-item-desc">
          <div>${item.description} (${item.quantity} st × ${item.unit_price.toLocaleString('sv-SE')} kr)</div>
          ${item.supplier ? `<div class="supplier">Leverantör: ${item.supplier}</div>` : ''}
        </div>
        <div class="line-item-amount">${item.amount.toLocaleString('sv-SE')} kr</div>
      </div>
    `).join('')}
  ` : ''}

  <div class="cost-spec">
    <h2 class="section-title">Kostnadsspecifikation</h2>
    
    <div class="cost-row separator">
      <span>Delsumma</span>
      <span>${invoice.subtotal.toLocaleString('sv-SE')} kr</span>
    </div>
    
    <div class="cost-row separator">
      <span>Moms (25%)</span>
      <span>${invoice.vat_amount.toLocaleString('sv-SE')} kr</span>
    </div>

    ${invoice.rot_amount && invoice.rot_amount > 0 ? `
      <div class="rot-box">
        <span>ROT-avdrag (30%)</span>
        <span>-${invoice.rot_amount.toLocaleString('sv-SE')} kr</span>
      </div>
    ` : ''}

    ${invoice.rut_amount && invoice.rut_amount > 0 ? `
      <div class="rut-box">
        <span>RUT-avdrag (30%)</span>
        <span>-${invoice.rut_amount.toLocaleString('sv-SE')} kr</span>
      </div>
    ` : ''}

    <div class="total-box">
      <div class="total-label">ATT BETALA</div>
      <div class="total-amount">${invoice.total_amount.toLocaleString('sv-SE')} kr</div>
    </div>
  </div>

  <footer>
    FIXCO AB | Org.nr: 559123-4567 | info@fixco.se | 073-123 45 67<br>
    Betalningsvillkor: 30 dagar netto | Ränta vid försenad betalning: 8%
  </footer>
</body>
</html>
  `.trim();
}
