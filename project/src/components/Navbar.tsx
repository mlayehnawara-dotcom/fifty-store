import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  Shield,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { STORE_INFO } from '../data/store';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const { products } = useCatalog();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const searchResults = useMemo(() => {
    if (query.trim().length < 2) {
      return [];
    }

    const normalized = query.trim().toLowerCase();
    return products
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(normalized) ||
          product.brand.toLowerCase().includes(normalized) ||
          product.category.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 6);
  }, [query]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-fuchsia-600 text-white shadow-glow'
        : 'text-secondary hover:bg-slate-100/80 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
  };

  const topBar = (
    <div className="border-b border-soft bg-gradient-to-r from-fuchsia-600 via-orange-500 to-rose-500 px-4 py-2 text-xs font-semibold text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 sm:flex-row sm:gap-3">
        <p className="text-center">
          {STORE_INFO.deliveryLabel} | Paiement a la livraison | WhatsApp: {STORE_INFO.phoneDisplay}
        </p>
        <p className="rounded-full bg-black/20 px-3 py-1 text-[11px] font-bold tracking-wide">
          {new Intl.DateTimeFormat('fr-TN', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(now)}{' '}
          -{' '}
          {new Intl.DateTimeFormat('fr-TN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(now)}
        </p>
      </div>
    </div>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        isScrolled ? 'backdrop-blur-md shadow-premium' : ''
      }`}
    >
      {topBar}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-2 rounded-2xl border border-soft bg-surface/95 px-3 py-3 dark:bg-slate-950/85">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl px-2 py-1">
              <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-soft shadow-lg shadow-black/15">
                <img src="/fifty-store-logo.png" alt="Fifty Store logo" className="h-full w-full object-cover" />
              </span>
              <div>
                <p className="font-display text-lg font-bold leading-none text-primary">Fifty Store</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia-500">Reparation et vente iPhone</p>
              </div>
            </Link>

            <nav className="ml-2 hidden items-center gap-1 lg:flex">
              <NavLink to="/" className={navClass} end>
                Accueil
              </NavLink>
              <NavLink to="/shop" className={navClass}>
                Boutique
              </NavLink>
              <NavLink to="/wishlist" className={navClass}>
                Favoris
              </NavLink>
              <NavLink to="/about" className={navClass}>
                A propos
              </NavLink>
              <NavLink to="/contact" className={navClass}>
                Contact
              </NavLink>
              <NavLink to="/admin" className={navClass}>
                {isAdmin ? 'Admin' : 'Espace Admin'}
              </NavLink>
            </nav>

            <div className="relative ml-auto hidden max-w-xs flex-1 sm:block">
              <div className="flex items-center gap-2 rounded-xl border border-soft bg-surface-strong px-3 py-2">
                <Search size={16} className="text-muted" />
                <input
                  type="search"
                  value={query}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      submitSearch();
                    }
                  }}
                  placeholder="Rechercher produits, marques..."
                  className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted"
                />
              </div>

              {searchOpen && searchResults.length > 0 ? (
                <div className="absolute left-0 right-0 top-[105%] max-h-80 overflow-auto rounded-2xl border border-soft bg-surface-strong p-2 shadow-premium">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onMouseDown={() => {
                        navigate(`/product/${product.id}`);
                        setQuery('');
                        setSearchOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-fuchsia-500/10"
                    >
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="line-clamp-1 text-sm font-semibold text-primary">{product.name}</p>
                        <p className="text-xs text-muted">{product.brand}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <ThemeToggle />

              {isAuthenticated ? (
                <>
                  <Link
                    to={isAdmin ? '/admin' : '/account'}
                    className="inline-flex items-center gap-2 rounded-xl border border-soft bg-surface-strong px-3 py-2 text-xs font-semibold text-primary hover:border-fuchsia-500/50"
                  >
                    {isAdmin ? <Shield size={14} /> : <User size={14} />}
                    {isAdmin ? 'Admin' : user?.fullName}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-soft bg-surface-strong text-primary hover:border-fuchsia-500/50"
                    aria-label="Se deconnecter"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-soft bg-surface-strong px-3 py-2 text-xs font-semibold text-primary hover:border-fuchsia-500/50"
                >
                  <LogIn size={14} /> Connexion
                </Link>
              )}

              <Link
                to="/wishlist"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-soft bg-surface-strong text-primary hover:border-fuchsia-500/50"
                aria-label="Favoris"
              >
                <Heart size={18} />
                {wishlistCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                    {wishlistCount}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-soft bg-surface-strong text-primary hover:border-fuchsia-500/50"
                aria-label="Panier"
              >
                <ShoppingCart size={18} />
                {totalItems > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-600 px-1 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                ) : null}
              </button>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-soft bg-surface-strong text-primary lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {mobileOpen ? (
            <div className="mt-4 border-t border-soft pt-4 lg:hidden">
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-soft bg-surface-strong px-3 py-2">
                <Search size={16} className="text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      submitSearch();
                    }
                  }}
                  placeholder="Rechercher"
                  className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted"
                />
              </div>

              <nav className="grid gap-2">
                <NavLink to="/" className={navClass} end>
                  Accueil
                </NavLink>
                <NavLink to="/shop" className={navClass}>
                  Boutique
                </NavLink>
                <NavLink to="/wishlist" className={navClass}>
                  Favoris ({wishlistCount})
                </NavLink>
                <NavLink to="/cart" className={navClass}>
                  Panier ({totalItems})
                </NavLink>
                {!isAdmin ? (
                  <NavLink to="/account" className={navClass}>
                    Mon compte
                  </NavLink>
                ) : null}
                <NavLink to="/admin" className={navClass}>
                  {isAdmin ? 'Dashboard admin' : 'Espace Admin'}
                </NavLink>
                <NavLink to="/about" className={navClass}>
                  A propos
                </NavLink>
                <NavLink to="/contact" className={navClass}>
                  Contact
                </NavLink>
              </nav>

              <div className="mt-3 flex items-center justify-between gap-2">
                <ThemeToggle />
                {!isAuthenticated ? (
                  <Link to="/login" className="premium-btn">
                    <LogIn size={16} /> Se connecter
                  </Link>
                ) : (
                  <button type="button" onClick={() => void signOut()} className="premium-btn">
                    <LogOut size={16} /> Se deconnecter
                  </button>
                )}
                <button type="button" onClick={() => setIsCartOpen(true)} className="premium-btn-secondary">
                  <ShoppingCart size={16} /> Panier
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
