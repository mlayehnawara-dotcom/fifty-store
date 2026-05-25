/* eslint-disable react-refresh/only-export-components */
import { useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createStableContext } from './stableContext';

const COMPARE_STORAGE_KEY = 'fifty-store-compare-v1';

interface CompareContextType {
  compareIds: number[];
  canCompareMore: boolean;
  toggleCompare: (productId: number) => void;
  isCompared: (productId: number) => boolean;
  clearCompare: () => void;
}

const CompareContext = createStableContext<CompareContextType>('compare');

function readCompareIds(): number[] {
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as number[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is number => typeof item === 'number').slice(0, 3);
  } catch {
    return [];
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<number[]>(() => readCompareIds());

  useEffect(() => {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  const toggleCompare = (productId: number) => {
    setCompareIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      if (current.length >= 3) {
        return [...current.slice(1), productId];
      }

      return [...current, productId];
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const value = useMemo(
    () => ({
      compareIds,
      canCompareMore: compareIds.length < 3,
      toggleCompare,
      isCompared: (productId: number) => compareIds.includes(productId),
      clearCompare,
    }),
    [compareIds],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextType {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
