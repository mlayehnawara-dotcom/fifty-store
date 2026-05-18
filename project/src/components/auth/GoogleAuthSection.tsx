import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface GoogleAuthSectionProps {
  label: string;
  helperText?: string;
  disabled?: boolean;
  usingSupabase: boolean;
  onClick: () => Promise<boolean> | boolean;
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.35 12.23c0-.71-.06-1.39-.19-2.05H12v3.88h5.24a4.47 4.47 0 0 1-1.94 2.94v2.44h3.13c1.84-1.69 2.92-4.19 2.92-7.21Z"
        fill="#4285F4"
      />
      <path
        d="M12 21.75c2.63 0 4.84-.87 6.46-2.31l-3.13-2.44c-.87.59-1.99.94-3.33.94-2.56 0-4.73-1.73-5.5-4.05H3.27v2.52A9.76 9.76 0 0 0 12 21.75Z"
        fill="#34A853"
      />
      <path
        d="M6.5 13.89a5.86 5.86 0 0 1 0-3.77V7.6H3.27a9.74 9.74 0 0 0 0 8.81l3.23-2.52Z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.06c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.15 14.63 2.25 12 2.25A9.76 9.76 0 0 0 3.27 7.6l3.23 2.52C7.27 7.8 9.44 6.06 12 6.06Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function GoogleAuthSection({
  label,
  helperText,
  disabled = false,
  usingSupabase,
  onClick,
}: GoogleAuthSectionProps) {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (disabled || pending) return;
    setPending(true);
    try {
      await onClick();
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-300/60 to-transparent dark:via-fuchsia-400/45" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Ou</span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-300/60 to-transparent dark:via-fuchsia-400/45" />
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || pending}
        className="group relative w-full overflow-hidden rounded-2xl border border-soft bg-surface-strong px-4 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-fuchsia-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="relative flex items-center justify-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-100">
            <GoogleIcon />
          </span>
          <span>{pending ? 'Redirection Google...' : label}</span>
          {pending ? <Loader2 size={16} className="animate-spin text-fuchsia-500" /> : null}
        </span>
      </button>

      {!usingSupabase ? (
        <p className="rounded-xl border border-amber-400/40 bg-amber-100/55 px-3 py-2 text-xs text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">
          Connexion Google activable apres configuration Supabase.
        </p>
      ) : null}

      {helperText ? <p className="text-center text-xs text-muted">{helperText}</p> : null}
    </div>
  );
}
