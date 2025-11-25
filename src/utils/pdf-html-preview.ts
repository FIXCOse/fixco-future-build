// Frontend copy of PDF HTML templates for live preview
// This is a copy of supabase/functions/_shared/pdf-html-templates.ts
// Keep in sync when updating PDF templates

interface QuoteItem {
  description: string;
  quantity: number;
  price: number;
  unit?: string;
  type?: 'work' | 'material';
  supplierName?: string;
  productUrl?: string;
  imageUrl?: string;
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
  discount_amount_sek?: number;
  discount_type?: string;
  discount_value?: number;
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

// Professional clean design matching QuotePublic.tsx exactly
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
    line-height: 1.6;
    padding: 40px 50px;
    max-width: 900px;
    margin: 0 auto;
  }

  /* Header with centered logo */
  .header {
    text-align: center;
    padding-bottom: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e5e7eb;
  }

  .logo {
    max-width: 140px;
    height: auto;
    margin-bottom: 20px;
  }

  .doc-title {
    font-size: 32px;
    font-weight: 700;
    color: #1e3a5f;
    margin-bottom: 5px;
  }

  .doc-subtitle {
    font-size: 13px;
    color: #6b7280;
    font-weight: 400;
  }

  /* Info Grid - 2 columns */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
    padding: 24px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .info-section h3 {
    font-size: 10px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 12px;
  }

  .info-section p {
    font-size: 14px;
    margin: 6px 0;
    color: #1f2937;
    line-height: 1.5;
  }

  .info-section p strong {
    font-weight: 600;
    color: #111827;
  }

  /* Items Section */
  .items-section {
    margin-bottom: 32px;
  }

  .items-section h3 {
    font-size: 15px;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
  }

  .items-list {
    margin-left: 0;
    padding: 0;
  }

  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    background: #ffffff;
  }

  .item-row:nth-child(even) {
    background: #fafafa;
  }

  .item-row:last-child {
    border-bottom: none;
  }

  .item-desc {
    flex: 1;
    color: #374151;
    font-size: 14px;
    padding-right: 20px;
  }

  .item-qty {
    color: #6b7280;
    font-size: 13px;
    padding-right: 16px;
    white-space: nowrap;
  }

  .item-price {
    font-weight: 600;
    color: #111827;
    font-size: 14px;
    white-space: nowrap;
    min-width: 100px;
    text-align: right;
  }

  /* Cost Breakdown */
  .cost-breakdown {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 2px solid #e5e7eb;
  }

  .cost-breakdown h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 20px;
  }

  .cost-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
  }

  .cost-row span:first-child {
    color: #6b7280;
  }

  .cost-row span:last-child {
    font-weight: 600;
    color: #111827;
  }

  .cost-row.discount {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    margin: 8px 0;
  }

  .cost-row.discount span {
    color: #16a34a !important;
    font-weight: 600;
  }

  .cost-row.total {
    background: #1e3a5f;
    color: white;
    padding: 22px 24px;
    margin-top: 20px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 700;
    border: none;
  }

  .cost-row.total span {
    color: white !important;
  }

  .cost-row.total span:first-child {
    font-size: 16px;
  }

  .cost-row.total span:last-child {
    font-size: 22px;
  }

  /* Product links */
  .product-links {
    margin-top: 6px;
    padding-left: 0;
    font-size: 11px;
    color: #6b7280;
  }

  .product-link {
    display: inline-block;
    margin-right: 12px;
    color: #1e3a5f;
    text-decoration: none;
    margin-top: 3px;
  }

  .product-link:hover {
    text-decoration: underline;
  }

  /* Info cards */
  .info-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 40px;
    margin-bottom: 40px;
  }

  .info-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
  }

  .info-card h4 {
    font-size: 13px;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 12px;
  }

  .info-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .info-card li {
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 6px;
    padding-left: 12px;
    position: relative;
  }

  .info-card li:before {
    content: "•";
    position: absolute;
    left: 0;
    color: #1e3a5f;
  }

  /* Signature Section */
  .signature-section {
    margin-top: 60px;
    padding: 28px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
  }

  .signature-section h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1e3a5f;
  }

  .signature-section p {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 30px;
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
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .signature-field .line {
    border-bottom: 2px solid #9ca3af;
    height: 40px;
  }

  /* Footer */
  .footer {
    margin-top: 60px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 11px;
    color: #6b7280;
    line-height: 1.8;
  }

  .footer p {
    margin: 3px 0;
  }

  .footer strong {
    color: #374151;
    font-weight: 600;
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
    ${logoBase64 ? `<img src="${logoBase64}" alt="Fixco Logo" class="logo" />` : '<div style="font-size: 24px; font-weight: bold; color: #1e3a5f;">FIXCO AB</div>'}
    <div class="doc-title">Offert ${quote.number}</div>
    <div class="doc-subtitle">Från Fixco AB</div>
  </div>

  <div class="info-grid">
    <div class="info-section">
      <h3>Mottagare</h3>
      <p><strong>${quote.customer_name}</strong></p>
      ${quote.customer_email ? `<p>${quote.customer_email}</p>` : ''}
      ${quote.customer_phone ? `<p>${quote.customer_phone}</p>` : ''}
      ${quote.customer_address ? `<p>${quote.customer_address}</p>` : ''}
    </div>
    <div class="info-section">
      <h3>Giltig till</h3>
      <p><strong>${new Date(quote.valid_until).toLocaleDateString('sv-SE')}</strong></p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Skapad: ${new Date(quote.created_at).toLocaleDateString('sv-SE')}</p>
    </div>
  </div>

  ${workItems.length > 0 ? `
    <div class="items-section">
      <h3>🔧 Arbete</h3>
      <div class="items-list">
        ${workItems.map(item => `
          <div class="item-row">
            <div style="flex: 1;">
              <div class="item-desc">${item.description}</div>
              ${(item.productUrl || item.imageUrl || item.supplierName) ? `
                <div class="product-links">
                  ${item.supplierName ? `<span style="color: #6b7280;">📍 ${item.supplierName}</span>` : ''}
                  ${item.productUrl ? `<a href="${item.productUrl}" class="product-link" target="_blank">🔗 Se produkt</a>` : ''}
                  ${item.imageUrl ? `<a href="${item.imageUrl}" class="product-link" target="_blank">🖼️ Visa bild</a>` : ''}
                </div>
              ` : ''}
            </div>
            <div class="item-qty">${item.quantity} ${item.unit || 'st'} × ${item.price.toLocaleString('sv-SE')} kr</div>
            <div class="item-price">${(item.quantity * item.price).toLocaleString('sv-SE')} kr</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : ''}

  ${materialItems.length > 0 ? `
    <div class="items-section">
      <h3>📦 Material</h3>
      <div class="items-list">
        ${materialItems.map(item => `
          <div class="item-row">
            <div style="flex: 1;">
              <div class="item-desc">${item.description}</div>
              ${(item.productUrl || item.imageUrl || item.supplierName) ? `
                <div class="product-links">
                  ${item.supplierName ? `<span style="color: #6b7280;">📍 ${item.supplierName}</span>` : ''}
                  ${item.productUrl ? `<a href="${item.productUrl}" class="product-link" target="_blank">🔗 Se produkt</a>` : ''}
                  ${item.imageUrl ? `<a href="${item.imageUrl}" class="product-link" target="_blank">🖼️ Visa bild</a>` : ''}
                </div>
              ` : ''}
            </div>
            <div class="item-qty">${item.quantity} ${item.unit || 'st'} × ${item.price.toLocaleString('sv-SE')} kr</div>
            <div class="item-price">${(item.quantity * item.price).toLocaleString('sv-SE')} kr</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : ''}

  <div class="cost-breakdown">
    <h3>Kostnadsspecifikation</h3>
    
    <div class="cost-row">
      <span>Arbetskostnad</span>
      <span>${quote.subtotal_work_sek.toLocaleString('sv-SE')} kr</span>
    </div>
    <div class="cost-row">
      <span>Materialkostnad</span>
      <span>${quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr</span>
    </div>
    ${quote.discount_amount_sek && quote.discount_amount_sek > 0 ? `
      <div class="cost-row discount">
        <span>Rabatt ${quote.discount_type === 'percentage' ? `(${quote.discount_value}%)` : ''}</span>
        <span>−${quote.discount_amount_sek.toLocaleString('sv-SE')} kr</span>
      </div>
    ` : ''}
    <div class="cost-row">
      <span>Moms (25%)</span>
      <span>${quote.vat_sek.toLocaleString('sv-SE')} kr</span>
    </div>
    ${quote.rot_deduction_sek > 0 ? `
      <div class="cost-row discount">
        <span>ROT-avdrag (${quote.rot_percentage || 30}%)</span>
        <span>−${quote.rot_deduction_sek.toLocaleString('sv-SE')} kr</span>
      </div>
    ` : ''}
    <div class="cost-row total">
      <span>Totalt att betala</span>
      <span>${quote.total_sek.toLocaleString('sv-SE')} kr</span>
    </div>
  </div>

  <div class="info-cards">
    <div class="info-card">
      <h4>💳 Betalning</h4>
      <ul>
        <li>Faktura efter slutfört arbete</li>
        <li>Kortbetalning & Swish</li>
        <li>ROT-avdrag hanteras automatiskt</li>
      </ul>
    </div>
    <div class="info-card">
      <h4>🛡️ Trygg handel</h4>
      <ul>
        <li>Org.nr: 559240-3418</li>
        <li>F-skatt & försäkring</li>
        <li>2 års garanti på arbete</li>
      </ul>
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
    ${logoBase64 ? `<img src="${logoBase64}" alt="Fixco Logo" class="logo" />` : '<div style="font-size: 22px; font-weight: bold; color: #1e3a5f;">FIXCO AB</div>'}
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
            <th style="width: 100px;">Antal</th>
            <th style="width: 120px;">à-pris</th>
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
            <th style="width: 100px;">Antal</th>
            <th style="width: 120px;">à-pris</th>
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
