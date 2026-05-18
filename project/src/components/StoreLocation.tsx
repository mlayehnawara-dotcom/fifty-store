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

export default function StoreLocation({ compact = false, className = '' }: StoreLocationProps) {
  const hasRealEmbed = STORE_LOCATION.embedMapUrl.trim().length > 0;
  const hasRealMapsLink = STORE_LOCATION.googleMapsUrl.trim().length > 0;
  const directionsUrl = buildDirectionsUrl();

  return (
    <section className={`glass-card rounded-3xl p-5 shadow-premium sm:p-6 ${className}`}>
      <div className={`grid gap-5 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {!compact && (
          <div className="relative overflow-hidden rounded-[1.75rem] border border-soft shadow-xl shadow-fuchsia-900/15">
            {hasRealEmbed ? (
              <div className="relative">
                <iframe
                  title="Fifty Store map"
                  src={STORE_LOCATION.embedMapUrl}
                  className="h-full min-h-[290px] w-full aspect-[16/10] lg:aspect-[4/3]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                <div className="absolute left-3 top-3 z-20 rounded-2xl border border-white/20 bg-slate-950/70 px-3 py-2 text-white shadow-2xl backdrop-blur-md sm:left-4 sm:top-4 sm:px-4 sm:py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300">Fifty Store</p>
                  <p className="mt-1 text-sm font-semibold">{STORE_LOCATION.address}</p>
                  <p className="text-xs text-slate-200">{STORE_LOCATION.city}</p>
                </div>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-xl hover:bg-emerald-400 sm:bottom-4 sm:right-4"
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
                      <Phone size={13} /> Call now
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                Add your Google Maps embed URL in STORE_LOCATION.embedMapUrl
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Adresse boutique</p>
            <h3 className="mt-2 text-2xl font-bold text-primary">{STORE_LOCATION.name}</h3>
            <p className="mt-2 text-sm text-muted">{STORE_LOCATION.address}</p>
            <p className="text-sm text-muted">{STORE_LOCATION.city}</p>
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
                Open in Maps
              </span>
              <ExternalLink size={16} />
            </a>

            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="premium-btn-secondary w-full justify-between">
              <span className="inline-flex items-center gap-2">
                <Navigation size={16} />
                Get Directions
              </span>
              <ExternalLink size={16} />
            </a>

            <a href={`tel:${STORE_INFO.phoneLink}`} className="premium-btn-secondary w-full justify-between">
              <span className="inline-flex items-center gap-2">
                <Phone size={16} />
                Call now
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
                WhatsApp quick contact
              </span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

