import { PILLAR_BY_ID } from '../data.js';
import * as store from '../store.js';
import { html, raw, el, on, icon, ring, esc, shortDate, toast } from '../ui.js';

export function pillarView(id) {
  const pillar = PILLAR_BY_ID[id];
  if (!pillar) {
    return el(html`<div class="stack"><section class="card"><p>That page does not exist. <a href="#/path">Back to the path</a>.</p></section></div>`);
  }

  const state = store.getState();
  const pr = store.pillarProgress(pillar);
  const steps = store.allSteps(pillar);

  const stepRows = steps
    .map((st) => {
      const rec = state.pillars[pillar.id].steps[st.id];
      const done = !!(rec && rec.done);
      return `<li class="step ${done ? 'is-done' : ''}">
        <button class="step-check" data-step="${st.id}" aria-pressed="${done}" aria-label="${esc(st.title)}"></button>
        <div class="step-body">
          <p class="step-title">${esc(st.title)}</p>
          ${st.hint ? `<p class="step-hint">${esc(st.hint)}</p>` : ''}
          ${done && rec.at ? `<p class="step-date">Done ${shortDate(rec.at)}</p>` : ''}
        </div>
        ${st.custom ? `<button class="step-remove" data-remove="${st.id}" aria-label="Remove this step">&times;</button>` : ''}
      </li>`;
    })
    .join('');

  const root = el(html`
    <div class="stack">
      <a class="back" href="#/path">&larr; The path</a>

      <section class="card pillar-hero">
        <div class="pillar-head">
          ${icon(pillar.icon)}
          <div class="pillar-heading"><h2>${pillar.title}</h2></div>
          ${ring(pr.pct, 52)}
        </div>
        <p class="pillar-aim">${pillar.aim}</p>
        <blockquote class="verse verse-sm">${pillar.verse}</blockquote>
        <cite class="verse-ref">${pillar.ref}</cite>
      </section>

      ${raw(
        pillar.streakHabit
          ? `<section class="card">
              <h3 class="card-title">Days clean</h3>
              <div class="stats">
                <div class="stat"><div class="stat-num">${store.streak(pillar.streakHabit)}</div><span class="stat-label">Right now</span></div>
                <div class="stat"><div class="stat-num">${store.bestStreak(pillar.streakHabit)}</div><span class="stat-label">Longest</span></div>
              </div>
              <p class="footnote">Marked on Today. A fall resets the count, never the covenant \u2014 there is no condemnation for those who are in Christ Jesus.</p>
            </section>`
          : ''
      )}

      ${raw(
        pillar.later
          ? `<section class="card note-later">
              <h3 class="card-title">Not yet</h3>
              <p>This one is written now and acted on later. Decide it while your head is clear, then leave it alone until the other five are standing.</p>
            </section>`
          : ''
      )}

      <section class="card">
        <div class="row row-between">
          <h3 class="card-title">Steps</h3>
          <span class="muted">${pr.done}/${pr.total}</span>
        </div>
        <ul class="steps">${raw(stepRows)}</ul>
        <form class="add-row">
          <input type="text" data-fk="addstep-${pillar.id}" placeholder="Add your own step&hellip;" maxlength="160" />
          <button type="submit" class="btn">Add</button>
        </form>
      </section>

      <section class="card">
        <h3 class="card-title">Notes &amp; what I'm learning</h3>
        <textarea class="notes" data-fk="notes-${pillar.id}" rows="7"
          placeholder="Churches visited, numbers to hit, names, what God keeps saying&hellip;">${esc(state.pillars[pillar.id].notes)}</textarea>
        <p class="footnote">Saved as you type.</p>
      </section>
    </div>
  `);

  on(root, '.step-check', 'click', (e) => {
    store.toggleStep(pillar.id, e.currentTarget.dataset.step);
  });

  on(root, '.step-remove', 'click', (e) => {
    store.removeCustomStep(pillar.id, e.currentTarget.dataset.remove);
  });

  on(root, '.add-row', 'submit', (e) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    if (store.addCustomStep(pillar.id, input.value)) {
      input.value = '';
      toast('Step added.');
    }
  });

  on(root, '.notes', 'input', (e) => {
    store.setNotes(pillar.id, e.currentTarget.value);
  });

  return root;
}
