// Theme, install prompt, and service worker — the parts that are about being
// an app rather than about the content.

let deferredPrompt = null;
let installed = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const shellListeners = new Set();

export function applyTheme(pref) {
  if (pref === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', pref);
}

export function installState() {
  return { installed, canPrompt: !!deferredPrompt && !installed };
}

export function onShellChange(fn) {
  shellListeners.add(fn);
  return () => shellListeners.delete(fn);
}

function notify() {
  for (const fn of shellListeners) fn();
}

export async function promptInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  try {
    await deferredPrompt.userChoice;
  } finally {
    deferredPrompt = null;
    notify();
  }
}

export function initShell() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    notify();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch((err) => {
        console.warn('Service worker did not register; the app still runs online.', err);
      });
    });
  }
}
