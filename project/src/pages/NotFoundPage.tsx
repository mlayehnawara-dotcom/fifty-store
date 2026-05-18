import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page introuvable" description="La page demandee n existe pas." path="/404" />
      <div className="page-bg flex min-h-screen items-center justify-center px-4 pt-28 sm:pt-32">
        <section className="glass-card w-full max-w-xl rounded-3xl p-10 text-center">
          <h1 className="text-5xl font-bold text-primary">404</h1>
          <p className="mt-3 text-sm text-muted">Cette page n existe pas.</p>
          <Link to="/" className="premium-btn mt-6 inline-flex">
            Retour accueil
          </Link>
        </section>
      </div>
    </>
  );
}
