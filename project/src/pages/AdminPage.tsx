import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  PackageCheck,
  Pencil,
  PlusCircle,
  Save,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Area,
  AreaChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Seo from '../components/Seo';
import OptimizedImage from '../components/ui/OptimizedImage';
import { useCatalog } from '../context/CatalogContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  createProductInSupabase,
  deleteProductInSupabase,
  fetchCustomersFromSupabase,
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase,
  updateProductInSupabase,
} from '../services/adminService';
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
  items: number;
}

interface ProductFormState {
  name: string;
  brand: string;
  category: string;
  price: string;
  stock: string;
  image: string;
}

type AdminSection = 'overview' | 'products' | 'orders' | 'customers';

const initialOrders: DemoOrder[] = [
  {
    id: 'CMD-101',
    customer: 'Sami Ben Salah',
    phone: '+216 22 111 000',
    city: 'Tunis',
    address: 'Centre ville Tunis',
    amount: 1849,
    status: 'Confirmee',
    date: '2026-05-12',
    items: 2,
  },
  {
    id: 'CMD-102',
    customer: 'Rania Slama',
    phone: '+216 26 222 111',
    city: 'Sousse',
    address: 'Route de la plage',
    amount: 329,
    status: 'En cours',
    date: '2026-05-13',
    items: 1,
  },
  {
    id: 'CMD-103',
    customer: 'Alaa Khemiri',
    phone: '+216 52 333 444',
    city: 'Sfax',
    address: 'Mahres Sfax',
    amount: 3999,
    status: 'Livree',
    date: '2026-05-14',
    items: 3,
  },
  {
    id: 'CMD-104',
    customer: 'Iheb Mzoughi',
    phone: '+216 94 555 666',
    city: 'Bizerte',
    address: 'Menzel Jemil',
    amount: 538,
    status: 'Expediee',
    date: '2026-05-15',
    items: 2,
  },
  {
    id: 'CMD-105',
    customer: 'Oumaima Trabelsi',
    phone: '+216 55 999 888',
    city: 'Monastir',
    address: 'Jemmel centre',
    amount: 2299,
    status: 'Confirmee',
    date: '2026-05-16',
    items: 2,
  },
];

const initialForm: ProductFormState = {
  name: '',
  brand: '',
  category: 'phones',
  price: '',
  stock: '',
  image: '',
};

