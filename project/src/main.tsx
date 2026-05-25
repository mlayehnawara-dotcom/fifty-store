import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

function clearLegacyMedismartStorage() {
  const storageBuckets: Storage[] = [window.localStorage, window.sessionStorage];

  storageBuckets.forEach((storage) => {
    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index);
      if (!key) continue;

      const value = storage.getItem(key) || '';
      if (key.toLowerCase().includes('medismart') || value.toLowerCase().includes('medismart')) {
        storage.removeItem(key);
      }
    }
  });
}

clearLegacyMedismartStorage();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

const PRELOAD_RETRY_KEY = 'fifty-store-preload-retry';

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();

  // Retry once by forcing a full reload when old chunk references are cached after deploy.
  if (sessionStorage.getItem(PRELOAD_RETRY_KEY)) {
    sessionStorage.removeItem(PRELOAD_RETRY_KEY);
    return;
  }

  sessionStorage.setItem(PRELOAD_RETRY_KEY, '1');
  window.location.reload();
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => registration.update())
      .catch(() => undefined);
  });
} else if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister();
      });
    });

    if ('caches' in window) {
      void caches.keys().then((keys) => {
        keys
          .filter((key) => key.startsWith('fifty-store-cache'))
          .forEach((key) => {
            void caches.delete(key);
          });
      });
    }
  });
}
