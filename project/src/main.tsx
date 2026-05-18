import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => registration.update())
      .catch(() => undefined);
  });
}
