/* eslint-disable react-refresh/only-export-components */
import { useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { categories as fallbackCategories, products as fallbackProducts, type Category, type Product } from '../data/products';
import type { SocialMediaItem } from '../data/social';
import {
  fetchCatalogCategories,
  fetchCatalogProducts,
  fetchSocialMedia,
  subscribeToCatalogChanges,
  type CatalogSource,
} from '../services/catalogService';
import { createStableContext } from './stableContext';

interface CatalogContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  source: CatalogSource;
  aiMinBudget: number;
  socialMedia: SocialMediaItem[];
  refreshProducts: () => Promise<void>;
  saveLocalProduct: (product: Product) => void;
  deleteLocalProduct: (productId: number) => void;
  updateAiMinBudget: (value: number) => void;
  saveLocalSocialMedia: (item: SocialMediaItem) => void;
  deleteLocalSocialMedia: (id: string) => void;
}

const CatalogContext = createStableContext<CatalogContextType>('catalog');
const LOCAL_CATALOG_KEY = 'fifty-store-local-catalog-v1';
const LOCAL_SETTINGS_KEY = 'fifty-store-ai-settings-v1';
const LOCAL_SOCIAL_MEDIA_KEY = 'fifty-store-social-media-v1';
const DEFAULT_AI_MIN_BUDGET = 10;

interface LocalCatalogState {
  products: Product[];
  deletedIds: number[];
}

const emptyLocalCatalog: LocalCatalogState = {
  products: [],
  deletedIds: [],
};

function isProductLike(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;

  const product = value as Partial<Product>;
  return (
    typeof product.id === 'number' &&
    typeof product.name === 'string' &&
    typeof product.brand === 'string' &&
    typeof product.category === 'string' &&
    typeof product.price === 'number' &&
    typeof product.stock === 'number' &&
    typeof product.image === 'string' &&
    Array.isArray(product.images) &&
    typeof product.description === 'string' &&
    Array.isArray(product.specs)
  );
}

function readLocalCatalog(): LocalCatalogState {
  if (typeof window === 'undefined') return emptyLocalCatalog;

  try {
    const raw = window.localStorage.getItem(LOCAL_CATALOG_KEY);
    if (!raw) return emptyLocalCatalog;

    const parsed = JSON.parse(raw) as Partial<LocalCatalogState>;
    return {
      products: Array.isArray(parsed.products) ? parsed.products.filter(isProductLike) : [],
      deletedIds: Array.isArray(parsed.deletedIds)
        ? parsed.deletedIds.filter((id): id is number => typeof id === 'number')
        : [],
    };
  } catch {
    return emptyLocalCatalog;
  }
}

function persistLocalCatalog(next: LocalCatalogState) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(LOCAL_CATALOG_KEY, JSON.stringify(next));
  } catch {
    // The in-memory catalog still updates even if a very large imported image exceeds localStorage.
  }
}

function readAiMinBudget(): number {
  if (typeof window === 'undefined') return DEFAULT_AI_MIN_BUDGET;

  try {
    const raw = window.localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (!raw) return DEFAULT_AI_MIN_BUDGET;

    const parsed = JSON.parse(raw) as { aiMinBudget?: unknown };
    const value = Number(parsed.aiMinBudget);
    return Number.isFinite(value) && value >= 0 ? value : DEFAULT_AI_MIN_BUDGET;
  } catch {
    return DEFAULT_AI_MIN_BUDGET;
  }
}

function persistAiMinBudget(value: number) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify({ aiMinBudget: value }));
  } catch {
    // If browser storage is unavailable, the current session still keeps the setting in memory.
  }
}

function isSocialMediaItem(value: unknown): value is SocialMediaItem {
  if (!value || typeof value !== 'object') return false;

  const item = value as Partial<SocialMediaItem>;
  return (
    typeof item.id === 'string' &&
    (item.platform === 'instagram' || item.platform === 'tiktok') &&
    typeof item.image === 'string' &&
    typeof item.postUrl === 'string' &&
    typeof item.caption === 'string' &&
    typeof item.createdAt === 'string'
  );
}

function readLocalSocialMedia(): SocialMediaItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_SOCIAL_MEDIA_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isSocialMediaItem) : [];
  } catch {
    return [];
  }
}

