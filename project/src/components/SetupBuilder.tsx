import { Headphones, MessageCircle, PackagePlus, PlugZap, Smartphone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import type { Product, ProductCategory } from '../data/products';
import { formatPrice } from '../utils/format';
import { buildSetupMessage, openWhatsApp } from '../utils/whatsapp';
import OptimizedImage from './ui/OptimizedImage';

interface ProductPickerProps {
  icon: typeof Smartphone;
  label: string;
  products: Product[];
  value: number | '';
  required?: boolean;
  onChange: (id: number | '') => void;
}

function ProductPicker({ icon: Icon, label, products, value, required = false, onChange }: ProductPickerProps) {
  return (
    <label className="block">
      <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
        <Icon size={15} className="text-fuchsia-500" /> {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value ? Number(event.target.value) : '')}
        className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
      >
        {!required ? <option value="">Sans ajout</option> : null}
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - {formatPrice(product.price)}
          </option>
        ))}
      </select>
    </label>
  );
}

function filterByCategory(products: Product[], categories: ProductCategory[]): Product[] {
  return products.filter((product) => categories.includes(product.category) && product.stock > 0);
}

export default function SetupBuilder() {
  const { products } = useCatalog();
  const phones = useMemo(() => filterByCategory(products, ['iphones']), [products]);
  const cases = useMemo(() => filterByCategory(products, ['cases']), [products]);
  const chargers = useMemo(() => filterByCategory(products, ['chargers', 'powerbanks']), [products]);
  const audio = useMemo(() => filterByCategory(products, ['headphones', 'speakers']), [products]);

  const [phoneId, setPhoneId] = useState<number | ''>('');
  const [caseId, setCaseId] = useState<number | ''>('');
  const [chargerId, setChargerId] = useState<number | ''>('');
  const [audioId, setAudioId] = useState<number | ''>('');

  useEffect(() => {
    if (phones.length > 0 && !phones.some((product) => product.id === phoneId)) {
      setPhoneId(phones[0].id);
    }
  }, [phoneId, phones]);

  const selection = useMemo(() => {
    const selectedIds = [phoneId, caseId, chargerId, audioId].filter((id): id is number => typeof id === 'number');
    return selectedIds
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product));
  }, [audioId, caseId, chargerId, phoneId, products]);

  const total = selection.reduce((sum, product) => sum + product.price, 0);
  const selectedPhone = selection.find((product) => product.category === 'iphones');

  if (phones.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-7 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Build your setup</p>
        <h2 className="mt-2 text-3xl font-bold text-primary">Pack كامل، وجيبتو واضحة</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Choisissez votre iPhone et ses accessoires. Le total est calculé immédiatement et l'équipe confirme la
          disponibilité sur WhatsApp.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 rounded-2xl border border-soft bg-surface p-5 sm:grid-cols-2">
          <ProductPicker icon={Smartphone} label="iPhone" products={phones} value={phoneId} required onChange={setPhoneId} />
          <ProductPicker icon={PackagePlus} label="Coque / protection" products={cases} value={caseId} onChange={setCaseId} />
          <ProductPicker icon={PlugZap} label="Chargeur / powerbank" products={chargers} value={chargerId} onChange={setChargerId} />
          <ProductPicker icon={Headphones} label="Audio" products={audio} value={audioId} onChange={setAudioId} />
        </div>

        <aside className="rounded-2xl border border-soft bg-surface p-5">
          <div className="flex items-center gap-3">
            {selectedPhone ? (
              <OptimizedImage
                src={selectedPhone.image}
                alt={selectedPhone.name}
                className="h-16 w-16 rounded-xl object-cover"
                sizes="64px"
              />
            ) : null}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-fuchsia-500">Votre pack</p>
              <p className="mt-1 text-sm font-semibold text-primary">{selection.length} produit(s)</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-soft pt-4 text-sm">
            {selection.map((product) => (
              <div key={product.id} className="flex justify-between gap-3 text-secondary">
                <span className="line-clamp-1">{product.name}</span>
                <span className="shrink-0 font-semibold text-primary">{formatPrice(product.price)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-soft pt-4 text-lg font-bold text-primary">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Prix affiché sans remise inventée. Toute offre pack est confirmée directement par Fifty Store.
          </p>

          <button
            type="button"
            disabled={selection.length === 0}
            onClick={() => openWhatsApp(buildSetupMessage(selection))}
            className="premium-btn mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            <MessageCircle size={16} /> Commander le pack
          </button>
        </aside>
      </div>
    </section>
  );
}
