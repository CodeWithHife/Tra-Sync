'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Shield, Zap, BarChart3, ShoppingCart, ArrowRight, Package, TrendingUp,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: ShoppingCart, label: 'POS Terminal', desc: 'Process sales & lock inventory', path: '/pos',    color: '#00d4ff', bg: '#00d4ff10' },
  { icon: BarChart3,    label: 'Admin Panel',  desc: 'Audit & analytics dashboard',   path: '/admin',   color: '#a855f7', bg: '#a855f710' },
  { icon: Package,      label: 'Inventory',    desc: 'Track stock reservations',       path: '/admin',   color: '#00ff87', bg: '#00ff8710' },
  { icon: TrendingUp,   label: 'Reports',      desc: 'Download & email reports',       path: '/admin',   color: '#fbbf24', bg: '#fbbf2410' },
];

export default function DashboardPage() {
  const router = useRouter();

  // Auto-redirect to admin after 8s if user is idle
  useEffect(() => {
    const t = setTimeout(() => router.push('/admin'), 8000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#040817] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#00d4ff] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#a855f7] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center animate-pulse-glow">
            <Shield size={24} className="text-[#040817]" />
          </div>
          <div>
            <div className="text-3xl font-black tracking-widest text-white">
              TRA<span className="text-[#00d4ff]">-SYNC</span>
            </div>
            <div className="text-slate-500 text-sm">Merchant Control Center</div>
          </div>
        </div>

        {/* Status bar */}
        <div className="card p-4 mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff87] animate-blink" />
            <span className="text-[#00ff87] text-sm font-medium">Fraud Shield Active</span>
          </div>
          <div className="w-px h-4 bg-[#1a2550]" />
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#00d4ff]" />
            <span className="text-slate-400 text-sm">Real-time inventory lock enabled</span>
          </div>
        </div>

        {/* Nav grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                id={`dashboard-${item.label.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => router.push(item.path)}
                className="card p-6 text-left hover:border-[#00d4ff40] group transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: item.bg }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div className="text-white font-bold mb-1">{item.label}</div>
                <div className="text-slate-500 text-xs">{item.desc}</div>
                <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs" style={{ color: item.color }}>Open</span>
                  <ArrowRight size={12} style={{ color: item.color }} />
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-slate-600 text-xs">
          Auto-redirecting to Admin Panel in a few seconds…
        </p>
      </div>
    </div>
  );
}
