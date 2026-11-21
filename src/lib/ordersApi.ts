import { supabase } from './supabase';
import { Order, OrderStatus, CartItem } from '../types';

const rowToOrder = (r: any, items: any[]): Order => ({
  id: r.id,
  orderNumber: r.order_number,
  date: (r.created_at || '').split('T')[0],
  customerName: r.customer_name,
  customerPhone: r.customer_phone,
  customerAddress: r.customer_address,
  customerCity: r.customer_city,
  items: items.map((it: any) => ({
    product: {
      id: it.product_id || it.id,
      title: it.title,
      price: Number(it.price),
      images: [],
    } as any,
    quantity: it.quantity,
  })),
  totalAmount: Number(r.total_amount),
  status: r.status as OrderStatus,
  paymentMethod: r.payment_method,
  escrowReleaseDate: r.escrow_release_date || undefined,
  trackingNumber: r.tracking_number || undefined,
  courierName: r.courier_name || undefined,
});

// Login user ke orders (RLS khud filter karti hai: buyer apne, seller apne, admin sab)
export async function fetchMyOrders(): Promise<Order[]> {
  if (!supabase) return [];
  const { data: rows, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !rows) {
    console.warn('fetch orders failed:', error?.message);
    return [];
  }
  if (rows.length === 0) return [];
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', rows.map((r: any) => r.id));
  return rows.map((r: any) =>
    rowToOrder(r, (items || []).filter((i: any) => i.order_id === r.id))
  );
}

export async function placeOrderApi(
  cart: CartItem[],
  name: string,
  phone: string,
  address: string,
  city: string,
  method: string
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Not configured' };
  const { error } = await supabase.rpc('place_order', {
    p_items: cart.map((c) => ({ product_id: c.product.id, quantity: c.quantity })),
    p_name: name,
    p_phone: phone,
    p_address: address,
    p_city: city,
    p_method: method,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function shipOrderApi(orderId: string, courier: string, tracking: string) {
  if (!supabase) return { ok: false, error: 'Not configured' };
  const { error } = await supabase.rpc('seller_ship_order', {
    p_order: orderId, p_courier: courier, p_tracking: tracking,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function confirmDeliveryApi(orderId: string) {
  if (!supabase) return { ok: false, error: 'Not configured' };
  const { error } = await supabase.rpc('buyer_confirm_delivery', { p_order: orderId });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function openDisputeApi(orderId: string, reason: string) {
  if (!supabase) return { ok: false, error: 'Not configured' };
  const { error } = await supabase.rpc('buyer_open_dispute', { p_order: orderId, p_reason: reason });
  return error ? { ok: false, error: error.message } : { ok: true };
}