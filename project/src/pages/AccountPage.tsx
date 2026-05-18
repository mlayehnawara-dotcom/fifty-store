import { ShieldCheck, ShoppingBag, UserCircle2 } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import Seo from '../components/Seo';
import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <Seo title="Mon compte" description="Espace client Fifty Store" path="/account" />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <section className="glass-card rounded-3xl p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-primary">Bienvenue, {user.fullName}</h1>
            <p className="mt-2 text-sm text-muted">Compte client actif: {user.email}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <article className="card-strong rounded-2xl p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <UserCircle2 size={16} className="text-emerald-500" /> Role
                </p>
                <p className="mt-2 text-sm text-secondary">Client</p>
              </article>

              <article className="card-strong rounded-2xl p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <ShoppingBag size={16} className="text-fuchsia-500" /> Achats
                </p>
                <p className="mt-2 text-sm text-secondary">Acces checkout et commandes</p>
              </article>

              <article className="card-strong rounded-2xl p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <ShieldCheck size={16} className="text-orange-500" /> Securite
                </p>
                <p className="mt-2 text-sm text-secondary">Compte separe de l espace admin</p>
              </article>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop" className="premium-btn">
                Aller a la boutique
              </Link>
              <Link to="/wishlist" className="premium-btn-secondary">
                Voir mes favoris
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
