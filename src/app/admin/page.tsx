'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
<<<<<<< HEAD
  Shield, BarChart3, Brain, Mail, AlertTriangle, CheckCircle,
  TrendingUp, RefreshCw, X, Loader2, ArrowLeft,
  Clock, DollarSign, Download, Filter, UserPlus, Search, Activity, User, Settings, LayoutDashboard, CreditCard
=======
  Shield, BarChart3, Brain, Mail, AlertTriangle, CheckCircle2,
  Package, TrendingUp, RefreshCw, X, Loader2, ArrowLeft,
  Clock, DollarSign, Download, Lock
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
} from 'lucide-react';
import { Order, AnalyzeResult } from '@/types';
import { mockOrders, mockProducts } from '@/lib/supabase';

const fmt = (n: number) => '₦' + n.toLocaleString('en-NG');

function StatusBadge({ status }: { status: Order['status'] }) {
  if (status === 'PAID') return <span className="bg-[#00E676]/10 text-[#00E676] px-3 py-1 rounded-full text-xs font-bold border border-[#00E676]/30 shadow-[0_0_10px_rgba(0,230,118,0.2)]">PAID</span>;
  if (status === 'FLAGGED') return <span className="bg-[#FF3366]/10 text-[#FF3366] px-3 py-1 rounded-full text-xs font-bold border border-[#FF3366]/50 shadow-[0_0_15px_rgba(255,51,102,0.4)]">FLAGGED</span>;
  if (status === 'PENDING') return <span className="bg-[#fbbf24]/10 text-[#fbbf24] px-3 py-1 rounded-full text-xs font-bold border border-[#fbbf24]/30">PENDING</span>;
  return <span className="bg-[#a78bfa]/10 text-[#a78bfa] px-3 py-1 rounded-full text-xs font-bold border border-[#a78bfa]/30">RESERVED</span>;
}

function RiskBadge({ risk }: { risk: AnalyzeResult['risk_score'] }) {
  const map = {
    LOW:    'text-[#00E676]',
    MEDIUM: 'text-[#fbbf24]',
    HIGH:   'text-[#FF3366]',
  };
  return <span className={`font-bold ${map[risk]}`}>{risk}</span>;
}

<<<<<<< HEAD
=======
// Toast notification component
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl animate-slide-up border ${
      type === 'success'
<<<<<<< HEAD
        ? 'bg-[#00E676]/10 border-[#00E676]/40 text-[#00E676]'
        : 'bg-[#FF3366]/10 border-[#FF3366]/40 text-[#FF3366]'
    }`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
      <span className="text-sm font-bold">{message}</span>
=======
        ? 'bg-[#062c1d] border-[#10B981]/50 text-[#10B981]'
        : 'bg-[#450a0a] border-red-500/40 text-red-400'
    }`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      <span className="text-sm font-semibold">{message}</span>
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

const STAFF_LIST = ['All Staff', 'Chidi (Terminal 1)', 'Blessing (Terminal 2)'];
const STATUS_FILTERS = ['All', 'Paid', 'Flagged', 'Pending'];

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
  
  const [staffFilter, setStaffFilter] = useState('All Staff');
  const [statusFilter, setStatusFilter] = useState('All');

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

  const totalRevenue = orders.filter((o) => o.status === 'PAID').reduce((s, o) => s + o.total, 0);
  const totalFlagged = orders.filter((o) => o.status === 'FLAGGED').length;
  const totalPaid = orders.filter((o) => o.status === 'PAID').length;
<<<<<<< HEAD

  const displayOrders = orders.filter(o => {
    if (statusFilter !== 'All' && o.status !== statusFilter.toUpperCase()) return false;
    // mock staff filter logic
    if (staffFilter === 'Chidi (Terminal 1)' && parseInt(o.id) % 2 !== 0) return false;
    if (staffFilter === 'Blessing (Terminal 2)' && parseInt(o.id) % 2 === 0) return false;
    return true;
  });
