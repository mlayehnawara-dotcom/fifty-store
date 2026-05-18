import { CheckCircle2, MessageCircle, PackageCheck, ShieldCheck, Truck } from 'lucide-react';

const items = [
  {
    title: 'Livraison sur toute la Tunisie',
    description: 'Service disponible pour toutes les regions avec suivi simple.',
    icon: Truck,
  },
  {
    title: 'Paiement a la livraison',
    description: 'Payez a la reception de votre commande en toute confiance.',
    icon: CheckCircle2,
  },
  {
    title: 'Confirmation via WhatsApp',
    description: 'Validation rapide de la commande et suivi direct avec notre equipe.',
    icon: MessageCircle,
  },
  {
    title: 'Expedition rapide',
    description: 'Preparation rapide et remise au transporteur dans les meilleurs delais.',
    icon: PackageCheck,
  },
  {
    title: 'Packaging securise',
    description: 'Protection soignee des produits pour eviter les chocs.',
    icon: ShieldCheck,
  },
];

export default function DeliverySection() {
  return (
    <section className="section-divider py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Livraison & service</p>
            <h2 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">Un service premium partout en Tunisie</h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="glass-card rounded-2xl p-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-500 dark:bg-fuchsia-500/20 dark:text-fuchsia-300">
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

