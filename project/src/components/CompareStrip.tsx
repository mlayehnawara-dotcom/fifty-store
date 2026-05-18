import { X } from 'lucide-react';
import { useMemo } from 'react';
import { useCompare } from '../context/CompareContext';
import { useCatalog } from '../context/CatalogContext';
import { formatPrice } from '../utils/format';

export default function CompareStrip() {
  const { compareIds, clearCompare, toggleCompare } = useCompare();
  const { products } = useCatalog();

  const comparedProducts = useMemo(
    () => products.filter((product) => compareIds.includes(product.id)).slice(0, 3),
    [products, compareIds],
  );

  if (comparedProducts.length === 0) return null;

  return (
    <section className="frost-panel mb-5 rounded-3xl border border-soft p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cyan-400">Comparaison produits</h3>
        <button type="button" onClick={clearCompare} className="text-xs font-semibold text-rose-400">
          Vider
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {comparedProducts.map((product) => (
          <article key={product.id} className="card-strong rounded-2xl border border-soft p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted">{product.brand}</p>
                <h4 className="line-clamp-1 text-sm font-semibold text-primary">{product.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => toggleCompare(product.id)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-soft text-muted"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
            <p className="mt-1 text-xs text-muted">{product.rating.toFixed(1)} / 5 - {product.stock} en stock</p>
          </article>
        ))}
      </div>
    </section>
  );
}
