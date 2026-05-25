import { categories as localCategories, products as localProducts, type Category, type Product, type ProductCategory } from '../data/products';
import { isSupabaseConfigured, supabase, verifyFiftyStoreDatabase } from '../lib/supabase';
import { type SocialMediaItem, type SocialPlatform } from '../data/social';

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
  image_url?: string | null;
  video_url?: string | null;
  video?: string | null;
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

interface SupabaseSocialMediaRow {
  id: number | string;
  platform?: string | null;
  image_url?: string | null;
  post_url?: string | null;
  caption?: string | null;
  created_at?: string | null;
}

const validCategories: ProductCategory[] = [
  'iphones',
  'cases',
  'chargers',
  'headphones',
  'smartwatches',
  'powerbanks',
  'speakers',
  'accessories',
];

function normalizeCategory(raw: string | null | undefined): ProductCategory {
  const normalized = (raw || '').toLowerCase().trim();
  if (normalized === 'phones' || normalized === 'smartphones') return 'iphones';
  if (normalized === 'gaming') return 'accessories';
  if (normalized === 'powerbank') return 'powerbanks';
  if (normalized === 'baffle' || normalized === 'baffles' || normalized === 'speaker') return 'speakers';
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
    row.image_url ||
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
    videoUrl: row.video_url || row.video || undefined,
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

function normalizeSocialPlatform(value: string | null | undefined): SocialPlatform {
  return value?.toLowerCase().trim() === 'instagram' ? 'instagram' : 'tiktok';
}

function mapSocialMediaRow(row: SupabaseSocialMediaRow): SocialMediaItem | null {
  if (!row.image_url?.trim() || !row.post_url?.trim()) return null;

  return {
    id: String(row.id),
    platform: normalizeSocialPlatform(row.platform),
    image: row.image_url.trim(),
    postUrl: row.post_url.trim(),
    caption: row.caption?.trim() || 'Publication Fifty Store',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function fetchCatalogProducts(): Promise<{ products: Product[]; source: CatalogSource }> {
  if (!isSupabaseConfigured || !supabase) {
    return { products: safeLocalProducts(), source: 'local' };
  }

  const verified = await verifyFiftyStoreDatabase();
  if (!verified) {
    return { products: safeLocalProducts(), source: 'local' };
  }

  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return { products: safeLocalProducts(), source: 'local' };
  }

  const mapped = (data as SupabaseProductRow[])
    .filter((row) => row.category?.toLowerCase().trim() !== 'gaming')
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

  const verified = await verifyFiftyStoreDatabase();
  if (!verified) {
    return safeLocalCategories();
  }

  const { data, error } = await supabase.from('categories').select('*');
  if (error || !data || data.length === 0) {
    return safeLocalCategories();
  }

  const mapped = (data as SupabaseCategoryRow[])
    .map((row) => {
      const rawId = (row.slug || row.id || '').toLowerCase().trim();
      const id = (rawId === 'phones' ? 'iphones' : rawId) as ProductCategory | 'all';

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

export async function fetchSocialMedia(): Promise<SocialMediaItem[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  if (!(await verifyFiftyStoreDatabase())) return [];

  const { data, error } = await supabase.from('social_media').select('*').order('created_at', { ascending: false }).limit(12);
  if (error || !data) return [];

  return (data as SupabaseSocialMediaRow[])
    .map((row) => mapSocialMediaRow(row))
    .filter((item): item is SocialMediaItem => Boolean(item));
}

export function subscribeToCatalogChanges(onChange: () => void): () => void {
  const client = supabase;

  if (!isSupabaseConfigured || !client) {
    return () => undefined;
  }

  const channel = client
    .channel('catalog-products-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => onChange())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'social_media' }, () => onChange())
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