export default function AdminPage() {
  const { products, categories } = useCatalog();
  const [section, setSection] = useState<AdminSection>('overview');
  const [productRows, setProductRows] = useState(products.slice(0, 14));
  const [orderRows, setOrderRows] = useState<DemoOrder[]>(initialOrders);
  const [remoteCustomers, setRemoteCustomers] = useState<
    { id: string; name: string; phone: string; city: string; orders: number; spend: number }[]
  >([]);
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [customCategory, setCustomCategory] = useState('');
  const [extraCategories, setExtraCategories] = useState<string[]>([]);

  useEffect(() => {
    setProductRows((current) => {
      if (current.length > 0) return current;
      return products.slice(0, 14);
    });
  }, [products]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadRemoteData = async () => {
      const [remoteOrders, customers] = await Promise.all([fetchOrdersFromSupabase(), fetchCustomersFromSupabase()]);
      if (remoteOrders.length > 0) {
        setOrderRows(remoteOrders);
      }
      if (customers.length > 0) {
        setRemoteCustomers(customers);
      }
    };

    void loadRemoteData();
  }, []);

  const totalRevenue = useMemo(() => orderRows.reduce((sum, order) => sum + order.amount, 0), [orderRows]);
  const deliveryPending = useMemo(
    () => orderRows.filter((order) => order.status === 'En cours' || order.status === 'Confirmee').length,
    [orderRows],
  );

  const salesData = useMemo(
    () => [
      { name: 'Jan', sales: 8200 },
      { name: 'Fev', sales: 9100 },
      { name: 'Mar', sales: 10250 },
      { name: 'Avr', sales: 11800 },
      { name: 'Mai', sales: 13450 },
      { name: 'Juin', sales: 14220 },
    ],
    [],
  );

  const orderStatusData = useMemo(() => {
    const groups: Record<DemoOrder['status'], number> = {
      'En cours': 0,
      Confirmee: 0,
      Expediee: 0,
      Livree: 0,
    };

    orderRows.forEach((order) => {
      groups[order.status] += 1;
    });

    return [
      { name: 'En cours', value: groups['En cours'], color: '#fb7185' },
      { name: 'Confirmee', value: groups.Confirmee, color: '#f59e0b' },
      { name: 'Expediee', value: groups.Expediee, color: '#22d3ee' },
      { name: 'Livree', value: groups.Livree, color: '#34d399' },
    ];
  }, [orderRows]);

  const customerRows = useMemo(() => {
    const statsByPhone = orderRows.reduce<Record<string, { orders: number; spend: number }>>((accumulator, order) => {
      const key = order.phone || order.id;
      const current = accumulator[key] || { orders: 0, spend: 0 };
      accumulator[key] = {
        orders: current.orders + 1,
        spend: current.spend + order.amount,
      };
      return accumulator;
    }, {});

    if (remoteCustomers.length > 0) {
      const merged = remoteCustomers.map((customer) => ({
        ...customer,
        orders: statsByPhone[customer.phone]?.orders ?? customer.orders,
        spend: statsByPhone[customer.phone]?.spend ?? customer.spend,
      }));

      const missing = orderRows
        .filter((order) => !merged.some((customer) => customer.phone === order.phone))
        .map((order) => ({
          id: order.id,
          name: order.customer,
          phone: order.phone,
          city: order.city,
          orders: statsByPhone[order.phone]?.orders ?? order.items,
          spend: statsByPhone[order.phone]?.spend ?? order.amount,
        }));

      return [...merged, ...missing];
    }

    return orderRows.map((order) => ({
      id: order.id,
      name: order.customer,
      phone: order.phone,
      city: order.city,
      orders: order.items,
      spend: order.amount,
    }));
  }, [orderRows, remoteCustomers]);

  const categoryOptions = useMemo(() => {
    const fromCatalog = categories.map((category) => category.id).filter((category) => category !== 'all');
    const merged = Array.from(new Set([...fromCatalog, ...extraCategories]));
    return merged.length > 0 ? merged : ['phones', 'cases', 'chargers', 'headphones', 'smartwatches', 'gaming', 'accessories'];
  }, [categories, extraCategories]);

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
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
      oldPrice: Math.round(Number(form.price) * 1.1),
      image: form.image.trim() || products[0]?.image,
      description: 'Produit ajoute depuis le dashboard admin (demo).',
      specs: ['A completer'],
      isBestSeller: false,
      isNew: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setProductRows((current) => [newProduct, ...current]);
    toast.success('Produit ajoute (demo)');

    const synced = await createProductInSupabase({
      name: newProduct.name,
      brand: newProduct.brand,
      category: newProduct.category,
      price: newProduct.price,
      stock: newProduct.stock,
      image: newProduct.image,
    });
    if (synced) {
      toast.success('Produit synchronise avec Supabase.');
    }

    setForm(initialForm);
  };

  const handleDeleteProduct = async (id: number) => {
    setProductRows((current) => current.filter((product) => product.id !== id));
    toast.success('Produit supprime (demo)');
    const synced = await deleteProductInSupabase(id);
    if (synced) {
      toast.success('Suppression synchronisee avec Supabase.');
    }
  };

  const handleEditProduct = async (productId: number) => {
    const current = productRows.find((product) => product.id === productId);
    if (!current) return;

    const nextPriceRaw = window.prompt('Nouveau prix (TND):', String(current.price));
    if (!nextPriceRaw) return;

    const nextPrice = Number(nextPriceRaw);
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      toast.error('Prix invalide.');
      return;
    }

    setProductRows((rows) =>
      rows.map((row) =>
        row.id === productId
          ? {
              ...row,
              price: nextPrice,
              oldPrice: Math.max(nextPrice, row.oldPrice ?? nextPrice),
            }
          : row,
      ),
    );

    toast.success('Produit edite (demo)');
    const synced = await updateProductInSupabase(productId, { price: nextPrice });
    if (synced) {
      toast.success('Edition synchronisee avec Supabase.');
    }
  };

  const updateOrderStatus = async (orderId: string, status: DemoOrder['status']) => {
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
    const synced = await updateOrderStatusInSupabase(orderId, status);
    if (synced) {
      toast.success('Statut synchronise avec Supabase.');
    }
  };

  const addCategory = () => {
    if (!customCategory.trim()) {
      toast.error('Entrez une categorie valide.');
      return;
    }
    const value = customCategory.trim().toLowerCase();
    setExtraCategories((current) => (current.includes(value) ? current : [...current, value]));
    setCustomCategory('');
    toast.success('Categorie ajoutee');
  };

  const statusClass = (status: DemoOrder['status']): string => {
    if (status === 'Livree') return 'bg-emerald-500/15 text-emerald-500';
    if (status === 'Expediee') return 'bg-cyan-500/15 text-cyan-400';
    if (status === 'Confirmee') return 'bg-amber-500/15 text-amber-500';
    return 'bg-rose-500/15 text-rose-500';
  };

  return (
    <>
      <Seo
        title="Admin Dashboard"
        description="Interface admin securisee pour gestion produits, commandes, clients et livraison."
        path="/admin"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">Espace Admin Fifty Store</h1>
            <p className="mt-2 text-sm text-muted">Panel avance pret pour integration backend complete.</p>
            <p className="mt-2 inline-flex rounded-full border border-soft bg-surface-strong px-3 py-1 text-xs font-semibold text-secondary">
              {isSupabaseConfigured ? 'Mode Supabase actif' : 'Mode local (fallback)'}
            </p>
          </header>

          <section className="grid gap-4 lg:grid-cols-[250px_1fr]">
            <aside className="frost-panel rounded-3xl border border-soft p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">Navigation admin</p>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => setSection('overview')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    section === 'overview' ? 'bg-cyan-600 text-white' : 'bg-surface-strong text-secondary'
                  }`}
                >
                  <LayoutDashboard size={15} /> Overview
                </button>
                <button
                  type="button"
                  onClick={() => setSection('products')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    section === 'products' ? 'bg-cyan-600 text-white' : 'bg-surface-strong text-secondary'
                  }`}
                >
                  <ShoppingBag size={15} /> Produits
                </button>
                <button
                  type="button"
                  onClick={() => setSection('orders')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    section === 'orders' ? 'bg-cyan-600 text-white' : 'bg-surface-strong text-secondary'
                  }`}
                >
                  <PackageCheck size={15} /> Commandes
                </button>
                <button
                  type="button"
                  onClick={() => setSection('customers')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    section === 'customers' ? 'bg-cyan-600 text-white' : 'bg-surface-strong text-secondary'
                  }`}
                >
                  <Users size={15} /> Clients
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-soft bg-surface-strong p-3 text-xs text-muted">
                <p className="inline-flex items-center gap-2 font-semibold text-primary">
                  <ShieldCheck size={13} className="text-cyan-400" /> Admin only
                </p>
                <p className="mt-1">Compte client non autorise sur ce dashboard.</p>
              </div>
            </aside>

            <div className="space-y-6">
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <article className="frost-panel rounded-2xl border border-soft p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Total produits</p>
                  <p className="mt-3 text-3xl font-bold text-primary">{productRows.length}</p>
                </article>
                <article className="frost-panel rounded-2xl border border-soft p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-500">Commandes</p>
                  <p className="mt-3 text-3xl font-bold text-primary">{orderRows.length}</p>
                </article>
                <article className="frost-panel rounded-2xl border border-soft p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">Revenu demo</p>
                  <p className="mt-3 text-3xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
                </article>
                <article className="frost-panel rounded-2xl border border-soft p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Livraisons a traiter</p>
                  <p className="mt-3 inline-flex items-center gap-2 text-2xl font-semibold text-primary">
                    <Truck size={20} className="text-rose-500" /> {deliveryPending}
                  </p>
                </article>
              </section>

              {section === 'overview' ? (
                <section className="grid gap-6 xl:grid-cols-2">
                  <article className="frost-panel rounded-3xl border border-soft p-5">
                    <h2 className="mb-4 text-lg font-bold text-primary">Evolution des ventes</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                          <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                              <stop offset="95%" stopColor="#ec4899" stopOpacity={0.06} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                          <XAxis dataKey="name" stroke="rgba(148,163,184,.8)" />
                          <YAxis stroke="rgba(148,163,184,.8)" />
                          <Tooltip />
                          <Area type="monotone" dataKey="sales" stroke="#22d3ee" fill="url(#salesGradient)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </article>

                  <article className="frost-panel rounded-3xl border border-soft p-5">
                    <h2 className="mb-4 text-lg font-bold text-primary">Statut commandes</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={orderStatusData} dataKey="value" nameKey="name" outerRadius={95} label>
                            {orderStatusData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      {orderStatusData.map((status) => (
                        <p key={status.name} className="inline-flex items-center gap-2 text-muted">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                          {status.name}: {status.value}
                        </p>
                      ))}
                    </div>
                  </article>
                </section>
              ) : null}

              {section === 'products' ? (
                <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                  <article className="glass-card rounded-3xl p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-primary">Gestion produits</h2>
                      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-400">
                        <ShieldCheck size={14} /> Admin only
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
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
                                <div className="flex items-center gap-3">
                                  <OptimizedImage
                                    src={product.image}
                                    alt={product.name}
                                    className="h-10 w-10 rounded-lg object-cover"
                                    sizes="40px"
                                  />
                                  <div>
                                    <p className="font-semibold text-primary">{product.name}</p>
                                    <p className="text-xs text-muted">{product.brand}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-secondary">{product.category}</td>
                              <td className="py-3 text-secondary">{formatPrice(product.price)}</td>
                              <td className="py-3 text-secondary">{product.stock}</td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditProduct(product.id)}
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
                        <label className="mb-1 block text-sm font-semibold text-secondary">Image URL</label>
                        <input
                          type="url"
                          value={form.image}
                          onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                          className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                          placeholder="https://..."
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-secondary">Categorie</label>
                        <select
                          value={form.category}
                          onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                          className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                        >
                          {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(event) => setCustomCategory(event.target.value)}
                          className="rounded-xl border border-soft bg-surface-strong px-3 py-2 text-sm text-primary outline-none"
                          placeholder="Ajouter une categorie"
                        />
                        <button type="button" onClick={addCategory} className="premium-btn-secondary">
                          <PlusCircle size={14} /> Ajouter
                        </button>
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
              ) : null}

              {section === 'orders' ? (
                <section className="glass-card rounded-3xl p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold text-primary">Gestion commandes & livraison</h2>
                    <button
                      type="button"
                      onClick={() => toast.success('Toutes les modifications sont sauvegardees localement.')}
                      className="premium-btn-secondary"
                    >
                      <Save size={14} /> Sauvegarder
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[940px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-soft text-xs uppercase tracking-[0.14em] text-muted">
                          <th className="py-3">ID</th>
                          <th className="py-3">Client</th>
                          <th className="py-3">Contact</th>
                          <th className="py-3">Adresse</th>
                          <th className="py-3">Montant</th>
                          <th className="py-3">Paiement</th>
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
                            <td className="py-3 text-secondary">
                              <span className="inline-flex items-center gap-1 text-xs">
                                <CreditCard size={12} /> Livraison
                              </span>
                            </td>
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
                </section>
              ) : null}

              {section === 'customers' ? (
                <section className="glass-card rounded-3xl p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-primary">Liste clients</h2>
                    <p className="inline-flex items-center gap-2 text-xs text-muted">
                      <BarChart3 size={14} /> Donnees demo prêtes pour backend
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-soft text-xs uppercase tracking-[0.14em] text-muted">
                          <th className="py-3">Client</th>
                          <th className="py-3">Telephone</th>
                          <th className="py-3">Ville</th>
                          <th className="py-3">Commandes</th>
                          <th className="py-3">Depense</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerRows.map((customer) => (
                          <tr key={customer.id} className="border-b border-soft/70">
                            <td className="py-3 font-semibold text-primary">{customer.name}</td>
                            <td className="py-3 text-secondary">{customer.phone}</td>
                            <td className="py-3 text-secondary">{customer.city}</td>
                            <td className="py-3 text-secondary">{customer.orders}</td>
                            <td className="py-3 text-secondary">{formatPrice(customer.spend)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}
            </div>
          </section>

          <p className="mt-6 inline-flex items-center gap-2 text-xs text-muted">
            <ShieldCheck size={14} /> L espace admin reste prive et inaccessible aux comptes clients.
          </p>
        </div>
      </div>
    </>
  );
}
