import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { STORE_INFO } from '../../data/store';
import type { Product } from '../../data/products';
import { formatPrice } from '../../utils/format';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

interface BudgetParseResult {
  value: number;
  raw: number;
  adjusted: boolean;
}

interface AssistantReply {
  text: string;
  suggestionHref: string;
}

interface RankedProduct {
  product: Product;
  score: number;
}

const categoryKeywords: { category: Product['category']; keywords: string[] }[] = [
  {
    category: 'iphones',
    keywords: ['telephone', 'talfoun', 'tlfn', 'tel', 'phone', 'smartphone', 'iphone', 'samsung', 'xiaomi', 'redmi', 'oppo', 'tecno'],
  },
  { category: 'cases', keywords: ['coque', 'case', 'anticase', 'cage', 'protection', 'verre', 'vitre', 'magsafe'] },
  { category: 'chargers', keywords: ['chargeur', 'charger', 'cable', 'type-c', 'type', 'usb', 'tube', 'charge'] },
  { category: 'headphones', keywords: ['ecouteur', 'buds', 'airpods', 'casque', 'headphone', 'audio', 'filaire', 'sans fil'] },
  { category: 'smartwatches', keywords: ['watch', 'montre', 'smartwatch'] },
  { category: 'powerbanks', keywords: ['power bank', 'powerbank', 'batterie externe'] },
  { category: 'speakers', keywords: ['baffle', 'speaker', 'bluetooth speaker'] },
  { category: 'accessories', keywords: ['accessoire', 'support', 'nettoyeur', 'kit'] },
];

const categorySearchTerms: Record<Product['category'], string> = {
  iphones: 'iphone',
  cases: 'coque',
  chargers: 'chargeur',
  headphones: 'ecouteur',
  smartwatches: 'watch',
  powerbanks: 'powerbank',
  speakers: 'baffle',
  accessories: 'accessoire',
};

const stopWords = new Set([
  'budget',
  'moins',
  'under',
  'max',
  'maximum',
  'prix',
  'price',
  'souma',
  'soum',
  'qadeh',
  '9adeh',
  'b9adeh',
  'bqadeh',
  'dt',
  'tnd',
  'dinar',
  'dinars',
  'nheb',
  'nhb',
  'chniya',
  'chnowa',
  'm3aya',
  'maaya',
  '3andi',
  'andi',
  'yansahni',
  'livraison',
  'delivery',
  'transport',
  'paiement',
  'cash',
  'cod',
  'bonjour',
  'salut',
  'hello',
  'salam',
  'asslema',
]);

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseBudget(message: string, minimumBudget: number): BudgetParseResult | null {
  const normalized = normalizeText(message).replace(/,/g, '.');
  const currencyValues = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*(?:dt|tnd|dinar|dinars)\b/g)]
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value));

  let values = currencyValues;
  const hasBudgetIntent = /\b(budget|moins|under|max|maximum|jusqua|jusqu|flous|m3aya|maaya|3andi|andi)\b/.test(normalized);

  if (values.length === 0 && hasBudgetIntent) {
    values = [...normalized.matchAll(/\b\d+(?:\.\d+)?\b/g)]
      .map((match) => Number(match[0]))
      .filter((value) => Number.isFinite(value));
  }

  if (values.length === 0) {
    const standalone = [...normalized.matchAll(/\b\d+(?:\.\d+)?\b/g)]
      .map((match) => Number(match[0]))
      .filter((value) => Number.isFinite(value));
    const looksLikeModel = /\b(iphone|galaxy|redmi|note|watch|s24|s23|s22)\b/.test(normalized);

    if (standalone.length === 1 && standalone[0] >= minimumBudget && !looksLikeModel) {
      values = standalone;
    }
  }

  if (values.length === 0) return null;

  const raw = Math.max(...values);
  return {
    raw,
    value: Math.max(minimumBudget, raw),
    adjusted: raw < minimumBudget,
  };
}

function detectCategory(message: string): Product['category'] | null {
  const normalized = normalizeText(message);
  const match = categoryKeywords.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
  return match?.category ?? null;
}

