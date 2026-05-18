import type { ProductCategory } from '../data/products';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  city: string;
  address: string;
  amount: number;
  status: 'En cours' | 'Confirmee' | 'Expediee' | 'Livree';
  date: string;
  items: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  city: string;
  orders: number;
  spend: number;
}

interface SupabaseOrderRow {
  id: number | string;
  customer_name?: string | null;
  phone?: string | null;
  city?: string | null;
  address?: string | null;
  total?: number | null;
  status?: string | null;
  created_at?: string | null;
}

interface SupabaseCustomerRow {
  id: number | string;
  full_name?: string | null;
  phone?: string | null;
  city?: string | null;
}

interface ProductPayload {
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

const validCategories: ProductCategory[] = [
  'phones',
  'cases',
  'chargers',
  'headphones',
  'smartwatches',
  'gaming',
  'accessories',
];

function normalizeCategory(value: string): ProductCategory {
  const normalized = value.toLowerCase().trim();
  return validCategories.includes(normalized as ProductCategory)
    ? (normalized as ProductCategory)
    : 'accessories';
}

export async function createProductInSupabase(payload: ProductPayload): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase.from('products').insert({
    name: payload.name,
    brand: payload.brand,
    category: normalizeCategory(payload.category),
    price: payload.price,
    old_price: Math.round(payload.price * 1.1),
    description: 'Produit ajoute depuis dashboard admin.',
    image: payload.image || null,
    image_url: payload.image || null,
    stock: payload.stock,
    rating: 4.5,
    reviews: 0,
    is_best_seller: false,
    is_new: true,
  });

  return !error;
}

export async function updateProductInSupabase(productId: number, payload: Partial<ProductPayload>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase
    .from('products')
    .update({
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.brand ? { brand: payload.brand } : {}),
      ...(payload.category ? { category: normalizeCategory(payload.category) } : {}),
      ...(typeof payload.price === 'number' ? { price: payload.price } : {}),
      ...(typeof payload.stock === 'number' ? { stock: payload.stock } : {}),
      ...(payload.image ? { image: payload.image, image_url: payload.image } : {}),
    })
    .eq('id', productId);

  return !error;
}

export async function deleteProductInSupabase(productId: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase.from('products').delete().eq('id', productId);
  return !error;
}

export async function fetchOrdersFromSupabase(): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(120);
  if (error || !data) return [];

  return (data as SupabaseOrderRow[]).map((row) => ({
    id: String(row.id),
    customer: row.customer_name || 'Client Fifty Store',
    phone: row.phone || '-',
    city: row.city || '-',
    address: row.address || '-',
    amount: Number(row.total ?? 0),
    status: (row.status as AdminOrder['status']) || 'En cours',
    date: row.created_at ? row.created_at.slice(0, 10) : '-',
    items: 1,
  }));
}

export async function updateOrderStatusInSupabase(orderId: string, status: AdminOrder['status']): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  return !error;
}

export async function fetchCustomersFromSupabase(): Promise<AdminCustomer[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase.from('customers').select('*').limit(300);
  if (error || !data) return [];

  return (data as SupabaseCustomerRow[]).map((row) => ({
    id: String(row.id),
    name: row.full_name || 'Client',
    phone: row.phone || '-',
    city: row.city || '-',
    orders: 0,
    spend: 0,
  }));
}
