// Local-first state. Everything lives in this browser; nothing is sent anywhere.
import { PILLARS, HABITS } from './data.js';

const KEY = 'marriage-prep:v1';
const SCHEMA = 1;

const listeners = new Set();
let state = load();

function blank() {
  return {
    version: SCHEMA,
    startedAt: new Date().toISOString(),
    pillars: {},
    habits: {},
    customHabits: [],
    journal: [],
    settings: { theme: 'auto', name: '' }
  };
}

function normalize(raw) {
  const base = blank();
  const s = raw && typeof raw === 'object' ? raw : {};
  const out = {
    version: SCHEMA,
    startedAt: s.startedAt || base.startedAt,
    pillars: {},
    habits: {},
    customHabits: Array.isArray(s.customHabits) ? s.customHabits : [],
    journal: Array.isArray(s.journal) ? s.journal : [],
    settings: Object.assign({}, base.settings, s.settings || {})
  };
  for (const p of PILLARS) {
    const prev = (s.pillars && s.pillars[p.id]) || {};
    out.pillars[p.id] = {
      steps: prev.steps && typeof prev.steps === 'object' ? prev.steps : {},
      custom: Array.isArray(prev.custom) ? prev.custom : [],
      notes: typeof prev.notes === 'string' ? prev.notes : ''
    };
  }
  const habitIds = HABITS.map((h) => h.id).concat(out.customHabits.map((h) => h.id));
  for (const id of habitIds) {
    const prev = (s.habits && s.habits[id]) || {};
    out.habits[id] = { log: prev.log && typeof prev.log === 'object' ? prev.log : {} };
  }
  return out;
}

function load() {
  try {
    return normalize(JSON.parse(localStorage.getItem(KEY) || 'null'));
  } catch (e) {
    console.warn('Could not read saved data, starting fresh.', e);
    return normalize(null);
  }
}

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save.', e);
    }
  }, 80);
}

function emit() {
  for (const fn of listeners) fn(state);
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Mutate state, persist, and re-render. */
export function update(mutator) {
  mutator(state);
  save();
  emit();
}

/** Mutate and persist without re-rendering — for fields the DOM already reflects. */
export function updateSilent(mutator) {
  mutator(state);
  save();
}

export function replaceState(raw) {
  state = normalize(raw);
  save();
  emit();
}

export function resetAll() {
  state = normalize(null);
  save();
  emit();
}

export function exportJSON() {
  return JSON.stringify(state, null, 2);
}

/* ---------- dates ---------- */

export function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(d, n) {
  const c = new Date(d.getTime());
  c.setDate(c.getDate() + n);
  return c;
}

/** Monday-based start of the week containing d. */
export function weekStart(d = new Date()) {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const shift = (c.getDay() + 6) % 7;
  return addDays(c, -shift);
}

/* ---------- pillars ---------- */

export function allSteps(pillar) {
  const custom = (state.pillars[pillar.id] && state.pillars[pillar.id].custom) || [];
  return pillar.steps.concat(custom.map((c) => ({ id: c.id, title: c.title, hint: '', custom: true })));
}

export function isDone(pillarId, stepId) {
  const rec = state.pillars[pillarId] && state.pillars[pillarId].steps[stepId];
  return !!(rec && rec.done);
}

export function toggleStep(pillarId, stepId) {
  update((s) => {
    const steps = s.pillars[pillarId].steps;
    const cur = steps[stepId];
    if (cur && cur.done) delete steps[stepId];
    else steps[stepId] = { done: true, at: new Date().toISOString() };
  });
}

export function addCustomStep(pillarId, title) {
  const clean = title.trim();
  if (!clean) return null;
  const id = 'c_' + Math.random().toString(36).slice(2, 9);
  update((s) => {
    s.pillars[pillarId].custom.push({ id, title: clean });
  });
  return id;
}

export function removeCustomStep(pillarId, stepId) {
  update((s) => {
    const p = s.pillars[pillarId];
    p.custom = p.custom.filter((c) => c.id !== stepId);
    delete p.steps[stepId];
  });
}

export function setNotes(pillarId, text) {
  updateSilent((s) => {
    s.pillars[pillarId].notes = text;
  });
}

export function pillarProgress(pillar) {
  const steps = allSteps(pillar);
  const done = steps.filter((st) => isDone(pillar.id, st.id)).length;
  return { done, total: steps.length, pct: steps.length ? Math.round((done / steps.length) * 100) : 0 };
}

export function overallProgress() {
  let done = 0;
  let total = 0;
  for (const p of PILLARS) {
    const pr = pillarProgress(p);
    done += pr.done;
    total += pr.total;
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/* ---------- habits ---------- */

export function habits() {
  return HABITS.concat(state.customHabits);
}

export function habitDone(habitId, key = dayKey()) {
  const h = state.habits[habitId];
  return !!(h && h.log[key]);
}

export function toggleHabit(habitId, key = dayKey()) {
  update((s) => {
    if (!s.habits[habitId]) s.habits[habitId] = { log: {} };
    const log = s.habits[habitId].log;
    if (log[key]) delete log[key];
    else log[key] = true;
  });
}

export function addCustomHabit(title, cadence, target) {
  const clean = title.trim();
  if (!clean) return null;
  const id = 'h_' + Math.random().toString(36).slice(2, 9);
  update((s) => {
    s.customHabits.push({ id, title: clean, cadence, target: cadence === 'weekly' ? target || 1 : undefined });
    s.habits[id] = { log: {} };
  });
  return id;
}

export function removeCustomHabit(id) {
  update((s) => {
    s.customHabits = s.customHabits.filter((h) => h.id !== id);
    delete s.habits[id];
  });
}

/** Consecutive days ending today (or yesterday, if today is not marked yet). */
export function streak(habitId) {
  const log = (state.habits[habitId] && state.habits[habitId].log) || {};
  let cursor = new Date();
  if (!log[dayKey(cursor)]) cursor = addDays(cursor, -1);
  let n = 0;
  while (log[dayKey(cursor)] && n < 3650) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

/** How many days this Monday-based week the habit was marked. */
export function weekCount(habitId) {
  const log = (state.habits[habitId] && state.habits[habitId].log) || {};
  const start = weekStart();
  let n = 0;
  for (let i = 0; i < 7; i++) if (log[dayKey(addDays(start, i))]) n++;
  return n;
}

/* ---------- journal ---------- */

export function addEntry(entry) {
  const id = 'j_' + Math.random().toString(36).slice(2, 9);
  update((s) => {
    s.journal.unshift(Object.assign({ id, at: new Date().toISOString() }, entry));
  });
  return id;
}

export function removeEntry(id) {
  update((s) => {
    s.journal = s.journal.filter((e) => e.id !== id);
  });
}

export function markAnswered(id) {
  update((s) => {
    const e = s.journal.find((x) => x.id === id);
    if (e) e.answeredAt = e.answeredAt ? null : new Date().toISOString();
  });
}

export function setSetting(key, value) {
  update((s) => {
    s.settings[key] = value;
  });
}
