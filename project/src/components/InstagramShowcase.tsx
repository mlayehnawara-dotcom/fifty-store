import { ArrowUpRight, Instagram, Video } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { OFFICIAL_TIKTOK_PROFILE_IMAGE } from '../data/social';
import { STORE_INFO } from '../data/store';
import OptimizedImage from './ui/OptimizedImage';

export default function InstagramShowcase() {
  const { socialMedia } = useCatalog();
  const highlightedPosts = socialMedia.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">
            <Instagram size={14} /> Social
          </p>
          <h2 className="mt-2 text-3xl font-bold text-primary">Actualites Fifty Store</h2>
          <p className="mt-2 text-sm text-muted">Arrivages, demos et nouveautes sur nos comptes officiels.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={STORE_INFO.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-btn"
            aria-label="Ouvrir TikTok Fifty Store"
          >
            <Video size={16} /> @fifty_store0 <ArrowUpRight size={16} />
          </a>
          <a
            href={STORE_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-btn-secondary"
            aria-label="Ouvrir Instagram Fifty Store"
          >
            <Instagram size={16} /> Instagram <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div className={`grid gap-3 ${highlightedPosts.length > 0 ? 'lg:grid-cols-[240px_1fr]' : 'max-w-sm'}`}>
        <a
          href={STORE_INFO.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group overflow-hidden rounded-lg border border-soft bg-surface"
          aria-label="Voir le profil officiel Fifty Store sur TikTok"
        >
          <OptimizedImage
            src={OFFICIAL_TIKTOK_PROFILE_IMAGE}
            alt="Enseigne officielle Fifty Store"
            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
            sizes="240px"
          />
          <div className="px-4 py-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Video size={15} className="text-fuchsia-500" /> Fifty_store_jemmel
            </p>
            <p className="mt-1 text-xs text-muted">TikTok officiel</p>
          </div>
        </a>

        {highlightedPosts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {highlightedPosts.map((post) => (
              <a
                key={post.id}
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg border border-soft bg-surface"
                aria-label={`Voir la publication ${post.platform} Fifty Store`}
              >
                <OptimizedImage
                  src={post.image}
                  alt={post.caption}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 text-white">
                  <p className="line-clamp-2 text-sm font-semibold">{post.caption}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold capitalize text-white/80">
                    {post.platform === 'instagram' ? <Instagram size={12} /> : <Video size={12} />}
                    {post.platform}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
