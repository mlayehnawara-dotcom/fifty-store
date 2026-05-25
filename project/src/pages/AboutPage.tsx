import {
  BadgeCheck,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Truck,
} from 'lucide-react';
import DeliverySection from '../components/DeliverySection';
import Seo from '../components/Seo';
import StoreLocation from '../components/StoreLocation';
import { STORE_INFO, STORE_LOCATION } from '../data/store';

const storeAnswers = [
  {
    question: 'شكون Fifty Store؟',
    answer:
      'Boutique tunisienne fondée par Wissem Loueti, spécialisée dans les iPhone, smartwatches et accessoires utiles au quotidien.',
    icon: Smartphone,
  },
  {
    question: 'وين تلقانا؟',
    answer: `${STORE_LOCATION.address}. تنجم تزورنا، تكلمنا، ولا تبعث message على WhatsApp قبل ما تطلب.`,
    icon: MapPin,
  },
  {
    question: 'علاش تثق فينا؟',
    answer:
      'Prix et caractéristiques visibles, confirmation de commande directe et paiement à la livraison partout en Tunisie.',
    icon: ShieldCheck,
  },
];

const trustReasons = [
  {
    title: 'Produit clair avant l achat',
    description: 'السوم، المواصفات والstock ظاهرين قبل ما تقرر.',
    icon: BadgeCheck,
  },
  {
    title: 'Conseil sur WhatsApp',
    description: 'قلنا budgetek واستعمالك، ونوجهوك للمنتج المناسب.',
    icon: MessageCircle,
  },
  {
    title: 'Paiement à la réception',
    description: 'تخلّص كي توصلك commande، بطريقة بسيطة ومطمئنة.',
    icon: PackageCheck,
  },
  {
    title: 'Livraison en Tunisie',
    description: 'الطلبية تتأكد وتتبعها بسهولة لأي ولاية.',
    icon: Truck,
  },
];

export default function AboutPage() {
  return (
    <>
      <Seo
        title="A propos"
        description="Fifty Store a Jemmel, Monastir: iPhone et accessoires avec conseil WhatsApp, livraison en Tunisie et paiement a la livraison."
        path="/about"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-5 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">À propos de Fifty Store</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-primary sm:text-5xl">
              قلي budgetek، نلقالك لقطة.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
              {STORE_INFO.name} هي boutique tech تونسية في Jemmel، Monastir. نختارولك iPhone ولا accessoires
              حسب احتياجك، بسوم واضح وخدمة قريبة منك.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
                  'Bonjour Fifty Store, nheb نستفسر على produit.',
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn"
              >
                <MessageCircle size={16} /> احكينا على WhatsApp
              </a>
              <a
                href={STORE_LOCATION.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-btn-secondary"
              >
                <MapPin size={16} /> شوف العنوان
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-soft bg-surface p-5 shadow-premium sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Fifty Store en bref</p>
            <dl className="mt-5 space-y-4">
              <div className="border-b border-soft pb-4">
                <dt className="text-xs font-semibold uppercase text-muted">Responsable</dt>
                <dd className="mt-1 text-lg font-semibold text-primary">{STORE_INFO.founder}</dd>
              </div>
              <div className="border-b border-soft pb-4">
                <dt className="text-xs font-semibold uppercase text-muted">Boutique</dt>
                <dd className="mt-1 text-lg font-semibold text-primary">{STORE_LOCATION.address}</dd>
              </div>
              <div className="border-b border-soft pb-4">
                <dt className="text-xs font-semibold uppercase text-muted">Contact direct</dt>
                <dd className="mt-1 text-lg font-semibold text-primary">{STORE_INFO.phoneDisplay}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-muted">Service</dt>
                <dd className="mt-1 text-sm font-semibold text-primary">
                  {STORE_INFO.deliveryLabel} · {STORE_INFO.paymentLabel}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="section-divider py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {storeAnswers.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.question} className="glass-card rounded-2xl p-6">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-500">
                      <Icon size={21} />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-primary">{item.question}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-7 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Confiance</p>
            <h2 className="mt-2 text-3xl font-bold text-primary">الثقة بالفعل، موش بالكلام</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              قبل ما تشري، عندك التفاصيل والتواصل والعنوان. ما تضيعش وقتك، اختار الصح.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <article key={reason.title} className="rounded-2xl border border-soft bg-surface p-5">
                  <Icon size={21} className="text-fuchsia-500" />
                  <h3 className="mt-3 text-base font-bold text-primary">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{reason.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <DeliverySection />

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Notre adresse</p>
            <h2 className="mt-2 text-3xl font-bold text-primary">عدّي علينا ولا كلّمنا مباشرة</h2>
          </div>
          <StoreLocation />
        </section>
      </div>
    </>
  );
}
