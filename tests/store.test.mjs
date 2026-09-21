// Run with: node --test tests/
// The store is plain ES modules, so it can be exercised in Node with a small
// localStorage stand-in.
import test from 'node:test';
import assert from 'node:assert/strict';

const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k)
};

const store = await import('../js/store.js');
const { PILLARS } = await import('../js/data.js');

test('starts empty with a slot for every pillar', () => {
  const s = store.getState();
  for (const p of PILLARS) assert.ok(s.pillars[p.id], `missing ${p.id}`);
  assert.equal(store.overallProgress().done, 0);
  assert.ok(store.overallProgress().total > 50);
});

test('toggling a step is reversible and dated', () => {
  store.toggleStep('church', 'list');
  assert.equal(store.isDone('church', 'list'), true);
  assert.ok(store.getState().pillars.church.steps.list.at);
  assert.equal(store.pillarProgress(PILLARS[0]).done, 1);
  store.toggleStep('church', 'list');
  assert.equal(store.isDone('church', 'list'), false);
  assert.equal(store.overallProgress().done, 0);
});

test('custom steps count toward progress and can be removed', () => {
  const before = store.pillarProgress(PILLARS[0]).total;
  const id = store.addCustomStep('church', '  Ask about their missions giving  ');
  assert.ok(id);
  assert.equal(store.pillarProgress(PILLARS[0]).total, before + 1);
  const added = store.allSteps(PILLARS[0]).find((s) => s.id === id);
  assert.equal(added.title, 'Ask about their missions giving');
  store.toggleStep('church', id);
  assert.equal(store.pillarProgress(PILLARS[0]).done, 1);
  store.removeCustomStep('church', id);
  assert.equal(store.pillarProgress(PILLARS[0]).total, before);
  assert.equal(store.pillarProgress(PILLARS[0]).done, 0);
});

test('blank custom steps are rejected', () => {
  assert.equal(store.addCustomStep('church', '   '), null);
  assert.equal(store.addCustomHabit('  ', 'daily'), null);
});

test('a daily streak counts back from today', () => {
  const today = new Date();
  for (let i = 0; i < 4; i++) store.toggleHabit('word', store.dayKey(store.addDays(today, -i)));
  assert.equal(store.streak('word'), 4);
  store.toggleHabit('word', store.dayKey(today)); // un-mark today
  assert.equal(store.streak('word'), 3, 'yesterday still anchors the streak');
});

test('a gap breaks the streak', () => {
  const today = new Date();
  for (let i = 0; i < 6; i++) store.toggleHabit('pray', store.dayKey(store.addDays(today, -i)));
  store.toggleHabit('pray', store.dayKey(store.addDays(today, -2)));
  assert.equal(store.streak('pray'), 2);
});

test('weekly counts stay inside the Monday week', () => {
  const start = store.weekStart();
  assert.equal(start.getDay(), 1, 'weeks start on Monday');
  store.toggleHabit('train', store.dayKey(start));
  store.toggleHabit('train', store.dayKey(store.addDays(start, 3)));
  store.toggleHabit('train', store.dayKey(store.addDays(start, -1))); // last week
  assert.equal(store.weekCount('train'), 2);
});

test('custom habits get their own log', () => {
  const id = store.addCustomHabit('Call my parents', 'weekly', 2);
  assert.ok(store.getState().habits[id]);
  store.toggleHabit(id);
  assert.equal(store.weekCount(id), 1);
  store.removeCustomHabit(id);
  assert.equal(store.getState().habits[id], undefined);
  assert.equal(store.habits().some((h) => h.id === id), false);
});

test('journal entries are newest-first and answerable', () => {
  const a = store.addEntry({ type: 'prayer', pillar: 'provision', text: 'For the job' });
  store.addEntry({ type: 'reflection', pillar: '', text: 'Slow down' });
  assert.equal(store.getState().journal[0].text, 'Slow down');
  store.markAnswered(a);
  assert.ok(store.getState().journal.find((e) => e.id === a).answeredAt);
  store.markAnswered(a);
  assert.equal(store.getState().journal.find((e) => e.id === a).answeredAt, null);
  store.removeEntry(a);
  assert.equal(store.getState().journal.some((e) => e.id === a), false);
});

