import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  role?: UserRole;
}

export default function RequireAuth({ children, role }: RequireAuthProps) {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="page-bg flex min-h-screen items-center justify-center pt-28 sm:pt-32">
        <div className="glass-card rounded-3xl px-6 py-4 text-sm font-semibold text-primary">Chargement du compte...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/account'} replace />;
  }

  return <>{children}</>;
}
