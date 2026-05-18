import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import OptimizedImage from './ui/OptimizedImage';

export default function CartSidebar() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-soft bg-surface-strong shadow-premium transition-transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-soft px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Mon panier</h2>
            <p className="text-xs text-muted">{totalItems} article(s)</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-soft text-secondary hover:text-primary"
            aria-label="Fermer panier"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-soft bg-surface">
                <ShoppingBag className="text-muted" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-primary">Panier vide</h3>
              <p className="mt-1 text-sm text-muted">Ajoutez des produits pour commencer.</p>
              <button
                type="button"
                onClick={() => {
                  navigate('/shop');
                  setIsCartOpen(false);
                }}
                className="premium-btn mt-5"
              >
                Voir la boutique
              </button>
            </div>
          ) : (
            items.map((item) => (
              <article key={item.product.id} className="glass-card flex gap-3 rounded-2xl p-3">
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/product/${item.product.id}`);
                    setIsCartOpen(false);
                  }}
                  className="h-20 w-20 overflow-hidden rounded-xl"
                >
                  <OptimizedImage
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                    sizes="80px"
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold text-primary">{item.product.name}</h3>
                  <p className="mt-1 text-xs text-muted">{item.product.brand}</p>
                  <p className="mt-1 text-sm font-bold text-primary">{formatPrice(item.product.price)}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-soft text-secondary"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-primary">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-soft text-secondary"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg border border-soft text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-3 border-t border-soft px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Sous-total</span>
              <span className="text-lg font-bold text-primary">{formatPrice(totalPrice)}</span>
            </div>

            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="premium-btn flex w-full justify-center"
            >
              Commander maintenant
            </Link>

            <Link
              to="/cart"
              onClick={() => setIsCartOpen(false)}
              className="premium-btn-secondary flex w-full justify-center"
            >
              Voir le panier
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  );
}
