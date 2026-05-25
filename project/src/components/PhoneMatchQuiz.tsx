import { Camera, Gamepad2, GraduationCap, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import type { Product } from '../data/products';
import { formatPrice } from '../utils/format';
import { getBatterySpec, getCameraSpec, getStorageSpec, isPhoneProduct } from '../utils/productInsights';
import OptimizedImage from './ui/OptimizedImage';

type QuizUsage = 'daily' | 'photo' | 'study' | 'gaming';

const usageOptions: { id: QuizUsage; label: string; icon: typeof Sparkles }[] = [
  { id: 'daily', label: 'Kol youm', icon: Sparkles },
  { id: 'photo', label: 'Photo', icon: Camera },
  { id: 'study', label: 'Study', icon: GraduationCap },
  { id: 'gaming', label: 'Gaming usage', icon: Gamepad2 },
];

function scorePhone(product: Product, budget: number, usage: QuizUsage): number {
  const specs = `${product.specs.join(' ')} ${product.description}`.toLowerCase();
  let score = product.rating * 10 + product.reviews * 0.02;

  if (product.price <= budget) {
    score += 30 - Math.min(10, (budget - product.price) / 250);
  } else {
    score -= Math.min(35, (product.price - budget) / 90);
  }

  if (usage === 'photo' && (specs.includes('camera') || specs.includes('48 mp') || specs.includes('triple'))) score += 16;
  if (usage === 'study' && (specs.includes('batterie') || specs.includes('128gb') || specs.includes('256gb'))) score += 14;
  if (usage === 'gaming' && (specs.includes('120hz') || specs.includes('a15') || specs.includes('a16'))) score += 16;
  if (usage === 'daily' && (specs.includes('face id') || specs.includes('compact') || specs.includes('journee'))) score += 12;
  if (product.stock > 0) score += 4;
  if (product.isBestSeller) score += 5;

  return score;
}

export default function PhoneMatchQuiz() {
  const { products, aiMinBudget } = useCatalog();
  const [budget, setBudget] = useState(() => Math.max(aiMinBudget, 1500));
  const [usage, setUsage] = useState<QuizUsage>('daily');

  const maxBudget = Math.max(5000, budget, aiMinBudget);
  const recommendations = useMemo(() => {
    const phones = products.filter(isPhoneProduct);
    const ranked = phones
      .map((product) => ({ product, score: scorePhone(product, budget, usage) }))
      .sort((a, b) => b.score - a.score);

    const inBudget = ranked.filter((entry) => entry.product.price <= budget);
    return (inBudget.length > 0 ? inBudget : ranked).slice(0, 3);
  }, [products, budget, usage]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <article className="frost-panel futuristic-border rounded-3xl p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-500">
              <Sparkles size={14} /> Quiz Fifty
            </p>
            <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">شنوة التليفون اللي يركّب عليك؟</h2>
            <p className="mt-2 text-sm text-muted">قلي budgetek واستعمالك، نلقالك لقطة بلا وجيعة راس.</p>
          </div>
          <span className="rounded-full border border-soft bg-surface-strong px-3 py-1 text-xs font-semibold text-secondary">
            “قلي budgetek، نلقالك لقطة”
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-soft bg-surface-strong p-4">
              <label className="text-sm font-semibold text-secondary">Budget: {formatPrice(budget)}</label>
              <input
                type="range"
                min={aiMinBudget}
                max={maxBudget}
                step={50}
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-fuchsia-500/30"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{formatPrice(aiMinBudget)}</span>
                <span>{formatPrice(maxBudget)}</span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {usageOptions.map((option) => {
                const Icon = option.icon;
                const active = usage === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setUsage(option.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      active ? 'border-fuchsia-400/45 bg-fuchsia-500/15 text-primary' : 'border-soft bg-surface-strong text-secondary'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-semibold">
                      <Icon size={16} className={active ? 'text-fuchsia-400' : 'text-muted'} /> {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3">
            {recommendations.map((entry, index) => (
              <article key={entry.product.id} className="card-strong rounded-2xl border border-soft p-3">
                <div className="flex items-center gap-3">
                  <OptimizedImage
                    src={entry.product.image}
                    alt={entry.product.name}
                    className="h-16 w-16 rounded-xl object-cover"
                    sizes="64px"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fuchsia-500">
                      {index === 0 ? 'Top match' : `Option ${index + 1}`}
                    </p>
                    <h3 className="line-clamp-1 text-sm font-bold text-primary">{entry.product.name}</h3>
                    <p className="text-xs text-muted">
                      {getCameraSpec(entry.product)} · {getBatterySpec(entry.product)} · {getStorageSpec(entry.product)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{formatPrice(entry.product.price)}</p>
                    <Link to={`/product/${entry.product.id}`} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                      Voir
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            {recommendations.length === 0 ? (
              <div className="rounded-2xl border border-soft bg-surface-strong p-6 text-center text-sm text-muted">
                Ma fama hata iPhone disponible tawa. Zid article mel admin w yarja3lek quiz bel jaw.
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </section>
  );
}
