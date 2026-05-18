import { Heart, Home, LayoutDashboard, ShoppingBag, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function MobileBottomNav() {
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAdmin, isAuthenticated } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold transition ${
      isActive ? 'text-cyan-400' : 'text-secondary'
    }`;

  return (
    <nav className="app-bottom-nav fixed inset-x-3 bottom-3 z-[70] rounded-2xl border border-soft p-2 shadow-premium sm:inset-x-6 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        <NavLink to="/" className={navClass} end>
          <Home size={16} />
          Accueil
        </NavLink>
        <NavLink to="/shop" className={navClass}>
          <ShoppingBag size={16} />
          Shop
        </NavLink>
        <NavLink to="/wishlist" className={navClass}>
          <Heart size={16} />
          Favoris
          {wishlistCount > 0 ? (
            <span className="absolute right-2 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {wishlistCount}
            </span>
          ) : null}
        </NavLink>
        <NavLink to={isAdmin ? '/admin' : '/account'} className={navClass}>
          {isAdmin ? <LayoutDashboard size={16} /> : <User size={16} />}
          {isAdmin ? 'Admin' : isAuthenticated ? 'Compte' : 'Login'}
        </NavLink>
        <NavLink to="/cart" className={navClass}>
          <ShoppingBag size={16} />
          Panier
          {totalItems > 0 ? (
            <span className="absolute right-2 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-600 px-1 text-[10px] font-bold text-white">
              {totalItems}
            </span>
          ) : null}
        </NavLink>
      </div>
    </nav>
  );
}
