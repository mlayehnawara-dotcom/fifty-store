import { Facebook, Instagram, LogIn, Mail, MessageCircle, Phone, Shield, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { STORE_INFO } from '../data/store';
import StoreLocation from './StoreLocation';
import OptimizedImage from './ui/OptimizedImage';

export default function Footer() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <footer className="mt-16 border-t border-soft bg-surface/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 overflow-hidden rounded-full border border-soft shadow-lg shadow-black/10">
              <OptimizedImage
                src="/fifty-store-logo.png"
                alt="Fifty Store logo"
                className="h-full w-full object-cover"
                sizes="48px"
              />
            </span>
            <h3 className="text-2xl font-bold text-primary">Fifty Store</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Boutique tunisienne de smartphones et accessoires premium. Livraison rapide, paiement a la livraison et support
            WhatsApp 7j/7.
          </p>
          <p className="mt-3 text-sm text-secondary">Fondateur: {STORE_INFO.founder}</p>

          <div className="mt-5 flex items-center gap-3">
            <a
              href={STORE_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn-secondary !p-2"
            >
              <Facebook size={16} />
            </a>
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn-secondary !p-2"
            >
              <Instagram size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="premium-btn-secondary !p-2">
              <Youtube size={16} />
            </a>
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn-secondary !p-2"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-primary">Navigation</h4>
          <div className="mt-4 grid gap-2 text-sm">
            <Link to="/" className="text-secondary hover:text-fuchsia-500">
              Accueil
            </Link>
            <Link to="/shop" className="text-secondary hover:text-fuchsia-500">
              Boutique
            </Link>
            <Link to="/wishlist" className="text-secondary hover:text-fuchsia-500">
              Favoris
            </Link>
            <Link to="/cart" className="text-secondary hover:text-fuchsia-500">
              Panier
            </Link>
            <Link to="/checkout" className="text-secondary hover:text-fuchsia-500">
              Checkout
            </Link>
            {!isAdmin ? (
              <Link to="/account" className="text-secondary hover:text-fuchsia-500">
                Compte client
              </Link>
            ) : (
              <Link to="/admin" className="inline-flex items-center gap-2 text-secondary hover:text-fuchsia-500">
                <Shield size={14} /> Dashboard admin
              </Link>
            )}
            {!isAuthenticated ? (
              <Link to="/login" className="inline-flex items-center gap-2 text-secondary hover:text-fuchsia-500">
                <LogIn size={14} /> Connexion
              </Link>
            ) : null}
            <Link to="/about" className="text-secondary hover:text-fuchsia-500">
              A propos
            </Link>
            <Link to="/contact" className="text-secondary hover:text-fuchsia-500">
              Contact
            </Link>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <a href={`tel:${STORE_INFO.phoneLink}`} className="inline-flex items-center gap-2 text-secondary hover:text-fuchsia-500">
              <Phone size={15} /> {STORE_INFO.phoneDisplay}
            </a>
            <a href="mailto:contact@fiftystore.tn" className="inline-flex items-center gap-2 text-secondary hover:text-fuchsia-500">
              <Mail size={15} /> contact@fiftystore.tn
            </a>
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:text-fuchsia-500"
            >
              <MessageCircle size={15} /> WhatsApp direct
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-primary">Quick contact</h4>
          <p className="mt-2 text-sm text-muted">Adresse et carte de la boutique.</p>
          <StoreLocation compact className="mt-4" />
        </div>
      </div>

      <div className="border-t border-soft py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted sm:flex-row sm:px-6">
          <p>
            {new Date().getFullYear()} Fifty Store - Tous droits reserves - {STORE_INFO.deliveryLabel}
          </p>
          <p>{STORE_INFO.paymentLabel}</p>
        </div>
      </div>
    </footer>
  );
}
