'use client';

import { useRouter } from 'next/navigation';
import {
  Shield, Zap, Lock, CheckCircle2, AlertTriangle, MapPin,
  ArrowRight, BarChart3, Brain, Receipt, QrCode,
  Play, Radio, Check, MessageSquare, Calculator, Landmark
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'NIPOST Sync', href: '#location' },
  { label: 'Audit Engine', href: '#audit' },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#090D16] text-white font-sans overflow-x-hidden selection:bg-[#10B981] selection:text-[#090D16]">
      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] group-hover:scale-105 transition-transform shadow-sm shadow-[#10B981]/20">
              <Shield className="w-5 h-5 fill-[#10B981]/20" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              TRA<span className="text-[#10B981]">-SYNC</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-300 hover:text-[#10B981] text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/auth')}
              className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 transition-colors"
              id="nav-login"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/auth')}
              className="bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm px-4 py-2.5 rounded-lg transition-all shadow-md shadow-[#10B981]/20 hover:shadow-[#10B981]/40 hover:-translate-y-0.5 active:translate-y-0"
              id="nav-create-account"
            >
              Create Store Account
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 lg:pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#10B981]/15 via-[#10B981]/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-[#062c1d] border border-[#10B981]/40 rounded-full px-3.5 py-1.5 shadow-sm shadow-[#10B981]/10">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[#10B981] text-xs font-bold tracking-wider uppercase">
                  STOP PAYMENT FRAUD IN NIGERIA
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight">
                Verify Customer Bank Transfers in Real-Time.{' '}
                <span className="text-[#10B981]">Release Goods with Confidence.</span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Never lose money to fake SMS alerts or forged transfer receipts. TRA-SYNC connects
                your bank directly to your checkout till so items unlock instantly when money arrives.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => router.push('/auth')}
                  className="bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-base px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/25 hover:shadow-[#10B981]/40 hover:-translate-y-0.5"
                  id="hero-create-account"
                >
                  Create Free Store Account <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push('/pos')}
                  className="bg-[#1E293B]/80 hover:bg-[#334155] text-white font-semibold text-base px-6 py-3.5 rounded-xl border border-slate-700/60 transition-all flex items-center justify-center gap-2 backdrop-blur-sm hover:-translate-y-0.5"
                  id="hero-view-demo"
                >
                  <Play className="w-4 h-4 text-white fill-white" /> View Live Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>CBN Compliant Protocol</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
                  <Zap className="w-4 h-4 text-[#10B981]" />
                  <span>Sub-2s Direct Hook</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
                  <BarChart3 className="w-4 h-4 text-[#10B981]" />
                  <span>Works with Low Network</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Terminal Widget (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl font-mono text-xs space-y-5 relative overflow-hidden shadow-[#10B981]/5">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                    <span className="text-slate-400 font-semibold tracking-wider uppercase">
                      NODE: TERMINAL-LOS-01
                    </span>
                  </div>
                  <div className="text-[#10B981] font-bold tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>LIVE LISTENING</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Customer Transfer Session</span>
                    <span className="text-slate-300 font-bold">REF: TR-89241</span>
                  </div>

                  <div className="flex justify-between items-end pt-1">
                    <div>
                      <div className="text-slate-400 text-[11px]">Payee Account (Providus)</div>
                      <div className="text-white font-bold text-sm tracking-wider">9920148810</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-[11px]">Due Amount</div>
                      <div className="text-white font-extrabold text-lg sm:text-xl">₦25,000.00</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <div className="bg-gradient-to-r from-[#10B981] to-[#34D399] h-full rounded-full w-full shadow-[0_0_12px_#10B981] animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-900/60 rounded-xl border border-slate-800/60">
                  <div className="border-r border-slate-800 pr-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">STEP 1</div>
                    <div className="text-slate-300 font-medium text-[11px]">Transfer Sent</div>
                  </div>
                  <div className="border-r border-slate-800 px-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">SPEED</div>
                    <div className="text-[#10B981] font-bold text-[11px]">1.2s Sync</div>
                  </div>
                  <div className="pl-1">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">STATUS</div>
                    <div className="text-[#10B981] font-bold text-[11px]">Auto Ledger</div>
                  </div>
                </div>

                <div className="bg-[#064E3B]/50 border border-[#10B981]/60 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-[#10B981]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#10B981] text-[#064E3B] flex items-center justify-center shrink-0 shadow-md">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">Payment Confirmed</span>
                        <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 text-[9px] uppercase font-black px-1.5 py-0.5 rounded tracking-wider">
                          SETTLED
                        </span>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        Inbound: Zenith Bank • Oladipo F.
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-extrabold text-base sm:text-lg">₦25,000.00</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-mono">RECEIPT #REC-4091 READY</span>
                  <div className="flex items-center gap-1.5 text-[#10B981] font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>BAG RELEASE AUTHORIZED</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS IN YOUR SHOP (SIMPLE 3-STEP PROCESS) ──────────────── */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-[#0B0F17]" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-[#10B981] font-mono text-xs font-bold tracking-wider uppercase mb-2">
                SIMPLE 3-STEP PROCESS
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                How It Works in Your Shop
              </h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base max-w-md font-normal leading-relaxed">
              Zero complex cashier training. Built directly into everyday checkout operations across retail supermarkets, pharmacies, and wholesale stalls.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* STAGE 01 */}
            <div className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <span className="text-slate-500 text-xs font-mono font-bold tracking-wider">STAGE 01</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ring Up Sale</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Cashier scans or selects items on the checkout counter. The system tallies total payable amount in Naira with exact line-item records.
                </p>
              </div>
              
              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Cart: 4 FMCG Items</span>
                <span className="text-white font-bold text-sm">₦18,450.00</span>
              </div>
            </div>

            {/* STAGE 02 */}
            <div className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="text-slate-500 text-xs font-mono font-bold tracking-wider">STAGE 02</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Customer Transfers</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Customer sends exact amount via any Nigerian bank app using an automated dynamic store account or quick QR code presented at checkout.
                </p>
              </div>

              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">NIBSS Instant Transfer</span>
                <span className="text-[#10B981] font-bold">SCAN / USSD / APP</span>
              </div>
            </div>

            {/* STAGE 03 */}
            <div className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-[#10B981]/40 transition-all shadow-lg shadow-[#10B981]/5">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[#10B981] text-xs font-mono font-bold tracking-wider">STAGE 03</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Confirmation</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Screen flashes green immediately the fund settles. Inventory deducts automatically and the thermal receipt issues without waiting for personal phone alerts.
                </p>
              </div>

              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center font-mono text-xs">
                <span className="text-[#10B981] font-bold tracking-wider">✓ SETTLED • PRINT RECEIPT</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── WHY SHOP OWNERS LOVE TRA-SYNC ─────────────────────────────── */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-[#090D16]" id="features">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="text-[#10B981] font-mono text-xs font-bold tracking-wider uppercase">
              BUILT FOR REAL NIGERIAN COMMERCE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Shop Owners Love TRA-SYNC
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              Engineered to eradicate cashiers&apos; biggest daily headaches: fake bank screenshots, delayed personal SMS alerts, and midnight ledger mismatches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-slate-700/60 text-slate-300 flex items-center justify-center mb-6">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No More Fake SMS Alerts</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Cashiers no longer rely on looking at customer phones or waiting for personal bank notifications. The till registers truth directly from the financial settlement gateway.
                </p>
              </div>

              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-slate-400 font-mono text-xs font-medium">
                Zero reliance on customer phone screens
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-slate-700/60 text-slate-300 flex items-center justify-center mb-6">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Zero Manual Ledger Balancing</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  End-of-day accounts reconcile automatically. Eliminate missing payments, uncredited transactions, and hours spent reviewing paper deposit slips after closing hours.
                </p>
              </div>

              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-slate-400 font-mono text-xs font-medium">
                Automated export to Excel &amp; POS databases
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-slate-700/60 text-slate-300 flex items-center justify-center mb-6">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Supported by Major Nigerian Banks</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Direct rails with GTBank, Zenith Bank, Providus Bank, Access Bank, and FirstBank ensure fast routing, low failure rates, and reliable notification speeds.
                </p>
              </div>

              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-slate-300 font-mono text-xs font-bold tracking-wider uppercase">
                GTBANK • ZENITH • PROVIDUS • ACCESS
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── PLATFORM METRICS STRIP ───────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl lg:text-4xl font-black text-[#10B981] font-sans">₦0</div>
                <div className="text-slate-400 text-xs font-medium mt-1">Charge on Failed Tries</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-black text-white font-sans">1.2s</div>
                <div className="text-slate-400 text-xs font-medium mt-1">Average Verification</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-black text-white font-sans">99.98%</div>
                <div className="text-slate-400 text-xs font-medium mt-1">Gateway Uptime</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-black text-[#10B981] font-sans">14,800+</div>
                <div className="text-slate-400 text-xs font-medium mt-1">Nigerian Retail Tills</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── READY TO PROTECT STORE REVENUE CTA CARD ─────────────────────── */}
      <section className="py-12 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl overflow-hidden grid md:grid-cols-12 items-center">
            
            {/* Left Content (8 Cols) */}
            <div className="md:col-span-8 p-8 md:p-10 space-y-3">
              <div className="text-[#10B981] font-mono text-xs font-bold tracking-wider uppercase">
                NO HARDWARE LOCK-IN • SETUP IN 5 MINS
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Ready to protect your store revenue?
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-normal leading-relaxed max-w-xl">
                Sign up today and run test transfers on your existing phone, tablet, or POS terminal without signing long bank contracts.
              </p>
            </div>

            {/* Right Buttons Container (4 Cols) */}
            <div className="md:col-span-4 bg-[#1E293B]/60 p-8 md:p-10 flex flex-col sm:flex-row md:flex-col gap-3 justify-center items-stretch md:items-start h-full border-t md:border-t-0 md:border-l border-slate-800/80">
              <button
                onClick={() => router.push('/auth')}
                className="bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm px-6 py-3.5 rounded-lg transition-all shadow-md shadow-[#10B981]/20 hover:shadow-[#10B981]/40 text-center w-full"
                id="cta-get-started"
              >
                Get Started Now
              </button>
              <button
                onClick={() => router.push('/onboard')}
                className="bg-[#1E293B] hover:bg-[#334155] text-white font-medium text-sm px-6 py-3.5 rounded-lg border border-slate-700/60 transition-colors text-center w-full"
                id="cta-setup-guide"
              >
                Terminal Setup Guide
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── NIPOST LOCATION ANCHOR ───────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-slate-800/80" id="location">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 md:flex items-center gap-10">
            <div className="w-20 h-20 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center mb-6 md:mb-0 shrink-0 shadow-lg shadow-[#10B981]/10">
              <MapPin className="w-10 h-10 text-[#10B981]" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
                Official NIPOST Integration
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white">
                Grounded in Physical Reality
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Validates terminal operations within physical boundaries using official NIPOST digital postcodes.
              </p>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <span className="text-slate-500">Postcode: </span>
                  <span className="text-[#10B981] font-bold">LA-100001-0842</span>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Location: Commercial Ave, Ikeja Industrial Zone, Lagos State.
                  </div>
                </div>
                <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  LOCATION VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI AUDIT ENGINE ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-slate-800/80" id="audit">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-10 md:flex items-center gap-10">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-[#a855f7] text-xs font-bold uppercase tracking-wider">
                <Brain className="w-4 h-4" /> AI Audit Engine
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white">
                Automated Discrepancy Detection
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Monitors transaction flows continuously to flag suspicious patterns and inventory mismatches.
              </p>
              <button
                onClick={() => router.push('/admin')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
                id="audit-admin-link"
              >
                <BarChart3 className="w-4 h-4 text-[#10B981]" /> Open Admin Audit Panel
              </button>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl min-w-[240px] mt-6 md:mt-0 space-y-4 font-mono text-xs">
              <div className="text-slate-500 text-[10px] uppercase tracking-wider">
                Risk Pipeline Status
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Batches Analyzed</span>
                  <span className="text-white font-bold">14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Discrepancies</span>
                  <span className="text-red-400 font-bold">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Risk Score</span>
                  <span className="bg-[#10B981]/20 text-[#10B981] font-bold px-2 py-0.5 rounded text-[10px]">
                    LOW (0.02%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 py-10 px-6 text-center text-slate-500 text-xs space-y-2 bg-slate-950">
        <div>© 2026 TRA-SYNC · Anti-Fraud Real-Time Payment & Inventory Synchronization</div>
        <div className="text-slate-600 font-mono">Built for Nigerian Retail Merchants & Enterprise Tills</div>
      </footer>
    </div>
  );
}
