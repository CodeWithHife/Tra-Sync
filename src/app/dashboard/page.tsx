'use client';

import { useRouter } from 'next/navigation';
import {
  Shield, Zap, BarChart3, ShoppingCart, ArrowRight, Package, TrendingUp,
  MapPin, CheckCircle2, RefreshCw, FileText, Settings, Radio
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: ShoppingCart, label: 'POS Terminal', desc: 'Process sales & lock inventory', path: '/pos', color: '#10B981', bg: '#10B98115' },
  { icon: BarChart3, label: 'Admin Panel', desc: 'Audit & analytics dashboard', path: '/admin', color: '#3B82F6', bg: '#3B82F615' },
  { icon: Package, label: 'Inventory Guard', desc: 'Track stock reservations', path: '/admin', color: '#10B981', bg: '#10B98115' },
  { icon: TrendingUp, label: 'EOD Reports', desc: 'Download audit summaries', path: '/admin', color: '#F59E0B', bg: '#F59E0B15' },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#090D16] text-white font-sans flex flex-col justify-between px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-[#10B981] selection:text-[#090D16]">
      {/* Background radial lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#10B981]/10 via-[#10B981]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="relative z-10 max-w-3xl w-full mx-auto my-auto space-y-6">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 mb-4">
          <div 
            onClick={() => router.push('/')}
            className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-lg shadow-[#10B981]/15 cursor-pointer hover:scale-105 transition-transform"
          >
            <Shield className="w-7 h-7 fill-[#10B981]/20" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              TRA<span className="text-[#10B981]">-SYNC</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
              Merchant Control Center &amp; Terminal Node
            </p>
          </div>
        </div>

        {/* System Status Banner */}
        <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl shadow-xl shadow-[#10B981]/5">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <div className="flex items-center gap-2">
              <span className="text-[#10B981] font-bold text-xs uppercase tracking-wider">
                FRAUD SHIELD ACTIVE
              </span>
              <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                SUB-2S HOOK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span>LA-100001-0842</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#10B981] font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE LISTENING</span>
            </div>
          </div>
        </div>

        {/* Action Grid (2x2 on sm/md, 1 col on mobile) */}
        <div className="grid sm:grid-cols-2 gap-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                id={`dashboard-${item.label.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => router.push(item.path)}
                className="bg-[#0F172A]/90 hover:bg-[#1E293B]/90 border border-slate-800 hover:border-[#10B981]/50 rounded-2xl p-6 text-left group transition-all duration-200 shadow-lg shadow-[#10B981]/5 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 border border-slate-800"
                    style={{ background: item.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="text-white font-bold text-lg mb-1 group-hover:text-[#10B981] transition-colors">
                    {item.label}
                  </div>
                  <div className="text-slate-400 text-xs leading-relaxed">{item.desc}</div>
                </div>

                <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold" style={{ color: item.color }}>
                  <span>Launch Module</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Direct CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => router.push('/pos')}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2"
            id="dash-open-pos"
          >
            <ShoppingCart className="w-4 h-4" /> Open POS Checkout Terminal
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-3.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
            id="dash-open-admin"
          >
            <BarChart3 className="w-4 h-4 text-[#10B981]" /> Open Admin Audit Center
          </button>
        </div>

      </div>

      {/* Footer Note */}
      <div className="text-center text-slate-500 text-xs font-mono z-10 pt-6">
        © 2026 TRA-SYNC · Real-Time Merchant Control Center · NIPOST Location Anchored
      </div>
    </div>
  );
}
