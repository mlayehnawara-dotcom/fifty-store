import { CheckCircle2, MessageCircle, ShoppingBag, Truck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import { useCart } from '../context/CartContext';
import { STORE_INFO, tunisianCities } from '../data/store';
import { createSupabaseOrder } from '../services/orderService';
import { formatPrice } from '../utils/format';
import { buildWhatsAppOrderMessage, openWhatsApp } from '../utils/whatsapp';

interface CheckoutForm {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

const DELIVERY_FEE = 8;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [completed, setCompleted] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });

  const orderTotal = totalPrice + (items.length > 0 ? DELIVERY_FEE : 0);

  const onFieldChange = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const hasMissingRequiredFields = !form.fullName.trim() || !form.phone.trim() || !form.city.trim() || !form.address.trim();

  const validateForm = () => {
    if (items.length === 0) {
      toast.error('Votre panier est vide.');
      return false;
    }

    if (hasMissingRequiredFields) {
      toast.error('Formulaire incomplet: veuillez remplir les champs obligatoires.');
      return false;
    }

    return true;
  };

  const handleWhatsAppCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    const whatsappMessage = buildWhatsAppOrderMessage(
      {
        fullName: form.fullName,
        phone: form.phone,
        city: form.city,
        address: form.address,
        notes: form.notes,
      },
      items,
      orderTotal,
    );

    const orderSaved = await createSupabaseOrder({
      fullName: form.fullName,
      phone: form.phone,
      city: form.city,
      address: form.address,
      notes: form.notes,
      items,
      total: orderTotal,
      paymentMethod: STORE_INFO.paymentLabel,
      deliveryMethod: STORE_INFO.deliveryLabel,
    });

    openWhatsApp(whatsappMessage);
    toast.success('Commande WhatsApp ouverte');
    if (orderSaved) {
      toast.success('Commande enregistree sur le serveur.');
    }
    clearCart(true);
    setCompleted(true);
  };

  const handleStandardConfirmation = async () => {
    if (!validateForm()) {
      return;
    }

    const orderSaved = await createSupabaseOrder({
      fullName: form.fullName,
      phone: form.phone,
      city: form.city,
      address: form.address,
      notes: form.notes,
      items,
      total: orderTotal,
      paymentMethod: STORE_INFO.paymentLabel,
      deliveryMethod: STORE_INFO.deliveryLabel,
    });

    toast.success('Commande enregistree. Notre equipe vous contacte sur WhatsApp.');
    if (orderSaved) {
      toast.success('Commande synchronisee avec la base de donnees.');
    }
    clearCart(true);
    setCompleted(true);
  };

  if (completed) {
    return (
      <>
        <Seo title="Commande confirmee" description="Votre commande Fifty Store a ete enregistree." path="/checkout" />
        <div className="page-bg flex min-h-screen items-center justify-center px-4 pt-28 sm:pt-32">
          <section className="glass-card w-full max-w-xl rounded-3xl p-10 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-primary">Commande confirmee</h1>
            <p className="mt-3 text-sm text-muted">
              Merci {form.fullName}. Votre demande a bien ete recue. Nous allons vous contacter rapidement au {form.phone}.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/" className="premium-btn">
                Retour accueil
              </Link>
              <Link to="/shop" className="premium-btn-secondary">
                Continuer mes achats
              </Link>
            </div>
          </section>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Seo title="Checkout" description="Finalisez votre commande Fifty Store." path="/checkout" />
        <div className="page-bg flex min-h-screen items-center justify-center px-4 pt-28 sm:pt-32">
          <section className="glass-card w-full max-w-xl rounded-3xl p-10 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-soft bg-surface">
              <ShoppingBag className="text-muted" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-primary">Votre panier est vide</h1>
            <p className="mt-3 text-sm text-muted">Ajoutez des produits avant de passer au checkout.</p>
            <Link to="/shop" className="premium-btn mt-6 inline-flex">
              Voir la boutique
            </Link>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Checkout" description="Finalisez votre commande Fifty Store et confirmez via WhatsApp." path="/checkout" />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
          <h1 className="text-3xl font-bold text-primary">Finaliser la commande</h1>
          <p className="mt-1 text-sm text-muted">Informations client + confirmation WhatsApp</p>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <section className="glass-card rounded-3xl p-6">
              <h2 className="text-xl font-bold text-primary">Informations de livraison</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-secondary">Nom complet *</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) => onFieldChange('fullName', event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="Exemple: Ahmed Ben Ali"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Telephone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => onFieldChange('phone', event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Ville *</label>
                  <select
                    value={form.city}
                    onChange={(event) => onFieldChange('city', event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                  >
                    <option value="">Selectionner</option>
                    {tunisianCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-secondary">Adresse complete *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(event) => onFieldChange('address', event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="Rue, quartier, immeuble..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-secondary">Notes</label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(event) => onFieldChange('notes', event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="Instructions de livraison optionnelles"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                <p className="text-sm font-semibold text-primary">Mode de paiement: {STORE_INFO.paymentLabel}</p>
                <p className="mt-1 text-xs text-muted">Vous payez uniquement a la reception.</p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={handleWhatsAppCheckout} className="premium-btn justify-center">
                  <MessageCircle size={16} /> Commander via WhatsApp
                </button>
                <button type="button" onClick={handleStandardConfirmation} className="premium-btn-secondary justify-center">
                  Confirmer sans WhatsApp
                </button>
              </div>
            </section>

            <aside className="glass-card h-fit rounded-3xl p-5 lg:sticky lg:top-32">
              <h2 className="text-xl font-bold text-primary">Recapitulatif</h2>

              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 rounded-xl border border-soft bg-surface-strong p-2">
                    <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-primary">{item.product.name}</p>
                      <p className="text-xs text-muted">
                        {item.quantity} x {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-soft pt-4 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Sous-total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Livraison</span>
                  <span className="text-primary">{formatPrice(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between border-t border-soft pt-3 text-base font-bold text-primary">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-soft bg-surface p-3 text-xs text-secondary">
                <p className="inline-flex items-center gap-2">
                  <Truck size={14} className="text-fuchsia-500" /> {STORE_INFO.deliveryLabel}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

