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
