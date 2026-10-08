import { NextRequest, NextResponse } from 'next/server';

const AUDIT_HTML = (date: string, orders: number, revenue: string, flagged: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #0a0a1a; color: #e2e8f0; margin: 0; padding: 24px; }
    .header { background: linear-gradient(135deg, #1a1a3e, #0f3460); padding: 32px; border-radius: 12px; margin-bottom: 24px; }
    .logo { font-size: 28px; font-weight: 900; color: #00d4ff; letter-spacing: 2px; }
    .subtitle { color: #94a3b8; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .card { background: #1e1e3f; border: 1px solid #334155; border-radius: 8px; padding: 20px; }
    .card-label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .card-value { font-size: 28px; font-weight: 700; color: #00d4ff; margin-top: 8px; }
    .flagged .card-value { color: #f87171; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #1a1a3e; color: #94a3b8; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
    .table td { padding: 12px; border-bottom: 1px solid #1e293b; }
    .badge-paid { background: #064e3b; color: #34d399; padding: 2px 10px; border-radius: 12px; font-size: 12px; }
    .badge-flagged { background: #450a0a; color: #f87171; padding: 2px 10px; border-radius: 12px; font-size: 12px; }
    .footer { margin-top: 32px; text-align: center; color: #475569; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">TRA-SYNC</div>
    <div class="subtitle">Daily Audit Report — ${date}</div>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-label">Total Transactions</div>
      <div class="card-value">${orders}</div>
    </div>
    <div class="card">
      <div class="card-label">Revenue</div>
      <div class="card-value">₦${revenue}</div>
    </div>
    <div class="card flagged">
      <div class="card-label">Flagged</div>
      <div class="card-value">${flagged}</div>
    </div>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th>Ref</th><th>Amount</th><th>Status</th><th>Time</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>TS-101</td><td>₦10,000</td><td><span class="badge-paid">PAID</span></td><td>08:12 AM</td></tr>
      <tr><td>TS-202</td><td>₦10,000</td><td><span class="badge-paid">PAID</span></td><td>10:45 AM</td></tr>
      <tr><td>TS-303</td><td>₦15,000</td><td><span class="badge-flagged">FLAGGED</span></td><td>01:22 PM</td></tr>
    </tbody>
  </table>
  <div class="footer">TRA-SYNC Anti-Fraud Platform &bull; Auto-generated report &bull; Do not reply to this email</div>
</body>
</html>
`;

export async function POST(req: NextRequest) {
  let body: { admin_email?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const adminEmail = body.admin_email ?? process.env.ADMIN_EMAIL ?? 'admin@trasync.io';
  const resendApiKey = process.env.RESEND_API_KEY;

  const reportDate = new Date().toLocaleDateString('en-NG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const htmlContent = AUDIT_HTML(reportDate, 3, '35,000', 1);

  // ── Resend SDK path ────────────────────────────────────────────────────────
  if (resendApiKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      const { data, error } = await resend.emails.send({
        from: 'TRA-SYNC <reports@trasync.io>',
        to: [adminEmail],
        subject: `TRA-SYNC Daily Audit — ${reportDate}`,
        html: htmlContent,
      });

      if (error) {
        return NextResponse.json({ error: 'Resend error', detail: error }, { status: 500 });
      }

      return NextResponse.json({ message: 'Report dispatched via Resend', id: data?.id, to: adminEmail });
    } catch (err) {
      return NextResponse.json({ error: 'Resend failed', detail: String(err) }, { status: 500 });
    }
  }

  // ── Mock path (no RESEND_API_KEY set) ─────────────────────────────────────
  await new Promise((resolve) => setTimeout(resolve, 800));
  return NextResponse.json({
    message: 'Report simulated (no RESEND_API_KEY set)',
    to: adminEmail,
    html_preview_length: htmlContent.length,
    note: 'Set RESEND_API_KEY in .env.local to send real emails',
  });
}
