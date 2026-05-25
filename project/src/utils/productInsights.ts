import type { Product } from '../data/products';

export function isPhoneProduct(product: Product): boolean {
  const searchable = `${product.name} ${product.category} ${product.brand}`.toLowerCase();
  return product.category === 'iphones' || searchable.includes('iphone') || searchable.includes('smartphone');
}

export function extractSpecValue(product: Product, keywords: string[], fallback = 'A completer'): string {
  const specs = product.specs || [];
  const match = specs.find((spec) => {
    const normalized = spec.toLowerCase();
    return keywords.some((keyword) => normalized.includes(keyword));
  });

  return match || fallback;
}

export function getCameraSpec(product: Product): string {
  return extractSpecValue(product, ['camera', 'caméra', 'mp', 'photo'], 'Camera selon modele');
}

export function getBatterySpec(product: Product): string {
  return extractSpecValue(product, ['batterie', 'mah', 'autonomie'], 'Autonomie journee');
}

export function getStorageSpec(product: Product): string {
  return extractSpecValue(product, ['gb', 'stockage', '64', '128', '256'], 'Stockage selon arrivage');
}
