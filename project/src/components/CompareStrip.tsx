import { BatteryCharging, Camera, HardDrive, PackageCheck, Scale, X } from 'lucide-react';
import { useMemo } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { useCompare } from '../context/CompareContext';
import { formatPrice } from '../utils/format';
import { getBatterySpec, getCameraSpec, getStorageSpec, isPhoneProduct } from '../utils/productInsights';
import OptimizedImage from './ui/OptimizedImage';

export default function CompareStrip() {
  const { compareIds, clearCompare, toggleCompare } = useCompare();
  const { products } = useCatalog();

  const comparedProducts = useMemo(
    () => products.filter((product) => compareIds.includes(product.id) && isPhoneProduct(product)).slice(0, 3),
    [products, compareIds],
  );

  if (comparedProducts.length === 0) return null;

  const rows = [
    { label: 'Prix', icon: Scale, value: (product: (typeof comparedProducts)[number]) => formatPrice(product.price) },
    { label: 'Camera', icon: Camera, value: getCameraSpec },
    { label: 'Battery', icon: BatteryCharging, value: getBatterySpec },
    { label: 'Stockage', icon: HardDrive, value: getStorageSpec },
    { label: 'Stock', icon: PackageCheck, value: (product: (typeof comparedProducts)[number]) => `${product.stock} pieces` },
  ];

  return (
    <section className="frost-panel mb-5 rounded-3xl border border-soft p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cyan-400">Qaren 2 wala 3 iPhones</h3>
          <p className="mt-1 text-xs text-muted">Prix, camera, battery, stockage w stock fi blassa wahda.</p>
        </div>
        <button type="button" onClick={clearCompare} className="text-xs font-semibold text-rose-400">
          Vider
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {comparedProducts.map((product) => (
          <article key={product.id} className="card-strong rounded-2xl border border-soft p-3">
            <div className="flex items-start gap-3">
              <OptimizedImage src={product.image} alt={product.name} className="h-14 w-14 rounded-xl object-cover" sizes="56px" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">{product.brand}</p>
                <h4 className="line-clamp-2 text-sm font-semibold text-primary">{product.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => toggleCompare(product.id)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-soft text-muted"
                aria-label="Retirer de la comparaison"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-3 grid gap-2">
              {rows.map((row) => {
                const Icon = row.icon;
                return (
                  <p key={row.label} className="grid grid-cols-[92px_1fr] items-start gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold text-cyan-400">
                      <Icon size={12} /> {row.label}
                    </span>
                    <span className="text-secondary">{row.value(product)}</span>
                  </p>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
