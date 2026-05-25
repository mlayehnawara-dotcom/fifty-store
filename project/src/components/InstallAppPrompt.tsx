import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallAppPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD) return undefined;

    const handler = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!promptEvent) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted' || choice.outcome === 'dismissed') {
          setPromptEvent(null);
        }
      }}
      className="sticky-cart-bubble fixed bottom-40 right-4 z-[69] inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/90 px-4 py-3 text-xs font-semibold text-white lg:bottom-6"
    >
      <Download size={14} /> Installer l'app
    </button>
  );
}
