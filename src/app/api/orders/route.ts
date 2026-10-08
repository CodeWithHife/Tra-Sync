import { NextRequest, NextResponse } from 'next/server';
import {
  USE_MOCK,
  supabase,
  mockProducts,
  addMockOrder,
  reserveMockStock,
  mockOrders,
  getMockOrderByRef,
} from '@/lib/supabase';
import { Order, OrderItem } from '@/types';

// POST /api/orders — create new order and reserve stock
export async function POST(req: NextRequest) {
  let body: { items: { product_id: string; quantity: number }[], total?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }

  const refNum = 800 + Math.floor(Math.random() * 100);
  const ref = `TS-${refNum}`;

  if (USE_MOCK) {
    const orderItems: OrderItem[] = body.items.map((i) => {
      const product = mockProducts.find((p) => p.id === i.product_id);
      return {
        product_id: i.product_id,
        product_name: product?.name ?? (i.product_id === 'custom' ? 'Custom Amount' : 'Unknown'),
        quantity: i.quantity,
        unit_price: product?.price ?? (body.total ? body.total / i.quantity : 0),
      };
    });
    const calculatedTotal = orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const total = body.total ?? calculatedTotal;
    const order: Order = {
      id: `ord-${Date.now()}`,
      ref,
      items: orderItems,
      total,
      status: 'RESERVED',
      created_at: new Date().toISOString(),
    };
    reserveMockStock(orderItems);
    addMockOrder(order);
    return NextResponse.json(order);
  }

  // Supabase path
  const orderItems: OrderItem[] = [];
  let total = 0;
  for (const item of body.items) {
    if (item.product_id === 'custom') {
      orderItems.push({ product_id: 'custom', product_name: 'Custom Amount', quantity: item.quantity, unit_price: body.total ?? 0 });
      total += body.total ?? 0;
      continue;
    }
    const { data: product } = await supabase!.from('products').select('*').eq('id', item.product_id).single();
    if (product) {
      orderItems.push({ product_id: item.product_id, product_name: product.name, quantity: item.quantity, unit_price: product.price });
      total += product.price * item.quantity;
      await supabase!.from('products').update({
        stock_available: product.stock_available - item.quantity,
        stock_reserved: product.stock_reserved + item.quantity,
      }).eq('id', item.product_id);
    }
  }

  const finalTotal = body.total ?? total;

  const { data: order, error } = await supabase!.from('orders').insert({
    ref, items: orderItems, total: finalTotal, status: 'RESERVED', created_at: new Date().toISOString(),
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(order);
}

// GET /api/orders?ref=TS-892 — poll order status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');

  if (!ref) return NextResponse.json({ error: 'Missing ref' }, { status: 400 });

  if (USE_MOCK) {
    const order = getMockOrderByRef(ref);
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  }

  const { data: order, error } = await supabase!.from('orders').select('*').eq('ref', ref).single();
  if (error || !order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}
