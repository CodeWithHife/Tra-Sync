'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, ShoppingCart, Plus, Minus, Trash2, Zap,
  CheckCircle, Clock, AlertTriangle, X, Package,
  ArrowLeft, RefreshCw,
} from 'lucide-react';
import { CartItem, Order, Product } from '@/types';

// ── Static product catalog (mock, no DB needed) ───────────────────────────────
const CATALOG: Product[] = [
  { id: 'prod-1', name: 'Product A',    price: 10000, stock_available: 50, stock_reserved: 0 },
  { id: 'prod-2', name: 'Product B',    price: 5000,  stock_available: 80, stock_reserved: 0 },
  { id: 'prod-3', name: 'Product C',    price: 15000, stock_available: 30, stock_reserved: 0 },
  { id: 'prod-4', name: 'Product D',    price: 8000,  stock_available: 60, stock_reserved: 0 },
  { id: 'prod-5', name: 'Premium Item', price: 25000, stock_available: 20, stock_reserved: 0 },
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
        // silently retry
      }
    }, 2000);
  }, []);

  // ── Demo: simulate payment after 8 seconds ──────────────────────────────────
  useEffect(() => {
    if (posState === 'POLLING' && order) {
      const timer = setTimeout(async () => {
        // Simulate flutterwave webhook hitting our API
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
      <div className="min-h-screen bg-[#020d06] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff8708] via-transparent to-[#00d4ff08]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff87] opacity-[0.04] rounded-full blur-3xl" />

        <div className="relative z-10 text-center animate-slide-up">
          {/* Outer ring */}
          <div className="relative mx-auto w-40 h-40 mb-8">
            <div className="absolute inset-0 rounded-full bg-[#00ff87] opacity-10 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-[#00ff87] opacity-10 animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="w-40 h-40 rounded-full bg-[#0a1f10] border-4 border-[#00ff87] flex items-center justify-center relative">
              <CheckCircle size={60} className="text-[#00ff87]" />
            </div>
          </div>

          <h1 className="text-5xl font-black text-white mb-2">PAYMENT VERIFIED</h1>
          <div className="text-2xl font-bold text-[#00ff87] mb-6 tracking-wider">
            — STOCK RELEASED —
          </div>

          <div className="glass rounded-2xl p-6 max-w-sm mx-auto mb-8">
            <div className="text-slate-400 text-sm mb-1">Transaction Reference</div>
            <div className="text-white font-mono text-2xl font-bold mb-4">{order?.ref}</div>
            <div className="text-slate-400 text-sm mb-1">Amount Confirmed</div>
            <div className="gradient-text-green text-3xl font-black">{fmt(order?.total ?? 0)}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={resetPOS} className="btn-primary flex items-center gap-2">
              <RefreshCw size={16} /> New Transaction
            </button>
            <button onClick={() => router.push('/admin')} className="btn-ghost flex items-center gap-2">
              View in Dashboard
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
      <div className="min-h-screen bg-[#0d0404] flex flex-col items-center justify-center px-6">
        <div className="text-center animate-slide-up">
          <div className="w-24 h-24 rounded-full bg-[#450a0a] border-4 border-[#f87171] flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} className="text-[#f87171]" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">TRANSACTION FLAGGED</h1>
          <p className="text-[#f87171] text-lg mb-6">Discrepancy detected — stock remains locked</p>
          <div className="glass rounded-xl p-5 max-w-xs mx-auto mb-8">
            <div className="text-slate-400 text-sm mb-1">Flagged Reference</div>
            <div className="text-white font-mono text-xl font-bold">{order?.ref}</div>
          </div>
          <button onClick={resetPOS} className="btn-ghost border-[#f87171] text-[#f87171] hover:bg-[#f8717115] flex items-center gap-2">
            <X size={16} /> Cancel & Reset
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  //  WAITING MODAL (POLLING STATE)
  // ══════════════════════════════════════════════════════════════════════════════
  const showModal = posState === 'POLLING' || posState === 'RESERVED';

  return (
    <div className="min-h-screen bg-[#040817] relative">
      {/* Nav */}
      <nav className="bg-[#080f2e] border-b border-[#0f1a3e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center">
            <Shield size={14} className="text-[#040817]" />
          </div>
          <span className="font-black tracking-widest text-white text-lg">
            TRA<span className="text-[#00d4ff]">-SYNC</span>
            <span className="text-slate-500 font-normal text-sm ml-2">POS Terminal</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff87] animate-blink" />
          <span className="text-slate-400 text-sm">Protected</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_360px] gap-6">
        {/* ── Left: Product Catalog ──────────────────────────────────────── */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Package size={20} className="text-[#00d4ff]" /> Product Catalog
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {CATALOG.map((product) => {
              const inCart = cart.find((i) => i.product.id === product.id);
              return (
                <div key={product.id} className="card p-5 hover:border-[#00d4ff40] transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-white font-semibold">{product.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        Stock: {product.stock_available} available
                      </div>
                    </div>
                    <div className="text-[#00d4ff] font-bold text-lg">{fmt(product.price)}</div>
                  </div>
                  {inCart ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(product.id, -1)}
                        className="w-8 h-8 rounded-lg bg-[#0f1a3e] border border-[#1a2550] text-slate-300 hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold text-lg w-8 text-center">{inCart.quantity}</span>
                      <button
                        onClick={() => updateQty(product.id, 1)}
                        className="w-8 h-8 rounded-lg bg-[#0f1a3e] border border-[#1a2550] text-slate-300 hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="ml-auto text-slate-600 hover:text-[#f87171] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 rounded-lg bg-[#0f1a3e] border border-[#00d4ff20] text-[#00d4ff] text-sm font-semibold hover:bg-[#00d4ff10] hover:border-[#00d4ff] transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: Cart ────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <ShoppingCart size={20} className="text-[#00d4ff]" />
            Cart
            {cartCount > 0 && (
              <span className="bg-[#00d4ff] text-[#040817] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </h2>

          <div className="card p-5 min-h-[300px] flex flex-col">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <ShoppingCart size={40} className="text-slate-700 mb-3" />
                <p className="text-slate-600">Cart is empty</p>
                <p className="text-slate-700 text-xs mt-1">Add products from the catalog</p>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between py-3 border-b border-[#0f1a3e]">
                      <div>
                        <div className="text-white text-sm font-medium">{item.product.name}</div>
                        <div className="text-slate-500 text-xs">{fmt(item.product.price)} × {item.quantity}</div>
                      </div>
                      <div className="text-[#00d4ff] font-bold text-sm">
                        {fmt(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-[#0f1a3e] pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total</span>
                    <span className="text-white font-black text-2xl">{fmt(cartTotal)}</span>
                  </div>
                </div>

                {/* Generate ref button */}
                <button
                  id="pos-generate-ref"
                  onClick={generateRef}
                  disabled={loading || posState !== 'BUILDING'}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#040817] border-t-transparent rounded-full animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Zap size={16} /> Generate Payment Reference
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Waiting Modal ─────────────────────────────────────────────────── */}
      {showModal && order && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <div className="glass rounded-3xl p-8 max-w-md w-full text-center animate-slide-up">
            {/* Pulsing logo */}
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full bg-[#00d4ff] opacity-20 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-[#0f1a3e] border-2 border-[#00d4ff40] flex items-center justify-center animate-pulse-glow">
                <Shield size={32} className="text-[#00d4ff]" />
              </div>
            </div>

            <div className="badge-reserved inline-block mb-3">INVENTORY RESERVED</div>
            <h2 className="text-3xl font-black text-white mb-1">{order.ref}</h2>
            <div className="text-[#00d4ff] text-2xl font-bold mb-6">{fmt(order.total)}</div>

            {/* Items summary */}
            <div className="bg-[#040817] rounded-xl p-4 mb-6 text-left">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm py-1.5 border-b border-[#0f1a3e] last:border-0">
                  <span className="text-slate-400">{item.product.name} ×{item.quantity}</span>
                  <span className="text-white">{fmt(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Waiting indicator */}
            <div className="flex items-center justify-center gap-3 bg-[#312e0a] border border-[#fbbf2430] rounded-xl p-4 mb-6">
              <Clock size={20} className="text-[#fbbf24] animate-spin" style={{ animationDuration: '3s' }} />
              <div className="text-left">
                <div className="text-[#fbbf24] font-semibold text-sm">Waiting for Bank Confirmation…</div>
                <div className="text-slate-500 text-xs mt-0.5">
                  Auto-checking every 2s · Checked {pollCount}×
                </div>
              </div>
            </div>

            <p className="text-slate-600 text-xs mb-4">
              Demo: payment auto-confirms in ~8 seconds
            </p>

            <button onClick={resetPOS} className="text-slate-600 hover:text-slate-400 text-sm flex items-center gap-1 mx-auto">
              <X size={14} /> Cancel Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
