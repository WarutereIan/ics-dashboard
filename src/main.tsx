import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA service worker
if ('serviceWorker' in navigator) {
  // @ts-ignore
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({
      onNeedRefresh() {
        // Show a notification that a new version is available
        if (confirm('New version available! Click OK to refresh.')) {
          window.location.reload();
        }
      },
      onOfflineReady() {
        console.log('App is ready to work offline');
      },
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
