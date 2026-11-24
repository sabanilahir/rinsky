export type SnackCategory = 'asin' | 'manis' | 'tradisional' | 'lainnya';

export interface SnackMenuItem {
  id: string;
  name: string;
  category: SnackCategory;
  price: number;
  aliases: string[];
}

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  pricePerUnit: number;
  totalPrice: number;
  packageGroup?: string; // e.g. "Kue nampan" atau "1 dus"
  note?: string; // e.g. "klo buat"
}

export type PaymentStatus = 'UNPAID' | 'DP' | 'PAID';
export type OrderStatus = 'PENDING' | 'IN_PRODUCTION' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  invoiceNumber?: string;
  orderDate: string; // YYYY-MM-DD
  deliveryTime: string; // e.g. "06:00" or "06.30"
  customerName: string;
  location: string;
  items: OrderItem[];
  totalPrice: number;
  paymentStatus: PaymentStatus;
  paidAmount?: number;
  paymentMethod?: string; // e.g. "Transfer BCA", "Tunai", "QRIS"
  paidAt?: string;
  orderStatus: OrderStatus;
  notes?: string;
  rawText?: string;
  createdAt: string;
}

export interface KitchenItemBreakdown {
  name: string;
  totalQty: number;
  completed: boolean;
  orders: {
    orderId: string;
    customerName: string;
    time: string;
    location: string;
    qty: number;
    packageGroup?: string;
    note?: string;
  }[];
}
