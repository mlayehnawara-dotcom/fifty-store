import { categories as localCategories, products as localProducts, type Category, type Product, type ProductCategory } from '../data/products';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export type CatalogSource = 'supabase' | 'local';

interface SupabaseProductRow {
  id: number | string;
  name: string;
  brand: string;
  category: string;
  price: number;
  old_price?: number | null;
  discount?: number | null;
  rating?: number | null;
  reviews?: number | null;
  stock?: number | null;
  image?: string | null;
  images?: unknown;
  description?: string | null;
  specs?: unknown;
  is_new?: boolean | null;
  is_best_seller?: boolean | null;
  created_at?: string | null;
}

interface SupabaseCategoryRow {
  id?: string | null;
  slug?: string | null;
  name?: string | null;
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

function normalizeCategory(raw: string | null | undefined): ProductCategory {
  const normalized = (raw || '').toLowerCase().trim();
  if (validCategories.includes(normalized as ProductCategory)) {
    return normalized as ProductCategory;
  }
  return 'accessories';
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function mapProductRow(row: SupabaseProductRow): Product {
  const imageFallback =
    row.image ||
    'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1000';

  const images = asStringArray(row.images);
  const specs = asStringArray(row.specs);

  return {
    id: Number(row.id),
    name: row.name,
    brand: row.brand,
    category: normalizeCategory(row.category),
    price: Number(row.price) || 0,
    oldPrice: row.old_price ? Number(row.old_price) : undefined,
    discount: row.discount ? Number(row.discount) : undefined,
    rating: Number(row.rating ?? 4.5),
    reviews: Number(row.reviews ?? 0),
    stock: Number(row.stock ?? 0),
    image: imageFallback,
    images: images.length > 0 ? images : [imageFallback],
    description: row.description || 'Produit premium Fifty Store.',
    specs: specs.length > 0 ? specs : ['Details a completer'],
    isNew: Boolean(row.is_new),
    isBestSeller: Boolean(row.is_best_seller),
    createdAt: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

function safeLocalProducts(): Product[] {
  return [...localProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function safeLocalCategories(): Category[] {
  return localCategories;
}

export async function fetchCatalogProducts(): Promise<{ products: Product[]; source: CatalogSource }> {
  if (!isSupabaseConfigured || !supabase) {
    return { products: safeLocalProducts(), source: 'local' };
  }

  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return { products: safeLocalProducts(), source: 'local' };
  }

  const mapped = (data as SupabaseProductRow[])
    .map((row) => mapProductRow(row))
    .filter((product) => Number.isFinite(product.id));

  if (mapped.length === 0) {
    return { products: safeLocalProducts(), source: 'local' };
  }

  return { products: mapped, source: 'supabase' };
}

export async function fetchCatalogCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    return safeLocalCategories();
  }

  const { data, error } = await supabase.from('categories').select('*');
  if (error || !data || data.length === 0) {
    return safeLocalCategories();
  }

  const mapped = (data as SupabaseCategoryRow[])
    .map((row) => {
      const rawId = (row.slug || row.id || '').toLowerCase().trim();
      const id = rawId as ProductCategory | 'all';

      if (id !== 'all' && !validCategories.includes(id as ProductCategory)) {
        return null;
      }

      return {
        id,
        name: row.name?.trim() || rawId || 'Categorie',
      } as Category;
    })
    .filter((item): item is Category => Boolean(item));

  const hasAll = mapped.some((item) => item.id === 'all');
  return hasAll ? mapped : [safeLocalCategories()[0], ...mapped];
}

export function subscribeToCatalogChanges(onChange: () => void): () => void {
  if (!isSupabaseConfigured || !supabase) {
    return () => undefined;
  }

  const channel = supabase
    .channel('catalog-products-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => onChange())
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
