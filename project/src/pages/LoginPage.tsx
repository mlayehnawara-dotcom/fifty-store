import { LockKeyhole, LogIn, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import GoogleAuthSection from '../components/auth/GoogleAuthSection';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../lib/supabase';

type LoginRole = 'client' | 'admin';

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect');

  const { signInWithEmail, signInWithGoogle, loading, usingSupabase } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expectedRole, setExpectedRole] = useState<LoginRole>('client');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (expectedRole === 'admin' && normalizedEmail !== ADMIN_EMAIL) {
      toast.error(`Compte admin autorise uniquement pour ${ADMIN_EMAIL}`);
      return;
    }

    const success = await signInWithEmail(normalizedEmail, password);
    if (!success) return;

    if (redirect) {
      navigate(decodeURIComponent(redirect), { replace: true });
      return;
    }

    navigate(expectedRole === 'admin' ? '/admin' : '/account', { replace: true });
  };

  const handleGoogle = async () => {
    if (expectedRole === 'admin') {
      toast.error('Utilisez le compte Google admin uniquement.');
    }
    await signInWithGoogle();
  };

  return (
    <>
      <Seo
        title="Connexion"
        description="Connexion client ou admin pour Fifty Store avec email/mot de passe ou Google."
        path="/login"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="glass-card rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Authentification</p>
              <h1 className="mt-2 text-3xl font-bold text-primary">Connexion Fifty Store</h1>
              <p className="mt-3 text-sm text-muted">
                Connectez-vous en tant que client ou admin. Les privileges admin sont separes des comptes clients.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-soft bg-surface p-1">
                  <button
                    type="button"
                    onClick={() => setExpectedRole('client')}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      expectedRole === 'client' ? 'bg-emerald-500 text-white' : 'text-secondary'
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpectedRole('admin')}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      expectedRole === 'admin' ? 'bg-rose-500 text-white' : 'text-secondary'
                    }`}
                  >
                    Admin
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="email@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="********"
                    required
                  />
                </div>

                <button disabled={loading} type="submit" className="premium-btn w-full justify-center">
                  <LogIn size={16} /> Se connecter
                </button>
              </form>

              <GoogleAuthSection
                label="Continuer avec Google"
                helperText="Connexion rapide en un clic avec votre compte Gmail."
                usingSupabase={usingSupabase}
                disabled={loading}
                onClick={handleGoogle}
              />

              <p className="mt-4 text-sm text-muted">
                Nouveau client ?{' '}
                <Link to="/register" className="font-semibold text-fuchsia-500">
                  Creer un compte
                </Link>
              </p>
            </section>

            <section className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-orange-400/20 blur-3xl" />

              <div className="relative z-10">
                <p className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-strong px-3 py-1 text-xs font-semibold text-fuchsia-500">
                  <Sparkles size={14} /> Acces securise
                </p>

                <h2 className="mt-4 text-2xl font-bold text-primary">Espace sécurisé Fifty Store</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Connectez-vous pour accéder à votre espace en toute sécurité. Interface rapide, fluide et compatible
                  mobile.
                </p>

                <div className="mt-5 space-y-3">
                  <article className="card-strong rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      <LockKeyhole size={16} className="text-emerald-500" /> Connexion protégée
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Vos informations sont traitées de façon sécurisée.
                    </p>
                  </article>

                  <article className="card-strong rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      <Mail size={16} className="text-fuchsia-500" /> Accès rapide
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Utilisez votre email ou Google pour entrer en quelques secondes.
                    </p>
                  </article>
                </div>

              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
