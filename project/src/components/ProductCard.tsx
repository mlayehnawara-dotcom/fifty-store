import { Heart, Eye, Scale, ShoppingCart, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/format';
import { isPhoneProduct } from '../utils/productInsights';
import { buildDirectProductMessage, openWhatsApp } from '../utils/whatsapp';
import ProductQuickViewModal from './ProductQuickViewModal';
import OptimizedImage from './ui/OptimizedImage';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isCompared, toggleCompare } = useCompare();

  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const wished = isWishlisted(product.id);
  const compared = isCompared(product.id);
  const canCompareProduct = isPhoneProduct(product);

  const stockPercent = Math.min(100, Math.max(8, (product.stock / 40) * 100));
  const stockTone = product.stock <= 5 ? 'bg-rose-500' : product.stock <= 12 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <>
      <motion.article
        className="group mouse-follow-glow glass-card premium-hover-depth relative overflow-hidden rounded-3xl p-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.42, ease: [0.2, 0.72, 0.2, 1] }}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="relative overflow-hidden rounded-2xl border border-soft bg-slate-100 dark:bg-slate-900">
          <OptimizedImage
            src={product.image}
            alt={`${product.name} - ${product.brand}`}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />

          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
            {product.isNew && (
              <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="rounded-full bg-cyan-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950">
                Trending
              </span>
            )}
            {product.discount ? (
              <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                -{product.discount}%
              </span>
            ) : null}
          </div>

          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              type="button"
              aria-label="Ajouter aux favoris"
              onClick={(event) => {
                event.stopPropagation();
                toggleWishlist(product);
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur hover:scale-105"
            >
              <Heart size={15} className={wished ? 'fill-rose-500 text-rose-500' : ''} />
            </button>

            {canCompareProduct ? (
              <button
                type="button"
                aria-label="Comparer"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleCompare(product.id);
                }}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur hover:scale-105 ${
                  compared ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950/70 text-white'
                }`}
              >
                <Scale size={15} />
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setQuickViewOpen(true);
            }}
            className="absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-2 rounded-xl border border-soft bg-surface-strong/95 px-3 py-2 text-xs font-semibold text-primary opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100"
          >
            <Eye size={14} /> Quick view
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-400">{product.brand}</p>
          <h3 className="mt-1 line-clamp-2 text-base font-bold text-primary">{product.name}</h3>

          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> {product.reviews} avis
            </span>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
              <span>Stock</span>
              <span>{product.stock} pieces</span>
            </div>
            <div className="h-2 rounded-full bg-slate-300/50 dark:bg-slate-800/80">
              <div className={`h-full rounded-full ${stockTone}`} style={{ width: `${stockPercent}%` }} />
            </div>
          </div>

          <div className="mt-4 flex items-end gap-2">
            <p className="text-xl font-extrabold text-primary">{formatPrice(product.price)}</p>
            {product.oldPrice ? <p className="text-sm text-muted line-through">{formatPrice(product.oldPrice)}</p> : null}
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <motion.button
              type="button"
              disabled={product.stock <= 0}
              onClick={(event) => {
                event.stopPropagation();
                addToCart(product);
              }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-3 py-3 text-sm font-semibold text-white hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingCart size={15} />
              {product.stock > 0 ? 'Ajouter' : 'Indisponible'}
            </motion.button>
            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={(event) => {
                event.stopPropagation();
                openWhatsApp(buildDirectProductMessage(product));
              }}
              title="Commander sur WhatsApp"
              aria-label={`Commander ${product.name} sur WhatsApp`}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/10 text-emerald-500 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </motion.article>

      <ProductQuickViewModal product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
}
