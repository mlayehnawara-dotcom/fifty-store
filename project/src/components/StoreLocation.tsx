import { ExternalLink, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { STORE_INFO, STORE_LOCATION } from '../data/store';

interface StoreLocationProps {
  compact?: boolean;
  className?: string;
}

function buildDirectionsUrl(): string {
  const qMatch = STORE_LOCATION.embedMapUrl.match(/[?&]q=([^&]+)/);
  if (qMatch?.[1]) {
    const destination = decodeURIComponent(qMatch[1]);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  }

  const fallbackDestination = `${STORE_LOCATION.address}, ${STORE_LOCATION.city}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fallbackDestination)}`;
}

function resolveOpenStatus() {
  const now = new Date();
  const hour = now.getHours();
  const isOpen = hour >= 8 && hour < 22;
  return {
    isOpen,
    label: isOpen ? 'Ouvert maintenant' : 'Fermé maintenant',
  };
}

export default function StoreLocation({ compact = false, className = '' }: StoreLocationProps) {
  const hasRealEmbed = STORE_LOCATION.embedMapUrl.trim().length > 0;
  const hasRealMapsLink = STORE_LOCATION.googleMapsUrl.trim().length > 0;
  const directionsUrl = buildDirectionsUrl();
  const openStatus = resolveOpenStatus();

  return (
    <section className={`frost-panel futuristic-border rounded-3xl p-5 shadow-premium sm:p-6 ${className}`}>
      <div className={`grid gap-5 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {!compact && (
          <div className="relative overflow-hidden rounded-[1.75rem] border border-soft shadow-xl shadow-cyan-900/30">
            <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_75%_20%,rgba(56,189,248,0.22),transparent_55%)]" />
            <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_15%_80%,rgba(236,72,153,0.2),transparent_55%)]" />

            {hasRealEmbed ? (
              <div className="relative z-[2]">
                <iframe
                  title="Fifty Store map"
                  src={STORE_LOCATION.embedMapUrl}
                  className="h-full min-h-[290px] w-full aspect-[16/10] rounded-[1.6rem] lg:aspect-[4/3]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

                <article className="absolute left-3 top-3 z-20 max-w-[74%] rounded-2xl border border-white/20 bg-slate-950/75 px-3 py-2 text-white shadow-2xl backdrop-blur-md sm:left-4 sm:top-4 sm:px-4 sm:py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">Fifty Store</p>
                  <p className="mt-1 text-sm font-semibold">{STORE_LOCATION.address}</p>
                  {STORE_LOCATION.city !== STORE_LOCATION.address ? (
                    <p className="text-xs text-slate-200">{STORE_LOCATION.city}</p>
                  ) : null}
                  <p
                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
                      openStatus.isOpen ? 'bg-emerald-500/30 text-emerald-200' : 'bg-rose-500/25 text-rose-100'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${openStatus.isOpen ? 'bg-emerald-300' : 'bg-rose-200'}`} />
                    {openStatus.label}
                  </p>
                </article>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-xl transition hover:scale-[1.02] hover:bg-emerald-400 sm:bottom-4 sm:right-4"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>

                <div className="absolute -bottom-1 left-1/2 z-20 hidden w-[88%] -translate-x-1/2 rounded-2xl border border-soft bg-surface-strong p-3 shadow-2xl lg:block">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-primary">{STORE_LOCATION.name}</p>
                      <p className="text-muted">{STORE_LOCATION.phone}</p>
                    </div>
                    <a href={`tel:${STORE_INFO.phoneLink}`} className="premium-btn-secondary !px-3 !py-2 text-[11px]">
                      <Phone size={13} /> Appeler
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                Localisation disponible sur Google Maps
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Adresse boutique</p>
            <h3 className="mt-2 text-2xl font-bold text-primary">{STORE_LOCATION.name}</h3>
            <p className="mt-2 text-sm text-muted">{STORE_LOCATION.address}</p>
            {STORE_LOCATION.city !== STORE_LOCATION.address ? (
              <p className="text-sm text-muted">{STORE_LOCATION.city}</p>
            ) : null}
            <p className="mt-2 text-sm text-secondary">Tel: {STORE_LOCATION.phone}</p>
          </div>

          <div className="grid gap-2">
            <a
              href={hasRealMapsLink ? STORE_LOCATION.googleMapsUrl : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn-secondary w-full justify-between"
            >
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} />
                Ouvrir Google Maps
              </span>
              <ExternalLink size={16} />
            </a>

            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="premium-btn-secondary w-full justify-between">
              <span className="inline-flex items-center gap-2">
                <Navigation size={16} />
                Itinéraire
              </span>
              <ExternalLink size={16} />
            </a>

            <a href={`tel:${STORE_INFO.phoneLink}`} className="premium-btn-secondary w-full justify-between">
              <span className="inline-flex items-center gap-2">
                <Phone size={16} />
                Appeler
              </span>
              <Phone size={16} />
            </a>

            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn w-full justify-between"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={16} />
                Contacter sur WhatsApp
              </span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