function extractSearchTokens(message: string): string[] {
  return normalizeText(message)
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function isDeliveryQuestion(normalized: string): boolean {
  return normalized.includes('livraison') || normalized.includes('delivery') || normalized.includes('transport');
}

function isPaymentQuestion(normalized: string): boolean {
  return normalized.includes('paiement') || normalized.includes('cash') || normalized.includes('cod') || normalized.includes('livraison');
}

function isGreeting(normalized: string): boolean {
  return /\b(bonjour|salut|hello|salam|asslema)\b/.test(normalized);
}

function isPriceQuestion(normalized: string): boolean {
  return /\b(prix|price|souma|soum|qadeh|9adeh|b9adeh|bqadeh)\b/.test(normalized);
}

function productSearchText(product: Product): string {
  return normalizeText(`${product.name} ${product.brand} ${product.category} ${product.description} ${product.specs.join(' ')}`);
}

function rankProducts(message: string, products: Product[], budget: BudgetParseResult | null): RankedProduct[] {
  const category = detectCategory(message);
  const tokens = extractSearchTokens(message);

  return products
    .map((product) => {
      const searchable = productSearchText(product);
      const normalizedName = normalizeText(product.name);
      const normalizedBrand = normalizeText(product.brand);
      let score = product.rating * 1.5 + product.reviews * 0.01;

      if (category && product.category === category) score += 18;

      tokens.forEach((token) => {
        if (normalizedName.includes(token)) score += 9;
        else if (normalizedBrand.includes(token)) score += 7;
        else if (searchable.includes(token)) score += 3;
      });

      if (budget) {
        if (product.price <= budget.value) {
          score += 24 - Math.min(8, (budget.value - product.price) / 250);
        } else {
          score -= Math.min(22, (product.price - budget.value) / 95);
        }
      }

      if (product.stock > 0) score += 2;
      else score -= 8;
      if (product.isBestSeller) score += 3;
      if (product.isNew) score += 1;

      return { product, score };
    })
    .sort((a, b) => b.score - a.score);
}

function productSummary(product: Product, budget: BudgetParseResult | null): string {
  const budgetLine = budget
    ? product.price <= budget.value
      ? `Yodkhol fi budget ${formatPrice(budget.value)}.`
      : `Fouq budget ${formatPrice(budget.value)}, ama akreb choix ken theb upgrade.`
    : 'Najm nanshek bih ken budgetek ywasel.';

  return `${product.name}: ${formatPrice(product.price)}.\n${product.description}\nSpecs: ${product.specs.slice(0, 3).join(', ')}.\n${budgetLine}`;
}

function recommendationLine(product: Product, index: number): string {
  const specHint = product.specs.slice(0, 2).join(', ');
  return `${index + 1}. ${product.name} - ${formatPrice(product.price)} (${specHint || product.brand})`;
}

function buildRecommendationReply(
  message: string,
  products: Product[],
  budget: BudgetParseResult | null,
  minimumBudget: number,
): AssistantReply {
  const category = detectCategory(message);
  const ranked = rankProducts(message, products, budget);
  const inBudget = budget ? ranked.filter((entry) => entry.product.price <= budget.value) : ranked;
  const selected = (inBudget.length > 0 ? inBudget : ranked).slice(0, 3);
  const topProduct = selected[0]?.product;
  const budgetNote = budget?.adjusted
    ? `Budget minimum houwa ${formatPrice(minimumBudget)}, donc khdhit ${formatPrice(minimumBudget)} comme base.\n`
    : budget
      ? `Hasb budget ${formatPrice(budget.value)}:\n`
      : 'Hedhi akther choix nanshek bihom:\n';

  if (!topProduct) {
    return {
      text: 'Ma l9itech produit ymatchi l demande. Jarreb kteb budget wala categorie kima iPhone, chargeur, smartwatch, powerbank, baffle.',
      suggestionHref: '/shop',
    };
  }

  const noExactBudget = budget && inBudget.length === 0;
  const prefix = noExactBudget
    ? `${budgetNote}Ma l9itech produit taht el budget hedha. Akreb produits disponibles:\n`
    : budgetNote;

  return {
    text: `${prefix}${selected.map((entry, index) => recommendationLine(entry.product, index)).join('\n')}\n\nTop pick: ${
      topProduct.name
    } خاطر rapport prix/specs behi.`,
    suggestionHref: category ? `/shop?q=${encodeURIComponent(categorySearchTerms[category])}` : `/product/${topProduct.id}`,
  };
}

function buildAssistantReply(message: string, products: Product[], minimumBudget: number): AssistantReply {
  const normalized = normalizeText(message);
  const budget = parseBudget(message, minimumBudget);
  const category = detectCategory(message);
  const tokens = extractSearchTokens(message);
  const hasCatalogIntent = Boolean(budget || category || tokens.length > 0 || isPriceQuestion(normalized));

  if (products.length === 0) {
    return {
      text: 'Le catalogue est vide pour le moment. Ajoute des produits dans admin, w baad nanshek hasb budgetek.',
      suggestionHref: '/shop',
    };
  }

  if (isDeliveryQuestion(normalized) && !hasCatalogIntent) {
    return {
      text: 'Livraison rapide sur toute la Tunisie en 24-72h selon la ville. Confirmation via WhatsApp.',
      suggestionHref: '/contact',
    };
  }

  if (isPaymentQuestion(normalized) && !hasCatalogIntent) {
    return {
      text: 'Paiement a la livraison. El client ykhaless ki yestlem el commande.',
      suggestionHref: '/checkout',
    };
  }

  const ranked = rankProducts(message, products, budget);
  const bestMatch = ranked[0];

  if (isPriceQuestion(normalized) && (tokens.length > 0 || category) && bestMatch && bestMatch.score >= 13) {
    return {
      text: productSummary(bestMatch.product, budget),
      suggestionHref: `/product/${bestMatch.product.id}`,
    };
  }

  if (budget || category || tokens.length > 0) {
    return buildRecommendationReply(message, products, budget, minimumBudget);
  }

  if (isGreeting(normalized)) {
    return {
      text: `Ahla. Aatini budgetek mel ${formatPrice(minimumBudget)} w fou9, wala 9olli chnowa t7eb: iPhone, chargeur, ecouteur, smartwatch, powerbank... w nanshek b produit w prix.`,
      suggestionHref: '/shop',
    };
  }

  return {
    text: `Najm nanshek hasb budgetek w produits Fifty Store. Exemple: "budget 150 DT chargeur" wala "prix iPhone 15". Budget minimum: ${formatPrice(
      minimumBudget,
    )}.`,
    suggestionHref: '/shop',
  };
}

export default function AIAssistantWidget() {
  const { products, aiMinBudget } = useCatalog();
  const quickPrompts = [`Budget ${aiMinBudget} DT`, 'iPhone 1500 DT', 'Chargeur moins 150 DT', 'Powerbank'];
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [suggestionHref, setSuggestionHref] = useState('/shop');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Ahla. Aatini budgetek mel ${formatPrice(aiMinBudget)} w nanshek b produit w prix.`,
    },
  ]);

  const canSend = input.trim().length > 0 && !typing;

  useEffect(() => {
    setMessages((current) => {
      if (current.length !== 1 || current[0].id !== 'welcome') return current;

      return [
        {
          ...current[0],
          text: `Ahla. Aatini budgetek mel ${formatPrice(aiMinBudget)} w nanshek b produit w prix.`,
        },
      ];
    });
  }, [aiMinBudget]);

  const handleSend = (text?: string) => {
    const content = (text || input).trim();
    if (!content || typing) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: content,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setTyping(true);

    window.setTimeout(() => {
      const assistantReply = buildAssistantReply(content, products, aiMinBudget);
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: assistantReply.text,
      };
      setSuggestionHref(assistantReply.suggestionHref);
      setMessages((current) => [...current, reply]);
      setTyping(false);
    }, 640);
  };

  return (
    <div className="fixed bottom-5 right-4 z-[75] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open ? (
          <motion.section
            key="assistant-panel"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
            className="frost-panel mouse-follow-glow mb-3 w-[min(92vw,380px)] overflow-hidden rounded-3xl border border-soft shadow-2xl"
            onMouseMove={(event) => {
              const target = event.currentTarget;
              const rect = target.getBoundingClientRect();
              target.style.setProperty('--mx', `${event.clientX - rect.left}px`);
              target.style.setProperty('--my', `${event.clientY - rect.top}px`);
            }}
          >
            <header className="animated-light-sheen flex items-center justify-between border-b border-soft px-4 py-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles size={14} className="text-cyan-400" /> AI Assistant
              </p>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-soft bg-surface-strong text-primary"
                onClick={() => setOpen(false)}
                aria-label="Fermer assistant"
              >
                <X size={15} />
              </button>
            </header>

            <div className="max-h-[400px] space-y-2 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`ai-message-in max-w-[92%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'assistant'
                      ? 'bg-sky-500/15 text-primary'
                      : 'ml-auto bg-fuchsia-600 text-white'
                  }`}
                >
                  {message.text}
                </div>
              ))}

              {typing ? (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-500/15 px-3 py-2 text-xs text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 [animation-delay:240ms]" />
                </div>
              ) : null}
            </div>

            <div className="border-t border-soft px-4 py-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-soft bg-surface-strong px-3 py-1.5 text-xs font-semibold text-secondary hover:border-cyan-400/40"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleSend();
                  }}
                  placeholder="Budget, produit, prix..."
                  className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-2 text-sm text-primary outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!canSend}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white disabled:opacity-60"
                >
                  <Send size={15} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted">
                <Link to={suggestionHref} className="font-semibold text-cyan-400 hover:text-cyan-300">
                  Voir suggestion produits
                </Link>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  WhatsApp direct
                </a>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="sticky-cart-bubble relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/35 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Ouvrir assistant AI"
      >
        <Bot size={20} />
        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold">
          AI
        </span>
      </motion.button>

      {!open ? (
        <p className="mt-2 rounded-full bg-surface/95 px-3 py-1 text-[11px] font-semibold text-primary shadow-premium">
          <MessageCircle size={12} className="mr-1 inline text-cyan-400" /> Besoin d'aide ?
        </p>
      ) : null}
    </div>
  );
}
