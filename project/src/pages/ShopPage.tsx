import { ChevronDown, Filter, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CompareStrip from '../components/CompareStrip';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';
import { useCatalog } from '../context/CatalogContext';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating';

export default function ShopPage() {
  const { products, categories, loading } = useCatalog();
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('q') ?? '';

  const minCatalogPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.min(...products.map((product) => product.price));
  }, [products]);

  const maxCatalogPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.max(...products.map((product) => product.price));
  }, [products]);

  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [selectedBrand, setSelectedBrand] = useState<'all' | string>('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    setMinPrice(minCatalogPrice);
    setMaxPrice(maxCatalogPrice);
  }, [minCatalogPrice, maxCatalogPrice]);

  const brandOptions = useMemo(() => {
    return ['all', ...Array.from(new Set(products.map((product) => product.brand))).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.brand.toLowerCase().includes(normalizedSearch);
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      const matchPrice = product.price >= minPrice && product.price <= maxPrice;

      return matchSearch && matchCategory && matchBrand && matchPrice;
    });

    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      case 'newest':
      default:
        return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [products, searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    searchTerm.length > 0 ||
    minPrice !== minCatalogPrice ||
    maxPrice !== maxCatalogPrice ||
    sortBy !== 'newest';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice(minCatalogPrice);
    setMaxPrice(maxCatalogPrice);
    setSortBy('newest');
  };

  const FiltersContent = (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">Recherche</p>
        <div className="flex items-center gap-2 rounded-xl border border-soft bg-surface-strong px-3 py-2">
          <Search size={16} className="text-muted" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Nom du produit"
            className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">Categorie</p>
        <div className="grid grid-cols-1 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                selectedCategory === category.id
                  ? 'bg-cyan-600 text-white'
                  : 'border border-soft bg-surface-strong text-secondary hover:border-cyan-500/40'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">Marque</p>
        <div className="relative">
          <select
            value={selectedBrand}
            onChange={(event) => setSelectedBrand(event.target.value)}
            className="w-full appearance-none rounded-xl border border-soft bg-surface-strong px-3 py-2 text-sm text-primary outline-none"
          >
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand === 'all' ? 'Toutes les marques' : brand}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">Prix (TND)</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={minCatalogPrice}
            value={minPrice}
            onChange={(event) => setMinPrice(Number(event.target.value) || minCatalogPrice)}
            className="rounded-xl border border-soft bg-surface-strong px-3 py-2 text-sm text-primary outline-none"
          />
          <input
            type="number"
            max={maxCatalogPrice}
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value) || maxCatalogPrice)}
            className="rounded-xl border border-soft bg-surface-strong px-3 py-2 text-sm text-primary outline-none"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">Tri</p>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="w-full appearance-none rounded-xl border border-soft bg-surface-strong px-3 py-2 text-sm text-primary outline-none"
          >
            <option value="newest">Plus recents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix decroissant</option>
            <option value="rating">Mieux notes</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <button type="button" onClick={clearFilters} className="premium-btn-secondary w-full justify-center">
        <X size={16} /> Clear filters
      </button>
    </div>
  );

  return (
    <>
      <Seo
        title="Boutique"
        description="Filtrez les produits Fifty Store par nom, categorie, marque, prix et tri avance."
        path="/shop"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-primary sm:text-4xl">Boutique Fifty Store</h1>
              <p className="mt-2 text-sm text-muted">Recherche avancee par nom, categorie, marque et prix.</p>
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl border border-soft bg-surface-strong px-4 py-2 text-sm font-semibold text-secondary lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filtres
            </button>
          </div>

          <CompareStrip />

          {mobileFiltersOpen ? <div className="glass-card mb-5 rounded-3xl p-5 lg:hidden">{FiltersContent}</div> : null}

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="hidden lg:block">
              <div className="glass-card sticky top-32 rounded-3xl p-5">
                <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  <Filter size={16} /> Filtres avances
                </div>
                {FiltersContent}
              </div>
            </aside>

            <section>
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-soft bg-surface px-4 py-3 text-sm">
                <p className="text-secondary">
                  <span className="font-bold text-primary">{filteredProducts.length}</span> produit(s) trouves
                </p>
                <div className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs text-cyan-400">
                    <Sparkles size={13} /> Experience premium
                  </span>
                  {hasActiveFilters ? (
                    <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 font-semibold text-cyan-400">
                      <X size={14} /> Effacer
                    </button>
                  ) : null}
                </div>
              </div>

              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-3xl p-10 text-center">
                  <Search size={30} className="mx-auto text-muted" />
                  <h2 className="mt-3 text-xl font-bold text-primary">Aucun produit trouve</h2>
                  <p className="mt-2 text-sm text-muted">
                    Essayez un autre nom, une marque differente ou un intervalle de prix plus large.
                  </p>
                  <button type="button" onClick={clearFilters} className="premium-btn mt-5">
                    Reinitialiser les filtres
                  </button>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
