import { PILLARS } from '../data.js';
import * as store from '../store.js';
import { html, raw, el, icon, ring } from '../ui.js';

export function pathView() {
  const overall = store.overallProgress();

  const cards = PILLARS.map((p) => {
    const pr = store.pillarProgress(p);
    const badge = p.later
      ? '<span class="badge badge-later">In due time</span>'
      : p.ongoing
        ? '<span class="badge badge-ongoing">Ongoing</span>'
        : pr.pct === 100
          ? '<span class="badge badge-done">Complete</span>'
          : '';
    return `<a class="pillar-card ${p.later ? 'is-later' : ''}" href="#/pillar/${p.id}">
      <div class="pillar-head">
        ${icon(p.icon).value}
        <div class="pillar-heading">
          <h3>${p.title}</h3>
          <p class="muted">${pr.done} of ${pr.total} steps</p>
        </div>
        ${ring(pr.pct, 46).value}
      </div>
      <p class="pillar-aim">${p.aim}</p>
      <div class="pillar-foot">${badge}<span class="chevron" aria-hidden="true">&rarr;</span></div>
    </a>`;
  }).join('');

  return el(html`
    <div class="stack">
      <section class="card">
        <h2 class="card-title">Six things to prepare</h2>
        <p class="muted">Built on one foundation, and none of it by my own strength.</p>
        <div class="bar"><div class="bar-fill" style="width:${overall.pct}%"></div></div>
        <p class="footnote">${overall.done} of ${overall.total} steps &middot; started ${new Date(store.getState().startedAt).getFullYear()}</p>
      </section>
      <div class="pillar-grid">${raw(cards)}</div>
    </div>
  `);
}
