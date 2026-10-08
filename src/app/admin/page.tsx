'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, BarChart3, Brain, Mail, AlertTriangle, CheckCircle2,
  Package, TrendingUp, RefreshCw, X, Loader2, ArrowLeft,
  Clock, DollarSign, Download, Lock
} from 'lucide-react';
import { Order, AnalyzeResult } from '@/types';
import { mockOrders, mockProducts } from '@/lib/supabase';

const fmt = (n: number) => '₦' + n.toLocaleString('en-NG');

function StatusBadge({ status }: { status: Order['status'] }) {
  const map: Record<Order['status'], string> = {
    PAID:     'badge-paid',
    PENDING:  'badge-pending',
    FLAGGED:  'badge-flagged',
    RESERVED: 'badge-reserved',
  };
  return <span className={map[status]}>{status}</span>;
}

function RiskBadge({ risk }: { risk: AnalyzeResult['risk_score'] }) {
  const map = {
    LOW:    'badge-paid',
    MEDIUM: 'badge-pending',
    HIGH:   'badge-flagged',
  };
  return <span className={map[risk]}>{risk}</span>;
}

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl animate-slide-up border ${
      type === 'success'
        ? 'bg-[#062c1d] border-[#10B981]/50 text-[#10B981]'
        : 'bg-[#450a0a] border-red-500/40 text-red-400'
    }`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const tableRef = useRef<HTMLDivElement>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [captureLoading, setCaptureLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Load orders ──────────────────────────────────────────────────────────────
  function loadOrders() {
    setOrders([...mockOrders].reverse());
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 400));
    loadOrders();
    setRefreshing(false);
  }

  // ── Derived metrics ──────────────────────────────────────────────────────────
  const totalRevenue = orders.filter((o) => o.status === 'PAID').reduce((s, o) => s + o.total, 0);
  const totalFlagged = orders.filter((o) => o.status === 'FLAGGED').length;
  const totalReserved = orders.filter((o) => o.status === 'RESERVED').length;
  const totalPaid = orders.filter((o) => o.status === 'PAID').length;
  const reservedStockTotal = mockProducts.reduce((s, p) => s + p.stock_reserved, 0);

  // ── Screen capture + AI analyze ──────────────────────────────────────────────
  async function handleCapture() {
    if (!tableRef.current) return;
    setCaptureLoading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(tableRef.current, { backgroundColor: '#090D16' });
      const dataUrl = canvas.toDataURL('image/png');

      const res = await fetch('/api/trasync/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl }),
      });
      const data: AnalyzeResult = await res.json();
      setAnalyzeResult(data);
      setShowAnalyzeModal(true);
      setToast({ message: 'AI Audit Complete! Discrepancies Parsed.', type: 'success' });
    } catch {
      setToast({ message: 'Failed to run AI audit capture.', type: 'error' });
    } finally {
      setCaptureLoading(false);
    }
  }

  // ── Send EOD email report ────────────────────────────────────────────────────
  async function handleSendEmail() {
    setEmailLoading(true);
    try {
      const res = await fetch('/api/reports/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: 'merchant@trasync.ng',
          ordersCount: orders.length,
          totalRevenue,
          flaggedCount: totalFlagged,
        }),
      });
      if (res.ok) {
        setToast({ message: 'EOD Audit Report emailed successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to send report email.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Network error sending report.', type: 'error' });
    } finally {
      setEmailLoading(false);
    }
  }

  const METRIC_CARDS = [
    { label: 'Total Verified Revenue', value: fmt(totalRevenue), sub: `${totalPaid} settled transactions`, icon: DollarSign, color: '#10B981', bg: '#10B98115' },
    { label: 'Flagged Discrepancies', value: totalFlagged.toString(), sub: 'Requires manual review', icon: AlertTriangle, color: '#f87171', bg: '#f8717115' },
    { label: 'Reserved Stock Items', value: `${reservedStockTotal} units`, sub: `${totalReserved} orders pending webhook`, icon: Lock, color: '#a78bfa', bg: '#a78bfa15' },
    { label: 'Average Sync Time', value: '1.2s', sub: '99.98% Gateway Uptime', icon: TrendingUp, color: '#3B82F6', bg: '#3B82F615' },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-white font-sans flex flex-col selection:bg-[#10B981] selection:text-[#090D16]">
      
      {/* Top Navbar */}
      <nav className="bg-[#090D16]/95 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div 
            onClick={() => router.push('/')}
            className="w-8 h-8 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] cursor-pointer"
          >
            <Shield className="w-4 h-4 fill-[#10B981]/20" />
          </div>
          <div>
            <span className="font-black tracking-tight text-white text-lg">
              TRA<span className="text-[#10B981]">-SYNC</span>
            </span>
            <span className="text-slate-400 text-xs font-mono ml-2 hidden sm:inline">Admin Audit Center</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-3.5 py-2 rounded-lg border border-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#10B981] ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Sync</span>
          </button>
          
          <button
            id="admin-send-eod"
            onClick={handleSendEmail}
            disabled={emailLoading}
            className="bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-[#10B981]/20 disabled:opacity-60"
          >
            {emailLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
            <span>Email EOD Report</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {METRIC_CARDS.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg shadow-[#10B981]/5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium">{m.label}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: m.bg }}>
                    <Icon className="w-4 h-4" style={{ color: m.color }} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-sans">{m.value}</div>
                <div className="text-slate-500 text-[11px] font-mono">{m.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Main Grid: Table & Panels */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Table Section (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#10B981]" /> Transaction Audit Logs
              </h2>

              <button
                id="admin-ai-capture"
                onClick={handleCapture}
                disabled={captureLoading}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60"
              >
                {captureLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#10B981]" />
                ) : (
                  <Brain className="w-4 h-4 text-[#10B981]" />
                )}
                <span>{captureLoading ? 'Analyzing…' : 'Run AI Audit Capture'}</span>
              </button>
            </div>

            <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-[#10B981]/5">
              <div ref={tableRef} className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm font-sans">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                      <th className="px-5 py-4">Reference</th>
                      <th className="px-5 py-4">Items Included</th>
                      <th className="px-5 py-4 text-right">Total</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-slate-500 py-12 font-mono">
                          No transactions recorded yet. Process sales in POS Terminal.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="px-5 py-4 font-mono text-[#10B981] font-bold">{order.ref}</td>
                          <td className="px-5 py-4 text-slate-300 max-w-[200px] truncate">
                            {order.items.map((i) => `${i.product_name} ×${i.quantity}`).join(', ')}
                          </td>
                          <td className="px-5 py-4 text-right text-white font-bold font-sans">{fmt(order.total)}</td>
                          <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                          <td className="px-5 py-4 text-slate-400 font-mono text-xs">
                            {new Date(order.created_at).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Panels Section (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Inventory Status Panel */}
            <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg shadow-[#10B981]/5">
              <h3 className="text-white font-bold text-base flex items-center gap-2 border-b border-slate-800 pb-3">
                <Package className="w-4 h-4 text-[#10B981]" /> Live Inventory Guard
              </h3>
              <div className="space-y-4">
                {mockProducts.map((p) => (
                  <div key={p.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">{p.name}</span>
                      <span className="text-slate-400 font-mono">{p.stock_available} avail · {p.stock_reserved} locked</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full transition-all duration-500"
                        style={{ width: `${(p.stock_available / (p.stock_available + p.stock_reserved + 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Export Panel */}
            <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg shadow-[#10B981]/5">
              <h3 className="text-white font-bold text-base flex items-center gap-2 border-b border-slate-800 pb-3">
                <Download className="w-4 h-4 text-[#10B981]" /> Automated Export
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generate verified EOD audit summaries directly exported to accounting ledgers and merchant records.
              </p>
              <button
                onClick={handleSendEmail}
                disabled={emailLoading}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-[#10B981]/20 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>Send Audit Summary via Email</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ── AI Analysis Results Modal ────────────────────────────────────── */}
      {showAnalyzeModal && analyzeResult && (
        <div className="fixed inset-0 bg-[#090D16]/80 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl shadow-[#10B981]/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-white font-bold text-lg">AI Audit Parse Output</h3>
              </div>
              <button onClick={() => setShowAnalyzeModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-slate-400 text-[10px] font-mono uppercase">Analyzed</div>
                  <div className="text-white font-bold text-base mt-1">{analyzeResult.parsed_transactions}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-slate-400 text-[10px] font-mono uppercase">Discrepancies</div>
                  <div className="text-red-400 font-bold text-base mt-1">{analyzeResult.flagged_discrepancies}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-slate-400 text-[10px] font-mono uppercase">Risk Level</div>
                  <div className="mt-1"><RiskBadge risk={analyzeResult.risk_score} /></div>
                </div>
              </div>

              {analyzeResult.flagged_discrepancies > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 space-y-1 text-xs">
                  <div className="text-red-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Discrepancies Flagged:
                  </div>
                  <p className="text-slate-300 pt-1">
                    Unmatched transfer detected. Verification status held until direct bank webhook logs resolve.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAnalyzeModal(false)}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm py-3 rounded-xl transition-all"
            >
              Close Audit Results
            </button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
