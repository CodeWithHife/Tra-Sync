'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
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

type POSState = 'BUILDING' | 'RESERVED' | 'POLLING' | 'PAID' | 'FLAGGED';

const fmt = (n: number) =>
  '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 0 });

export default function POSPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [posState, setPosState] = useState<POSState>('BUILDING');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Cart helpers ────────────────────────────────────────────────────────────
  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ── Generate payment reference ──────────────────────────────────────────────
  async function generateRef() {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        }),
      });
      const data: Order = await res.json();
      setOrder(data);
      setPosState('RESERVED');
      startPolling(data.ref);
    } catch {
      alert('Failed to create order. Check network.');
    } finally {
      setLoading(false);
    }
  }

  // ── Polling for order status ─────────────────────────────────────────────────
  const startPolling = useCallback((ref: string) => {
    setPosState('POLLING');
    setPollCount(0);
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      setPollCount((c) => c + 1);
      try {
        const res = await fetch(`/api/orders?ref=${ref}`);
        const data: Order = await res.json();
        setOrder(data);
        if (data.status === 'PAID') {
          clearInterval(pollRef.current!);
          setPosState('PAID');
        } else if (data.status === 'FLAGGED') {
          clearInterval(pollRef.current!);
          setPosState('FLAGGED');
        }
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
  }

  // ══════════════════════════════════════════════════════════════════════════════
  //  PAID SUCCESS SCREEN
  // ══════════════════════════════════════════════════════════════════════════════
  if (posState === 'PAID') {
    return (
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
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  //  FLAGGED SCREEN
  // ══════════════════════════════════════════════════════════════════════════════
  if (posState === 'FLAGGED') {
    return (
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
          </button>
        </div>
      </div>
    );
  }

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
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              ))}
            </div>

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
        </div>
      )}
    </div>
  );
}
