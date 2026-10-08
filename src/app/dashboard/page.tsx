'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Shield, Zap, BarChart3, ShoppingCart, ArrowRight, Package, TrendingUp, Radio, CheckCircle2
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: ShoppingCart, label: 'POS Terminal', desc: 'Process checkout & lock inventory', path: '/pos',    color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
  { icon: BarChart3,    label: 'Admin Panel',  desc: 'Audit log & transaction verification', path: '/admin', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
  { icon: Package,      label: 'Inventory',    desc: 'Stock status & reserved cart locks', path: '/admin', color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' },
  { icon: TrendingUp,   label: 'EOD Reports',  desc: 'Daily sales audit & email export', path: '/admin', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
];

export default function DashboardPage() {
  const router = useRouter();

  // Auto-redirect to admin panel after 8s if user remains idle
  useEffect(() => {
    const t = setTimeout(() => router.push('/admin'), 8000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#10B981] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#059669] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full animate-slide-up">
        {/* Logo Header */}
        <div 
          onClick={() => router.push('/')}
          className="flex items-center justify-center gap-3 mb-10 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:scale-105 transition-transform shadow-lg shadow-[#10B981]/10">
            <Shield size={26} className="fill-[#10B981]/20" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black tracking-widest text-white">
              TRA<span className="text-[#10B981]">-SYNC</span>
            </div>
            <div className="text-slate-400 text-xs sm:text-sm font-medium">Merchant Control Center</div>
          </div>
        </div>

        {/* Live System Status Strip */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#10B981] text-xs sm:text-sm font-bold tracking-wide uppercase">
              FRAUD SHIELD ACTIVE
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#1E293B]" />
          <div className="flex items-center gap-2">
            <Radio size={15} className="text-[#10B981] animate-pulse" />
            <span className="text-slate-300 text-xs sm:text-sm font-medium">
              Real-time Sub-2s Webhook Listener Connected
            </span>
          </div>
        </div>

        {/* Module Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                id={`dashboard-${item.label.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => router.push(item.path)}
                className="bg-[#0F172A] border border-[#1E293B] hover:border-[#10B981]/40 rounded-2xl p-6 text-left group transition-all duration-200 shadow-lg hover:shadow-[#10B981]/10 flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: item.bg }}
                  >
                    <Icon size={22} style={{ color: item.color }} />
                  </div>
                  <div className="text-white font-bold text-lg mb-1">{item.label}</div>
                  <div className="text-slate-400 text-xs leading-relaxed">{item.desc}</div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-slate-400 group-hover:text-[#10B981] transition-colors">
                  <span className="text-xs font-bold" style={{ color: item.color }}>Launch</span>
                  <ArrowRight size={14} style={{ color: item.color }} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-slate-500 text-xs font-medium">
          Auto-redirecting to Admin Panel in a few seconds…
        </p>
      </div>
    </div>
  );
}

