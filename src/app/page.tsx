'use client';

import { useRouter } from 'next/navigation';
import {
  Shield, Zap, Lock, CheckCircle, AlertTriangle, MapPin,
  ArrowRight, BarChart3, Brain, ChevronRight, Globe,
  ShoppingCart, CreditCard, Building2, Package
} from 'lucide-react';

const CHAIN_STEPS = [
  { icon: ShoppingCart, label: 'Customer', color: '#94a3b8' },
  { icon: CreditCard,   label: 'Payment',  color: '#f59e0b' },
  { icon: Building2,    label: 'Bank',      color: '#3b82f6' },
  { icon: Shield,       label: 'TRA-SYNC',  color: '#00d4ff', highlight: true },
  { icon: Zap,          label: 'POS',       color: '#a855f7' },
  { icon: Package,      label: 'Inventory', color: '#00ff87' },
];

const METRICS = [
  { label: 'Transactions Verified', value: '2.4M+', icon: CheckCircle, color: '#00d4ff' },
  { label: 'Fraud Attempts Blocked', value: '18,429', icon: AlertTriangle, color: '#f87171' },
  { label: 'Merchants Protected',    value: '4,700+', icon: Shield,       color: '#a855f7' },
  { label: 'Avg Verification Time',  value: '1.2s',   icon: Zap,          color: '#00ff87' },
];

const PROBLEMS = [
  { icon: AlertTriangle, color: '#f87171', text: 'Merchants accept fake payment screenshots' },
  { icon: AlertTriangle, color: '#f87171', text: 'Stock released before bank confirms funds' },
  { icon: AlertTriangle, color: '#f87171', text: 'No geolocation proof of merchant identity' },
];

