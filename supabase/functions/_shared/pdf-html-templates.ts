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
    supplierName?: string;
    productUrl?: string;
    imageUrl?: string;
  }>;
  subtotal_work_sek: number;
  subtotal_mat_sek: number;
  vat_sek: number;
  rot_deduction_sek?: number;
  rot_percentage?: number;
  discount_amount_sek?: number;
  discount_type?: string;
  discount_value?: number;
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

// Professional clean design matching QuotePublic.tsx exactly
const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #0f172a;
    background: #f8fafc;
    padding: 20px;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  /* Header */
  .header-section {
    text-align: center;
    margin-bottom: 24px;
  }

  .icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(30, 58, 95, 0.3);
    margin-bottom: 12px;
  }

  .icon-box svg {
    width: 20px;
    height: 20px;
    color: white;
  }

  .header-title {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 4px;
  }

  .header-subtitle {
    font-size: 12px;
    color: #64748b;
  }

  .status-badges {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 500;
  }

  .badge-secondary {
    background: #f1f5f9;
    color: #475569;
  }

  .badge-success {
    background: #dcfce7;
    color: #16a34a;
  }

  /* Main Card */
  .main-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 16px;
  }

  /* Title Section */
  .title-section {
    text-align: center;
    padding-bottom: 24px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 24px;
  }

  .title-section h2 {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
  }

  /* Customer & Date Grid */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
    font-size: 14px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
  }

  .info-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 4px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .info-value {
    font-weight: 600;
    color: #0f172a;
  }

  /* Section Headers */
  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 16px;
  }

  .section-icon-box {
    width: 24px;
    height: 24px;
    background: rgba(30, 58, 95, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .section-icon-box svg {
    width: 16px;
    height: 16px;
    color: #1e3a5f;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
  }

  /* Items Section */
  .items-section {
    padding: 24px 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 16px;
  }

  .item-category {
    margin-bottom: 16px;
  }

  .item-category:last-child {
    margin-bottom: 0;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #0f172a;
    margin-bottom: 12px;
  }

  .category-header svg {
    width: 16px;
    height: 16px;
    color: #1e3a5f;
  }

  .item-row {
    margin-left: 24px;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .item-description {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    color: #0f172a;
  }

  .item-description-text {
    flex: 1;
  }

  .item-price {
    font-weight: 600;
    white-space: nowrap;
    color: #0f172a;
  }

  .product-links {
    margin-top: 4px;
    margin-left: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .product-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #1e3a5f;
    text-decoration: none;
  }

  .product-link svg {
    width: 12px;
    height: 12px;
  }

  .supplier-name {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #64748b;
  }

  .supplier-name svg {
    width: 12px;
    height: 12px;
  }

  /* Cost Breakdown */
  .cost-section {
    padding-top: 16px;
  }

  .cost-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
  }

  .cost-label {
    color: #64748b;
  }

  .cost-value {
    font-weight: 600;
    color: #0f172a;
  }

  .cost-row-discount {
    background: #f0fdf4;
    margin: 0 -16px;
    padding: 12px 16px;
    border-radius: 8px;
    border-bottom: 1px solid #bbf7d0;
  }

  .cost-row-discount .cost-label {
    color: #15803d;
    font-weight: 500;
  }

  .cost-row-discount .cost-value {
    color: #15803d;
    font-weight: 600;
  }

  /* Total Box */
  .total-box {
    background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
    border-radius: 12px;
    padding: 20px;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .total-label {
    font-size: 18px;
    font-weight: 700;
    color: white;
  }

  .total-value {
    font-size: 28px;
    font-weight: 700;
    color: white;
  }

  /* Info Cards */
  .info-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
  }

  .info-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
  }

  .info-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 8px;
  }

  .info-card-header svg {
    width: 16px;
    height: 16px;
  }

  .info-card-content {
    font-size: 12px;
    color: #64748b;
    line-height: 1.8;
  }

  .info-card-content p {
    margin-bottom: 4px;
  }

  /* Footer */
  .footer-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 2px solid #e2e8f0;
    text-align: center;
  }

  .footer-logo {
    font-size: 18px;
    font-weight: 700;
    color: #1e3a5f;
    margin-bottom: 8px;
  }

  .footer-contact {
    font-size: 12px;
    color: #64748b;
    line-height: 1.8;
  }

  .signature-section {
    margin-top: 40px;
    padding: 24px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }

  .signature-title {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 16px;
  }

  .signature-line {
    border-bottom: 2px solid #cbd5e1;
    padding-bottom: 40px;
    margin-bottom: 8px;
  }

  .signature-label {
    font-size: 11px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export function generateQuoteHTML(quote: QuoteData, logoBase64?: string): string {
  const workItems = quote.items.filter((item) => item.type === 'work');
  const materialItems = quote.items.filter((item) => item.type === 'material');

  const daysLeft = quote.valid_until 
    ? Math.ceil((new Date(quote.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpired = quote.valid_until && new Date(quote.valid_until) < new Date();

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
      <div class="container">
        <!-- Header -->
        <div class="header-section">
          <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <h1 class="header-title">Offert ${quote.number}</h1>
          <p class="header-subtitle">Från Fixco AB</p>
          
          <div class="status-badges">
            ${isExpired ? '<span class="badge" style="background: #fee2e2; color: #991b1b;">⏰ Utgången</span>' : 
              daysLeft !== null && daysLeft > 0 ? `<span class="badge badge-secondary">⏰ ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagar'} kvar</span>` : ''}
          </div>
        </div>

        <!-- Main Card -->
        <div class="main-card">
          <!-- Title -->
          <div class="title-section">
            <h2>${quote.title}</h2>
          </div>

          <!-- Customer & Date -->
          <div class="info-grid">
            <div class="info-item">
              <p class="info-label">MOTTAGARE</p>
              <p class="info-value">${quote.customer?.name || 'Okänd kund'}</p>
            </div>
            <div class="info-item">
              <p class="info-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                GILTIG TILL
              </p>
              <p class="info-value">
                ${quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('sv-SE') : '—'}
              </p>
            </div>
          </div>

          <!-- Items Section -->
          ${workItems.length > 0 || materialItems.length > 0 ? `
          <div class="items-section">
            <div class="section-header">
              <div class="section-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </div>
              <h3 class="section-title">Vad ingår i offerten</h3>
            </div>

            ${workItems.length > 0 ? `
            <div class="item-category">
              <div class="category-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                Arbete
              </div>
              ${workItems.map((item) => `
                <div class="item-row">
                  <div class="item-description">
                    <span class="item-description-text">
                      ${item.description} (${item.quantity} ${item.unit || 'st'} × ${item.price.toLocaleString('sv-SE')} kr)
                    </span>
                    <span class="item-price">${(item.quantity * item.price).toLocaleString('sv-SE')} kr</span>
                  </div>
                  ${item.productUrl || item.imageUrl || item.supplierName ? `
                    <div class="product-links">
                      ${item.supplierName ? `
                        <span class="supplier-name">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                          </svg>
                          ${item.supplierName}
                        </span>
                      ` : ''}
                      ${item.productUrl ? `
                        <a href="${item.productUrl.startsWith('http') ? item.productUrl : `https://${item.productUrl}`}" class="product-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                          </svg>
                          Se produkt
                        </a>
                      ` : ''}
                      ${item.imageUrl ? `
                        <a href="${item.imageUrl.startsWith('http') ? item.imageUrl : `https://${item.imageUrl}`}" class="product-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          Visa bild
                        </a>
                      ` : ''}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${materialItems.length > 0 ? `
            <div class="item-category">
              <div class="category-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                Material
              </div>
              ${materialItems.map((item) => `
                <div class="item-row">
                  <div class="item-description">
                    <span class="item-description-text">
                      ${item.description} (${item.quantity} ${item.unit || 'st'} × ${item.price.toLocaleString('sv-SE')} kr)
                    </span>
                    <span class="item-price">${(item.quantity * item.price).toLocaleString('sv-SE')} kr</span>
                  </div>
                  ${item.productUrl || item.imageUrl || item.supplierName ? `
                    <div class="product-links">
                      ${item.supplierName ? `
                        <span class="supplier-name">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                          </svg>
                          ${item.supplierName}
                        </span>
                      ` : ''}
                      ${item.productUrl ? `
                        <a href="${item.productUrl.startsWith('http') ? item.productUrl : `https://${item.productUrl}`}" class="product-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                          </svg>
                          Se produkt
                        </a>
                      ` : ''}
                      ${item.imageUrl ? `
                        <a href="${item.imageUrl.startsWith('http') ? item.imageUrl : `https://${item.imageUrl}`}" class="product-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          Visa bild
                        </a>
                      ` : ''}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
          ` : ''}

          <!-- Cost Breakdown -->
          <div class="cost-section">
            <div class="section-header">
              <div class="section-icon-box">
                <span style="font-weight: 700; font-size: 12px; color: #1e3a5f;">kr</span>
              </div>
              <h3 class="section-title">Kostnadsspecifikation</h3>
            </div>

            <div class="cost-row">
              <span class="cost-label">Arbetskostnad</span>
              <span class="cost-value">${quote.subtotal_work_sek.toLocaleString('sv-SE')} kr</span>
            </div>

            <div class="cost-row">
              <span class="cost-label">Materialkostnad</span>
              <span class="cost-value">${quote.subtotal_mat_sek.toLocaleString('sv-SE')} kr</span>
            </div>

            ${quote.discount_amount_sek && quote.discount_amount_sek > 0 ? `
            <div class="cost-row-discount">
              <span class="cost-label">
                Rabatt ${quote.discount_type === 'percentage' ? `(${quote.discount_value}%)` : ''}
              </span>
              <span class="cost-value">−${quote.discount_amount_sek.toLocaleString('sv-SE')} kr</span>
            </div>
            ` : ''}

            <div class="cost-row">
              <span class="cost-label">Moms (25%)</span>
              <span class="cost-value">${quote.vat_sek.toLocaleString('sv-SE')} kr</span>
            </div>

            ${quote.rot_deduction_sek > 0 ? `
            <div class="cost-row-discount">
              <span class="cost-label">ROT-avdrag (${quote.rot_percentage || 30}%)</span>
              <span class="cost-value">−${quote.rot_deduction_sek.toLocaleString('sv-SE')} kr</span>
            </div>
            ` : ''}

            <div class="total-box">
              <span class="total-label">Totalt att betala</span>
              <span class="total-value">${quote.total_sek.toLocaleString('sv-SE')} kr</span>
            </div>
          </div>

          <!-- Info Cards -->
          <div class="info-cards">
            <div class="info-card">
              <div class="info-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Betalning
              </div>
              <div class="info-card-content">
                <p>• Faktura efter slutfört arbete</p>
                <p>• Kortbetalning & Swish</p>
                <p>• ROT-avdrag hanteras automatiskt</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Trygg handel
              </div>
              <div class="info-card-content">
                <p>• Org.nr: 559240-3418</p>
                <p>• F-skatt & försäkring</p>
                <p>• 2 års garanti på arbete</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
          <h3 class="signature-title">Godkännande</h3>
          <div class="signature-line"></div>
          <p class="signature-label">Namn och datum</p>
        </div>

        <!-- Footer -->
        <div class="footer-section">
          <div class="footer-logo">FIXCO AB</div>
          <div class="footer-contact">
            <p>Org.nr: 559240-3418 | info@fixco.se | Tel: 073-123 45 67</p>
            <p>Besöksadress: Testgatan 1, 123 45 Stockholm</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
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
