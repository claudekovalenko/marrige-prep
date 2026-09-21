// Tiny view helpers. No framework — just enough to keep the views readable.

export function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Tagged template that escapes interpolations. Use `raw()` to opt out. */
export function html(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    if (i === 0) return str;
    const v = values[i - 1];
    const piece = v && v.__raw ? v.value : Array.isArray(v) ? v.map(part).join('') : esc(v);
    return acc + piece + str;
  }, '');
}

function part(v) {
  return v && v.__raw ? v.value : esc(v);
}

export function raw(value) {
  return { __raw: true, value: String(value) };
}

/** Build a detached element from an HTML string. */
export function el(markup) {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup.trim();
  return tpl.content.firstElementChild;
}

export function on(root, selector, event, handler) {
  root.querySelectorAll(selector).forEach((node) => node.addEventListener(event, handler));
}

let toastTimer = null;
export function toast(message) {
  const node = document.getElementById('toast');
  if (!node) return;
  node.textContent = message;
  node.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('is-visible'), 2200);
}

/** Circular progress indicator. */
export function ring(pct, size = 48) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return raw(`
    <svg class="ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
      <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="4"></circle>
      <circle class="ring-value" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="4"
              stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
              transform="rotate(-90 ${size / 2} ${size / 2})" stroke-linecap="round"></circle>
    </svg>`);
}

const ICONS = {
  church: '<path d="M12 2.5 14 6v2.2l4.4 2.6V21H5.6v-10.2L10 8.2V6ZM12 6.6v3M10.4 8h3.2M9.6 21v-3.4a2.4 2.4 0 0 1 4.8 0V21"/>',
  coin: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7v10M14.6 9.3c-.5-.8-1.5-1.2-2.6-1.2-1.6 0-2.6.8-2.6 2s1 1.7 2.6 2.1 2.8.8 2.8 2.1-1.2 2-2.8 2c-1.2 0-2.2-.4-2.7-1.3"/>',
  flame: '<path d="M12 2.8s5.4 4 5.4 9.1A5.4 5.4 0 0 1 12 21.2a5.4 5.4 0 0 1-5.4-9.3c1-1.6 2.2-2.3 2.6-4 .8 1 1.4 1.8 1.6 3 1-1.6 1.2-4.3 1.2-8.1Z"/>',
  vine: '<path d="M12 21V7"/><path d="M12 12c-3.2 0-5.4-1.8-5.4-5C9.8 7 12 8.8 12 12Z"/><path d="M12 15c3.2 0 5.4-1.8 5.4-5-3.2 0-5.4 1.8-5.4 5Z"/>',
  hands: '<path d="M8 21v-5.5L5.2 12a1.6 1.6 0 0 1 2.6-1.9L9.6 12V4.6a1.6 1.6 0 0 1 3.2 0V11"/><path d="M12.8 11V5.8a1.6 1.6 0 0 1 3.2 0V12l1.4-1.6a1.6 1.6 0 0 1 2.4 2.1L16 17.4V21"/>',
  ring: '<circle cx="12" cy="14.6" r="5.4"/><path d="m9.4 9.4 2.6-3.8 2.6 3.8M9.6 5.6h4.8"/>',
  shield: '<path d="M12 2.9l7 2.8v6.1c0 4.2-2.9 7.6-7 9.3-4.1-1.7-7-5.1-7-9.3V5.7Z"/><path d="m8.8 12.1 2.2 2.3 4.2-4.6"/>',
  anchor: '<circle cx="12" cy="5.2" r="2.3"/><path d="M12 7.5V21M8.4 10.6h7.2M4 14.2a8 8 0 0 0 16 0"/>'
};

export function icon(name, cls = 'pill-icon') {
  return raw(`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.vine}</svg>`);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function longDate(d = new Date()) {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function shortDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function dayLetter(d) {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
}

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

export function spell(n) {
  return NUMBER_WORDS[n] || String(n);
}
