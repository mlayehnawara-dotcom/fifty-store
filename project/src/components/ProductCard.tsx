import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const wished = isWishlisted(product.id);

  return (
    <article
      className="group glass-card relative overflow-hidden rounded-3xl p-4 hover:-translate-y-1 hover:shadow-premium"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-soft bg-slate-100 dark:bg-slate-900">
        <img
          src={product.image}
          alt={`${product.name} - ${product.brand}`}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isNew && (
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-900">
              Best seller
            </span>
          )}
          {product.discount ? (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              -{product.discount}%
            </span>
          ) : null}
        </div>

        <button
          type="button"
          aria-label="Ajouter aux favoris"
          onClick={(event) => {
            event.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur hover:scale-105"
        >
          <Heart size={15} className={wished ? 'fill-rose-500 text-rose-500' : ''} />
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-500">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold text-primary">{product.name}</h3>

        <div className="mt-2 flex items-center gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
          <span>({product.reviews} avis)</span>
          <span className="ml-auto">Stock: {product.stock}</span>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <p className="text-xl font-extrabold text-primary">{formatPrice(product.price)}</p>
          {product.oldPrice ? (
            <p className="text-sm text-muted line-through">{formatPrice(product.oldPrice)}</p>
          ) : null}
        </div>

        <button
          type="button"
          disabled={product.stock <= 0}
          onClick={(event) => {
            event.stopPropagation();
            addToCart(product);
          }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-fuchsia-600 px-4 py-3 text-sm font-semibold text-white hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          <ShoppingCart size={15} />
          {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
        </button>
      </div>
    </article>
  );
}

