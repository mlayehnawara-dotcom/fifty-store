/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { categories as fallbackCategories, products as fallbackProducts, type Category, type Product } from '../data/products';
import {
  fetchCatalogCategories,
  fetchCatalogProducts,
  subscribeToCatalogChanges,
  type CatalogSource,
} from '../services/catalogService';

interface CatalogContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  source: CatalogSource;
  refreshProducts: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<CatalogSource>('local');

  const refreshProducts = useCallback(async () => {
    const [productsResult, categoriesResult] = await Promise.all([fetchCatalogProducts(), fetchCatalogCategories()]);

    setProducts(productsResult.products);
    setCategories(categoriesResult);
    setSource(productsResult.source);
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

  const value = useMemo(
    () => ({
      products,
      categories,
      loading,
      source,
      refreshProducts,
    }),
    [products, categories, loading, source, refreshProducts],
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
