export interface Order {
  id: number;
  order_number: string;
  timestamp: string;
  order_type: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  paid_at: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  note: string;
}

export interface OrderDetail extends Omit<Order, 'timestamp'> {
  items: OrderItem[];
}
