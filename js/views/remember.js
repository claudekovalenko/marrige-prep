import { PROMISES } from '../data.js';
import * as store from '../store.js';
import { html, raw, el, on, arm, esc, shortDate, toast } from '../ui.js';

// Which card is open for editing, and whether the "add" form is showing.
let editingId = null;
let adding = false;

function card(e) {
  if (e.id === editingId) {
    return `<li class="enc is-editing" data-id="${e.id}">
      <form class="enc-form">
        <input type="text" name="title" data-fk="edit-title" value="${esc(e.title)}" maxlength="60" placeholder="Title" />
        <textarea name="text" rows="8" placeholder="What He showed you…">${esc(e.text)}</textarea>
        <input type="text" name="source" value="${esc(e.source || '')}" maxlength="60" placeholder="Where it came from (optional)" />
        <div class="row row-end">
          <button type="button" class="link-btn cancel-edit">Cancel</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    </li>`;
  }
  return `<li class="enc ${e.pinned ? 'is-pinned' : ''}" data-id="${e.id}">
    <div class="enc-head">
      <h3>${esc(e.title)}</h3>
      ${e.pinned ? '<span class="badge badge-ongoing">On Today</span>' : ''}
    </div>
    ${e.source ? `<p class="enc-source">${esc(e.source)}</p>` : ''}
    <p class="enc-text">${esc(e.text)}</p>
    <div class="entry-actions">
      ${e.pinned ? '' : `<button class="link-btn" data-pin="${e.id}">Show on Today</button>`}
      <button class="link-btn" data-edit="${e.id}">Edit</button>
      <button class="link-btn danger" data-delete="${e.id}">Delete</button>
      ${e.at ? `<span class="entry-date">${shortDate(e.at)}</span>` : ''}
    </div>
  </li>`;
}

export function rememberView() {
  const list = store.encouragements();

  const root = el(html`
    <div class="stack">
      <section class="card">
        <h2 class="card-title">Remember</h2>
        <p class="muted">
          What He has already shown you. Read it on the days the waiting is long,
          and on the days you are tempted to look to the right or to the left.
        </p>
      </section>

      <ul class="enc-list">${raw(list.map(card).join('') || '<li class="empty">Nothing saved yet. Write down the first thing He gave you.</li>')}</ul>

      ${raw(
        adding
          ? `<section class="card">
              <h3 class="card-title">Something new to hold onto</h3>
              <form class="enc-form add-enc">
                <input type="text" name="title" data-fk="new-title" maxlength="60" placeholder="Title — e.g. The aisle" />
                <textarea name="text" rows="7" required placeholder="A vision, a word, a promise, something someone said…"></textarea>
                <input type="text" name="source" maxlength="60" placeholder="Where it came from (optional)" />
                <div class="row row-end">
                  <button type="button" class="link-btn cancel-add">Cancel</button>
                  <button type="submit" class="btn btn-primary">Save</button>
                </div>
              </form>
            </section>`
          : '<button class="btn add-enc-btn">Add an encouragement</button>'
      )}

      <section class="card">
        <h2 class="card-title">For the hard days</h2>
        <ul class="promises">
          ${raw(
            PROMISES.map(
              (p) => `<li><blockquote class="verse verse-sm">${esc(p.text)}</blockquote><cite class="verse-ref">${esc(p.ref)}</cite></li>`
            ).join('')
          )}
        </ul>
      </section>
    </div>
  `);

  on(root, '[data-pin]', 'click', (e) => {
    store.pinEncouragement(e.currentTarget.dataset.pin);
    toast('It will meet you on Today.');
  });

  on(root, '[data-edit]', 'click', (e) => {
    editingId = e.currentTarget.dataset.edit;
    adding = false;
    store.update(() => {});
  });

  on(root, '.cancel-edit', 'click', () => {
    editingId = null;
    store.update(() => {});
  });

  on(root, '.enc.is-editing .enc-form', 'submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const id = f.closest('.enc').dataset.id;
    editingId = null;
    store.editEncouragement(id, {
      title: f.elements.title.value,
      text: f.elements.text.value,
      source: f.elements.source.value
    });
    toast('Saved.');
  });

  on(root, '[data-delete]', 'click', (e) => {
    const btn = e.currentTarget;
    arm(btn, 'Tap again to delete', () => store.removeEncouragement(btn.dataset.delete));
  });

  on(root, '.add-enc-btn', 'click', () => {
    adding = true;
    editingId = null;
    store.update(() => {});
  });

  on(root, '.cancel-add', 'click', () => {
    adding = false;
    store.update(() => {});
  });

  on(root, '.add-enc', 'submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (store.addEncouragement({ title: f.elements.title.value, text: f.elements.text.value, source: f.elements.source.value })) {
      adding = false;
      toast('Written down.');
    }
  });

  return root;
}
