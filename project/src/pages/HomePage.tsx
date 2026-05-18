import { ArrowRight, MessageCircle, ShieldCheck, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DeliverySection from '../components/DeliverySection';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import StoreLocation from '../components/StoreLocation';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';
import { faqs, products, testimonials } from '../data/products';
import { STORE_INFO } from '../data/store';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 550);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const bestSellers = useMemo(() => products.filter((product) => product.isBestSeller).slice(0, 8), []);
  const newArrivals = useMemo(() => products.filter((product) => product.isNew).slice(0, 4), []);

  return (
    <>
      <Seo
        title="Smartphones et accessoires en Tunisie"
        description="Fifty Store: boutique tunisienne de telephones et accessoires premium avec livraison sur toute la Tunisie et paiement a la livraison."
        path="/"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-soft bg-surface-strong p-8 shadow-premium sm:p-12">
            <div className="hero-ambient absolute inset-0" />
            <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-orange-400/25 blur-3xl" />
            <div className="absolute left-1/3 top-16 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p
                  className="hero-fade-up hero-badge-pulse inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-fuchsia-500"
                  style={{ animationDelay: '40ms' }}
                >
                  🚚 Livraison rapide sur toute la Tunisie
                </p>

                <h1
                  className="hero-fade-up mt-5 text-4xl font-bold leading-tight text-primary sm:text-5xl lg:text-6xl"
                  style={{ animationDelay: '140ms' }}
                >
                  Smartphones & accessoires premium,
                  <br />
                  <span className="hero-gradient-text hero-electric-glow">livrés partout en Tunisie</span>
                </h1>

                <p
                  className="hero-fade-up mt-5 max-w-xl text-base leading-relaxed text-secondary sm:text-lg"
                  style={{ animationDelay: '240ms' }}
                >
                  Découvrez les meilleurs smartphones, chargeurs, coques, écouteurs et accessoires gaming avec
                  prix compétitifs en TND, paiement à la livraison et commande rapide via WhatsApp.
                </p>

                <div className="hero-fade-up mt-7 flex flex-wrap gap-3" style={{ animationDelay: '320ms' }}>
                  <Link to="/shop" className="premium-btn hero-cta-glow">
                    Explorer les offres
                    <ArrowRight size={16} />
                  </Link>
                  <a
                    href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-btn-secondary"
                  >
                    <MessageCircle size={16} /> Commander sur WhatsApp
                  </a>
                </div>

                <div className="hero-fade-up mt-8 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2" style={{ animationDelay: '420ms' }}>
                  <div className="glass-card hero-card-pop rounded-2xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-primary">500+</p>
                    <p className="text-muted">Clients satisfaits</p>
                  </div>
                  <div className="glass-card hero-card-pop rounded-2xl p-4 text-center" style={{ animationDelay: '560ms' }}>
                    <p className="text-2xl font-extrabold text-primary">22</p>
                    <p className="text-muted">Produits disponibles</p>
                  </div>
                </div>

                <div className="hero-fade-up mt-4 inline-flex items-center gap-2 rounded-full border border-soft bg-surface-strong px-4 py-2 text-xs font-semibold text-secondary" style={{ animationDelay: '520ms' }}>
                  Date: {new Intl.DateTimeFormat('fr-TN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(now)}
                  <span className="text-muted">|</span>
                  Heure:{' '}
                  {new Intl.DateTimeFormat('fr-TN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }).format(now)}
                </div>
              </div>

              <div className="hero-fade-up relative" style={{ animationDelay: '260ms' }}>
                <div className="hero-image-float hero-image-glow overflow-hidden rounded-3xl border border-soft">
                  <div className="relative flex min-h-[360px] items-center justify-center bg-gradient-to-br from-slate-100 via-white to-fuchsia-100 dark:from-slate-900 dark:via-slate-800 dark:to-fuchsia-950/40 sm:min-h-[430px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.14),transparent_56%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15),transparent_40%)]" />
                    <img
                      src="/fifty-store-logo.png"
                      alt="Logo Fifty Store"
                      className="relative h-44 w-44 rounded-full border-4 border-white/70 object-cover shadow-2xl shadow-black/35 sm:h-56 sm:w-56"
                    />
                  </div>
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
                  Produits garantis
                </div>
              </div>
            </div>
          </div>
        </section>

        <DeliverySection />

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Top ventes</p>
              <h2 className="mt-2 text-3xl font-bold text-primary">Best sellers</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-fuchsia-500 hover:text-fuchsia-400">
              Voir tout
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

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

            <article className="glass-card rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Confiance clients</p>
              <h3 className="mt-2 text-2xl font-bold text-primary">Avis recents</h3>
              <div className="mt-5 grid gap-3">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="card-strong rounded-2xl p-4">
                    <div className="mb-2 flex items-center gap-1 text-amber-400">
                      {Array.from({ length: testimonial.rating }).map((_, index) => (
                        <Star key={`${testimonial.id}-${index}`} size={14} className="fill-current" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-secondary">"{testimonial.text}"</p>
                    <p className="mt-3 text-xs font-semibold text-primary">
                      {testimonial.name} - {testimonial.city}
                    </p>
                  </div>
                ))}
              </div>
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
                  <ShieldCheck size={16} className="mt-0.5 text-fuchsia-500" />
                  Produits testes et selectionnes pour une qualite stable.
                </li>
                <li className="inline-flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 text-fuchsia-500" />
                  Confirmation rapide et suivi de commande via WhatsApp.
                </li>
                <li className="inline-flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 text-fuchsia-500" />
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

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <StoreLocation />
        </section>
      </div>
    </>
  );
}

