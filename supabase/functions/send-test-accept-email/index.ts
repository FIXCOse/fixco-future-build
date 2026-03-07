const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');

    const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:linear-gradient(135deg,#16a34a,#15803d);color:white;padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">✅</div>
      <h1 style="margin:0;font-size:24px;font-weight:700;">Offert accepterad!</h1>
      <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">En kund har accepterat din offert</p>
    </div>
    <div style="background:white;padding:30px;border:1px solid #e5e7eb;border-top:none;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;width:140px;">Offert</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:14px;">Q-2026-042 – Badrumsrenovering</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Kund</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:14px;">Anna Svensson</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Kundens email</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">anna.svensson@example.com</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Signatur</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">Anna Svensson</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:14px;">Tidpunkt</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">${now}</td>
        </tr>
      </table>
      <div style="margin-top:20px;padding:16px;background:#f0fdf4;border-radius:8px;border-left:4px solid #16a34a;">
        <p style="margin:0;font-size:14px;color:#15803d;font-weight:600;">🏗️ Projekt har skapats automatiskt</p>
        <p style="margin:4px 0 0;font-size:13px;color:#166534;">Projektet är redo att tilldelas en arbetare.</p>
      </div>
      <div style="text-align:center;margin-top:24px;">
        <a href="https://fixco-future-build.lovable.app/admin/quotes" style="display:inline-block;background:#2563eb;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Öppna i Admin →</a>
      </div>
    </div>
    <div style="text-align:center;padding:20px;color:#9ca3af;font-size:12px;">
      <p style="margin:0;">Fixco · info@fixco.se</p>
      <p style="margin:4px 0 0;">Detta är ett automatiskt meddelande.</p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Fixco <info@fixco.se>',
        to: ['imedashviliomar@gmail.com'],
        subject: '✅ Offert Q-2026-042 accepterad av Anna Svensson',
        html,
      }),
    });

    const result = await res.json();
    console.log('Email sent:', result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('Error:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
