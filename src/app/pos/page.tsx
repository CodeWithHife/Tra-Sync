'use client';

import {
  useState, useEffect, useRef
} from 'react';
import { useRouter } from 'next/navigation';
import {
<<<<<<< HEAD
  Shield, Zap, CheckCircle, X, ArrowLeft, Copy, CheckCheck,
  Building2, Hash, Keyboard, ReceiptText, AlertCircle, Wifi, Printer, ChevronRight
} from 'lucide-react';
import { Order, VirtualAccount } from '@/types';
import { supabase } from '@/lib/supabase';
=======
  Shield, ShoppingCart, Plus, Minus, Trash2, Zap,
  CheckCircle2, Clock, AlertTriangle, X, Package,
  ArrowLeft, RefreshCw, Radio, Lock
} from 'lucide-react';
import { CartItem, Order, Product } from '@/types';

// ── Static product catalog (mock, no DB needed) ───────────────────────────────
const CATALOG: Product[] = [
  { id: 'prod-1', name: 'Product A (Wireless Scanner)', price: 10000, stock_available: 50, stock_reserved: 0 },
  { id: 'prod-2', name: 'Product B (Receipt Paper Pack)', price: 5000,  stock_available: 80, stock_reserved: 0 },
  { id: 'prod-3', name: 'Product C (Thermal Printer)', price: 15000, stock_available: 30, stock_reserved: 0 },
  { id: 'prod-4', name: 'Product D (Cash Drawer)', price: 8000,  stock_available: 60, stock_reserved: 0 },
  { id: 'prod-5', name: 'Premium POS Till Node', price: 25000, stock_available: 20, stock_reserved: 0 },
];
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5

// ── Types ────────────────────────────────────────────────────────────────────
type POSState = 'BUILDING' | 'RESERVED' | 'POLLING' | 'PAID' | 'FLAGGED';

const fmt = (n: number) =>
  '\u20A6' + n.toLocaleString('en-NG', { minimumFractionDigits: 0 });

export default function POSPage() {
  const router = useRouter();

  const [posState, setPosState] = useState<POSState>('BUILDING');
  const [order, setOrder] = useState<Order | null>(null);
  const [van, setVan] = useState<VirtualAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);

  const customAmountNum = parseInt(customAmount.replace(/[^0-9]/g, ''), 10) || 0;

  async function copyText(text: string) {
    try { await navigator.clipboard.writeText(text); } catch {
      const el = document.createElement('textarea');
      el.value = text; document.body.appendChild(el); el.select();
      document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function generateRef() {
    if (customAmountNum === 0) return;
    setLoading(true);
    setShowModal(true);
    try {
      const items = [{ product_id: 'custom', quantity: 1 }];

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total: customAmountNum }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);
      setOrder(orderData);

      const vanRes = await fetch('/api/virtual-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_ref: orderData.ref }),
      });
      const vanData = await vanRes.json();
      if (!vanRes.ok) throw new Error(vanData.error);
      setVan(vanData);

      setPosState('POLLING');
      startPolling(orderData.ref);
    } catch (err) {
      console.error(err);
      alert('Failed to generate virtual account');
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  }

  function startPolling(ref: string) {
    // 1) Set up Supabase realtime listener
    if (supabase) {
      channelRef.current = supabase
        .channel(`order-${ref}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `ref=eq.${ref}` },
          (payload) => {
            const st = payload.new.status as POSState;
            if (st === 'PAID' || st === 'FLAGGED') {
              setPosState(st);
              cleanupPolling();
            }
          }
        )
        .subscribe();
    }

    // 2) Fallback REST polling
    pollRef.current = setInterval(async () => {
      setPollCount((c) => c + 1);
      try {
        const res = await fetch(`/api/orders?ref=${ref}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'PAID' || data.status === 'FLAGGED') {
          setPosState(data.status);
          cleanupPolling();
        }
<<<<<<< HEAD
      } catch (e) {
        console.error('Poll err', e);
      }
    }, 2000);
