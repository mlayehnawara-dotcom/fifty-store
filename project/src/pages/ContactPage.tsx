import { Clock3, Mail, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import StoreLocation from '../components/StoreLocation';
import { STORE_INFO } from '../data/store';
import { openWhatsApp } from '../utils/whatsapp';

interface ContactForm {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error('Formulaire incomplet: nom, telephone et message sont requis.');
      return;
    }

    const message = [
      'Message client depuis le site Fifty Store',
      '',
      `Nom: ${form.fullName}`,
      `Telephone: ${form.phone}`,
      `Email: ${form.email || '-'}`,
      '',
      `Message: ${form.message}`,
    ].join('\n');

    openWhatsApp(message);
    toast.success('Message WhatsApp ouvert');

    setForm({
      fullName: '',
      phone: '',
      email: '',
      message: '',
    });
  };

  return (
    <>
      <Seo
        title="Contact"
        description="Contactez Fifty Store via telephone, WhatsApp, email et localisation Google Maps."
        path="/contact"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">Contactez-nous</h1>
            <p className="mt-2 text-sm text-muted">Notre equipe vous repond rapidement sur WhatsApp.</p>
          </header>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="glass-card rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-primary">Nos coordonnees</h2>

              <div className="mt-5 grid gap-3">
                <a href={`tel:${STORE_INFO.phoneLink}`} className="card-strong rounded-2xl p-4 text-sm text-secondary hover:border-fuchsia-500/40">
                  <p className="inline-flex items-center gap-2 font-semibold text-primary">
                    <Phone size={16} className="text-fuchsia-500" /> Telephone
                  </p>
                  <p className="mt-1">{STORE_INFO.phoneDisplay}</p>
                </a>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-strong rounded-2xl p-4 text-sm text-secondary hover:border-fuchsia-500/40"
                >
                  <p className="inline-flex items-center gap-2 font-semibold text-primary">
                    <MessageCircle size={16} className="text-fuchsia-500" /> WhatsApp
                  </p>
                  <p className="mt-1">Discussion rapide pour commande et support.</p>
                </a>

                <a
                  href="mailto:contact@fiftystore.tn"
                  className="card-strong rounded-2xl p-4 text-sm text-secondary hover:border-fuchsia-500/40"
                >
                  <p className="inline-flex items-center gap-2 font-semibold text-primary">
                    <Mail size={16} className="text-fuchsia-500" /> Email
                  </p>
                  <p className="mt-1">contact@fiftystore.tn</p>
                </a>

                <div className="card-strong rounded-2xl p-4 text-sm text-secondary">
                  <p className="inline-flex items-center gap-2 font-semibold text-primary">
                    <Clock3 size={16} className="text-fuchsia-500" /> Horaires
                  </p>
                  <p className="mt-1">Tous les jours: 08:00 - 22:00</p>
                </div>
              </div>
            </article>

            <article className="glass-card rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-primary">Envoyer un message</h2>
              <form onSubmit={handleSend} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Nom complet *</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="Votre nom"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-secondary">Telephone *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                      className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-secondary">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="Votre demande"
                  />
                </div>

                <button type="submit" className="premium-btn w-full justify-center">
                  <MessageCircle size={16} /> Envoyer via WhatsApp
                </button>
              </form>
            </article>
          </section>

          <section className="mt-8">
            <StoreLocation />
          </section>
        </div>
      </div>
    </>
  );
}

