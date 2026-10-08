'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, BarChart3, Brain, Mail, AlertTriangle, CheckCircle,
  Package, TrendingUp, RefreshCw, X, Loader2, ArrowLeft,
  Clock, DollarSign, Download,
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

// Toast component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl animate-slide-up border ${
      type === 'success'
        ? 'bg-[#0a1f10] border-[#34d39940] text-[#34d399]'
        : 'bg-[#1a0505] border-[#f8717140] text-[#f87171]'
    }`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X size={14} />
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
    // In mock mode: read from shared mockOrders array
    setOrders([...mockOrders].reverse());
  }

  useEffect(() => {
    loadOrders();
    // Poll for updates every 3 seconds
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
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#080f2e',
        scale: 1.5,
        useCORS: true,
        logging: false,
      });
      const imageData = canvas.toDataURL('image/png').split(',')[1];

      const res = await fetch('/api/trasync/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_data: imageData }),
      });
      const data: AnalyzeResult = await res.json();
      setAnalyzeResult(data);
      setShowAnalyzeModal(true);
    } catch (err) {
      setToast({ message: `Capture failed: ${String(err)}`, type: 'error' });
    } finally {
      setCaptureLoading(false);
    }
  }

  // ── Send email report ────────────────────────────────────────────────────────
  async function handleSendEmail() {
    setEmailLoading(true);
    try {
      const res = await fetch('/api/reports/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_email: 'admin@trasync.io' }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: `Report dispatched! ${data.note ?? ''}`.trim(), type: 'success' });
      } else {
        setToast({ message: data.error ?? 'Email dispatch failed', type: 'error' });
      }
    } catch {
      setToast({ message: 'Network error sending email', type: 'error' });
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#040817]">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="bg-[#080f2e] border-b border-[#0f1a3e] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center">
            <Shield size={14} className="text-[#040817]" />
          </div>
          <span className="font-black tracking-widest text-white text-lg">
            TRA<span className="text-[#00d4ff]">-SYNC</span>
            <span className="text-slate-500 font-normal text-sm ml-2">Admin Dashboard</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="admin-refresh"
            onClick={handleRefresh}
            className="btn-ghost py-2 px-4 text-sm flex items-center gap-2"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            id="admin-pos-link"
            onClick={() => router.push('/pos')}
            className="btn-primary py-2 px-4 text-sm"
          >
            Open POS
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Metrics Cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue',    value: fmt(totalRevenue), icon: DollarSign, color: '#00d4ff',  bg: '#00d4ff10' },
            { label: 'Paid Transactions',value: totalPaid,         icon: CheckCircle,color: '#34d399',  bg: '#34d39910' },
            { label: 'Flagged',          value: totalFlagged,      icon: AlertTriangle,color:'#f87171', bg: '#f8717110' },
            { label: 'Reserved Stock',   value: reservedStockTotal,icon: Package,    color: '#a78bfa',  bg: '#a78bfa10' },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-500 text-xs uppercase tracking-wider">{m.label}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: m.bg }}>
                    <Icon size={16} style={{ color: m.color }} />
                  </div>
                </div>
                <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* ── Transaction Table ────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <BarChart3 size={20} className="text-[#00d4ff]" /> Transaction Logs
              </h2>
              {/* AI Capture Button */}
              <button
                id="admin-ai-capture"
                onClick={handleCapture}
                disabled={captureLoading}
                className="btn-ghost py-2 px-4 text-sm flex items-center gap-2 border-[#a855f730] text-[#a855f7] hover:bg-[#a855f710] hover:border-[#a855f7] disabled:opacity-60"
              >
                {captureLoading
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Brain size={14} />
                }
                {captureLoading ? 'Analyzing…' : 'AI Audit Capture'}
              </button>
            </div>

            <div className="card overflow-hidden">
              <div ref={tableRef} className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0f1a3e]">
                      <th className="text-left text-slate-500 text-xs uppercase tracking-wider px-5 py-4">Ref</th>
                      <th className="text-left text-slate-500 text-xs uppercase tracking-wider px-5 py-4">Items</th>
                      <th className="text-right text-slate-500 text-xs uppercase tracking-wider px-5 py-4">Total</th>
                      <th className="text-left text-slate-500 text-xs uppercase tracking-wider px-5 py-4">Status</th>
                      <th className="text-left text-slate-500 text-xs uppercase tracking-wider px-5 py-4">
                        <Clock size={12} className="inline mr-1" />Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-slate-600 py-12">
                          No transactions yet. Use the POS to create orders.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="border-t border-[#0f1a3e] hover:bg-[#0f1a3e40] transition-colors">
                          <td className="px-5 py-4">
                            <span className="font-mono text-[#00d4ff] font-bold">{order.ref}</span>
                          </td>
                          <td className="px-5 py-4 text-slate-400 text-xs max-w-[180px]">
                            {order.items.map((i) => `${i.product_name} ×${i.quantity}`).join(', ')}
                          </td>
                          <td className="px-5 py-4 text-right text-white font-semibold">{fmt(order.total)}</td>
                          <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                          <td className="px-5 py-4 text-slate-500 text-xs">
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

          {/* ── Right Panel ──────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Stock Status */}
            <div className="card p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Package size={16} className="text-[#a78bfa]" /> Inventory Status
              </h3>
              <div className="space-y-3">
                {mockProducts.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{p.name}</span>
                      <span className="text-slate-500">{p.stock_available} avail · {p.stock_reserved} reserved</span>
                    </div>
                    <div className="h-2 bg-[#0f1a3e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-full transition-all duration-500"
                        style={{ width: `${(p.stock_available / (p.stock_available + p.stock_reserved + 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Trend */}
            <div className="card p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#00d4ff]" /> Revenue Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Confirmed</span>
                  <span className="text-[#34d399] font-bold">{fmt(totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">At Risk (Reserved)</span>
                  <span className="text-[#fbbf24] font-bold">
                    {fmt(orders.filter(o => o.status === 'RESERVED').reduce((s, o) => s + o.total, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Blocked (Flagged)</span>
                  <span className="text-[#f87171] font-bold">
                    {fmt(orders.filter(o => o.status === 'FLAGGED').reduce((s, o) => s + o.total, 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card p-5">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  id="admin-send-email"
                  onClick={handleSendEmail}
                  disabled={emailLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#a855f720] to-[#0066ff20] border border-[#a855f730] text-[#a855f7] font-semibold text-sm hover:border-[#a855f7] hover:bg-[#a855f710] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {emailLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                  {emailLoading ? 'Sending Report…' : 'Send Daily Audit Report'}
                </button>
                <button
                  id="admin-export"
                  onClick={() => {
                    const csv = [
                      'Ref,Total,Status,Created',
                      ...orders.map(o => `${o.ref},${o.total},${o.status},${o.created_at}`)
                    ].join('\n');
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                    a.download = `trasync-audit-${Date.now()}.csv`;
                    a.click();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#0f1a3e] border border-[#1a2550] text-slate-300 font-semibold text-sm hover:border-[#00d4ff40] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Analyze Modal ─────────────────────────────────────────────── */}
      {showAnalyzeModal && analyzeResult && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <div className="glass rounded-3xl p-8 max-w-md w-full animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#a855f720] border border-[#a855f730] flex items-center justify-center">
                  <Brain size={20} className="text-[#a855f7]" />
                </div>
                <div>
                  <h3 className="text-white font-bold">AI Audit Result</h3>
                  <p className="text-slate-500 text-xs">Screen capture analysis complete</p>
                </div>
              </div>
              <button onClick={() => setShowAnalyzeModal(false)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#040817] rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-[#00d4ff] mb-1">{analyzeResult.parsed_transactions}</div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">Parsed Transactions</div>
              </div>
              <div className="bg-[#040817] rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-[#f87171] mb-1">{analyzeResult.flagged_discrepancies}</div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">Discrepancies</div>
              </div>
            </div>

            <div className="bg-[#040817] rounded-xl p-4 flex items-center justify-between mb-6">
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Risk Score</div>
                <div className="text-white font-bold text-lg">Overall Assessment</div>
              </div>
              <RiskBadge risk={analyzeResult.risk_score} />
            </div>

            {analyzeResult.risk_score === 'HIGH' && (
              <div className="flex items-start gap-3 bg-[#450a0a] border border-[#f8717130] rounded-xl p-4 mb-6">
                <AlertTriangle size={18} className="text-[#f87171] shrink-0 mt-0.5" />
                <p className="text-[#f87171] text-sm">
                  High risk detected. Review flagged transactions immediately and consider suspending the terminal.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowAnalyzeModal(false)}
              className="btn-primary w-full"
            >
              Acknowledged
            </button>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
