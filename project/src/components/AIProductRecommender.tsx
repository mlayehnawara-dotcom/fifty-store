import { BrainCircuit, Camera, Gamepad2, Laptop2, Smartphone, Sparkles, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { formatPrice } from '../utils/format';
import OptimizedImage from './ui/OptimizedImage';

interface Preferences {
  performance: boolean;
  camera: boolean;
  battery: boolean;
  work: boolean;
}

const preferenceLabels = [
  { key: 'performance', label: 'Performance', icon: Gamepad2 },
  { key: 'camera', label: 'Camera quality', icon: Camera },
  { key: 'battery', label: 'Battery', icon: Zap },
  { key: 'work', label: 'Work / Study', icon: Laptop2 },
] as const;

export default function AIProductRecommender() {
  const { products, aiMinBudget } = useCatalog();
  const [budget, setBudget] = useState(() => Math.max(aiMinBudget, 300));
  const [preferences, setPreferences] = useState<Preferences>({
    performance: true,
    camera: false,
    battery: true,
    work: false,
  });

  useEffect(() => {
    setBudget((current) => (current < aiMinBudget ? aiMinBudget : current));
  }, [aiMinBudget]);

  const recommendations = useMemo(() => {
    const productPool = products;

    const scored = productPool.map((product) => {
      let score = product.rating * 10 + product.reviews * 0.03;

      const specsText = `${product.specs.join(' ')} ${product.description}`.toLowerCase();

      if (product.price <= budget) {
        score += 24;
      } else {
        score -= (product.price - budget) / 120;
      }

      if (preferences.performance && (specsText.includes('120hz') || specsText.includes('a15') || specsText.includes('a16'))) {
        score += 14;
      }

      if (preferences.camera && (specsText.includes('camera') || specsText.includes('mp') || specsText.includes('leica'))) {
        score += 12;
      }

      if (preferences.battery && (specsText.includes('5000') || specsText.includes('5100') || specsText.includes('autonomie'))) {
        score += 12;
      }

      if (preferences.work && (specsText.includes('nfc') || specsText.includes('5g') || specsText.includes('256gb'))) {
        score += 10;
      }

      if (product.isBestSeller) score += 8;
      if (product.isNew) score += 5;

      return { product, score };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);
    const inBudget = sorted.filter((entry) => entry.product.price <= budget);

    return (inBudget.length > 0 ? inBudget : sorted).slice(0, 3);
  }, [products, budget, preferences]);

  const topPick = recommendations[0]?.product;
  const maxBudget = Math.max(5000, aiMinBudget);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <article className="frost-panel futuristic-border rounded-3xl p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
              <BrainCircuit size={14} /> AI Recommender
            </p>
            <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">Trouve ton produit idéal</h2>
            <p className="mt-2 text-sm text-muted">Choisis ton budget a partir de {formatPrice(aiMinBudget)} et tes priorités.</p>
          </div>

          {topPick ? (
            <div className="rounded-2xl border border-cyan-400/35 bg-cyan-500/10 px-4 py-3 text-sm">
              <p className="font-semibold text-cyan-300">Top pick pour toi:</p>
              <p className="mt-1 font-bold text-primary">{topPick.name}</p>
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-soft bg-surface-strong p-4">
              <label className="text-sm font-semibold text-secondary">Budget: {formatPrice(budget)}</label>
              <input
                type="range"
                min={aiMinBudget}
                max={maxBudget}
                step={10}
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-cyan-500/30"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{formatPrice(aiMinBudget)}</span>
                <span>{formatPrice(maxBudget)}</span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {preferenceLabels.map((item) => {
                const Icon = item.icon;
                const active = preferences[item.key];

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setPreferences((current) => ({
                        ...current,
                        [item.key]: !current[item.key],
                      }))
                    }
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? 'border-cyan-400/45 bg-cyan-500/15 text-primary'
                        : 'border-soft bg-surface-strong text-secondary'
                    }`}
                  >
                    <p className="inline-flex items-center gap-2 text-sm font-semibold">
                      <Icon size={16} className={active ? 'text-cyan-400' : 'text-muted'} /> {item.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {recommendations.map((entry, index) => (
              <article key={entry.product.id} className="card-strong premium-hover-depth rounded-2xl border border-soft p-3">
                <div className="flex items-center gap-3">
                  <OptimizedImage
                    src={entry.product.image}
                    alt={entry.product.name}
                    className="h-14 w-14 rounded-xl object-cover"
                    sizes="56px"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-400">
                      {index === 0 ? (entry.product.price <= budget ? 'Best match' : 'Closest match') : `Option ${index + 1}`}
                    </p>
                    <h3 className="line-clamp-1 text-sm font-bold text-primary">{entry.product.name}</h3>
                    <p className="text-xs text-muted">{entry.product.brand}</p>
                  </div>
                  <p className="text-sm font-bold text-primary">{formatPrice(entry.product.price)}</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="inline-flex items-center gap-1 text-xs text-muted">
                    <Sparkles size={12} className="text-cyan-400" /> Score: {entry.score.toFixed(1)}
                  </p>
                  <Link to={`/product/${entry.product.id}`} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                    Voir produit
                  </Link>
                </div>
              </article>
            ))}

            {recommendations.length === 0 ? (
              <div className="rounded-2xl border border-soft bg-surface-strong p-6 text-center text-sm text-muted">
                <Smartphone size={22} className="mx-auto text-cyan-400" />
                Ajustez vos préférences pour obtenir une recommandation.
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </section>
  );
}
