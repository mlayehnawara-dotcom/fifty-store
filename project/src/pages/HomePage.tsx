import { ArrowRight, Flame, MessageCircle, ShieldCheck, Star, TrendingUp } from 'lucide-react';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { BadgePercent, CreditCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import MagneticButton from '../components/animations/MagneticButton';
import Reveal from '../components/animations/Reveal';
import OptimizedImage from '../components/ui/OptimizedImage';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';
import { useCatalog } from '../context/CatalogContext';
import { faqs } from '../data/products';
import { STORE_INFO } from '../data/store';
import { formatPrice } from '../utils/format';
import { readRecentlyViewed } from '../utils/recentlyViewed';
import { buildDirectProductMessage, openWhatsApp } from '../utils/whatsapp';

// Deferred below-the-fold sections keep the first render lighter in production.
const AIProductRecommender = lazy(() => import('../components/AIProductRecommender'));
const DeliverySection = lazy(() => import('../components/DeliverySection'));
const InstagramShowcase = lazy(() => import('../components/InstagramShowcase'));
const PhoneMatchQuiz = lazy(() => import('../components/PhoneMatchQuiz'));
const SetupBuilder = lazy(() => import('../components/SetupBuilder'));
const StoreLocation = lazy(() => import('../components/StoreLocation'));

const tunisianSlogans = [
  'سوم يفرّح و livraison تاقفة',
  'قلي budgetek، نلقالك لقطة',
  'ما تضيعش وقتك، اختار الصح',
  'Deal سخون قبل ما يبرد',
  'تليفونك الجاي؟ خلّيه علينا',
  'أسعار ما تتعاودش كل نهار',
  'Pack كامل، وجيبتو خفيفة',
  'Fifty Store: تشوف، تختار، توصلك',
];

function DeferredSectionFallback() {
  return <div className="mx-auto my-8 h-24 max-w-7xl animate-pulse rounded-3xl border border-soft bg-surface-strong/60" />;
}

export default function HomePage() {
  const { products, loading } = useCatalog();
  const [recentIds, setRecentIds] = useState<number[]>([]);

  useEffect(() => {
    setRecentIds(readRecentlyViewed());
  }, []);

  const bestSellers = useMemo(() => products.filter((product) => product.isBestSeller).slice(0, 8), [products]);
  const newArrivals = useMemo(() => products.filter((product) => product.isNew).slice(0, 4), [products]);
  const featuredDeals = useMemo(
    () =>
      products
        .filter((product) => Boolean(product.discount))
        .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
        .slice(0, 3),
    [products],
  );
  const heroProduct = bestSellers[0] ?? products[0];
  const maxDiscount = featuredDeals[0]?.discount ?? 0;
  const productOfTheDay = featuredDeals[0] ?? heroProduct;
  const trendingProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.rating * 100 + b.reviews - (a.rating * 100 + a.reviews))
        .slice(0, 4),
    [products],
  );

  const recentlyViewedProducts = useMemo(
    () =>
      recentIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is (typeof products)[number] => Boolean(product))
        .slice(0, 4),
    [recentIds, products],
  );

  return (
    <>
      <Seo
        title="iPhones et accessoires en Tunisie"
        description="Fifty Store: iPhones, smartwatches, chargeurs, anticases, powerbanks, ecouteurs et baffles avec livraison en Tunisie."
        path="/"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="frost-panel futuristic-border relative overflow-hidden rounded-[2rem] p-8 shadow-premium sm:p-12">
            <div className="ultra-grid-bg absolute inset-0 opacity-35" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
              <div>
                <Reveal>
                  <p className="hero-badge-pulse inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">
                    <Truck size={14} /> Livraison rapide sur toute la Tunisie
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  <h1 className="mt-5 text-4xl font-bold leading-tight text-primary sm:text-5xl lg:text-6xl">
                    iPhone et accessoires
                    <br />
                    <span className="hero-gradient-text hero-electric-glow">aux bons prix en Tunisie</span>
                  </h1>
                </Reveal>

                <Reveal delay={0.16}>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-secondary sm:text-lg">
                    تليفونك الجاي؟ خلّيه علينا. Découvrez nos iPhone, smartwatches et accessoires avec prix en TND,
                    paiement à la livraison et commande rapide via WhatsApp.
                  </p>
                </Reveal>

                <Reveal delay={0.24}>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <MagneticButton>
                      <Link to="/shop" className="premium-btn hero-cta-glow">
                        Explorer les offres
                        <ArrowRight size={16} />
                      </Link>
                    </MagneticButton>

                    <MagneticButton>
                      <a
                        href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="premium-btn-secondary"
                      >
                        <MessageCircle size={16} /> Commander sur WhatsApp
                      </a>
                    </MagneticButton>
                  </div>
                </Reveal>

                <Reveal delay={0.32}>
                  <div className="mt-8 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                    <div className="glass-card hero-card-pop rounded-2xl p-4 text-center">
                      <CreditCard size={20} className="mx-auto text-fuchsia-500" />
                      <p className="mt-2 font-bold text-primary">Paiement</p>
                      <p className="text-muted">à la livraison</p>
                    </div>
                    <div className="glass-card hero-card-pop rounded-2xl p-4 text-center">
                      <Truck size={20} className="mx-auto text-cyan-400" />
                      <p className="mt-2 font-bold text-primary">Livraison</p>
                      <p className="text-muted">toute la Tunisie</p>
                    </div>
                    <div className="glass-card hero-card-pop rounded-2xl p-4 text-center">
                      <MessageCircle size={20} className="mx-auto text-emerald-500" />
                      <p className="mt-2 font-bold text-primary">Conseil</p>
                      <p className="text-muted">sur WhatsApp</p>
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.16} className="relative">
                <div className="hero-image-float hero-image-glow animated-light-sheen overflow-hidden rounded-3xl border border-soft">
                  {heroProduct ? (
                    <Link to={`/product/${heroProduct.id}`} className="group relative block min-h-[400px] sm:min-h-[500px]">
                      <OptimizedImage
                        src={heroProduct.image}
                        alt={`${heroProduct.name} disponible chez Fifty Store`}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                        {heroProduct.discount ? (
                          <span className="inline-flex rounded-full bg-rose-500 px-3 py-1 text-xs font-bold">
                            -{heroProduct.discount}% Offre
                          </span>
                        ) : null}
                        <p className="mt-3 text-2xl font-bold">{heroProduct.name}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <p className="text-2xl font-extrabold">{formatPrice(heroProduct.price)}</p>
                          {heroProduct.oldPrice ? (
                            <p className="text-sm text-white/70 line-through">{formatPrice(heroProduct.oldPrice)}</p>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  ) : null}
                </div>

                <div className="hero-float-tag absolute -left-3 top-8 hidden rounded-2xl border border-soft bg-surface-strong px-4 py-3 text-xs font-semibold text-primary shadow-premium sm:block">
                  Paiement à la livraison
                </div>
                <div className="hero-float-tag absolute -right-3 top-16 hidden rounded-2xl border border-soft bg-surface-strong px-4 py-3 text-xs font-semibold text-primary shadow-premium sm:block [animation-delay:300ms]">
                  24-72h livraison
                </div>
                <div className="hero-float-tag absolute -left-2 bottom-20 hidden rounded-2xl border border-soft bg-surface-strong px-4 py-3 text-xs font-semibold text-primary shadow-premium sm:block [animation-delay:600ms]">
                  Support WhatsApp
                </div>
                <div className="hero-float-tag absolute right-4 -bottom-5 hidden rounded-2xl border border-soft bg-surface-strong px-4 py-3 text-xs font-semibold text-primary shadow-premium sm:block [animation-delay:900ms]">
                  Prix affichés en TND
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Reveal>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-500">
                  <BadgePercent size={14} /> Promotions
                </p>
                <h2 className="mt-2 text-3xl font-bold text-primary">
                  Deals à saisir {maxDiscount > 0 ? `jusqu'à -${maxDiscount}%` : ''}
                </h2>
                <p className="mt-2 text-sm text-muted">Prix promotionnels affichés directement sur les produits disponibles.</p>
              </div>
              <Link to="/shop" className="premium-btn-secondary">
                Toutes les offres <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : featuredDeals.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group grid grid-cols-[112px_1fr] overflow-hidden rounded-2xl border border-soft bg-surface transition hover:-translate-y-1 hover:shadow-premium"
                  >
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      className="h-full min-h-[128px] w-full object-cover transition duration-500 group-hover:scale-105"
                      sizes="112px"
                    />
                    <div className="flex min-w-0 flex-col justify-center p-4">
                      <p className="inline-flex w-fit items-center gap-1 rounded-full bg-rose-500 px-2 py-1 text-[11px] font-bold text-white">
                        <Flame size={12} /> -{product.discount}%
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-sm font-bold text-primary">{product.name}</h3>
                      <p className="mt-2 text-lg font-extrabold text-primary">{formatPrice(product.price)}</p>
                      {product.oldPrice ? (
                        <p className="text-xs text-muted line-through">{formatPrice(product.oldPrice)}</p>
                      ) : null}
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <Reveal>
            <article className="frost-panel rounded-3xl border border-soft p-4">
              <div className="flex flex-wrap items-center gap-2">
                {tunisianSlogans.map((slogan, index) => (
                  <span
                    key={slogan}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      index % 2 === 0 ? 'bg-fuchsia-500/15 text-fuchsia-500' : 'bg-cyan-500/15 text-cyan-400'
                    }`}
                  >
                    {slogan}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        </section>

        <Suspense fallback={<DeferredSectionFallback />}>
          <SetupBuilder />
        </Suspense>

        <Suspense fallback={<DeferredSectionFallback />}>
          <PhoneMatchQuiz />
        </Suspense>

        <Suspense fallback={<DeferredSectionFallback />}>
          <AIProductRecommender />
        </Suspense>

        <Suspense fallback={<DeferredSectionFallback />}>
          <DeliverySection />
        </Suspense>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Top ventes</p>
              <h2 className="mt-2 text-3xl font-bold text-primary">Best sellers</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
              Voir tout
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Tendance</p>
              <h2 className="mt-2 text-3xl font-bold text-primary">Produits trending</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-strong px-3 py-1 text-xs font-semibold text-secondary">
              <TrendingUp size={14} className="text-cyan-400" /> Sélection catalogue
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : trendingProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        {recentlyViewedProducts.length > 0 ? (
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Historique</p>
              <h2 className="mt-2 text-2xl font-bold text-primary">Produits consultes recemment</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyViewedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="glass-card rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Nouveautes</p>
              <h3 className="mt-2 text-2xl font-bold text-primary">Produits recents</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {loading
                  ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
                  : newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </article>

            <article className="glass-card overflow-hidden rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Produit du jour</p>
              <h3 className="mt-2 text-2xl font-bold text-primary">La sélection Fifty Store</h3>
              {productOfTheDay ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-[148px_1fr]">
                  <Link to={`/product/${productOfTheDay.id}`} className="overflow-hidden rounded-2xl border border-soft">
                    <OptimizedImage
                      src={productOfTheDay.image}
                      alt={productOfTheDay.name}
                      className="aspect-square h-full w-full object-cover transition duration-500 hover:scale-105"
                      sizes="148px"
                    />
                  </Link>
                  <div>
                    {productOfTheDay.discount ? (
                      <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
                        -{productOfTheDay.discount}%
                      </span>
                    ) : null}
                    <h4 className="mt-3 text-lg font-bold text-primary">{productOfTheDay.name}</h4>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {productOfTheDay.rating.toFixed(1)} ({productOfTheDay.reviews} avis)
                    </div>
                    <p className="mt-3 text-2xl font-extrabold text-primary">{formatPrice(productOfTheDay.price)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link to={`/product/${productOfTheDay.id}`} className="premium-btn-secondary !px-3 !py-2 text-xs">
                        Voir produit
                      </Link>
                      <button
                        type="button"
                        onClick={() => openWhatsApp(buildDirectProductMessage(productOfTheDay))}
                        className="premium-btn !px-3 !py-2 text-xs"
                      >
                        <MessageCircle size={14} /> Commander
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="glass-card rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">FAQ</p>
              <h3 className="mt-2 text-2xl font-bold text-primary">Questions frequentes</h3>
              <div className="mt-4 space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="card-strong rounded-xl p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-primary">{faq.question}</summary>
                    <p className="mt-2 text-sm text-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </article>

            <article className="glass-card rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Service & securite</p>
              <h3 className="mt-2 text-2xl font-bold text-primary">Pourquoi Fifty Store ?</h3>
              <ul className="mt-4 space-y-3 text-sm text-secondary">
                <li className="inline-flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 text-cyan-400" />
                  Produits testes et selectionnes pour une qualite stable.
                </li>
                <li className="inline-flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 text-cyan-400" />
                  Confirmation rapide et suivi de commande via WhatsApp.
                </li>
                <li className="inline-flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 text-cyan-400" />
                  Livraison nationale avec paiement a la reception.
                </li>
              </ul>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Bonjour%20Fifty%20Store,%20je%20souhaite%20commander.`}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn mt-5"
              >
                <MessageCircle size={16} /> Demarrer sur WhatsApp
              </a>
            </article>
          </div>
        </section>

        <Suspense fallback={<DeferredSectionFallback />}>
          <InstagramShowcase />
        </Suspense>

        <Suspense fallback={<DeferredSectionFallback />}>
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
            <StoreLocation />
          </section>
        </Suspense>
      </div>
    </>
  );
}
