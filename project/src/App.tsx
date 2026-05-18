import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import CartSidebar from './components/CartSidebar';
import RequireAuth from './components/auth/RequireAuth';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PageLoader from './components/ui/PageLoader';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import AboutPage from './pages/AboutPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import WishlistPage from './pages/WishlistPage';

function AppLayout() {
  const location = useLocation();
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    setLoadingPage(true);
    const timer = window.setTimeout(() => setLoadingPage(false), 300);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <PageLoader active={loadingPage} />
      <Navbar />
      <CartSidebar />

      <main key={location.pathname} className="flex-1 animate-page-enter">
        <Routes>
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
      </main>

      <Footer />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2600,
          style: {
            borderRadius: '14px',
            background: '#1f2937',
            color: '#fefce8',
            border: '1px solid rgba(251, 146, 60, 0.28)',
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
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
