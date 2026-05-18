import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { STORE_INFO } from '../../data/store';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

const quickPrompts = ['Smartphones', 'Livraison', 'Paiement', 'Accessoires gaming'];

function buildAssistantReply(message: string): string {
  const value = message.toLowerCase();

  if (value.includes('livraison') || value.includes('24') || value.includes('72')) {
    return 'Livraison rapide sur toute la Tunisie en 24-72h selon la ville. Confirmation immédiate via WhatsApp.';
  }

  if (value.includes('paiement') || value.includes('cash') || value.includes('cod')) {
    return 'Le paiement est à la livraison. Vous payez uniquement à la réception, en toute tranquillité.';
  }

  if (value.includes('iphone') || value.includes('samsung') || value.includes('smartphone')) {
    return 'Top choix du moment: iPhone 15, Samsung S24 et Xiaomi 14. Je peux vous guider selon votre budget en TND.';
  }

  if (value.includes('gaming')) {
    return 'Côté gaming: manettes Bluetooth, casques RGB et accessoires mobile gamer sont disponibles.';
  }

  if (value.includes('bonjour') || value.includes('salut') || value.includes('hello')) {
    return 'Bonjour 👋 Je suis l’assistant Fifty Store. Dites-moi votre budget et je vous propose les meilleurs produits.';
  }

  return 'Je peux vous aider pour smartphones, accessoires, livraison, paiement et commande WhatsApp. Que cherchez-vous exactement ?';
}

export default function AIAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Bonjour 👋 Besoin d’aide pour choisir un smartphone ?',
    },
  ]);

  const canSend = input.trim().length > 0 && !typing;

  const handleSend = (text?: string) => {
    const content = (text || input).trim();
    if (!content || typing) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: content,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setTyping(true);

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: buildAssistantReply(content),
      };
      setMessages((current) => [...current, reply]);
      setTyping(false);
    }, 640);
  };

  const latestSuggestion = useMemo(() => {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    if (!lastUserMessage) return '/shop';

    const value = lastUserMessage.text.toLowerCase();
    if (value.includes('gaming')) return '/shop?q=gaming';
    if (value.includes('iphone')) return '/shop?q=iphone';
    if (value.includes('samsung')) return '/shop?q=samsung';
    if (value.includes('coque') || value.includes('cable') || value.includes('chargeur')) return '/shop?q=accessoires';
    return '/shop';
  }, [messages]);

  return (
    <div className="fixed bottom-5 right-4 z-[75] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open ? (
          <motion.section
            key="assistant-panel"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
            className="frost-panel mouse-follow-glow mb-3 w-[min(92vw,360px)] overflow-hidden rounded-3xl border border-soft shadow-2xl"
            onMouseMove={(event) => {
              const target = event.currentTarget;
              const rect = target.getBoundingClientRect();
              target.style.setProperty('--mx', `${event.clientX - rect.left}px`);
              target.style.setProperty('--my', `${event.clientY - rect.top}px`);
            }}
          >
            <header className="animated-light-sheen flex items-center justify-between border-b border-soft px-4 py-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles size={14} className="text-cyan-400" /> AI Assistant
              </p>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-soft bg-surface-strong text-primary"
                onClick={() => setOpen(false)}
                aria-label="Fermer assistant"
              >
                <X size={15} />
              </button>
            </header>

            <div className="max-h-[380px] space-y-2 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`ai-message-in max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'assistant'
                      ? 'bg-sky-500/15 text-primary'
                      : 'ml-auto bg-fuchsia-600 text-white'
                  }`}
                >
                  {message.text}
                </div>
              ))}

              {typing ? (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-500/15 px-3 py-2 text-xs text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 [animation-delay:240ms]" />
                </div>
              ) : null}
            </div>

            <div className="border-t border-soft px-4 py-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-soft bg-surface-strong px-3 py-1.5 text-xs font-semibold text-secondary hover:border-cyan-400/40"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleSend();
                  }}
                  placeholder="Posez votre question..."
                  className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-2 text-sm text-primary outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!canSend}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white disabled:opacity-60"
                >
                  <Send size={15} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted">
                <Link to={latestSuggestion} className="font-semibold text-cyan-400 hover:text-cyan-300">
                  Voir suggestion produits
                </Link>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  WhatsApp direct
                </a>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="sticky-cart-bubble relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/35 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Ouvrir assistant AI"
      >
        <Bot size={20} />
        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold">
          AI
        </span>
      </motion.button>

      {!open ? (
        <p className="mt-2 rounded-full bg-surface/95 px-3 py-1 text-[11px] font-semibold text-primary shadow-premium">
          <MessageCircle size={12} className="mr-1 inline text-cyan-400" /> Besoin d’aide ?
        </p>
      ) : null}
    </div>
  );
}
