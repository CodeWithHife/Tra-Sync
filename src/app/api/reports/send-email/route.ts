import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"Tra-Sync Compliance" <${process.env.SMTP_USER}>`,
      to: email || process.env.SMTP_USER,
      subject: 'Tra-Sync Executive EOD Audit Report',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff;">
          <h2 style="color: #10b981;">Tra-Sync Daily Audit Summary</h2>
          <p><strong>Total Revenue:</strong> ₦20,000</p>
          <p><strong>Settled Transactions:</strong> 2 Paid</p>
          <p><strong>Flagged Discrepancies:</strong> 1 Mismatch</p>
          <hr style="border-color: #334155; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">Sent via Tra-Sync Terminal Node • Geofenced & Verified</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Audit email dispatched via Nodemailer' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