function persistLocalSocialMedia(items: SocialMediaItem[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(LOCAL_SOCIAL_MEDIA_KEY, JSON.stringify(items));
  } catch {
    // Imported images can exceed local storage; the current session still updates.
  }
}

function mergeCatalogProducts(baseProducts: Product[], localCatalog: LocalCatalogState): Product[] {
  const deletedIds = new Set(localCatalog.deletedIds);
  const byId = new Map<number, Product>();

  baseProducts.forEach((product) => {
    if (!deletedIds.has(product.id)) {
      byId.set(product.id, product);
    }
  });

  localCatalog.products.forEach((product) => {
    if (!deletedIds.has(product.id)) {
      byId.set(product.id, product);
    }
  });

  return Array.from(byId.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [baseProducts, setBaseProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [localCatalog, setLocalCatalog] = useState<LocalCatalogState>(() => readLocalCatalog());
  const [aiMinBudget, setAiMinBudget] = useState(() => readAiMinBudget());
  const [remoteSocialMedia, setRemoteSocialMedia] = useState<SocialMediaItem[]>([]);
  const [localSocialMedia, setLocalSocialMedia] = useState<SocialMediaItem[]>(() => readLocalSocialMedia());
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<CatalogSource>('local');

  const refreshProducts = useCallback(async () => {
    const [productsResult, categoriesResult, socialMediaResult] = await Promise.all([
      fetchCatalogProducts(),
      fetchCatalogCategories(),
      fetchSocialMedia(),
    ]);

    setBaseProducts(productsResult.products);
    setCategories(categoriesResult);
    setRemoteSocialMedia(socialMediaResult);
    setSource(productsResult.source);
  }, []);

  const saveLocalProduct = useCallback((product: Product) => {
    setLocalCatalog((current) => {
      const next = {
        products: [product, ...current.products.filter((item) => item.id !== product.id)],
        deletedIds: current.deletedIds.filter((id) => id !== product.id),
      };
      persistLocalCatalog(next);
      return next;
    });
  }, []);

  const deleteLocalProduct = useCallback((productId: number) => {
    setLocalCatalog((current) => {
      const next = {
        products: current.products.filter((product) => product.id !== productId),
        deletedIds: current.deletedIds.includes(productId) ? current.deletedIds : [...current.deletedIds, productId],
      };
      persistLocalCatalog(next);
      return next;
    });
  }, []);

  const updateAiMinBudget = useCallback((value: number) => {
    const next = Number.isFinite(value) && value >= 0 ? Math.round(value) : DEFAULT_AI_MIN_BUDGET;
    setAiMinBudget(next);
    persistAiMinBudget(next);
  }, []);

  const saveLocalSocialMedia = useCallback((item: SocialMediaItem) => {
    setLocalSocialMedia((current) => {
      const next = [item, ...current.filter((entry) => entry.id !== item.id)];
      persistLocalSocialMedia(next);
      return next;
    });
  }, []);

  const deleteLocalSocialMedia = useCallback((id: string) => {
    setLocalSocialMedia((current) => {
      const next = current.filter((item) => item.id !== id);
      persistLocalSocialMedia(next);
      return next;
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        await refreshProducts();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

    const unsubscribe = subscribeToCatalogChanges(() => {
      void refreshProducts();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [refreshProducts]);

  const products = useMemo(
    () => (source === 'supabase' ? baseProducts : mergeCatalogProducts(baseProducts, localCatalog)),
    [baseProducts, localCatalog, source],
  );
  const socialMedia = useMemo(
    () => (source === 'supabase' ? remoteSocialMedia : localSocialMedia),
    [localSocialMedia, remoteSocialMedia, source],
  );

  const value = useMemo(
    () => ({
      products,
      categories,
      loading,
      source,
      aiMinBudget,
      socialMedia,
      refreshProducts,
      saveLocalProduct,
      deleteLocalProduct,
      updateAiMinBudget,
      saveLocalSocialMedia,
      deleteLocalSocialMedia,
    }),
    [
      products,
      categories,
      loading,
      source,
      aiMinBudget,
      socialMedia,
      refreshProducts,
      saveLocalProduct,
      deleteLocalProduct,
      updateAiMinBudget,
      saveLocalSocialMedia,
      deleteLocalSocialMedia,
    ],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextType {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within CatalogProvider');
  }
  return context;
}