=======
      } catch {
        // retry silently
      }
    }, 2000);
  }, []);

  // ── Demo: simulate payment webhook after 8 seconds ─────────────────────────
  useEffect(() => {
    if (posState === 'POLLING' && order) {
      const timer = setTimeout(async () => {
        await fetch('/api/webhooks/flutterwave', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'verif-hash': 'tra-sync-dev-hash',
          },
          body: JSON.stringify({
            tx_ref: order.ref,
            amount: order.total,
            status: 'successful',
          }),
        });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [posState, order]);

  // ── Cleanup polling on unmount ───────────────────────────────────────────────
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // ── Reset POS ────────────────────────────────────────────────────────────────
  function resetPOS() {
    if (pollRef.current) clearInterval(pollRef.current);
    setCart([]);
    setOrder(null);
    setPosState('BUILDING');
    setPollCount(0);
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
  }

  function cleanupPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    if (channelRef.current && supabase) supabase.removeChannel(channelRef.current);
  }

  useEffect(() => {
    return () => cleanupPolling();
  }, []);

  // Play success chime when PAID
  useEffect(() => {
    if (posState === 'PAID') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
          osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // A6
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }
      } catch (e) {
        console.error('Audio play failed', e);
      }
    }
  }, [posState]);

  async function simulatePayment() {
    if (!order || posState !== 'POLLING') return;
    setSimulating(true);
    try {
      const res = await fetch('/api/webhooks/flutterwave', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'verif-hash': 'tra-sync-dev-hash'
        },
        body: JSON.stringify({
          tx_ref: order.ref,
          amount: customAmountNum,
          status: 'successful'
        })
      });
      if (!res.ok) throw new Error('Simulation failed');
    } catch (err) {
      console.error(err);
      alert('Simulation error');
    } finally {
      setSimulating(false);
    }
  }

  function resetPOS() {
    cleanupPolling();
    setPosState('BUILDING');
    setOrder(null);
    setVan(null);
    setShowModal(false);
    setCustomAmount('');
    setCustomDesc('');
    setPollCount(0);
    setSimulating(false);
  }

  // ── PAID ──────────────────────────────────────────────────────────────────
  if (posState === 'PAID') {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-[#040817] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#00D08415,transparent_50%)]" />
        <div className="relative z-10 text-center animate-slide-up max-w-md w-full">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-[#00D084] rounded-full animate-ping opacity-20" />
            <div className="relative w-full h-full bg-[#00D084] rounded-full flex items-center justify-center shadow-[0_0_40px_#00D08460]">
              <CheckCircle size={48} className="text-[#040817]" />
            </div>
          </div>
          <div className="text-xs font-bold tracking-[0.3em] text-[#00D084] mb-2 uppercase">Payment Verified</div>
          <h1 className="text-4xl font-black text-white mb-1">
            {fmt(order?.total ?? customAmountNum)} <span className="text-[#00D084]">Received</span>
          </h1>
          <p className="text-slate-500 text-sm mb-8">Transaction confirmed</p>
          <div className="bg-[#071410] border border-[#00D08430] rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Transaction ID</span>
              <span className="text-white font-mono font-bold">{order?.ref ?? 'TS-DEMO'}</span>
            </div>
            {van && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Bank</span>
                  <span className="text-white">{van.bank_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Account</span>
                  <span className="text-[#00D084] font-mono font-bold">{van.account_number}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm border-t border-[#00D08420] pt-3">
              <span className="text-slate-500">Time</span>
              <span className="text-white">{new Date().toLocaleTimeString('en-NG')}</span>
            </div>
=======
      <div className="min-h-screen bg-[#090D16] text-white font-sans flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-6 max-w-md w-full">
          {/* Outer glowing icon ring */}
          <div className="relative mx-auto w-28 h-28">
            <div className="w-28 h-28 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center shadow-2xl shadow-[#10B981]/30">
              <CheckCircle2 className="w-14 h-14 text-[#10B981]" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">PAYMENT VERIFIED</h1>
            <div className="text-lg font-bold text-[#10B981] tracking-wider uppercase flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4" /> STOCK RELEASE AUTHORIZED
            </div>
          </div>

          <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Transaction Reference</span>
              <span className="text-white font-bold text-sm">{order?.ref}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-3">
              <span>Amount Confirmed</span>
              <span className="text-[#10B981] font-black text-2xl">{fmt(order?.total ?? 0)}</span>
            </div>
            <div className="bg-[#062c1d]/60 border border-[#10B981]/40 rounded-xl p-3 text-[#10B981] text-center font-bold text-[11px]">
              ✓ INBOUND: ZENITH BANK • OLADIPO F.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={resetPOS}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Next Transaction
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-3.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              Dashboard
            </button>
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
          </div>
          <button
            onClick={resetPOS}
            className="w-full py-3.5 rounded-xl bg-[#00D084] text-[#040817] font-bold flex items-center justify-center gap-2 hover:bg-[#00E676] transition-colors"
          >
            <Printer size={16} /> Print Receipt / New Sale
          </button>
          <button onClick={() => router.push('/admin')} className="mt-3 text-slate-600 hover:text-slate-400 text-sm transition-colors">
            View in Dashboard &rarr;
          </button>
        </div>
      </div>
    );
  }

  // ── FLAGGED ───────────────────────────────────────────────────────────────
  if (posState === 'FLAGGED') {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-[#0d0404] flex flex-col items-center justify-center px-6">
        <div className="text-center animate-slide-up">
          <div className="w-24 h-24 rounded-full bg-[#450a0a] border-4 border-[#f87171] flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-[#f87171]" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">TRANSACTION FLAGGED</h1>
          <p className="text-[#f87171] text-lg mb-6">Discrepancy detected</p>
          <div className="glass rounded-xl p-5 max-w-xs mx-auto mb-8">
            <div className="text-slate-400 text-sm mb-1">Flagged Reference</div>
            <div className="text-white font-mono text-xl font-bold">{order?.ref}</div>
          </div>
          <button onClick={resetPOS} className="btn-ghost flex items-center gap-2 mx-auto" style={{ borderColor: '#f87171', color: '#f87171' }}>
            <X size={16} /> Cancel &amp; Reset
=======
      <div className="min-h-screen bg-[#090D16] text-white font-sans flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto shadow-xl shadow-red-500/20">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white">TRANSACTION FLAGGED</h1>
            <p className="text-red-400 text-sm font-semibold">Discrepancy detected — stock remains locked</p>
          </div>
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 text-center font-mono text-xs">
            <div className="text-slate-400">Flagged Reference</div>
            <div className="text-white text-xl font-bold mt-1">{order?.ref}</div>
          </div>
          <button
            onClick={resetPOS}
            className="w-full bg-slate-800 hover:bg-slate-700 text-red-400 font-bold text-sm py-3.5 rounded-xl border border-red-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel &amp; Reset Terminal
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
          </button>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // ── MAIN POS LAYOUT (CUSTOM AMOUNT ONLY) ──────────────────────────────────
  return (
    <div className="h-screen bg-[#0A0F1D] flex flex-col overflow-hidden">
      {/* Top Nav */}
      <nav className="shrink-0 bg-[#0D1526] border-b border-[#1E293B] px-5 h-14 flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-8 h-8 rounded-lg border border-[#1E293B] flex items-center justify-center text-slate-500 hover:text-white hover:border-[#2d3f5e] transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0066FF] flex items-center justify-center">
              <Shield size={13} className="text-[#040817]" />
            </div>
            <span className="font-black tracking-widest text-white text-base">
              TRA<span className="text-[#00D4FF]">-SYNC</span>
              <span className="text-slate-500 font-normal text-xs ml-2">POS Terminal</span>
            </span>
=======
  // ══════════════════════════════════════════════════════════════════════════════
  //  MAIN POS INTERFACE
  // ══════════════════════════════════════════════════════════════════════════════
  const showModal = posState === 'POLLING' || posState === 'RESERVED';

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
            <span className="text-slate-400 text-xs font-mono ml-2 hidden sm:inline">POS Node 01</span>
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
          </div>
        </div>

        <div className="flex items-center gap-3">
<<<<<<< HEAD
          <div className="flex items-center gap-1.5">
            <Wifi size={13} className="text-[#00D084]" />
            <span className="text-slate-400 text-xs hidden sm:inline">Live</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#00D084] animate-blink" />
          <span className="text-slate-400 text-xs hidden sm:inline">Protected</span>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,#111E33_0%,#0A0F1D_70%)]">
        
        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-[#0D1526] border border-[#1E293B] rounded-3xl p-6 shadow-xl mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#152236] flex items-center justify-center">
                <Keyboard size={20} className="text-[#00D4FF]" />
              </div>
              <div>
                <h2 className="text-white font-bold">Charge Amount</h2>
                <p className="text-slate-500 text-xs">Enter exactly how much the customer needs to pay</p>
              </div>
            </div>

            <div className="mb-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount (&#8358;)</div>
            <div className="relative mb-6">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-black text-[#00D084]">₦</span>
              <input
                type="text"
                inputMode="numeric"
                value={customAmount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setCustomAmount(raw ? parseInt(raw, 10).toLocaleString() : '');
                }}
                placeholder="0"
                className="w-full bg-[#070B14] border-2 border-[#1E293B] focus:border-[#00D084] rounded-2xl pl-14 pr-6 py-6 text-5xl font-black text-white focus:outline-none transition-all"
              />
            </div>
            
            <div className="mb-6">
              <div className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description (optional)</div>
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="e.g. Service fee, Deposit..."
                className="w-full bg-[#0A1628] border border-[#1E293B] rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00D4FF40] transition-all"
              />
            </div>
            
            <div className="mb-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Quick amounts</div>
            <div className="grid grid-cols-3 gap-3">
              {[5000, 10000, 25000, 50000, 100000, 250000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCustomAmount(amt.toLocaleString())}
                  className="py-2.5 rounded-xl bg-[#0A1628] border border-[#1E293B] text-slate-300 text-sm font-semibold hover:border-[#00D4FF40] hover:text-[#00D4FF] hover:bg-[#00D4FF10] transition-all"
                >
                  {fmt(amt)}
                </button>
=======
          <div className="hidden sm:flex items-center gap-1.5 text-[#10B981] font-mono text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>NIBSS WEBHOOK ACTIVE</span>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            Audit Logs
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Product Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-[#10B981]" /> Product Catalog
            </h2>
            <span className="text-slate-400 text-xs font-mono">{CATALOG.length} Items Available</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {CATALOG.map((product) => {
              const inCart = cart.find((i) => i.product.id === product.id);
              return (
                <div key={product.id} className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 shadow-lg shadow-[#10B981]/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-bold text-sm sm:text-base">{product.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5 font-mono">
                        Stock: {product.stock_available} available
                      </div>
                    </div>
                    <div className="text-[#10B981] font-black text-lg font-sans">{fmt(product.price)}</div>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => updateQty(product.id, -1)}
                        className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-[#10B981] hover:text-[#10B981] transition-all flex items-center justify-center font-bold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-black text-base w-8 text-center">{inCart.quantity}</span>
                      <button
                        onClick={() => updateQty(product.id, 1)}
                        className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-[#10B981] hover:text-[#10B981] transition-all flex items-center justify-center font-bold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="ml-auto text-slate-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-[#10B981] text-xs font-bold hover:bg-[#10B981]/15 hover:border-[#10B981]/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add to Checkout
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Checkout Cart (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#10B981]" />
              Till Cart
              {cartCount > 0 && (
                <span className="bg-[#10B981] text-[#090D16] text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </h2>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-slate-500 hover:text-red-400">
                Clear Cart
              </button>
            )}
          </div>

          <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 min-h-[340px] flex flex-col justify-between shadow-xl shadow-[#10B981]/5">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-300 font-semibold text-sm">Cart is Empty</p>
                  <p className="text-slate-500 text-xs">Add items from the catalog on the left</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3 divide-y divide-slate-800/80 max-h-[260px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between pt-3 first:pt-0">
                      <div>
                        <div className="text-white text-sm font-semibold">{item.product.name}</div>
                        <div className="text-slate-400 text-xs">{fmt(item.product.price)} × {item.quantity}</div>
                      </div>
                      <div className="text-[#10B981] font-bold text-sm font-sans">
                        {fmt(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Total Due</span>
                    <span className="text-white font-black text-2xl font-sans">{fmt(cartTotal)}</span>
                  </div>

                  <button
                    id="pos-generate-ref"
                    onClick={generateRef}
                    disabled={loading || posState !== 'BUILDING'}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-[#090D16] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#090D16] border-t-transparent rounded-full animate-spin" />
                        <span>Generating Reference…</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Generate Payment Reference
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Waiting Modal (Polling State) ────────────────────────────────── */}
      {showModal && order && (
        <div className="fixed inset-0 bg-[#090D16]/80 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl shadow-[#10B981]/10 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="relative mx-auto w-20 h-20">
              <div className="w-20 h-20 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center animate-pulse">
                <Shield className="w-9 h-9 text-[#10B981]" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase">
                INVENTORY RESERVED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white pt-2">{order.ref}</h2>
              <div className="text-[#10B981] text-2xl font-black">{fmt(order.total)}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-left font-mono text-xs space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between py-1 border-b border-slate-800 last:border-0">
                  <span className="text-slate-400">{item.product.name} ×{item.quantity}</span>
                  <span className="text-white font-bold">{fmt(item.product.price * item.quantity)}</span>
                </div>
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
              ))}
            </div>
          </div>

<<<<<<< HEAD
          <button
            id="pos-generate-ref"
            onClick={generateRef}
            disabled={customAmountNum === 0 || loading || posState !== 'BUILDING'}
            className={`w-full py-5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all duration-200 ${
              customAmountNum > 0 && posState === 'BUILDING'
                ? 'bg-[#00D084] text-[#040817] hover:bg-[#00E676] shadow-[0_0_24px_#00D08440] hover:shadow-[0_0_36px_#00D08470] hover:-translate-y-1'
                : 'bg-[#152236] text-slate-600 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#040817] border-t-transparent rounded-full animate-spin" />
                Generating Virtual Account…
              </>
            ) : (
              <>
                <ReceiptText size={20} />
                Collect Bank Transfer
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>

      </div>

      {/* ── VAN PAYMENT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
          {!van && order && (
            <div className="glass rounded-3xl px-12 py-10 text-center animate-slide-up">
              <div className="w-14 h-14 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-bold">Generating Virtual Account…</p>
              <p className="text-slate-500 text-sm mt-1">Contacting bank provider</p>
            </div>
          )}

          {van && order && (
            <div className="w-full max-w-sm animate-slide-up">
              <div className="bg-[#0D1526] border border-[#1E293B] rounded-3xl overflow-hidden shadow-[0_0_60px_#00D08418]">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#071A14] to-[#0D1526] px-6 py-5 flex items-center justify-between border-b border-[#1E293B]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#00D084] flex items-center justify-center shadow-[0_0_16px_#00D08460]">
                      <Zap size={18} className="text-[#040817]" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Bank Transfer Details</div>
                      <div className="text-slate-500 text-xs">Ref: {order.ref}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#312e0a] border border-[#fbbf2430] rounded-full px-2.5 py-1">
                    {[0,1,2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-blink" style={{ animationDelay: `${i*0.3}s` }} />
                    ))}
                    <span className="text-[#fbbf24] text-[10px] font-semibold ml-0.5">Awaiting Payment</span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Amount */}
                  <div className="text-center bg-[#071A14] border border-[#00D08430] rounded-2xl py-4">
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Exact Amount to Transfer</p>
                    <div className="text-4xl font-black text-[#00D084]">{fmt(van.amount)}</div>
                    <p className="text-slate-600 text-[10px] mt-1">Transfer exactly this amount &mdash; no more, no less</p>
                  </div>

                  {/* Bank Details (Huge and Centered) */}
                  <div className="bg-[#0A1628] border border-[#1E293B] rounded-2xl py-6 px-4 text-center">
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-2">Account Number</div>
                    <div className="text-4xl font-black font-mono tracking-widest text-white mb-2">
                      {van.account_number}
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="text-slate-400 text-sm">Bank: <span className="text-white font-bold">{van.bank_name}</span></div>
                    </div>

                    <button
                      id="pos-copy-account"
                      onClick={() => copyText(van.account_number)}
                      className={`mx-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        copied
                          ? 'bg-[#064e3b] border border-[#34d39940] text-[#34d399]'
                          : 'bg-[#152236] border border-[#1E293B] text-[#00D4FF] hover:bg-[#00D4FF15] hover:border-[#00D4FF40]'
                      }`}
                    >
                      {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy Account Number'}
                    </button>
                    
                    <div className="text-slate-500 text-[10px] mt-4">
                      Account Name: <span className="text-slate-300 font-medium">{van.account_name}</span>
                    </div>
                  </div>

                  {/* Simulate button */}
                  <button
                    id="pos-simulate-payment"
                    onClick={simulatePayment}
                    disabled={simulating}
                    className="w-full py-4 rounded-2xl bg-[#00D084] text-[#040817] font-black text-sm flex items-center justify-center gap-2 hover:bg-[#00E676] shadow-[0_0_20px_#00D08430] hover:shadow-[0_0_32px_#00D08460] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {simulating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#040817] border-t-transparent rounded-full animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Simulate Successful Transfer
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetPOS}
                    className="w-full text-slate-600 hover:text-slate-400 text-xs flex items-center justify-center gap-1.5 transition-colors pt-2"
                  >
                    <X size={12} /> Cancel Transaction
                  </button>
                </div>
              </div>
            </div>
          )}
=======
            <div className="bg-[#062c1d]/60 border border-[#10B981]/40 rounded-xl p-4 flex items-center gap-3 text-left">
              <Clock className="w-5 h-5 text-[#10B981] shrink-0 animate-spin" />
              <div>
                <div className="text-white font-bold text-xs">Waiting for Bank Webhook…</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Checking NIBSS gateway every 2s · Check #{pollCount}
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-[11px]">
              Demo Mode: Webhook auto-confirms in ~8 seconds
            </p>

            <button 
              onClick={resetPOS} 
              className="text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancel Transaction
            </button>
          </div>
>>>>>>> c108baab430a01d7be03f94c675613b6598449c5
        </div>
      )}
    </div>
  );
}
