import { PILLARS, VERSES } from '../data.js';
import * as store from '../store.js';
import { html, raw, el, on, icon, longDate, toast, dayLetter } from '../ui.js';

function verseOfDay() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const doy = Math.floor((now - start) / 86400000);
  return VERSES[doy % VERSES.length];
}

function weekStrip(habitId) {
  const start = store.weekStart();
  const today = store.dayKey();
  const cells = [];
  for (let i = 0; i < 7; i++) {
    const d = store.addDays(start, i);
    const key = store.dayKey(d);
    const done = store.habitDone(habitId, key);
    const future = key > today;
    cells.push(
      `<button class="dot ${done ? 'is-done' : ''} ${key === today ? 'is-today' : ''}" data-habit="${habitId}"
        data-day="${key}" ${future ? 'disabled' : ''}
        aria-pressed="${done}" aria-label="${dayLetter(d)} ${key}">${dayLetter(d)}</button>`
    );
  }
  return raw(`<div class="week-strip">${cells.join('')}</div>`);
}

export function todayView() {
  const state = store.getState();
  const v = verseOfDay();
  const overall = store.overallProgress();
  const all = store.habits();
  const daily = all.filter((h) => h.cadence === 'daily');
  const weekly = all.filter((h) => h.cadence === 'weekly');
  const greetingName = state.settings.name ? `, ${state.settings.name}` : '';

  const pinned = store.pinnedEncouragement();

  // What he called a priority comes first.
  const nextSteps = PILLARS.filter((p) => !p.later)
    .slice()
    .sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0))
    .map((p) => {
      const step = store.allSteps(p).find((st) => !store.isDone(p.id, st.id));
      return step ? { pillar: p, step } : null;
    })
    .filter(Boolean);

  const root = el(html`
    <div class="stack">
      <section class="card verse-card">
        <p class="eyebrow">${longDate()}</p>
        <blockquote class="verse">${v.text}</blockquote>
        <cite class="verse-ref">${v.ref}</cite>
      </section>

      ${raw(
        pinned
          ? `<a class="card today-enc" href="#/remember">
              <p class="eyebrow">Remember</p>
              <p class="enc-text">${pinned.text.split('\n\n')[0].replace(/</g, '&lt;')}</p>
              <span class="more">${pinned.title} &rarr;</span>
            </a>`
          : ''
      )}

      <section class="card">
        <div class="row row-between">
          <div>
            <h2 class="card-title">The whole work${greetingName}</h2>
            <p class="muted">${overall.done} of ${overall.total} steps taken &middot; ${overall.pct}%</p>
          </div>
          <div class="pct-big">${overall.pct}<span>%</span></div>
        </div>
        <div class="bar"><div class="bar-fill" style="width:${overall.pct}%"></div></div>
        <p class="footnote">Not a race. &ldquo;In due season we will reap, if we do not give up.&rdquo;</p>
      </section>

      <section class="card">
        <h2 class="card-title">Today</h2>
        <div class="chips">
          ${raw(
            daily
              .map((h) => {
                const done = store.habitDone(h.id);
                const s = store.streak(h.id);
                return `<button class="chip ${done ? 'is-done' : ''}" data-habit="${h.id}" data-day="${store.dayKey()}" aria-pressed="${done}">
                  <span class="chip-check" aria-hidden="true"></span>
                  <span class="chip-label">${h.title}</span>
                  ${s > 0 ? `<span class="chip-streak">${s}d</span>` : ''}
                </button>`;
              })
              .join('')
          )}
        </div>
      </section>

      <section class="card">
        <h2 class="card-title">This week</h2>
        <ul class="weeklies">
          ${raw(
            weekly
              .map((h) => {
                const count = store.weekCount(h.id);
                const target = h.target || 1;
                return `<li class="weekly ${count >= target ? 'is-met' : ''}">
                  <div class="row row-between">
                    <span class="weekly-title">${h.title}</span>
                    <span class="weekly-count">${count}/${target}</span>
                  </div>
                  ${weekStrip(h.id).value}
                </li>`;
              })
              .join('')
          )}
        </ul>
      </section>

      <section class="card">
        <h2 class="card-title">The next faithful step</h2>
        <ul class="next-list">
          ${raw(
            nextSteps
              .map(
                ({ pillar, step }) => `<li class="next-item">
                  <button class="next-check" data-pillar="${pillar.id}" data-step="${step.id}" aria-label="Mark done: ${step.title.replace(/"/g, '&quot;')}"></button>
                  <div class="next-body">
                    <a class="next-tag" href="#/pillar/${pillar.id}">${icon(pillar.icon, 'tag-icon').value} ${pillar.short}</a>
                    <p class="next-title">${step.title}</p>
                  </div>
                </li>`
              )
              .join('') || '<li class="empty">Every step is checked. Write a new one on the Path.</li>'
          )}
        </ul>
      </section>

      <section class="card">
        <h2 class="card-title">Say it to Him</h2>
        <form class="quick-pray">
          <textarea data-fk="quickpray" rows="3" placeholder="A prayer, a thanks, or the thing you are afraid of&hellip;"></textarea>
          <div class="row row-end">
            <button type="submit" class="btn btn-primary">Save to journal</button>
          </div>
        </form>
      </section>
    </div>
  `);

  on(root, '[data-habit]', 'click', (e) => {
    const btn = e.currentTarget;
    store.toggleHabit(btn.dataset.habit, btn.dataset.day);
  });

  on(root, '.next-check', 'click', (e) => {
    const btn = e.currentTarget;
    store.toggleStep(btn.dataset.pillar, btn.dataset.step);
    toast('Step taken. Thanks be to God.');
  });

  on(root, '.quick-pray', 'submit', (e) => {
    e.preventDefault();
    const box = e.currentTarget.querySelector('textarea');
    const text = box.value.trim();
    if (!text) return;
    store.addEntry({ type: 'prayer', pillar: '', text });
    box.value = '';
    toast('Written down.');
  });

  return root;
}
