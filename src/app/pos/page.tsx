'use client';

import {
  useState, useEffect, useRef
} from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Zap, CheckCircle, X, ArrowLeft, Copy, CheckCheck,
  Building2, Hash, Keyboard, ReceiptText, AlertCircle, Wifi, Printer, ChevronRight
} from 'lucide-react';
import { Order, VirtualAccount } from '@/types';
import { supabase } from '@/lib/supabase';

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
      } catch (e) {
        console.error('Poll err', e);
      }
    }, 2000);
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
          </button>
        </div>
      </div>
    );
  }

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
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              ))}
            </div>
          </div>

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
        </div>
      )}
    </div>
  );
}
