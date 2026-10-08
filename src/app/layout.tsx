import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TRA-SYNC — Fintech POS Anti-Fraud & Inventory Platform',
  description:
    'TRA-SYNC verifies payments in real-time, locks inventory on reserve, and protects merchants from screenshot fraud at the point of sale.',
  keywords: ['POS', 'anti-fraud', 'fintech', 'Nigeria', 'payment verification', 'inventory management'],
  openGraph: {
    title: 'TRA-SYNC',
    description: 'Don\'t Trust the Screenshot. Verify the Payment.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#040817] text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
