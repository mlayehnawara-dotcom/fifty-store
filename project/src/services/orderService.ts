import type { CartItem } from '../context/CartContext';
import { isSupabaseConfigured, supabase, verifyFiftyStoreDatabase } from '../lib/supabase';

interface CustomerPayload {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

interface CreateOrderPayload extends CustomerPayload {
  notes?: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
}

async function resolveCustomerId(payload: CustomerPayload): Promise<number | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  if (!(await verifyFiftyStoreDatabase())) return null;

  const existing = await supabase.from('customers').select('id').eq('phone', payload.phone).maybeSingle();
  if (existing.data?.id) {
    await supabase
      .from('customers')
      .update({
        full_name: payload.fullName,
        city: payload.city,
        address: payload.address,
      })
      .eq('id', existing.data.id);
    return Number(existing.data.id);
  }

  const created = await supabase
    .from('customers')
    .insert({
      full_name: payload.fullName,
      phone: payload.phone,
      city: payload.city,
      address: payload.address,
    })
    .select('id')
    .single();

  return Number(created.data?.id ?? 0) || null;
}

export async function createSupabaseOrder(payload: CreateOrderPayload): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  if (!(await verifyFiftyStoreDatabase())) {
    return false;
  }

  try {
    const customerId = await resolveCustomerId(payload);

    const orderInsert = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        customer_name: payload.fullName,
        phone: payload.phone,
        city: payload.city,
        address: payload.address,
        notes: payload.notes || null,
        total: payload.total,
        payment_method: payload.paymentMethod,
        delivery_method: payload.deliveryMethod,
        status: 'En cours',
      })
      .select('id')
      .single();

    if (orderInsert.error || !orderInsert.data?.id) {
      throw orderInsert.error || new Error('Unable to create order');
    }

    const orderId = Number(orderInsert.data.id);

    const orderItems = payload.items.map((item) => ({
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.quantity * item.product.price,
    }));

    const itemsInsert = await supabase.from('order_items').insert(orderItems);
    if (itemsInsert.error) {
      throw itemsInsert.error;
    }

    return true;
  } catch {
    try {
      const fallbackInsert = await supabase.from('orders').insert({
        customer_name: payload.fullName,
        phone: payload.phone,
        city: payload.city,
        address: payload.address,
        notes: payload.notes || null,
        total: payload.total,
        status: 'En cours',
      });

      return !fallbackInsert.error;
    } catch {
      return false;
    }
  }
}