test('export round-trips through import', () => {
  store.toggleStep('body', 'baseline');
  store.setNotes('body', 'Squat 225 today.');
  const backup = store.exportJSON();
  store.resetAll();
  assert.equal(store.isDone('body', 'baseline'), false);
  store.replaceState(JSON.parse(backup));
  assert.equal(store.isDone('body', 'baseline'), true);
  assert.equal(store.getState().pillars.body.notes, 'Squat 225 today.');
});

test('a damaged or foreign backup does not crash the app', () => {
  store.replaceState({ pillars: 'nonsense', journal: 42, settings: null });
  const s = store.getState();
  for (const p of PILLARS) assert.deepEqual(s.pillars[p.id].steps, {});
  assert.deepEqual(s.journal, []);
  assert.equal(s.settings.theme, 'auto');
});

test('subscribers are notified and can unsubscribe', () => {
  let hits = 0;
  const off = store.subscribe(() => hits++);
  store.toggleStep('god', 'daily');
  assert.equal(hits, 1);
  off();
  store.toggleStep('god', 'daily');
  assert.equal(hits, 1);
});

test('the purity pillar is present, prioritized, and tied to the clean-day habit', async () => {
  const { HABIT_BY_ID } = await import('../js/data.js');
  const purity = PILLARS.find((p) => p.id === 'purity');
  assert.ok(purity, 'purity pillar exists');
  assert.equal(purity.priority, true);
  assert.equal(purity.streakHabit, 'clean');
  assert.ok(HABIT_BY_ID.clean, 'the clean-day habit exists');
  assert.equal(HABIT_BY_ID.clean.pillar, 'purity');
  assert.equal(HABIT_BY_ID.clean.cadence, 'daily');
  assert.ok(store.getState().pillars.purity, 'it has a slot in state');
});

test('encouragements are seeded on a first run and on an older backup', () => {
  store.resetAll();
  assert.equal(store.encouragements().length, 1);
  assert.equal(store.pinnedEncouragement().id, 'aisle');
  store.replaceState({ journal: [] }); // a backup written before this existed
  assert.equal(store.encouragements().length, 1, 'seeded rather than left empty');
  store.replaceState(Object.assign(JSON.parse(store.exportJSON()), { encouragements: [] }));
  assert.equal(store.encouragements().length, 0, 'but an empty list is respected');
});

test('encouragements can be added, edited, pinned, and removed', () => {
  store.resetAll();
  const id = store.addEncouragement({ title: 'What he said', text: 'Wait for it.', source: 'Pastor' });
  assert.ok(id);
  assert.equal(store.encouragements()[0].id, id, 'newest first');
  assert.equal(store.encouragements().find((e) => e.id === id).pinned, false, 'the seeded one keeps the pin');

  store.pinEncouragement(id);
  assert.equal(store.pinnedEncouragement().id, id);
  assert.equal(store.encouragements().filter((e) => e.pinned).length, 1, 'only ever one pin');

  store.editEncouragement(id, { text: 'Wait for it. He is not late.', title: '' });
  const edited = store.encouragements().find((e) => e.id === id);
  assert.equal(edited.text, 'Wait for it. He is not late.');
  assert.equal(edited.title, 'What he said', 'a blank title leaves the old one alone');

  store.removeEncouragement(id);
  assert.equal(store.encouragements().length, 1);
  assert.equal(store.pinnedEncouragement().id, 'aisle', 'the pin moves rather than vanishing');
  assert.equal(store.addEncouragement({ title: 'x', text: '   ' }), null, 'blank text is rejected');
});

test('the clean-day streak tracks both the current run and the longest ever', () => {
  store.resetAll();
  const today = new Date();
  for (const offset of [40, 39, 38, 37, 36, 20, 19, 1, 0]) {
    store.toggleHabit('clean', store.dayKey(store.addDays(today, -offset)));
  }
  assert.equal(store.streak('clean'), 2, 'yesterday and today');
  assert.equal(store.bestStreak('clean'), 5, 'the best run stands even after a fall');
  store.resetAll();
  assert.equal(store.bestStreak('clean'), 0);
});
