import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order, Product } from '@/types';

// ─── Supabase Client (with mock fallback) ─────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const USE_MOCK = !supabaseUrl || !supabaseAnonKey;

export let supabase: SupabaseClient | null = null;

if (!USE_MOCK) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// ─── Mock In-Memory State (used when Supabase env vars are absent) ────────────

export const mockProducts: Product[] = [
  { id: 'prod-1', name: 'Product A', price: 10000, stock_available: 50, stock_reserved: 0 },
  { id: 'prod-2', name: 'Product B', price: 5000, stock_available: 80, stock_reserved: 0 },
  { id: 'prod-3', name: 'Product C', price: 15000, stock_available: 30, stock_reserved: 0 },
];

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    ref: 'TS-101',
    items: [
      { product_id: 'prod-1', product_name: 'Product A', quantity: 1, unit_price: 10000 },
    ],
    total: 10000,
    status: 'PAID',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ord-002',
    ref: 'TS-202',
    items: [
      { product_id: 'prod-2', product_name: 'Product B', quantity: 2, unit_price: 5000 },
    ],
    total: 10000,
    status: 'PAID',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ord-003',
    ref: 'TS-303',
    items: [
      { product_id: 'prod-1', product_name: 'Product A', quantity: 1, unit_price: 10000 },
      { product_id: 'prod-2', product_name: 'Product B', quantity: 1, unit_price: 5000 },
    ],
    total: 15000,
    status: 'FLAGGED',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'ord-004',
    ref: 'TS-404',
    items: [
      { product_id: 'prod-3', product_name: 'Product C', quantity: 3, unit_price: 15000 },
    ],
    total: 45000,
    status: 'PAID',
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'ord-005',
    ref: 'TS-505',
    items: [
      { product_id: 'prod-1', product_name: 'Product A', quantity: 2, unit_price: 10000 },
    ],
    total: 20000,
    status: 'PENDING',
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'ord-006',
    ref: 'TS-606',
    items: [
      { product_id: 'prod-2', product_name: 'Product B', quantity: 4, unit_price: 5000 },
      { product_id: 'prod-3', product_name: 'Product C', quantity: 1, unit_price: 15000 },
    ],
    total: 35000,
    status: 'PAID',
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'ord-007',
    ref: 'TS-707',
    items: [
      { product_id: 'prod-1', product_name: 'Product A', quantity: 10, unit_price: 10000 },
    ],
    total: 100000,
    status: 'FLAGGED',
    created_at: new Date(Date.now() - 150000).toISOString(),
  },
];

// ─── Mock Helpers ──────────────────────────────────────────────────────────────

export function getMockOrderByRef(ref: string): Order | undefined {
  return mockOrders.find((o) => o.ref === ref);
}

export function updateMockOrderStatus(ref: string, status: Order['status']): Order | null {
  const order = mockOrders.find((o) => o.ref === ref);
  if (!order) return null;
  order.status = status;
  // Deduct from stock_reserved on PAID
  if (status === 'PAID') {
    order.items.forEach((item) => {
      const product = mockProducts.find((p) => p.id === item.product_id);
      if (product) {
        const deduct = Math.min(item.quantity, product.stock_reserved);
        product.stock_reserved -= deduct;
      }
    });
  }
  return order;
}

export function reserveMockStock(items: Order['items']): void {
  items.forEach((item) => {
    const product = mockProducts.find((p) => p.id === item.product_id);
    if (product) {
      const reserve = Math.min(item.quantity, product.stock_available);
      product.stock_available -= reserve;
      product.stock_reserved += reserve;
    }
  });
}

export function addMockOrder(order: Order): void {
  mockOrders.push(order);
}
