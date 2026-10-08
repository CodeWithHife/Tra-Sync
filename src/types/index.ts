// ─── TRA-SYNC Core Types ───────────────────────────────────────────────────────

export interface Merchant {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  postcode: string;
  address: string;
  state: string;
  lga: string;
  lat: number;
  lng: number;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock_available: number;
  stock_reserved: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'FLAGGED' | 'RESERVED';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  ref: string; // e.g. "TS-892"
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
}

// ── Dynamic Virtual Account Number (VAN) ─────────────────────────────────────
export interface VirtualAccount {
  order_ref: string;          // e.g. "TS-892" — matches Order.ref
  bank_name: string;          // e.g. "Wema Bank"
  bank_code: string;          // e.g. "035"
  account_number: string;     // 10-digit dynamic account
  account_name: string;       // Merchant display name
  amount: number;             // Exact amount customer must transfer
  currency: 'NGN';
  expires_at: string;         // ISO timestamp — 15 min window
  created_at: string;
}

export interface PostcodeResult {
  postcode: string;
  street: string;
  lga: string;
  state: string;
  lat: number;
  lng: number;
}

export interface FlutterwaveWebhookPayload {
  tx_ref: string;
  amount: number;
  status: string;
  currency?: string;
  customer?: {
    email: string;
    name: string;
  };
}

export interface AnalyzeResult {
  status: string;
  parsed_transactions: number;
  flagged_discrepancies: number;
  risk_score: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CartItem {
  product: Product;
  quantity: number;
}
