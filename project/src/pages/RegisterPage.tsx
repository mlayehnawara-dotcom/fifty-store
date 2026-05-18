import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import GoogleAuthSection from '../components/auth/GoogleAuthSection';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../lib/supabase';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, loading, usingSupabase } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === ADMIN_EMAIL) {
      toast.error('Cet email est reserve au compte admin.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Confirmation de mot de passe invalide.');
      return;
    }

    const success = await signUpWithEmail(fullName, normalizedEmail, password);
    if (!success) return;

    navigate('/account', { replace: true });
  };

  const handleGoogleRegister = async () => {
    return signInWithGoogle();
  };

  return (
    <>
      <Seo
        title="Inscription"
        description="Creation compte client Fifty Store avec email/password ou Google Gmail."
        path="/register"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <section className="glass-card rounded-3xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Client onboarding</p>
            <h1 className="mt-2 text-3xl font-bold text-primary">Creer votre compte client</h1>
            <p className="mt-3 text-sm text-muted">
              Inscrivez-vous pour commander plus rapidement, sauvegarder vos favoris et suivre vos demandes.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-secondary">Nom complet</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                  placeholder="Votre nom"
                  required
                />
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="Minimum 6 caracteres"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Confirmer</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="Retapez mot de passe"
                    required
                  />
                </div>
              </div>

              <button disabled={loading} type="submit" className="premium-btn w-full justify-center">
                <UserPlus size={16} /> Creer mon compte
              </button>
            </form>

            <GoogleAuthSection
              label="Inscription avec Google"
              helperText="Creez votre compte client instantanement avec Gmail."
              usingSupabase={usingSupabase}
              disabled={loading}
              onClick={handleGoogleRegister}
            />

            <p className="mt-4 text-sm text-muted">
              Deja inscrit ?{' '}
              <Link to="/login" className="font-semibold text-fuchsia-500">
                Se connecter
              </Link>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
