import * as store from '../store.js';
import { html, raw, el, on, arm, esc, toast } from '../ui.js';
import { applyTheme, installState, promptInstall } from '../app-shell.js';

export function settingsView() {
  const state = store.getState();
  const custom = state.customHabits;
  const install = installState();

  const root = el(html`
    <div class="stack">
      <section class="card">
        <h2 class="card-title">You</h2>
        <label class="field">
          <span>What should this call you?</span>
          <input type="text" data-fk="name" class="name-input" maxlength="40" value="${state.settings.name}" placeholder="Your name" />
        </label>
        <label class="field">
          <span>Theme</span>
          <select class="theme-select">
            ${raw(
              [
                ['auto', 'Match my phone'],
                ['dark', 'Dark'],
                ['light', 'Light']
              ]
                .map(([v, l]) => `<option value="${v}" ${state.settings.theme === v ? 'selected' : ''}>${l}</option>`)
                .join('')
            )}
          </select>
        </label>
      </section>

      <section class="card">
        <h2 class="card-title">Your own rhythms</h2>
        <p class="muted">Add anything you want to keep track of day by day or week by week.</p>
        <ul class="custom-habits">
          ${raw(
            custom
              .map(
                (h) => `<li class="row row-between">
                  <span>${esc(h.title)} <span class="muted">&middot; ${h.cadence === 'weekly' ? `${h.target}&times; a week` : 'daily'}</span></span>
                  <button class="link-btn danger" data-remove-habit="${h.id}">Remove</button>
                </li>`
              )
              .join('') || '<li class="empty">No custom rhythms yet.</li>'
          )}
        </ul>
        <form class="habit-form">
          <input type="text" data-fk="habit-title" placeholder="e.g. Call my parents" maxlength="60" required />
          <select name="cadence">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <input type="number" name="target" min="1" max="7" value="3" class="target-input" aria-label="Times per week" hidden />
          <button type="submit" class="btn">Add</button>
        </form>
      </section>

      <section class="card">
        <h2 class="card-title">Install it</h2>
        <p class="muted">
          ${install.installed
            ? 'Installed. It opens like any other app and works with no signal.'
            : install.canPrompt
              ? 'Add it to your home screen so it opens full-screen and works offline.'
              : 'On iPhone: Share → Add to Home Screen. On Android: menu → Install app.'}
        </p>
        ${raw(install.canPrompt ? '<button class="btn btn-primary install-btn">Add to home screen</button>' : '')}
      </section>

      <section class="card">
        <h2 class="card-title">Your data</h2>
        <p class="muted">Everything stays on this device. Nothing is uploaded, and no one else can read it. Back it up now and then.</p>
        <div class="btn-row">
          <button class="btn export-btn">Export a backup</button>
          <button class="btn import-btn">Restore a backup</button>
          <input type="file" accept="application/json,.json" class="file-input" hidden />
        </div>
        <button class="btn btn-danger reset-btn">Erase everything</button>
      </section>

      <section class="card about">
        <p class="verse verse-sm">&ldquo;Unless the LORD builds the house, those who build it labor in vain.&rdquo;</p>
        <cite class="verse-ref">Psalm 127:1</cite>
        <p class="footnote">Prepare &middot; a quiet place to do the work before the work.</p>
      </section>
    </div>
  `);

  on(root, '.name-input', 'input', (e) => store.setSetting('name', e.currentTarget.value));

  on(root, '.theme-select', 'change', (e) => {
    store.setSetting('theme', e.currentTarget.value);
    applyTheme(e.currentTarget.value);
  });

  on(root, '[data-remove-habit]', 'click', (e) => store.removeCustomHabit(e.currentTarget.dataset.removeHabit));

  on(root, '.habit-form', 'submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const title = f.querySelector('input[type=text]').value;
    const cadence = f.elements.cadence.value;
    if (store.addCustomHabit(title, cadence, Number(f.elements.target.value))) toast('Added.');
  });

  on(root, '.habit-form select[name=cadence]', 'change', (e) => {
    root.querySelector('.target-input').hidden = e.currentTarget.value !== 'weekly';
  });

  on(root, '.install-btn', 'click', () => promptInstall());

  on(root, '.export-btn', 'click', () => {
    const blob = new Blob([store.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prepare-backup-${store.dayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  on(root, '.import-btn', 'click', (e) => {
    arm(e.currentTarget, 'Tap again \u2014 this replaces everything', () =>
      root.querySelector('.file-input').click()
    );
  });

  on(root, '.file-input', 'change', (e) => {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || typeof data !== 'object') throw new Error('bad file');
        store.replaceState(data);
        applyTheme(store.getState().settings.theme);
        toast('Backup restored.');
      } catch (err) {
        toast('That file could not be read.');
      }
    };
    reader.readAsText(file);
  });

  on(root, '.reset-btn', 'click', (e) => {
    arm(e.currentTarget, 'Tap again to erase everything', () => {
      store.resetAll();
      toast('Cleared. Start again.');
    });
  });

  return root;
}
