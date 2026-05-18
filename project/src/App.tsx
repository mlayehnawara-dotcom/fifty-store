import { lazy, Suspense, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import CartSidebar from './components/CartSidebar';
import FloatingCartButton from './components/FloatingCartButton';
import InstallAppPrompt from './components/InstallAppPrompt';
import MobileBottomNav from './components/MobileBottomNav';
import RequireAuth from './components/auth/RequireAuth';
import AIAssistantWidget from './components/chat/AIAssistantWidget';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import SmoothScroll from './components/layout/SmoothScroll';
import PageLoader from './components/ui/PageLoader';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

function RouteFallback() {
  return (
    <div className="page-bg flex min-h-screen items-center justify-center pt-28 sm:pt-32">
      <div className="frost-panel rounded-2xl px-5 py-4 text-sm font-semibold text-primary">Chargement de la page...</div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    setLoadingPage(true);
    const timer = window.setTimeout(() => setLoadingPage(false), 280);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <SmoothScroll />
      <PageLoader active={loadingPage} />
      <Navbar />
      <CartSidebar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/account"
                element={
                  <RequireAuth role="client">
                    <AccountPage />
                  </RequireAuth>
                }
              />

              <Route
                path="/checkout"
                element={
                  <RequireAuth role="client">
                    <CheckoutPage />
                  </RequireAuth>
                }
              />

              <Route
                path="/admin"
                element={
                  <RequireAuth role="admin">
                    <AdminPage />
                  </RequireAuth>
                }
              />

              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <Footer />
      <MobileBottomNav />
      <FloatingCartButton />
      <InstallAppPrompt />
      <AIAssistantWidget />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2600,
          style: {
            borderRadius: '14px',
            background: '#111827',
            color: '#f8fafc',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontWeight: '600',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CatalogProvider>
          <WishlistProvider>
            <CompareProvider>
              <CartProvider>
                <BrowserRouter>
                  <AppLayout />
                </BrowserRouter>
              </CartProvider>
            </CompareProvider>
          </WishlistProvider>
        </CatalogProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
