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
  title: string;
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
  paid_at?: string | null;
  status?: string;
  customer?: {
    name?: string;
    company_name?: string;
    email?: string;
    phone?: string;
    org_number?: string;
  };
  customer_name?: string;
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
    background: #1e3a5f;
    color: white;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .header-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e3a5f;
    margin-bottom: 4px;
  }

  .header-subtitle {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 16px;
  }

  .status-badges {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
  }

  .badge-secondary {
    background: #f1f5f9;
    color: #475569;
  }

  /* Main Card */
  .main-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Title Section */
  .title-section {
    text-align: center;
    padding-bottom: 24px;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 24px;
  }

  .title-section h2 {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }

  .info-item {
    text-align: center;
  }

  .info-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .info-value {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
  }

  /* Items Section */
  .items-section {
    margin-bottom: 32px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e5e7eb;
  }

  .section-icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #f1f5f9;
    color: #1e3a5f;
    border-radius: 6px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .item-category {
    margin-bottom: 24px;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 12px;
    padding: 8px 12px;
    background: #f8fafc;
    border-radius: 6px;
  }

  .item-row {
    padding: 12px 16px;
    border-left: 3px solid #e5e7eb;
    margin-bottom: 8px;
    background: #fafafa;
    border-radius: 4px;
  }

  .item-description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .item-description-text {
    flex: 1;
    font-size: 14px;
    color: #334155;
  }

  .item-price {
    font-weight: 600;
    color: #0f172a;
    white-space: nowrap;
  }

  .product-links {
    display: flex;
    gap: 12px;
    margin-top: 8px;
    flex-wrap: wrap;
  }

  .product-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #3b82f6;
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 4px;
    background: #eff6ff;
  }

  .supplier-name {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #64748b;
    padding: 4px 8px;
    border-radius: 4px;
    background: #f1f5f9;
  }

  /* Cost Section */
  .cost-section {
    margin-bottom: 32px;
  }

  .cost-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .cost-row-discount {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    background: #dcfce7;
    border-radius: 6px;
    margin: 8px 0;
  }

  .cost-label {
    font-size: 14px;
    color: #64748b;
  }

  .cost-value {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }

  .cost-row-discount .cost-value {
    color: #166534;
  }

  .total-box {
    margin-top: 16px;
    padding: 20px;
    background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%);
    border-radius: 8px;
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
    font-size: 24px;
    font-weight: 700;
    color: white;
  }

  /* Info Cards */
  .info-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }

  .info-card {
    padding: 16px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .info-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 12px;
  }

  .info-card-content {
    font-size: 13px;
    color: #475569;
    line-height: 1.8;
  }

  .info-card-content p {
    margin: 0;
  }

  /* Signature Section */
  .signature-section {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 2px solid #e5e7eb;
  }

  .signature-title {
    font-size: 16px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 32px;
  }

  .signature-line {
    width: 100%;
    height: 2px;
    background: #cbd5e1;
    margin-bottom: 8px;
  }

  .signature-label {
    font-size: 13px;
    color: #94a3b8;
  }

  /* Footer */
  .footer-section {
    text-align: center;
    margin-top: 48px;
    padding-top: 24px;
    border-top: 2px solid #e5e7eb;
  }

  .footer-logo {
    font-size: 20px;
    font-weight: 700;
    color: #1e3a5f;
    margin-bottom: 12px;
  }

  .footer-contact {
    font-size: 12px;
    color: #64748b;
    line-height: 1.8;
  }

  .footer-contact p {
    margin: 0;
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
              <p class="info-value">${quote.customer_name}</p>
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
  // Parse line items and categorize
  const lineItems = Array.isArray(invoice.line_items) ? invoice.line_items : [];
  const workItems = lineItems.filter((item: any) => item.type === 'work' || item.type === 'service');
  const materialItems = lineItems.filter((item: any) => item.type === 'material' || item.type === 'product');

  // Calculate payment status
  const isPaid = invoice.status === 'paid' || !!invoice.paid_at;
  const dueDate = new Date(invoice.due_date);
  const today = new Date();
  const isOverdue = !isPaid && dueDate < today;
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Status badge
  let statusBadge = '';
  if (isPaid) {
    statusBadge = '<span class="badge" style="background: #dcfce7; color: #166534;">✓ Betald</span>';
  } else if (isOverdue) {
    statusBadge = '<span class="badge" style="background: #fee2e2; color: #991b1b;">⏰ Förfallen</span>';
  } else {
    statusBadge = '<span class="badge badge-secondary">📄 Skickad</span>';
  }

  // Customer info
  const customerName = invoice.customer?.name || 'Kund';

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
      <div class="container">
        <!-- Header -->
        <div class="header-section">
          <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 1-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h1 class="header-title">Faktura ${invoice.invoice_number}</h1>
          <p class="header-subtitle">Från Fixco AB</p>
          
          <div class="status-badges">
            ${statusBadge}
          </div>
        </div>

        <!-- Main Card -->
        <div class="main-card">
          <!-- Title -->
          <div class="title-section">
            <h2>Faktura för ${customerName}</h2>
          </div>

          <!-- Customer & Date -->
          <div class="info-grid">
            <div class="info-item">
              <p class="info-label">MOTTAGARE</p>
              <p class="info-value">${customerName}</p>
            </div>
            <div class="info-item">
              <p class="info-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                FÖRFALLODATUM
              </p>
              <p class="info-value">
                ${new Date(invoice.due_date).toLocaleDateString('sv-SE')}
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
              <h3 class="section-title">Vad ingår i fakturan</h3>
            </div>

            ${workItems.length > 0 ? `
            <div class="item-category">
              <div class="category-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                Arbete
              </div>
              ${workItems.map((item: any) => `
                <div class="item-row">
                  <div class="item-description">
                    <span class="item-description-text">
                      ${item.description} (${item.quantity} ${item.unit || 'st'} × ${item.unit_price.toLocaleString('sv-SE')} kr)
                    </span>
                    <span class="item-price">${(item.total_price || item.amount).toLocaleString('sv-SE')} kr</span>
                  </div>
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
              ${materialItems.map((item: any) => `
                <div class="item-row">
                  <div class="item-description">
                    <span class="item-description-text">
                      ${item.description} (${item.quantity} ${item.unit || 'st'} × ${item.unit_price.toLocaleString('sv-SE')} kr)
                    </span>
                    <span class="item-price">${(item.total_price || item.amount).toLocaleString('sv-SE')} kr</span>
                  </div>
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
              <span class="cost-label">Delsumma</span>
              <span class="cost-value">${invoice.subtotal.toLocaleString('sv-SE')} kr</span>
            </div>

            ${invoice.discount_amount && invoice.discount_amount > 0 ? `
            <div class="cost-row-discount">
              <span class="cost-label">Rabatt</span>
              <span class="cost-value">−${invoice.discount_amount.toLocaleString('sv-SE')} kr</span>
            </div>
            ` : ''}

            <div class="cost-row">
              <span class="cost-label">Moms (25%)</span>
              <span class="cost-value">${invoice.vat_amount.toLocaleString('sv-SE')} kr</span>
            </div>

            ${invoice.rot_amount && invoice.rot_amount > 0 ? `
            <div class="cost-row-discount">
              <span class="cost-label">ROT-avdrag</span>
              <span class="cost-value">−${invoice.rot_amount.toLocaleString('sv-SE')} kr</span>
            </div>
            ` : ''}

            ${invoice.rut_amount && invoice.rut_amount > 0 ? `
            <div class="cost-row-discount">
              <span class="cost-label">RUT-avdrag</span>
              <span class="cost-value">−${invoice.rut_amount.toLocaleString('sv-SE')} kr</span>
            </div>
            ` : ''}

            <div class="total-box">
              <span class="total-label">Totalt att betala</span>
              <span class="total-value">${invoice.total_amount.toLocaleString('sv-SE')} kr</span>
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
                <p>• Betalning inom ${daysUntilDue > 0 ? daysUntilDue : 0} dagar</p>
                <p>• Kortbetalning & Swish</p>
                <p>• Bankgiro: 123-4567</p>
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
