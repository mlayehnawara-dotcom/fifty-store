import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import OptimizedImage from '../components/ui/OptimizedImage';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  const estimatedDelivery = items.length > 0 ? 8 : 0;
  const finalTotal = totalPrice + estimatedDelivery;

  return (
    <>
      <Seo
        title="Panier"
        description="Consultez votre panier Fifty Store avant validation de la commande."
        path="/cart"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-500">
            <ArrowLeft size={14} /> Continuer mes achats
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-primary">Mon panier</h1>
          <p className="mt-1 text-sm text-muted">{totalItems} article(s) dans votre panier.</p>

          {items.length === 0 ? (
            <section className="glass-card mt-8 rounded-3xl p-12 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-soft bg-surface">
                <ShoppingBag className="text-muted" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-primary">Votre panier est vide</h2>
              <p className="mt-2 text-sm text-muted">Ajoutez des produits depuis la boutique pour demarrer votre commande.</p>
              <Link to="/shop" className="premium-btn mt-5 inline-flex">
                Explorer la boutique
              </Link>
            </section>
          ) : (
            <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-3">
                {items.map((item) => (
                  <article key={item.product.id} className="glass-card grid gap-4 rounded-3xl p-4 sm:grid-cols-[110px_1fr]">
                    <Link to={`/product/${item.product.id}`} className="overflow-hidden rounded-2xl border border-soft">
                      <OptimizedImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-28 w-full object-cover"
                        sizes="110px"
                      />
                    </Link>

                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-500">{item.product.brand}</p>
                          <Link to={`/product/${item.product.id}`} className="mt-1 block text-base font-bold text-primary hover:text-fuchsia-500">
                            {item.product.name}
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-soft text-rose-500"
                          aria-label="Retirer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-secondary">{formatPrice(item.product.price)}</p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-xl border border-soft bg-surface-strong px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-fuchsia-500/10"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-primary">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-fuchsia-500/10"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="text-lg font-bold text-primary">{formatPrice(item.quantity * item.product.price)}</p>
                      </div>
                    </div>
                  </article>
                ))}

                <button type="button" onClick={() => clearCart()} className="text-sm font-semibold text-rose-500 hover:text-rose-400">
                  Vider tout le panier
                </button>
              </div>

              <aside className="glass-card h-fit rounded-3xl p-5 lg:sticky lg:top-32">
                <h2 className="text-xl font-bold text-primary">Resume commande</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Sous-total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Livraison estimee</span>
                    <span className="text-primary">{formatPrice(estimatedDelivery)}</span>
                  </div>
                  <div className="mt-3 border-t border-soft pt-3 text-base font-bold text-primary">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout" className="premium-btn mt-5 flex w-full justify-center">
                  Passer au checkout
                </Link>
              </aside>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

