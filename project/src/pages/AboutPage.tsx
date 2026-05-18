import { Award, ShieldCheck, Truck, Users } from 'lucide-react';
import DeliverySection from '../components/DeliverySection';
import Seo from '../components/Seo';
import StoreLocation from '../components/StoreLocation';
import { STORE_INFO } from '../data/store';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="A propos"
        description="Decouvrez Fifty Store, la boutique tunisienne fondee par Wissem Loueti pour smartphones et accessoires premium."
        path="/about"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <section className="glass-card rounded-3xl p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Notre histoire</p>
            <h1 className="mt-3 text-4xl font-bold text-primary">Fifty Store</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-secondary">
              Fifty Store est une boutique tunisienne specialisee dans les smartphones et accessoires tech. Le projet est
              fonde par {STORE_INFO.founder} avec un objectif clair: proposer des produits fiables, un conseil rapide et
              une experience client professionnelle pour toute la Tunisie.
            </p>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="glass-card rounded-2xl p-5">
              <Users className="text-fuchsia-500" />
              <h2 className="mt-3 text-lg font-bold text-primary">Relation client</h2>
              <p className="mt-2 text-sm text-muted">Support rapide et humain via WhatsApp et telephone.</p>
            </article>
            <article className="glass-card rounded-2xl p-5">
              <ShieldCheck className="text-fuchsia-500" />
              <h2 className="mt-3 text-lg font-bold text-primary">Qualite controlee</h2>
              <p className="mt-2 text-sm text-muted">Selection de references utiles et suivi apres-vente.</p>
            </article>
            <article className="glass-card rounded-2xl p-5">
              <Truck className="text-fuchsia-500" />
              <h2 className="mt-3 text-lg font-bold text-primary">Livraison nationale</h2>
              <p className="mt-2 text-sm text-muted">Service sur toute la Tunisie avec confirmation de commande.</p>
            </article>
            <article className="glass-card rounded-2xl p-5">
              <Award className="text-fuchsia-500" />
              <h2 className="mt-3 text-lg font-bold text-primary">Vision premium</h2>
              <p className="mt-2 text-sm text-muted">Design, conseil et logistique penses pour une vraie e-boutique.</p>
            </article>
          </section>

          <DeliverySection />

          <section className="mt-8">
            <StoreLocation />
          </section>
        </div>
      </div>
    </>
  );
}

