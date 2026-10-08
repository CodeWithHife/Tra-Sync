import { NextRequest, NextResponse } from 'next/server';
import {
  USE_MOCK,
  supabase,
  getMockOrderByRef,
  mockOrders,
} from '@/lib/supabase';
import { VirtualAccount } from '@/types';

// ── Mock bank pool ────────────────────────────────────────────────────────────
const BANKS = [
  { name: 'Wema Bank',     code: '035' },
  { name: 'Zenith Bank',   code: '057' },
  { name: 'GTBank',        code: '058' },
  { name: 'UBA',           code: '033' },
  { name: 'Access Bank',   code: '044' },
  { name: 'First Bank',    code: '011' },
];

// In-memory VAN store (keyed by order_ref) — survives hot-reload in dev
const vanStore = new Map<string, VirtualAccount>();

/**
 * Generates a deterministic-looking 10-digit account number from
 * the order ref and a timestamp component so it looks unique per cart.
 */
function generateAccountNumber(orderRef: string, createdAt: number): string {
  // Seed from ref characters + timestamp mod to keep it 10 digits
  const seed = orderRef
    .replace(/\D/g, '')                        // extract digits from ref e.g. "892"
    .padStart(4, '0')
    .slice(0, 4);
  const timeSuffix = String(createdAt).slice(-6); // last 6 digits of epoch ms
  return `${seed}${timeSuffix}`;                  // → 10 digits exactly
}

// ── POST /api/virtual-account ─────────────────────────────────────────────────
// Body: { order_ref: string }
// Returns: VirtualAccount
export async function POST(req: NextRequest) {
  let body: { order_ref?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { order_ref } = body;
  if (!order_ref) {
    return NextResponse.json({ error: 'Missing field: order_ref' }, { status: 400 });
  }

  // ── Return cached VAN if already issued for this order ────────────────────
  if (vanStore.has(order_ref)) {
    return NextResponse.json(vanStore.get(order_ref));
  }

  // ── Resolve order ─────────────────────────────────────────────────────────
  let orderTotal: number;

  if (USE_MOCK) {
    // Also check live mockOrders (includes any just created by /api/orders)
    const order = getMockOrderByRef(order_ref) ?? mockOrders.find((o) => o.ref === order_ref);
    if (!order) {
      return NextResponse.json({ error: `Order not found: ${order_ref}` }, { status: 404 });
    }
    orderTotal = order.total;
  } else {
    const { data: order, error } = await supabase!
      .from('orders')
      .select('total')
      .eq('ref', order_ref)
      .single();
    if (error || !order) {
      return NextResponse.json({ error: `Order not found: ${order_ref}` }, { status: 404 });
    }
    orderTotal = order.total;
  }

  // ── Pick a bank deterministically from ref so same ref → same bank ────────
  const refDigit = parseInt(order_ref.replace(/\D/g, '').slice(-1) || '0', 10);
  const bank = BANKS[refDigit % BANKS.length];

  const now = Date.now();
  const van: VirtualAccount = {
    order_ref,
    bank_name: bank.name,
    bank_code: bank.code,
    account_number: generateAccountNumber(order_ref, now),
    account_name: 'TRA-SYNC MERCHANT',
    amount: orderTotal,
    currency: 'NGN',
    expires_at: new Date(now + 15 * 60 * 1000).toISOString(), // +15 min
    created_at: new Date(now).toISOString(),
  };

  vanStore.set(order_ref, van);

  // Simulate slight provider latency
  await new Promise((r) => setTimeout(r, 350));

  return NextResponse.json(van);
}

// ── GET /api/virtual-account?ref=TS-892 ───────────────────────────────────────
// Fetch existing VAN for an order (used by POS polling to re-display after refresh)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');

  if (!ref) return NextResponse.json({ error: 'Missing query param: ref' }, { status: 400 });

  const van = vanStore.get(ref);
  if (!van) return NextResponse.json({ error: `No VAN issued for ref: ${ref}` }, { status: 404 });

  return NextResponse.json(van);
}
