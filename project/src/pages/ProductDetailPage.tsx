import { ArrowLeft, Check, MessageCircle, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { STORE_INFO } from '../data/store';
import { formatPrice } from '../utils/format';
import { openWhatsApp } from '../utils/whatsapp';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const productId = Number(id);
  const product = products.find((item) => item.id === productId);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <div className="glass-card rounded-3xl p-10">
            <h1 className="text-2xl font-bold text-primary">Produit introuvable</h1>
            <p className="mt-3 text-sm text-muted">Ce produit n existe pas ou n est plus disponible.</p>
            <Link to="/shop" className="premium-btn mt-5 inline-flex">
              Retour a la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const directOrderMessage = [
    'Bonjour Fifty Store,',
    '',
    'Je souhaite commander ce produit:',
    `Produit: ${product.name}`,
    `Marque: ${product.brand}`,
    `Prix unitaire: ${formatPrice(product.price)}`,
    `Quantite: ${quantity}`,
    `Total: ${formatPrice(product.price * quantity)}`,
    `Paiement: ${STORE_INFO.paymentLabel}`,
    `Livraison: ${STORE_INFO.deliveryLabel}`,
  ].join('\n');

  return (
    <>
      <Seo
        title={`${product.name} ${product.brand}`}
        description={product.description}
        path={`/product/${product.id}`}
        image={product.image}
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-500">
            <ArrowLeft size={14} /> Retour boutique
          </Link>

          <section className="mt-5 grid gap-8 lg:grid-cols-2">
            <article className="glass-card rounded-3xl p-5">
              <div className="overflow-hidden rounded-2xl border border-soft bg-slate-100 dark:bg-slate-900">
                <img
                  src={product.images[activeImage] ?? product.image}
                  alt={`${product.name} photo ${activeImage + 1}`}
                  className="aspect-square w-full object-cover"
                />
              </div>

              {product.images.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-xl border ${
                        activeImage === index ? 'border-fuchsia-500' : 'border-soft'
                      }`}
                    >
                      <img src={image} alt={`${product.name} miniature ${index + 1}`} className="h-20 w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </article>

            <article className="glass-card rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-500">{product.brand}</p>
              <h1 className="mt-2 text-3xl font-bold text-primary">{product.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-secondary">{product.description}</p>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                <span className="inline-flex items-center gap-1 text-amber-500">
                  <Star size={14} className="fill-current" /> {product.rating.toFixed(1)}
                </span>
                <span>({product.reviews} avis)</span>
                <span className="ml-auto">Stock: {product.stock}</span>
              </div>

              <div className="mt-5 flex items-end gap-3 border-y border-soft py-4">
                <p className="text-4xl font-extrabold text-primary">{formatPrice(product.price)}</p>
                {product.oldPrice ? <p className="text-base text-muted line-through">{formatPrice(product.oldPrice)}</p> : null}
              </div>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {product.specs.map((spec) => (
                  <li key={spec} className="inline-flex items-center gap-2 text-sm text-secondary">
                    <Check size={14} className="text-fuchsia-500" /> {spec}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-xl border border-soft bg-surface-strong px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-fuchsia-500/10"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-lg font-bold text-primary">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-fuchsia-500/10"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product, quantity)}
                  className="premium-btn flex-1 justify-center"
                >
                  <ShoppingCart size={16} /> Ajouter au panier
                </button>

                <button
                  type="button"
                  onClick={() => openWhatsApp(directOrderMessage)}
                  className="premium-btn-secondary flex-1 justify-center"
                >
                  <MessageCircle size={16} /> Commander via WhatsApp
                </button>
              </div>

              <div className="mt-6 grid gap-3 rounded-2xl border border-soft bg-surface p-4 text-sm">
                <p className="inline-flex items-center gap-2 text-secondary">
                  <Truck size={15} className="text-fuchsia-500" /> {STORE_INFO.deliveryLabel}
                </p>
                <p className="inline-flex items-center gap-2 text-secondary">
                  <ShieldCheck size={15} className="text-fuchsia-500" /> {STORE_INFO.paymentLabel}
                </p>
              </div>
            </article>
          </section>

          {relatedProducts.length > 0 ? (
            <section className="mt-14 pb-16">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-bold text-primary">Produits similaires</h2>
                <Link to="/shop" className="text-sm font-semibold text-fuchsia-500">
                  Voir plus
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}

