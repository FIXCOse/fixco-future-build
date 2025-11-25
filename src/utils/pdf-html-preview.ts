// Frontend copy of PDF HTML templates for live preview
// This is a copy of supabase/functions/_shared/pdf-html-templates.ts
// Keep in sync when updating PDF templates

interface QuoteItem {
  name: string;
  quantity: number;
  unit_price: number;
  category?: 'work' | 'material';
}

interface QuoteData {
  number: string;
  date: string;
  valid_until: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  items: QuoteItem[];
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  notes?: string;
  rot_deduction?: number;
  cost_specifications?: {
    work_cost?: number;
    material_cost?: number;
    rot_deduction?: number;
  };
}

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
  category?: 'work' | 'material';
}

interface InvoiceData {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  line_items: InvoiceLineItem[];
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  rot_amount?: number;
  rut_amount?: number;
  notes?: string;
}

const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    background: white;
  }
  
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
    margin: 0 auto;
    background: white;
    position: relative;
  }
  
  .header {
    margin-bottom: 30px;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 20px;
  }
  
  .header-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    align-items: start;
  }
  
  .logo-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .logo {
    max-width: 120px;
    height: auto;
  }
  
  .company-info {
    font-size: 9pt;
    color: #666;
    line-height: 1.4;
  }
  
  .quote-info, .invoice-info {
    text-align: right;
  }
  
  .quote-info h1, .invoice-info h1 {
    font-size: 24pt;
    color: #2563eb;
    margin-bottom: 10px;
  }
  
  .info-row {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 4px;
    font-size: 10pt;
  }
  
  .info-label {
    color: #666;
    font-weight: 500;
  }
  
  .customer-section {
    background: #f8fafc;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 30px;
  }
  
  .customer-section h2 {
    font-size: 12pt;
    color: #2563eb;
    margin-bottom: 10px;
  }
  
  .customer-details {
    font-size: 10pt;
    line-height: 1.8;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 10pt;
  }
  
  thead {
    background: #2563eb;
    color: white;
  }
  
  th {
    padding: 12px 10px;
    text-align: left;
    font-weight: 600;
    font-size: 10pt;
  }
  
  th:last-child,
  td:last-child {
    text-align: right;
  }
  
  tbody tr {
    border-bottom: 1px solid #e5e7eb;
  }
  
  tbody tr:hover {
    background: #f9fafb;
  }
  
  td {
    padding: 10px;
  }
  
  .category-header {
    background: #f1f5f9;
    font-weight: 600;
    color: #475569;
    padding: 8px 10px !important;
  }
  
  .summary-section {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  }
  
  .summary-table {
    width: 300px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 10pt;
  }
  
  .summary-row.total {
    border-top: 2px solid #2563eb;
    margin-top: 10px;
    padding-top: 15px;
    font-size: 14pt;
    font-weight: bold;
    color: #2563eb;
  }
  
  .summary-row.subtotal {
    font-weight: 600;
  }
  
  .notes-section {
    margin-top: 40px;
    padding: 15px;
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    border-radius: 4px;
  }
  
  .notes-section h3 {
    font-size: 11pt;
    color: #92400e;
    margin-bottom: 8px;
  }
  
  .notes-section p {
    font-size: 9pt;
    color: #78350f;
    line-height: 1.6;
  }
  
  .footer {
    position: absolute;
    bottom: 20mm;
    left: 20mm;
    right: 20mm;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    font-size: 8pt;
    color: #666;
    text-align: center;
  }
  
  .cost-specifications {
    margin-top: 20px;
    padding: 15px;
    background: #f0f9ff;
    border-radius: 8px;
    border: 1px solid #bfdbfe;
  }
  
  .cost-specifications h3 {
    font-size: 11pt;
    color: #1e40af;
    margin-bottom: 10px;
  }
  
  .cost-spec-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 10pt;
  }
  
  .cost-spec-label {
    color: #1e3a8a;
    font-weight: 500;
  }
  
  .rot-highlight {
    color: #059669;
    font-weight: bold;
  }
