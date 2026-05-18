import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function FloatingCartButton() {
  const { totalItems, setIsCartOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <motion.button
      type="button"
      onClick={() => setIsCartOpen(true)}
      className="sticky-cart-bubble fixed bottom-24 right-4 z-[69] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white lg:hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileTap={{ scale: 0.97 }}
      aria-label="Ouvrir panier"
    >
      <ShoppingCart size={16} />
      Panier ({totalItems})
    </motion.button>
  );
}