const SOLUTIONS = [
  { icon: CheckCircle, color: '#34d399', text: 'Real-time bank webhook confirmation before POS unlocks' },
  { icon: CheckCircle, color: '#34d399', text: 'Inventory locked in RESERVED state until payment clears' },
  { icon: CheckCircle, color: '#34d399', text: 'NIPOST digital postcode anchors merchant to physical address' },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#040817] overflow-x-hidden">
      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-[#00d4ff15]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center">
              <Shield size={16} className="text-[#040817]" />
            </div>
            <span className="text-xl font-black tracking-widest text-white">TRA<span className="text-[#00d4ff]">-SYNC</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/auth')} className="btn-ghost text-sm py-2 px-5">Login</button>
            <button onClick={() => router.push('/auth')} className="btn-primary text-sm py-2 px-5">Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#00d4ff] opacity-5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-[#a855f7] opacity-5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#00d4ff10] border border-[#00d4ff25] rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-[#00ff87] rounded-full animate-blink" />
            <span className="text-[#00d4ff] text-sm font-medium">Live Fraud Protection Active</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Don&apos;t Trust the<br />
            <span className="gradient-text">Screenshot.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-slate-400 font-light mb-4">Verify the Payment.</p>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-12">
            TRA-SYNC intercepts payment confirmations directly from your bank, locks inventory
            until funds clear, and anchors every merchant to a verified NIPOST digital address.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth')}
              className="btn-primary flex items-center justify-center gap-2 text-base"
              id="hero-get-started"
            >
              Start Protecting Sales <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push('/pos')}
              className="btn-ghost flex items-center justify-center gap-2 text-base"
              id="hero-demo-pos"
            >
              Live POS Demo <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Payment Chain Indicator ────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-slate-500 text-sm uppercase tracking-widest mb-10">
            The Verified Payment Chain
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CHAIN_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-2">
                  <div
                    className={`flex flex-col items-center gap-2 ${step.highlight ? 'animate-float' : ''}`}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: step.highlight
                          ? 'linear-gradient(135deg, #00d4ff20, #0066ff20)'
                          : '#0f1a3e',
                        border: `1px solid ${step.color}30`,
                        boxShadow: step.highlight ? `0 0 24px ${step.color}40` : 'none',
                      }}
                    >
                      <Icon size={22} style={{ color: step.color }} />
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: step.highlight ? step.color : '#64748b' }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < CHAIN_STEPS.length - 1 && (
                    <div className="w-8 h-px bg-gradient-to-r from-[#1a2550] to-[#1a2550] mb-5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Problem vs Solution ────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            The Fraud Problem — <span className="gradient-text">Solved</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-[#f87171] font-bold text-lg mb-5 flex items-center gap-2">
                <AlertTriangle size={20} /> Without TRA-SYNC
              </h3>
              <div className="space-y-4">
                {PROBLEMS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.text} className="flex items-start gap-3">
                      <Icon size={18} style={{ color: p.color }} className="mt-0.5 shrink-0" />
                      <p className="text-slate-400 text-sm">{p.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card p-6 border-[#00d4ff20]" style={{ boxShadow: '0 0 24px rgba(0,212,255,0.05)' }}>
              <h3 className="text-[#34d399] font-bold text-lg mb-5 flex items-center gap-2">
                <CheckCircle size={20} /> With TRA-SYNC
              </h3>
              <div className="space-y-4">
                {SOLUTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.text} className="flex items-start gap-3">
                      <Icon size={18} style={{ color: s.color }} className="mt-0.5 shrink-0" />
                      <p className="text-slate-300 text-sm">{s.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Metrics ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#080f2e30]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-slate-500 text-sm uppercase tracking-widest mb-10">Live Platform Metrics</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="card p-5 text-center">
                  <Icon size={24} style={{ color: m.color }} className="mx-auto mb-3" />
                  <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-slate-500 text-xs mt-1">{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NIPOST Location Card ──────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:flex items-center gap-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d4ff20] to-[#0066ff20] border border-[#00d4ff30] flex items-center justify-center mb-6 md:mb-0 shrink-0 animate-float">
              <MapPin size={36} style={{ color: '#00d4ff' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-2xl mb-2">NIPOST Digital Address Proof</h3>
              <p className="text-slate-400 mb-4">
                Every merchant is anchored to a verified physical location via Nigeria&apos;s national postcode system.
                No postcode, no terminal. No location, no trust.
              </p>
              <div className="inline-flex items-center gap-3 bg-[#0f1a3e] border border-[#00d4ff20] rounded-lg px-4 py-3">
                <Globe size={16} className="text-[#00d4ff]" />
                <div>
                  <div className="text-[#00d4ff] font-mono text-sm font-bold">LA-100001-0842</div>
                  <div className="text-slate-500 text-xs">14 Allen Avenue, Ikeja, Lagos · 6.5965°N 3.3421°E</div>
                </div>
                <CheckCircle size={16} className="text-[#34d399]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Audit Card ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:flex items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={20} className="text-[#a855f7]" />
                <span className="text-[#a855f7] text-sm font-semibold uppercase tracking-wider">AI Audit Engine</span>
              </div>
              <h3 className="text-white font-bold text-2xl mb-3">Screenshot Intelligence</h3>
              <p className="text-slate-400 mb-6">
                Capture your POS screen. Our AI parses visible transactions, detects discrepancies
                against verified records, and outputs a risk score in under 2 seconds.
              </p>
              <button onClick={() => router.push('/admin')} className="btn-ghost flex items-center gap-2 text-sm" id="audit-cta">
                <BarChart3 size={16} /> View Admin Audit Panel
              </button>
            </div>
            <div className="card p-5 min-w-[200px] mt-6 md:mt-0">
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-4">Last Audit Result</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Parsed Transactions</span>
                  <span className="text-white font-bold">14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Discrepancies</span>
                  <span className="text-[#f87171] font-bold">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Risk Score</span>
                  <span className="badge-paid">LOW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to <span className="gradient-text">Lock Your Sales?</span>
          </h2>
          <p className="text-slate-400 mb-8">Join 4,700+ Nigerian merchants who verify before they release.</p>
          <button
            onClick={() => router.push('/auth')}
            className="btn-primary text-lg py-4 px-10 animate-pulse-glow"
            id="bottom-cta"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#0f1a3e] py-8 px-6 text-center text-slate-600 text-sm">
        © 2024 TRA-SYNC · Anti-Fraud POS Platform · Built for Nigerian Merchants
      </footer>
    </div>
  );
}