`;

export function generateQuoteHTML(quote: QuoteData, logoBase64?: string): string {
  // Separate work and material items
  const workItems = quote.items.filter(item => item.category === 'work');
  const materialItems = quote.items.filter(item => item.category === 'material');
  const uncategorizedItems = quote.items.filter(item => !item.category);

  const renderItems = (items: QuoteItem[]) => {
    return items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${item.unit_price.toLocaleString('sv-SE')} kr</td>
        <td style="text-align: right;">${(item.quantity * item.unit_price).toLocaleString('sv-SE')} kr</td>
      </tr>
    `).join('');
  };

  const costSpecSection = quote.cost_specifications ? `
    <div class="cost-specifications">
      <h3>Kostnadsspecifikation</h3>
      ${quote.cost_specifications.work_cost ? `
        <div class="cost-spec-item">
          <span class="cost-spec-label">Arbetskostnad:</span>
          <span>${quote.cost_specifications.work_cost.toLocaleString('sv-SE')} kr</span>
        </div>
      ` : ''}
      ${quote.cost_specifications.material_cost ? `
        <div class="cost-spec-item">
          <span class="cost-spec-label">Materialkostnad:</span>
          <span>${quote.cost_specifications.material_cost.toLocaleString('sv-SE')} kr</span>
        </div>
      ` : ''}
      ${quote.cost_specifications.rot_deduction ? `
        <div class="cost-spec-item">
          <span class="cost-spec-label">Varav ROT-avdrag (30%):</span>
          <span class="rot-highlight">-${quote.cost_specifications.rot_deduction.toLocaleString('sv-SE')} kr</span>
        </div>
      ` : ''}
    </div>
  ` : '';

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
      <div class="page">
        <div class="header">
          <div class="header-grid">
            <div class="logo-section">
              ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="FixCo Logo" class="logo">` : '<div style="font-size: 20pt; font-weight: bold; color: #2563eb;">FixCo</div>'}
              <div class="company-info">
                <div><strong>FixCo AB</strong></div>
                <div>Org.nr: 559472-6448</div>
                <div>info@fixco.se</div>
                <div>070-XXX XX XX</div>
              </div>
            </div>
            
            <div class="quote-info">
              <h1>OFFERT</h1>
              <div class="info-row">
                <span class="info-label">Offertnummer:</span>
                <span>${quote.number}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Datum:</span>
                <span>${quote.date}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Giltig t.o.m:</span>
                <span>${quote.valid_until}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="customer-section">
          <h2>Kund</h2>
          <div class="customer-details">
            <div><strong>${quote.customer_name}</strong></div>
            ${quote.customer_address ? `<div>${quote.customer_address}</div>` : ''}
            <div>${quote.customer_email}</div>
            ${quote.customer_phone ? `<div>${quote.customer_phone}</div>` : ''}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Beskrivning</th>
              <th style="text-align: center;">Antal</th>
              <th style="text-align: right;">À-pris</th>
              <th style="text-align: right;">Summa</th>
            </tr>
          </thead>
          <tbody>
            ${workItems.length > 0 ? `
              <tr>
                <td colspan="4" class="category-header">Arbete</td>
              </tr>
              ${renderItems(workItems)}
            ` : ''}
            
            ${materialItems.length > 0 ? `
              <tr>
                <td colspan="4" class="category-header">Material</td>
              </tr>
              ${renderItems(materialItems)}
            ` : ''}
            
            ${uncategorizedItems.length > 0 ? renderItems(uncategorizedItems) : ''}
          </tbody>
        </table>
        
        ${costSpecSection}
        
        <div class="summary-section">
          <div class="summary-table">
            <div class="summary-row subtotal">
              <span>Delsumma:</span>
              <span>${quote.subtotal.toLocaleString('sv-SE')} kr</span>
            </div>
            <div class="summary-row">
              <span>Moms (25%):</span>
              <span>${quote.vat_amount.toLocaleString('sv-SE')} kr</span>
            </div>
            ${quote.rot_deduction ? `
              <div class="summary-row">
                <span class="rot-highlight">ROT-avdrag:</span>
                <span class="rot-highlight">-${quote.rot_deduction.toLocaleString('sv-SE')} kr</span>
              </div>
            ` : ''}
            <div class="summary-row total">
              <span>Totalt:</span>
              <span>${quote.total_amount.toLocaleString('sv-SE')} kr</span>
            </div>
          </div>
        </div>
        
        ${quote.notes ? `
          <div class="notes-section">
            <h3>Anteckningar</h3>
            <p>${quote.notes}</p>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Tack för ditt förtroende! Vid frågor, kontakta oss på info@fixco.se eller 070-XXX XX XX</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateInvoiceHTML(invoice: InvoiceData, logoBase64?: string): string {
  // Separate work and material items
  const workItems = invoice.line_items.filter(item => item.category === 'work');
  const materialItems = invoice.line_items.filter(item => item.category === 'material');
  const uncategorizedItems = invoice.line_items.filter(item => !item.category);

  const renderItems = (items: InvoiceLineItem[]) => {
    return items.map(item => {
      const amount = item.quantity * item.unit_price;
      return `
        <tr>
          <td>${item.description}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${item.unit_price.toLocaleString('sv-SE')} kr</td>
          <td style="text-align: right;">${item.vat_rate}%</td>
          <td style="text-align: right;">${amount.toLocaleString('sv-SE')} kr</td>
        </tr>
      `;
    }).join('');
  };

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
      <div class="page">
        <div class="header">
          <div class="header-grid">
            <div class="logo-section">
              ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="FixCo Logo" class="logo">` : '<div style="font-size: 20pt; font-weight: bold; color: #2563eb;">FixCo</div>'}
              <div class="company-info">
                <div><strong>FixCo AB</strong></div>
                <div>Org.nr: 559472-6448</div>
                <div>info@fixco.se</div>
                <div>070-XXX XX XX</div>
              </div>
            </div>
            
            <div class="invoice-info">
              <h1>FAKTURA</h1>
              <div class="info-row">
                <span class="info-label">Fakturanummer:</span>
                <span>${invoice.invoice_number}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fakturadatum:</span>
                <span>${invoice.issue_date}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Förfallodatum:</span>
                <span>${invoice.due_date}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="customer-section">
          <h2>Kund</h2>
          <div class="customer-details">
            <div><strong>${invoice.customer_name}</strong></div>
            ${invoice.customer_address ? `<div>${invoice.customer_address}</div>` : ''}
            <div>${invoice.customer_email}</div>
            ${invoice.customer_phone ? `<div>${invoice.customer_phone}</div>` : ''}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Beskrivning</th>
              <th style="text-align: center;">Antal</th>
              <th style="text-align: right;">À-pris</th>
              <th style="text-align: right;">Moms</th>
              <th style="text-align: right;">Summa</th>
            </tr>
          </thead>
          <tbody>
            ${workItems.length > 0 ? `
              <tr>
                <td colspan="5" class="category-header">Arbete</td>
              </tr>
              ${renderItems(workItems)}
            ` : ''}
            
            ${materialItems.length > 0 ? `
              <tr>
                <td colspan="5" class="category-header">Material</td>
              </tr>
              ${renderItems(materialItems)}
            ` : ''}
            
            ${uncategorizedItems.length > 0 ? renderItems(uncategorizedItems) : ''}
          </tbody>
        </table>
        
        <div class="summary-section">
          <div class="summary-table">
            <div class="summary-row subtotal">
              <span>Delsumma:</span>
              <span>${invoice.subtotal.toLocaleString('sv-SE')} kr</span>
            </div>
            <div class="summary-row">
              <span>Moms (25%):</span>
              <span>${invoice.vat_amount.toLocaleString('sv-SE')} kr</span>
            </div>
            ${invoice.rot_amount ? `
              <div class="summary-row">
                <span class="rot-highlight">ROT-avdrag:</span>
                <span class="rot-highlight">-${invoice.rot_amount.toLocaleString('sv-SE')} kr</span>
              </div>
            ` : ''}
            ${invoice.rut_amount ? `
              <div class="summary-row">
                <span class="rot-highlight">RUT-avdrag:</span>
                <span class="rot-highlight">-${invoice.rut_amount.toLocaleString('sv-SE')} kr</span>
              </div>
            ` : ''}
            <div class="summary-row total">
              <span>Att betala:</span>
              <span>${invoice.total_amount.toLocaleString('sv-SE')} kr</span>
            </div>
          </div>
        </div>
        
        ${invoice.notes ? `
          <div class="notes-section">
            <h3>Anteckningar</h3>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Betalning sker till bankgiro: XXX-XXXX | Swish: 070-XXX XX XX</p>
          <p>Vid frågor, kontakta oss på info@fixco.se eller 070-XXX XX XX</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
