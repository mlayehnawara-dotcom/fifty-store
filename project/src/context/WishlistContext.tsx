/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import type { Product } from '../data/products';

const WISHLIST_STORAGE_KEY = 'fifty-store-wishlist-v1';

interface WishlistContextType {
  wishlistIds: number[];
  wishlistCount: number;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

function readStoredWishlist(): number[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as number[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === 'number');
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => readStoredWishlist());

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const isWishlisted = useCallback((productId: number): boolean => wishlistIds.includes(productId), [wishlistIds]);

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        toast.success(`${product.name} retire des favoris`);
        return prev.filter((id) => id !== product.id);
      }

      toast.success(`${product.name} ajoute aux favoris`);
      return [...prev, product.id];
    });
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    toast.success('Favoris vides');
  };

  const value = useMemo(
    () => ({
      wishlistIds,
      wishlistCount: wishlistIds.length,
      isWishlisted,
      toggleWishlist,
      clearWishlist,
    }),
    [wishlistIds, isWishlisted],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used inside WishlistProvider');
  }
  return ctx;
}
