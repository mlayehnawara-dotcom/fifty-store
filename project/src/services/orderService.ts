import type { CartItem } from '../context/CartContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

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

export async function createSupabaseOrder(payload: CreateOrderPayload): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const customerRecord = {
      full_name: payload.fullName,
      phone: payload.phone,
      city: payload.city,
      address: payload.address,
    };

    const customerInsert = await supabase.from('customers').insert(customerRecord).select('id').single();

    const customerId = customerInsert.data?.id ?? null;

    const orderRecord = {
      customer_id: customerId,
      customer_name: payload.fullName,
      customer_phone: payload.phone,
      city: payload.city,
      address: payload.address,
      notes: payload.notes || null,
      total_amount: payload.total,
      payment_method: payload.paymentMethod,
      delivery_method: payload.deliveryMethod,
      status: 'En cours',
      items: payload.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
    };

    const orderInsert = await supabase.from('orders').insert(orderRecord);
    if (orderInsert.error) {
      throw orderInsert.error;
    }

    return true;
  } catch {
    try {
      const fallbackInsert = await supabase.from('orders').insert({
        customer_name: payload.fullName,
        customer_phone: payload.phone,
        city: payload.city,
        address: payload.address,
        total_amount: payload.total,
        status: 'En cours',
      });

      return !fallbackInsert.error;
    } catch {
      return false;
    }
  }
}
