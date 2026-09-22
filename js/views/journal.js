import { PILLARS, PILLAR_BY_ID } from '../data.js';
import * as store from '../store.js';
import { html, raw, el, on, arm, esc, shortDate, toast } from '../ui.js';

const TYPES = [
  { id: 'prayer', label: 'Prayer' },
  { id: 'praise', label: 'Answered / praise' },
  { id: 'reflection', label: 'Reflection' }
];

let filter = 'all';

export function journalView() {
  const state = store.getState();
  const entries = state.journal.filter((e) => filter === 'all' || e.type === filter);
  const answered = state.journal.filter((e) => e.answeredAt).length;

  const list = entries
    .map((e) => {
      const p = e.pillar ? PILLAR_BY_ID[e.pillar] : null;
      return `<li class="entry entry-${esc(e.type)} ${e.answeredAt ? 'is-answered' : ''}">
        <div class="entry-head">
          <span class="entry-type">${esc((TYPES.find((t) => t.id === e.type) || {}).label || e.type)}</span>
          ${p ? `<a class="entry-pillar" href="#/pillar/${p.id}">${esc(p.short)}</a>` : ''}
          <span class="entry-date">${shortDate(e.at)}</span>
        </div>
        <p class="entry-text">${esc(e.text)}</p>
        ${e.answeredAt ? `<p class="entry-answered">Answered &mdash; ${shortDate(e.answeredAt)}</p>` : ''}
        <div class="entry-actions">
          ${e.type === 'prayer' ? `<button class="link-btn" data-answer="${e.id}">${e.answeredAt ? 'Unmark' : 'He answered this'}</button>` : ''}
          <button class="link-btn danger" data-delete="${e.id}">Delete</button>
        </div>
      </li>`;
    })
    .join('');

  const root = el(html`
    <div class="stack">
      <section class="card">
        <h2 class="card-title">Write it down</h2>
        <form class="entry-form">
          <textarea data-fk="journal-text" rows="4" required
            placeholder="What are you asking Him for? What did He do?"></textarea>
          <div class="field-row">
            <label class="field">
              <span>Type</span>
              <select name="type">
                ${raw(TYPES.map((t) => `<option value="${t.id}">${t.label}</option>`).join(''))}
              </select>
            </label>
            <label class="field">
              <span>About</span>
              <select name="pillar">
                <option value="">Everything</option>
                ${raw(PILLARS.map((p) => `<option value="${p.id}">${esc(p.short)}</option>`).join(''))}
              </select>
            </label>
          </div>
          <div class="row row-end"><button type="submit" class="btn btn-primary">Save</button></div>
        </form>
      </section>

      <section class="card">
        <div class="row row-between">
          <h2 class="card-title">The record</h2>
          <span class="muted">${state.journal.length} entries &middot; ${answered} answered</span>
        </div>
        <div class="filters">
          ${raw(
            [{ id: 'all', label: 'All' }]
              .concat(TYPES)
              .map((t) => `<button class="filter ${filter === t.id ? 'is-active' : ''}" data-filter="${t.id}">${t.label}</button>`)
              .join('')
          )}
        </div>
        <ul class="entries">${raw(list || '<li class="empty">Nothing here yet. Start with one honest sentence.</li>')}</ul>
      </section>
    </div>
  `);

  on(root, '.entry-form', 'submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const text = form.querySelector('textarea').value.trim();
    if (!text) return;
    store.addEntry({ type: form.elements.type.value, pillar: form.elements.pillar.value, text });
    toast('Written down.');
  });

  on(root, '[data-filter]', 'click', (e) => {
    filter = e.currentTarget.dataset.filter;
    store.update(() => {}); // re-render
  });

  on(root, '[data-answer]', 'click', (e) => store.markAnswered(e.currentTarget.dataset.answer));

  on(root, '[data-delete]', 'click', (e) => {
    const btn = e.currentTarget;
    arm(btn, 'Tap again to delete', () => store.removeEntry(btn.dataset.delete));
  });

  return root;
}
