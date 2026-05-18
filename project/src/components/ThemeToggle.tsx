import { MoonStar, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-soft bg-surface-strong text-primary hover:border-fuchsia-500/50"
      aria-label="Changer le theme"
      title={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
    >
      {isDark ? <Sun size={18} /> : <MoonStar size={18} />}
    </button>
  );
}
