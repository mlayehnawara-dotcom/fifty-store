import { BarChart3, Pencil, PlusCircle, Save, ShieldCheck, Trash2, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import { products } from '../data/products';
import { formatPrice } from '../utils/format';

interface DemoOrder {
  id: string;
  customer: string;
  phone: string;
  city: string;
  address: string;
  amount: number;
  status: 'En cours' | 'Confirmee' | 'Expediee' | 'Livree';
  date: string;
}

interface ProductFormState {
  name: string;
  brand: string;
  category: string;
  price: string;
  stock: string;
}

const initialOrders: DemoOrder[] = [
  {
    id: 'CMD-101',
    customer: 'Sami B.',
    phone: '+216 22 111 000',
    city: 'Tunis',
    address: 'Centre ville Tunis',
    amount: 1849,
    status: 'Confirmee',
    date: '2026-05-12',
  },
  {
    id: 'CMD-102',
    customer: 'Rania S.',
    phone: '+216 26 222 111',
    city: 'Sousse',
    address: 'Route de la plage',
    amount: 329,
    status: 'En cours',
    date: '2026-05-13',
  },
  {
    id: 'CMD-103',
    customer: 'Alaa K.',
    phone: '+216 52 333 444',
    city: 'Sfax',
    address: 'Mahrès Sfax',
    amount: 3999,
    status: 'Livree',
    date: '2026-05-14',
  },
  {
    id: 'CMD-104',
    customer: 'Iheb M.',
    phone: '+216 94 555 666',
    city: 'Bizerte',
    address: 'Menzel Jemil',
    amount: 538,
    status: 'Expediee',
    date: '2026-05-15',
  },
];

export default function AdminPage() {
  const [productRows, setProductRows] = useState(products.slice(0, 12));
  const [orderRows, setOrderRows] = useState<DemoOrder[]>(initialOrders);
  const [form, setForm] = useState<ProductFormState>({
    name: '',
    brand: '',
    category: 'phones',
    price: '',
    stock: '',
  });

  const totalRevenue = useMemo(() => orderRows.reduce((sum, order) => sum + order.amount, 0), [orderRows]);
  const deliveryPending = useMemo(
    () => orderRows.filter((order) => order.status === 'En cours' || order.status === 'Confirmee').length,
    [orderRows],
  );

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.brand.trim() || !form.price || !form.stock) {
      toast.error('Veuillez remplir tous les champs du produit.');
      return;
    }

    const newProduct = {
      ...products[0],
      id: Date.now(),
      name: form.name,
      brand: form.brand,
      category: form.category as (typeof products)[number]['category'],
      price: Number(form.price),
      stock: Number(form.stock),
      oldPrice: Number(form.price),
      description: 'Produit ajoute depuis le dashboard admin (demo).',
      specs: ['A completer'],
      isBestSeller: false,
      isNew: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setProductRows((current) => [newProduct, ...current]);
    toast.success('Produit ajoute (demo)');

    setForm({
      name: '',
      brand: '',
      category: 'phones',
      price: '',
      stock: '',
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProductRows((current) => current.filter((product) => product.id !== id));
    toast.success('Produit supprime (demo)');
  };

  const handleEditProduct = () => {
    toast.success('Action edition simulee (demo)');
  };

  const updateOrderStatus = (orderId: string, status: DemoOrder['status']) => {
    setOrderRows((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order,
      ),
    );
    toast.success('Statut livraison mis a jour');
  };

  const statusClass = (status: DemoOrder['status']): string => {
    if (status === 'Livree') return 'bg-emerald-500/15 text-emerald-500';
    if (status === 'Expediee') return 'bg-indigo-500/15 text-indigo-500';
    if (status === 'Confirmee') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
    return 'bg-rose-500/15 text-rose-500';
  };

  return (
    <>
      <Seo
        title="Admin Dashboard"
        description="Interface admin securisee pour gestion produits, commandes et livraison."
        path="/admin"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">Espace Admin Fifty Store</h1>
            <p className="mt-2 text-sm text-muted">
              Acces prive admin: gestion produits, commandes clients et suivi livraison.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="glass-card animate-page-enter rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-500">Total produits</p>
              <p className="mt-3 text-3xl font-bold text-primary">{productRows.length}</p>
            </article>
            <article className="glass-card animate-page-enter rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-500">Commandes</p>
              <p className="mt-3 text-3xl font-bold text-primary">{orderRows.length}</p>
            </article>
            <article className="glass-card animate-page-enter rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">Revenu demo</p>
              <p className="mt-3 text-3xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
            </article>
            <article className="glass-card animate-page-enter rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Livraisons a traiter</p>
              <p className="mt-3 inline-flex items-center gap-2 text-2xl font-semibold text-primary">
                <Truck size={20} className="text-rose-500" /> {deliveryPending}
              </p>
            </article>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <article className="glass-card rounded-3xl p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Gestion produits</h2>
                <span className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-fuchsia-500">
                  <ShieldCheck size={14} /> Admin only
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-soft text-xs uppercase tracking-[0.14em] text-muted">
                      <th className="py-3">Produit</th>
                      <th className="py-3">Categorie</th>
                      <th className="py-3">Prix</th>
                      <th className="py-3">Stock</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((product) => (
                      <tr key={product.id} className="border-b border-soft/70">
                        <td className="py-3">
                          <p className="font-semibold text-primary">{product.name}</p>
                          <p className="text-xs text-muted">{product.brand}</p>
                        </td>
                        <td className="py-3 text-secondary">{product.category}</td>
                        <td className="py-3 text-secondary">{formatPrice(product.price)}</td>
                        <td className="py-3 text-secondary">{product.stock}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleEditProduct}
                              className="premium-btn-secondary !p-2"
                              aria-label="Editer"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="premium-btn-secondary !p-2 text-rose-500"
                              aria-label="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="glass-card rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-primary">Ajouter produit</h2>
              <form onSubmit={handleAddProduct} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Nom</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Marque</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Categorie</label>
                  <select
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                  >
                    <option value="phones">phones</option>
                    <option value="cases">cases</option>
                    <option value="chargers">chargers</option>
                    <option value="headphones">headphones</option>
                    <option value="smartwatches">smartwatches</option>
                    <option value="gaming">gaming</option>
                    <option value="accessories">accessories</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-secondary">Prix</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                      className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-secondary">Stock</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                      className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="premium-btn w-full justify-center">
                  <PlusCircle size={16} /> Ajouter produit
                </button>
              </form>
            </article>
          </section>

          <section className="mt-8 glass-card rounded-3xl p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-primary">Gestion commandes & livraison</h2>
              <button
                type="button"
                onClick={() => toast.success('Toutes les modifications sont deja sauvegardees localement.')}
                className="premium-btn-secondary"
              >
                <Save size={14} /> Sauvegarder
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-soft text-xs uppercase tracking-[0.14em] text-muted">
                    <th className="py-3">ID</th>
                    <th className="py-3">Client</th>
                    <th className="py-3">Contact</th>
                    <th className="py-3">Adresse</th>
                    <th className="py-3">Montant</th>
                    <th className="py-3">Livraison</th>
                    <th className="py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orderRows.map((order) => (
                    <tr key={order.id} className="border-b border-soft/70">
                      <td className="py-3 font-semibold text-primary">{order.id}</td>
                      <td className="py-3 text-secondary">{order.customer}</td>
                      <td className="py-3 text-secondary">
                        <p>{order.phone}</p>
                        <p className="text-xs text-muted">{order.city}</p>
                      </td>
                      <td className="py-3 text-secondary">{order.address}</td>
                      <td className="py-3 text-secondary">{formatPrice(order.amount)}</td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(event) => updateOrderStatus(order.id, event.target.value as DemoOrder['status'])}
                          className={`rounded-xl border border-soft px-3 py-2 text-xs font-semibold outline-none ${statusClass(
                            order.status,
                          )}`}
                        >
                          <option value="En cours">En cours</option>
                          <option value="Confirmee">Confirmee</option>
                          <option value="Expediee">Expediee</option>
                          <option value="Livree">Livree</option>
                        </select>
                      </td>
                      <td className="py-3 text-secondary">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted">
              <BarChart3 size={14} /> L espace admin est prive et inaccessible aux comptes clients.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
