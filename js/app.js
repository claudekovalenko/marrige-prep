import * as store from './store.js';
import { initShell, applyTheme, onShellChange } from './app-shell.js';
import { todayView } from './views/today.js';
import { pathView } from './views/path.js';
import { pillarView } from './views/pillar.js';
import { rememberView } from './views/remember.js';
import { journalView } from './views/journal.js';
import { settingsView } from './views/settings.js';

const main = document.getElementById('main');

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);
  return { name: parts[0] || 'today', param: parts[1] || '' };
}

function viewFor(route) {
  switch (route.name) {
    case 'path':
      return { node: pathView(), tab: 'path' };
    case 'pillar':
      return { node: pillarView(route.param), tab: 'path' };
    case 'remember':
      return { node: rememberView(), tab: 'remember' };
    case 'journal':
      return { node: journalView(), tab: 'journal' };
    case 'settings':
      return { node: settingsView(), tab: 'settings' };
    default:
      return { node: todayView(), tab: 'today' };
  }
}

/** Keep the caret where it was when a keystroke triggers a re-render. */
function captureFocus() {
  const a = document.activeElement;
  if (!a || !a.dataset || !a.dataset.fk) return null;
  const snap = { key: a.dataset.fk };
  if (typeof a.selectionStart === 'number') {
    snap.start = a.selectionStart;
    snap.end = a.selectionEnd;
  }
  return snap;
}

function restoreFocus(snap) {
  if (!snap) return;
  const node = main.querySelector(`[data-fk="${CSS.escape(snap.key)}"]`);
  if (!node) return;
  node.focus({ preventScroll: true });
  if (typeof snap.start === 'number' && typeof node.setSelectionRange === 'function') {
    try {
      node.setSelectionRange(snap.start, snap.end);
    } catch (e) {
      /* some input types disallow selection ranges */
    }
  }
}

let lastKey = '';

function render() {
  const route = currentRoute();
  const key = route.name + '/' + route.param;
  const snap = captureFocus();

  const { node, tab } = viewFor(route);
  main.replaceChildren(node);

  document.querySelectorAll('.tabbar a').forEach((a) => {
    const active = a.dataset.tab === tab;
    a.classList.toggle('is-active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  if (key !== lastKey) {
    window.scrollTo(0, 0);
    lastKey = key;
  } else {
    restoreFocus(snap);
  }
}

function boot() {
  applyTheme(store.getState().settings.theme);
  initShell();

  const name = store.getState().settings.name;
  const tagline = document.getElementById('tagline');
  if (name && tagline) tagline.textContent = `Building well, ${name}.`;

  window.addEventListener('hashchange', render);
  store.subscribe(() => {
    const t = document.getElementById('tagline');
    const n = store.getState().settings.name;
    if (t) t.textContent = n ? `Building well, ${n}.` : 'Unless the LORD builds the house…';
    render();
  });
  onShellChange(render);

  if (!location.hash) location.replace('#/today');
  render();
}

boot();
