import { NextRequest, NextResponse } from 'next/server';
import {
  USE_MOCK,
  supabase,
  getMockOrderByRef,
  updateMockOrderStatus,
} from '@/lib/supabase';
import { FlutterwaveWebhookPayload } from '@/types';

export async function POST(req: NextRequest) {
  // ── 1. Validate webhook secret ─────────────────────────────────────────────
  const verifHash = req.headers.get('verif-hash');
  const expectedHash = process.env.FLW_SECRET_HASH ?? 'tra-sync-dev-hash';

  if (verifHash !== expectedHash) {
    return NextResponse.json({ error: 'Unauthorized: invalid verif-hash' }, { status: 401 });
  }

  // ── 2. Parse payload ───────────────────────────────────────────────────────
  let body: FlutterwaveWebhookPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { tx_ref, amount, status } = body;

  if (!tx_ref || !amount || !status) {
    return NextResponse.json({ error: 'Missing required fields: tx_ref, amount, status' }, { status: 400 });
  }

  if (status !== 'successful') {
    return NextResponse.json({ message: 'Payment not successful — no action taken', status }, { status: 200 });
  }

  // ── 3. Update order & deduct inventory ────────────────────────────────────
  if (USE_MOCK) {
    const order = getMockOrderByRef(tx_ref);
    if (!order) {
      return NextResponse.json({ error: `Order not found: ${tx_ref}` }, { status: 404 });
    }
    const updated = updateMockOrderStatus(tx_ref, 'PAID');
    return NextResponse.json({
      message: 'Order updated (mock)',
      order: updated,
    });
  }

  // ── Supabase path ─────────────────────────────────────────────────────────
  let order;
  try {
    const res = await supabase!
      .from('orders')
      .select('*')
      .eq('ref', tx_ref)
      .single();
      
    if (res.error || !res.data) throw new Error('Order not found or DB err');
    order = res.data;

    const updateRes = await supabase!
      .from('orders')
      .update({ status: 'PAID' })
      .eq('ref', tx_ref);
      
    if (updateRes.error) throw new Error('Update failed');
  } catch (err) {
    // Fallback to mock if supabase env is broken
    const orderMock = getMockOrderByRef(tx_ref);
    if (!orderMock) {
      return NextResponse.json({ error: `Order not found: ${tx_ref}` }, { status: 404 });
    }
    const updated = updateMockOrderStatus(tx_ref, 'PAID');
    return NextResponse.json({
      message: 'Order updated (mock fallback)',
      order: updated,
    });
  }

  // Deduct stock_reserved for each item
  for (const item of order.items ?? []) {
    const { data: product } = await supabase!
      .from('products')
      .select('stock_reserved')
      .eq('id', item.product_id)
      .single();

    if (product) {
      const newReserved = Math.max(0, product.stock_reserved - item.quantity);
      await supabase!
        .from('products')
        .update({ stock_reserved: newReserved })
        .eq('id', item.product_id);
    }
  }

  return NextResponse.json({ message: 'Order paid and inventory deducted', ref: tx_ref });
}
