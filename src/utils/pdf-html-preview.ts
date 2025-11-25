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
    font-size: 10pt;
    line-height: 1.5;
    color: #1e293b;
    background: #f8fafc;
  }
  
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 15mm 20mm 20mm;
    margin: 0 auto;
    background: transparent;
  }
  
  /* Professional Header - Clean and minimal */
  .hero-header {
    background: #ffffff;
    border-radius: 8px 8px 0 0;
    padding: 30px 25px 25px;
    text-align: center;
    margin-bottom: 0;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .logo-container {
    margin-bottom: 15px;
  }
  
  .company-logo {
    max-width: 140px;
    height: auto;
    display: block;
    margin: 0 auto;
  }
  
  .hero-header h1 {
    font-size: 22pt;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  /* Main card container */
  .main-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin-bottom: 15px;
  }
  
  /* Title section */
  .title-section {
    text-align: center;
    padding-bottom: 18px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 20px;
  }
  
  .title-section h2 {
    font-size: 16pt;
    font-weight: 600;
    color: #1e293b;
  }
  
  /* Customer & Date Grid */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 25px;
    font-size: 9pt;
  }
  
  .info-item {
    background: #f8fafc;
    border-radius: 6px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border: 1px solid #f1f5f9;
  }
  
  .info-label {
    text-transform: uppercase;
    font-size: 7pt;
    letter-spacing: 0.6px;
    color: #64748b;
    font-weight: 600;
  }
  
  .info-value {
    font-weight: 600;
    font-size: 10.5pt;
    color: #1e293b;
  }
  
  /* Section header - minimal style */
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .section-icon {
    width: 24px;
    height: 24px;
    background: #1e3a5f;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .section-icon svg {
    width: 14px;
    height: 14px;
    color: white;
  }
  
  .section-title {
    font-size: 12pt;
    font-weight: 600;
    color: #1e293b;
  }
  
  /* Items section - CLASSIC TABLE LAYOUT */
  .items-section {
    margin-bottom: 20px;
  }
  
  .category-title {
    font-size: 10pt;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  /* Table for items */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }
  
  .items-table thead {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .items-table th {
    text-align: left;
    padding: 10px 12px;
    font-size: 8pt;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .items-table th:last-child,
  .items-table td:last-child {
    text-align: right;
  }
  
  .items-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
  }
  
  .items-table tbody tr:nth-child(even) {
    background: #f8fafc;
  }
  
  .items-table td {
    padding: 10px 12px;
    font-size: 9pt;
    color: #1e293b;
  }
  
  .item-description {
    font-weight: 500;
  }
  
  .item-quantity,
  .item-unit-price {
    color: #64748b;
  }
  
  .item-total {
    font-weight: 600;
  }
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 8px;
    padding: 10px 12px;
    background: white;
    border-radius: 10px;
    font-size: 9pt;
  }
  
  .item-description {
    color: #0f172a;
    flex: 1;
    font-weight: 500;
  }
  
  .item-price {
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
    font-size: 10pt;
  }
  
  /* Cost specification */
  .cost-section {
    margin-bottom: 20px;
  }
  
  .cost-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 9.5pt;
  }
  
  .cost-label {
    color: #64748b;
    font-weight: 500;
  }
  
  .cost-value {
    font-weight: 600;
    color: #1e293b;
  }
  
  /* Professional discount section - subtle green */
  .cost-row.discount {
    background: #f0fdf4;
    margin: 8px -16px;
    padding: 14px 16px;
    border-radius: 6px;
    border: 1px solid #bbf7d0;
  }
  
  .cost-row.discount .cost-label {
    color: #15803d;
    font-weight: 600;
    font-size: 10pt;
  }
  
  .cost-row.discount .cost-value {
    color: #15803d;
    font-weight: 700;
    font-size: 11pt;
  }
  
  .discount-explanation {
    font-size: 8pt;
    color: #16a34a;
    margin-top: 4px;
    font-weight: 500;
  }
  
  /* Professional total box - solid dark blue */
  .total-box {
    background: #1e3a5f;
    border-radius: 6px;
    padding: 18px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    border: 1px solid #334155;
  }
  
  .total-label {
    font-size: 12pt;
    font-weight: 600;
    color: white;
  }
  
  .total-amount {
    font-size: 20pt;
    font-weight: 700;
    color: white;
  }
  
  /* Signature section */
  .signature-section {
    margin-top: 25px;
    padding: 18px;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 6px;
  }
  
  .signature-header {
    font-size: 9.5pt;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .signature-line {
    border-bottom: 1px solid #94a3b8;
    height: 45px;
    margin-bottom: 6px;
  }
  
  .signature-label {
    font-size: 8pt;
    color: #64748b;
    display: flex;
    justify-content: space-between;
  }
  
  /* Simple footer - traditional 2-column */
  .bottom-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 25px;
    padding-top: 18px;
    border-top: 1px solid #e2e8f0;
  }
  
  .info-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 14px;
  }
  
  .info-card-title {
    font-size: 9pt;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }
  
  .info-card-content {
    font-size: 8pt;
    color: #64748b;
    line-height: 1.6;
  }
  
  .info-card-content p {
    margin-bottom: 4px;
  }
  
  /* SVG Icons */
  .icon-file {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

export function generateQuoteHTML(quote: QuoteData, logoBase64?: string): string {
  // Separate work and material items
  const workItems = quote.items.filter(item => item.category === 'work');
  const materialItems = quote.items.filter(item => item.category === 'material');
  const uncategorizedItems = quote.items.filter(item => !item.category);

  const renderItems = (items: QuoteItem[]) => {
    return items.map(item => `
      <div class="item-row">
        <span class="item-description">
          ${item.name} (${item.quantity} st × ${item.unit_price.toLocaleString('sv-SE')} kr)
        </span>
        <span class="item-price">${(item.quantity * item.unit_price).toLocaleString('sv-SE')} kr</span>
      </div>
    `).join('');
  };

  // Calculate savings percentage for ROT
  const rotPercentage = quote.cost_specifications?.work_cost && quote.cost_specifications?.rot_deduction 
    ? Math.round((quote.cost_specifications.rot_deduction / quote.cost_specifications.work_cost) * 100)
    : 30;

  // File icon SVG
  const fileIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  `;

  // Check icon SVG
  const checkIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `;

  // Wrench icon SVG
  const wrenchIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  `;

  // Package icon SVG
  const packageIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  `;

  // List icon SVG
  const listIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  `;

  // Credit card icon SVG
  const creditCardIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  `;

  // Shield icon SVG
  const shieldIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  `;

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
        <!-- Hero Header -->
    <div class="hero-header">
      ${logoBase64 ? `
      <div class="logo-container">
        <img src="data:image/png;base64,${logoBase64}" alt="Fixco" class="company-logo" />
      </div>
      ` : ''}
      <h1>Offert ${quote.number}</h1>
    </div>
        
        <!-- Main Card -->
        <div class="main-card">
          <!-- Title -->
          <div class="title-section">
            <h2>Offertförfrågan</h2>
          </div>
          
          <!-- Customer & Date Grid -->
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Mottagare</span>
              <span class="info-value">${quote.customer_name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Giltig till</span>
              <span class="info-value">${quote.valid_until}</span>
            </div>
          </div>
          
          <!-- What's included -->
          <div class="items-section">
            <div class="section-header">
              <div class="section-icon">
                ${listIconSVG}
              </div>
              <span class="section-title">Vad ingår i offerten</span>
            </div>
            
            ${workItems.length > 0 ? `
              <div class="category-card">
                <div class="category-header">
                  <span class="category-icon">${wrenchIconSVG}</span>
                  <span>Arbete</span>
                </div>
                ${renderItems(workItems)}
              </div>
            ` : ''}
            
            ${materialItems.length > 0 ? `
              <div class="category-card">
                <div class="category-header">
                  <span class="category-icon">${packageIconSVG}</span>
                  <span>Material</span>
                </div>
                ${renderItems(materialItems)}
              </div>
            ` : ''}
            
            ${uncategorizedItems.length > 0 ? `
              <div class="category-card">
                ${renderItems(uncategorizedItems)}
              </div>
            ` : ''}
          </div>
          
          <!-- Cost specification -->
          <div class="cost-section">
            <div class="section-header">
              <div class="section-icon">
                <span style="font-weight: 700; color: white; font-size: 11pt;">kr</span>
              </div>
              <span class="section-title">Kostnadsspecifikation</span>
            </div>
            
            ${quote.cost_specifications?.work_cost ? `
              <div class="cost-row">
                <span class="cost-label">Arbetskostnad</span>
                <span class="cost-value">${quote.cost_specifications.work_cost.toLocaleString('sv-SE')} kr</span>
              </div>
            ` : ''}
            
            ${quote.cost_specifications?.material_cost ? `
              <div class="cost-row">
                <span class="cost-label">Materialkostnad</span>
                <span class="cost-value">${quote.cost_specifications.material_cost.toLocaleString('sv-SE')} kr</span>
              </div>
            ` : ''}
            
            <div class="cost-row">
              <span class="cost-label">Moms (25%)</span>
              <span class="cost-value">${quote.vat_amount.toLocaleString('sv-SE')} kr</span>
            </div>
            
            ${quote.cost_specifications?.rot_deduction ? `
              <div class="cost-row discount">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="cost-label">🌱 ROT-avdrag (${rotPercentage}%)</span>
                    <span class="cost-value">−${quote.cost_specifications.rot_deduction.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <div class="discount-explanation">
                    💰 Du sparar ${rotPercentage}% på arbetskostnaden!
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Supercharged Total box -->
          <div class="total-box">
            <span class="total-label">Totalt att betala</span>
            <span class="total-amount">${quote.total_amount.toLocaleString('sv-SE')} kr</span>
          </div>
          
          <!-- Signature Section -->
          <div class="signature-section">
            <div class="signature-header">
              ✍️ Godkännande
            </div>
            <div class="signature-line"></div>
            <div class="signature-label">
              <span>Underskrift</span>
              <span>Datum</span>
            </div>
          </div>
          
          <!-- Payment & Trust Info -->
          <div class="bottom-info">
            <div class="info-card">
              <div class="info-card-title">Företagsinformation</div>
              <div class="info-card-content">
                <p><strong>Fixco AB</strong></p>
                <p>Org.nr: 559240-3418</p>
                <p>F-skatt & försäkring</p>
                <p>2 års garanti på arbete</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-card-title">Kontakt</div>
              <div class="info-card-content">
                <p>Email: info@fixco.se</p>
                <p>Telefon: 010-551 72 40</p>
                <p>Bankgiro: 5783-1466</p>
              </div>
            </div>
          </div>
        </div>
        
        ${quote.notes ? `
          <div class="main-card" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-color: #fbbf24;">
            <div style="font-size: 10pt; color: #92400e; font-weight: 500;">
              <strong style="font-size: 11pt;">📝 Anteckningar:</strong><br>
              <span style="margin-top: 6px; display: block;">${quote.notes}</span>
            </div>
          </div>
        ` : ''}
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
        <div class="item-row">
          <span class="item-description">
            ${item.description} (${item.quantity} st × ${item.unit_price.toLocaleString('sv-SE')} kr)
          </span>
          <span class="item-price">${amount.toLocaleString('sv-SE')} kr</span>
        </div>
      `;
    }).join('');
  };

  // Calculate ROT/RUT percentage
  const rotPercentage = invoice.rot_amount && invoice.subtotal 
    ? Math.round((invoice.rot_amount / invoice.subtotal) * 100)
    : 30;
  const rutPercentage = invoice.rut_amount && invoice.subtotal 
    ? Math.round((invoice.rut_amount / invoice.subtotal) * 100)
    : 30;

  // Icons (same as quote)
  const fileIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  `;

  const checkIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `;

  const wrenchIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  `;

  const packageIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  `;

  const listIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  `;

  const creditCardIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  `;

  const shieldIconSVG = `
    <svg class="icon-file" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  `;

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
        <!-- Hero Header -->
        <div class="hero-header">
          ${logoBase64 ? `
          <div class="logo-container">
            <img src="data:image/png;base64,${logoBase64}" alt="Fixco" class="company-logo" />
          </div>
          ` : ''}
          <h1>Faktura ${invoice.invoice_number}</h1>
        </div>
        
        <!-- Trust Badges -->
        <div class="trust-badges">
          <div class="trust-badge">
            ${checkIconSVG}
            <span>F-skatt registrerad</span>
          </div>
          <div class="trust-badge">
            ${checkIconSVG}
            <span>Försäkrad & Momsregistrerad</span>
          </div>
          <div class="trust-badge">
            ${checkIconSVG}
            <span>Professionell service</span>
          </div>
        </div>
        
        <!-- Main Card -->
        <div class="main-card">
          <!-- Title -->
          <div class="title-section">
            <h2>Faktura för utfört arbete</h2>
          </div>
          
          <!-- Customer & Date Grid -->
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Fakturamottagare</span>
              <span class="info-value">${invoice.customer_name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Förfallodatum</span>
              <span class="info-value">${invoice.due_date}</span>
            </div>
          </div>
          
          <!-- Line items -->
          <div class="items-section">
            <div class="section-header">
              <div class="section-icon">
                ${listIconSVG}
              </div>
              <span class="section-title">Specifikation</span>
            </div>
            
            ${workItems.length > 0 ? `
              <div class="category-card">
                <div class="category-header">
                  <span class="category-icon">${wrenchIconSVG}</span>
                  <span>Arbete</span>
                </div>
                ${renderItems(workItems)}
              </div>
            ` : ''}
            
            ${materialItems.length > 0 ? `
              <div class="category-card">
                <div class="category-header">
                  <span class="category-icon">${packageIconSVG}</span>
                  <span>Material</span>
                </div>
                ${renderItems(materialItems)}
              </div>
            ` : ''}
            
            ${uncategorizedItems.length > 0 ? `
              <div class="category-card">
                ${renderItems(uncategorizedItems)}
              </div>
            ` : ''}
          </div>
          
          <!-- Cost specification -->
          <div class="cost-section">
            <div class="section-header">
              <div class="section-icon">
                <span style="font-weight: 700; color: white; font-size: 11pt;">kr</span>
              </div>
              <span class="section-title">Kostnadsspecifikation</span>
            </div>
            
            <div class="cost-row">
              <span class="cost-label">Delsumma</span>
              <span class="cost-value">${invoice.subtotal.toLocaleString('sv-SE')} kr</span>
            </div>
            
            <div class="cost-row">
              <span class="cost-label">Moms (25%)</span>
              <span class="cost-value">${invoice.vat_amount.toLocaleString('sv-SE')} kr</span>
            </div>
            
            ${invoice.rot_amount && invoice.rot_amount > 0 ? `
              <div class="cost-row discount">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="cost-label">🌱 ROT-avdrag (${rotPercentage}%)</span>
                    <span class="cost-value">−${invoice.rot_amount.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <div class="discount-explanation">
                    💰 Du sparar ${rotPercentage}% på arbetskostnaden!
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${invoice.rut_amount && invoice.rut_amount > 0 ? `
              <div class="cost-row discount">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="cost-label">🏠 RUT-avdrag (${rutPercentage}%)</span>
                    <span class="cost-value">−${invoice.rut_amount.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <div class="discount-explanation">
                    💰 Du sparar ${rutPercentage}% på arbetskostnaden!
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Supercharged Total box -->
          <div class="total-box">
            <span class="total-label">Totalt att betala</span>
            <span class="total-amount">${invoice.total_amount.toLocaleString('sv-SE')} kr</span>
          </div>
          
          <!-- Payment & Trust Info -->
          <div class="bottom-info">
            <div class="info-card">
              <div class="info-card-header">
                <span class="info-card-icon">${creditCardIconSVG}</span>
                <span class="info-card-title">Betalning</span>
              </div>
              <div class="info-card-content">
                <p>📅 Förfallodatum: ${invoice.due_date}</p>
                <p>💳 Kortbetalning & Swish</p>
                <p>🏦 Bankgiro: 123-4567</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-card-header">
                <span class="info-card-icon">${shieldIconSVG}</span>
                <span class="info-card-title">Företagsinformation</span>
              </div>
              <div class="info-card-content">
                <p>🏢 Org.nr: 559472-6448</p>
                <p>✅ F-skatt & moms</p>
                <p>📧 info@fixco.se</p>
              </div>
            </div>
          </div>
        </div>
        
        ${invoice.notes ? `
          <div class="main-card" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-color: #fbbf24;">
            <div style="font-size: 10pt; color: #92400e; font-weight: 500;">
              <strong style="font-size: 11pt;">📝 Anteckningar:</strong><br>
              <span style="margin-top: 6px; display: block;">${invoice.notes}</span>
            </div>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}