=======
  const reservedStockTotal = mockProducts.reduce((s, p) => s + p.stock_reserved, 0);
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5

  async function handleCapture() {
    if (!tableRef.current) return;
    setCaptureLoading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
<<<<<<< HEAD
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: '#0B132B',
        scale: 1.5,
        useCORS: true,
        logging: false,
      });
      const imageData = canvas.toDataURL('image/png').split(',')[1];
=======
      const canvas = await html2canvas(tableRef.current, { backgroundColor: '#090D16' });
      const dataUrl = canvas.toDataURL('image/png');
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5

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

<<<<<<< HEAD
=======
  // ── Send EOD email report ────────────────────────────────────────────────────
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
  async function handleSendEmail() {
    setEmailLoading(true);
    let imageData = '';
    try {
      const el = document.getElementById('audit-table-container') || tableRef.current;
      if (el) {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(el, { backgroundColor: '#0B132B', scale: 1.5 });
        imageData = canvas.toDataURL('image/png');
      }
    } catch (err) {
      console.warn('Canvas capture failed:', err);
    }

    try {
      const res = await fetch('/api/reports/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
        body: JSON.stringify({ admin_email: 'admin@trasync.io', image_data: imageData }),
=======
        body: JSON.stringify({
          recipient: 'merchant@trasync.ng',
          ordersCount: orders.length,
          totalRevenue,
          flaggedCount: totalFlagged,
        }),
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
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
<<<<<<< HEAD
    <div className="flex min-h-screen bg-[#0A0F1D] text-[#FFFFFF] font-sans">
      
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-[#0B132B] border-r border-[#1E2A4F] flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[#1E2A4F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E676] to-[#00B359] flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.5)]">
              <Shield size={16} className="text-[#0A0F1D]" />
            </div>
            <span className="font-black tracking-widest text-[#FFFFFF] text-xl drop-shadow-md">
              TRA<span className="text-[#00E676]">-SYNC</span>
            </span>
          </div>
          <div className="bg-[#111C3A] p-3 rounded-xl border border-[#00E676]/30 shadow-[0_0_10px_rgba(0,230,118,0.15)] flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[#00E676] animate-pulse" />
              <span className="text-[#00E676] text-xs font-bold tracking-wide">Bank API</span>
            </div>
            <span className="text-[#94A3B8] text-[10px] font-bold">99.9% Uptime</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#111C3A] text-[#FFFFFF] rounded-xl border border-[#1E2A4F] shadow-md transition-all font-bold text-sm">
            <LayoutDashboard size={18} className="text-[#00E676]" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[#94A3B8] hover:bg-[#111C3A]/50 rounded-xl transition-all font-semibold text-sm">
            <BarChart3 size={18} /> Transactions
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[#94A3B8] hover:bg-[#111C3A]/50 rounded-xl transition-all font-semibold text-sm">
            <User size={18} /> Staff Management
          </button>
          <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 px-4 py-3 text-[#94A3B8] hover:bg-[#111C3A]/50 rounded-xl transition-all font-semibold text-sm">
            <ArrowLeft size={18} /> Back to POS
          </button>
        </nav>

        <div className="p-4 border-t border-[#1E2A4F] space-y-2">
          <button
            onClick={handleCapture}
            disabled={captureLoading}
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#00E676]/10 text-[#00E676] hover:bg-[#00E676]/20 rounded-xl border border-[#00E676]/30 transition-all font-bold text-sm disabled:opacity-70"
          >
            {captureLoading ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
            AI Audit
          </button>
          <button
            onClick={handleSendEmail}
            disabled={emailLoading}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#94A3B8] hover:bg-[#111C3A]/50 hover:text-[#FFFFFF] rounded-xl transition-all font-semibold text-sm disabled:opacity-60"
          >
            {emailLoading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
            Email Report
          </button>
          <button
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
            className="w-full flex items-center gap-3 px-4 py-3 text-[#94A3B8] hover:bg-[#111C3A]/50 hover:text-[#FFFFFF] rounded-xl transition-all font-semibold text-sm"
          >
            <Download size={18} /> Export CSV
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[#94A3B8] hover:bg-[#111C3A]/50 hover:text-[#FFFFFF] rounded-xl transition-all font-semibold text-sm">
            <Settings size={18} /> Settings
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-[#0B132B]/80 backdrop-blur-md border-b border-[#1E2A4F] px-8 py-5 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-2xl font-black text-[#FFFFFF]">Admin Dashboard</h1>
          <button onClick={handleRefresh} className="text-[#94A3B8] hover:text-[#FFFFFF] flex items-center gap-2 text-sm font-semibold transition-colors bg-[#111C3A] px-4 py-2 rounded-xl border border-[#1E2A4F]">
            <RefreshCw size={16} className={refreshing ? 'animate-spin text-[#00E676]' : ''} /> Refresh Data
          </button>
        </header>

        <div className="p-8">
          {/* ── Metrics Cards ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#111C3A] border border-[#1E2A4F] rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#94A3B8] text-xs uppercase tracking-wider font-bold">Total Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 flex items-center justify-center border border-[#00E676]/20">
                  <DollarSign size={20} className="text-[#00E676]" />
                </div>
              </div>
              <div className="text-4xl font-black text-[#00E676] drop-shadow-[0_0_12px_rgba(0,230,118,0.6)]">{fmt(totalRevenue)}</div>
            </div>
            
            <div className="bg-[#111C3A] border border-[#1E2A4F] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#94A3B8] text-xs uppercase tracking-wider font-bold">Paid Transactions</span>
                <div className="w-10 h-10 rounded-xl bg-[#FFFFFF]/5 flex items-center justify-center">
                  <CheckCircle size={20} className="text-[#00E676]" />
                </div>
              </div>
              <div className="text-4xl font-black text-[#FFFFFF]">{totalPaid}</div>
            </div>

            <div className="bg-[#111C3A] border border-[#FF3366]/40 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,51,102,0.15)] relative">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF3366] to-transparent opacity-50"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#94A3B8] text-xs uppercase tracking-wider font-bold">Flagged / Alerts</span>
                <div className="bg-[#FF3366]/20 px-3 py-1 rounded-full border border-[#FF3366]/50 flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,51,102,0.3)]">
                  <AlertTriangle size={12} className="text-[#FF3366]" />
                  <span className="text-[#FF3366] text-xs font-bold">{totalFlagged} Flagged</span>
                </div>
              </div>
              <div className="text-4xl font-black text-[#FF3366] drop-shadow-[0_0_12px_rgba(255,51,102,0.8)]">{totalFlagged}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* ── Transaction Table & Filtering ───────────────────────── */}
            <div className="flex flex-col gap-6">
              {/* Top Filter Bar */}
              <div className="bg-[#111C3A] border border-[#1E2A4F] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2 text-[#94A3B8] font-semibold text-sm">
                    <Filter size={16} /> Filters:
                  </div>
                  <select 
                    value={staffFilter} 
                    onChange={(e) => setStaffFilter(e.target.value)}
                    className="bg-[#0B132B] border border-[#1E2A4F] text-[#FFFFFF] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#00E676] transition-colors"
                  >
                    {STAFF_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="flex items-center bg-[#0B132B] rounded-lg border border-[#1E2A4F] p-1">
                    {STATUS_FILTERS.map(s => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === s ? 'bg-[#1E2A4F] text-[#FFFFFF]' : 'text-[#94A3B8] hover:text-[#FFFFFF]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 border border-[#FFFFFF]/20 text-[#FFFFFF] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                  <UserPlus size={16} /> Add Staff
                </button>
              </div>

              <div className="bg-[#111C3A] border border-[#1E2A4F] rounded-2xl overflow-hidden shadow-lg">
                <div id="audit-table-container" ref={tableRef} className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0A0F1D]/50 border-b border-[#1E2A4F]">
                        <th className="text-left text-[#94A3B8] text-xs uppercase tracking-wider font-bold px-6 py-4">Ref ID</th>
                        <th className="text-left text-[#94A3B8] text-xs uppercase tracking-wider font-bold px-6 py-4">Staff</th>
                        <th className="text-right text-[#94A3B8] text-xs uppercase tracking-wider font-bold px-6 py-4">Amount</th>
                        <th className="text-left text-[#94A3B8] text-xs uppercase tracking-wider font-bold px-6 py-4">Status</th>
                        <th className="text-left text-[#94A3B8] text-xs uppercase tracking-wider font-bold px-6 py-4">Bank / Account</th>
                        <th className="text-left text-[#94A3B8] text-xs uppercase tracking-wider font-bold px-6 py-4">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-[#94A3B8] py-12 font-medium">
                            No transactions match the selected filters.
                          </td>
                        </tr>
                      ) : (
                        displayOrders.map((order) => {
                          const isEven = parseInt(order.id) % 2 === 0;
                          const staffName = isEven ? 'Blessing (T2)' : 'Chidi (T1)';
                          const acctNum = '0' + (Math.floor(Math.random() * 900000000) + 100000000);
                          return (
                          <tr key={order.id} className="border-b last:border-0 border-[#1E2A4F] hover:bg-[#0A0F1D]/30 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-mono text-[#FFFFFF] font-bold bg-[#FFFFFF]/10 px-2 py-1 rounded">{order.ref}</span>
                            </td>
                            <td className="px-6 py-4 text-[#E2E8F0] font-medium flex items-center gap-2">
                              <User size={14} className="text-[#94A3B8]" /> {staffName}
                            </td>
                            <td className="px-6 py-4 text-right text-[#FFFFFF] font-black text-base">{fmt(order.total)}</td>
                            <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                            <td className="px-6 py-4 text-[#E2E8F0] font-medium">
                              <div className="flex flex-col">
                                <span className="text-xs text-[#94A3B8]">Wema Bank</span>
                                <span className="font-mono">{acctNum}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#94A3B8] font-medium">
                              {new Date(order.created_at).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        )})
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── AI Analyze Modal ─────────────────────────────────────────────── */}
      {showAnalyzeModal && analyzeResult && (
        <div className="fixed inset-0 bg-[#0A0F1D]/80 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <div className="bg-[#111C3A] border border-[#1E2A4F] rounded-3xl p-8 max-w-md w-full animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#00E676]/20 border border-[#00E676]/30 flex items-center justify-center">
                  <Brain size={24} className="text-[#00E676]" />
                </div>
                <div>
                  <h3 className="text-[#FFFFFF] font-black text-xl">Audit Complete</h3>
                  <p className="text-[#00E676] font-bold text-xs mt-1">100% Precision Match</p>
                </div>
              </div>
              <button onClick={() => setShowAnalyzeModal(false)} className="text-[#94A3B8] hover:text-[#FFFFFF]">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0A0F1D] rounded-2xl p-5 text-center border border-[#1E2A4F]">
                <div className="text-4xl font-black text-[#FFFFFF] mb-1">{analyzeResult.parsed_transactions}</div>
                <div className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider">Parsed</div>
              </div>
              <div className="bg-[#0A0F1D] rounded-2xl p-5 text-center border border-[#1E2A4F]">
                <div className="text-4xl font-black text-[#FF3366] mb-1">{analyzeResult.flagged_discrepancies}</div>
                <div className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider">Discrepancies</div>
=======
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
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
              </div>
              <button onClick={() => setShowAnalyzeModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

<<<<<<< HEAD
            <div className="bg-[#0A0F1D] rounded-2xl p-5 flex items-center justify-between mb-6 border border-[#1E2A4F]">
              <div>
                <div className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-1">Risk Assessment</div>
                <div className="text-[#FFFFFF] font-black text-lg">System Status</div>
=======
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
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
              </div>

<<<<<<< HEAD
            {analyzeResult.risk_score === 'HIGH' && (
              <div className="flex items-start gap-3 bg-[#FF3366]/10 border border-[#FF3366]/40 rounded-2xl p-5 mb-6">
                <AlertTriangle size={20} className="text-[#FF3366] shrink-0 mt-0.5" />
                <p className="text-[#FF3366] text-sm font-bold leading-relaxed">
                  High fraud risk detected. Suspend compromised terminal immediately.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowAnalyzeModal(false)}
              className="w-full bg-[#FFFFFF] text-[#0A0F1D] py-3 rounded-xl font-black shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-[#E2E8F0] transition-colors"
            >
              ACKNOWLEDGE
=======
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
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
            </button>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
=======
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
    </div>
  );
}
