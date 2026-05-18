import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import { useCatalog } from '../context/CatalogContext';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { wishlistIds, clearWishlist } = useWishlist();
  const { products } = useCatalog();

  const favoriteProducts = products.filter((product) => wishlistIds.includes(product.id));

  return (
    <>
      <Seo
        title="Favoris"
        description="Retrouvez les produits sauvegardes dans votre wishlist Fifty Store."
        path="/wishlist"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-primary">Mes favoris</h1>
              <p className="mt-1 text-sm text-muted">{favoriteProducts.length} produit(s) en wishlist.</p>
            </div>

            {favoriteProducts.length > 0 ? (
              <button type="button" onClick={clearWishlist} className="premium-btn-secondary">
                <Trash2 size={16} /> Vider
              </button>
            ) : null}
          </div>

          {favoriteProducts.length === 0 ? (
            <section className="glass-card rounded-3xl p-12 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-soft bg-surface">
                <Heart className="text-muted" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-primary">Wishlist vide</h2>
              <p className="mt-2 text-sm text-muted">Ajoutez des produits avec l icone coeur depuis la boutique.</p>
              <Link to="/shop" className="premium-btn mt-5 inline-flex">
                <ShoppingBag size={16} /> Explorer la boutique
              </Link>
            </section>
          ) : (
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
