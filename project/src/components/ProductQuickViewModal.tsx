import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, ShoppingCart, Star, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';
import { formatPrice } from '../utils/format';
import { buildDirectProductMessage, openWhatsApp } from '../utils/whatsapp';
import OptimizedImage from './ui/OptimizedImage';

interface ProductQuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, open, onClose }: ProductQuickViewModalProps) {
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {open && product ? (
        <>
          <motion.div
            className="fixed inset-0 z-[88] bg-slate-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.24 }}
            className="fixed left-1/2 top-1/2 z-[89] w-[min(94vw,900px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-soft bg-surface-strong shadow-2xl"
          >
            <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-soft md:border-b-0 md:border-r">
                <OptimizedImage
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-400">{product.brand}</p>
                    <h3 className="mt-1 text-2xl font-bold text-primary">{product.name}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-soft bg-surface text-secondary"
                    aria-label="Fermer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-muted">
                  <span className="inline-flex items-center gap-1 text-amber-500">
                    <Star size={14} className="fill-current" /> {product.rating.toFixed(1)}
                  </span>
                  <span>({product.reviews} avis)</span>
                  <span className="ml-auto">Stock: {product.stock}</span>
                </div>

                <p className="text-sm leading-relaxed text-secondary">{product.description}</p>

                <div className="mt-4 flex items-end gap-2">
                  <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
                  {product.oldPrice ? <p className="text-sm text-muted line-through">{formatPrice(product.oldPrice)}</p> : null}
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {product.specs.slice(0, 6).map((spec) => (
                    <p key={spec} className="inline-flex items-center gap-2 text-xs text-muted">
                      <CheckCircle2 size={13} className="text-cyan-400" />
                      {spec}
                    </p>
                  ))}
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <button type="button" onClick={() => addToCart(product)} className="premium-btn justify-center">
                    <ShoppingCart size={15} /> Ajouter au panier
                  </button>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(buildDirectProductMessage(product))}
                    className="premium-btn-secondary justify-center"
                  >
                    <MessageCircle size={15} /> Commander
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
