import {
  ArrowLeft,
  Check,
  Flame,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import { useCatalog } from '../context/CatalogContext';
import { useCart } from '../context/CartContext';
import { STORE_INFO } from '../data/store';
import { addRecentlyViewed } from '../utils/recentlyViewed';
import { formatPrice } from '../utils/format';
import { buildDirectProductMessage, openWhatsApp } from '../utils/whatsapp';
import OptimizedImage from '../components/ui/OptimizedImage';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { products } = useCatalog();

  const productId = Number(id);
  const product = products.find((item) => item.id === productId);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    addRecentlyViewed(product.id);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  }, [product, products]);

  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id)
      .sort((a, b) => {
        const scoreA = Number(a.brand === product.brand) * 3 + a.rating + (a.isBestSeller ? 2 : 0);
        const scoreB = Number(b.brand === product.brand) * 3 + b.rating + (b.isBestSeller ? 2 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 4);
  }, [product, products]);

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

  const directOrderMessage = buildDirectProductMessage(product, quantity);

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
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400">
            <ArrowLeft size={14} /> Retour boutique
          </Link>

          <section className="mt-5 grid gap-8 lg:grid-cols-2">
            <article className="glass-card rounded-3xl p-5">
              <div className="overflow-hidden rounded-2xl border border-soft bg-slate-100 dark:bg-slate-900">
                <OptimizedImage
                  src={product.images[activeImage] ?? product.image}
                  alt={`${product.name} photo ${activeImage + 1}`}
                  className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
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
                        activeImage === index ? 'border-cyan-400' : 'border-soft'
                      }`}
                    >
                      <OptimizedImage
                        src={image}
                        alt={`${product.name} miniature ${index + 1}`}
                        className="h-20 w-full object-cover"
                        sizes="120px"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              {product.videoUrl ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-soft bg-black">
                  <iframe
                    src={product.videoUrl}
                    title={`${product.name} video`}
                    className="aspect-video w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </article>

            <article className="glass-card rounded-3xl p-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Flame size={13} /> Produit premium tendance
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">{product.brand}</p>
              <h1 className="mt-2 text-3xl font-bold text-primary">{product.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-secondary">{product.description}</p>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                <span className="inline-flex items-center gap-1 text-amber-500">
                  <Star size={14} className="fill-current" /> {product.rating.toFixed(1)}
                </span>
                <span>({product.reviews} avis)</span>
                <span className="ml-auto text-cyan-400">Stock: {product.stock}</span>
              </div>

              <div className="mt-5 flex items-end gap-3 border-y border-soft py-4">
                <p className="text-4xl font-extrabold text-primary">{formatPrice(product.price)}</p>
                {product.oldPrice ? <p className="text-base text-muted line-through">{formatPrice(product.oldPrice)}</p> : null}
              </div>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {product.specs.map((spec) => (
                  <li key={spec} className="inline-flex items-center gap-2 text-sm text-secondary">
                    <Check size={14} className="text-cyan-400" /> {spec}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-xl border border-soft bg-surface-strong px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-cyan-500/10"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-lg font-bold text-primary">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-cyan-500/10"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button type="button" onClick={() => addToCart(product, quantity)} className="premium-btn flex-1 justify-center">
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
                  <Truck size={15} className="text-cyan-400" /> {STORE_INFO.deliveryLabel}
                </p>
                <p className="inline-flex items-center gap-2 text-secondary">
                  <ShieldCheck size={15} className="text-cyan-400" /> {STORE_INFO.paymentLabel}
                </p>
              </div>
            </article>
          </section>

          {relatedProducts.length > 0 ? (
            <section className="mt-14">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-bold text-primary">Produits similaires</h2>
                <Link to="/shop" className="text-sm font-semibold text-cyan-400">
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

          {recommendedProducts.length > 0 ? (
            <section className="mt-14 pb-16">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-bold text-primary">Recommandes pour vous</h2>
                <Link to="/shop" className="text-sm font-semibold text-cyan-400">
                  Explorer
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {recommendedProducts.map((recommended) => (
                  <ProductCard key={recommended.id} product={recommended} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
