# Prepare

A small, private, offline-first PWA for the work that comes before marriage — built around six things to prepare, and around the fact that none of it holds without God.

> Unless the LORD builds the house, those who build it labor in vain. — Psalm 127:1

## What's in it

**Six pillars**, each with concrete steps you can check off, your own notes, and a verse to anchor it:

| Pillar | The aim |
| --- | --- |
| A Church to Bring Her Into | Be rooted in one established local church — known, under elders, serving |
| Enough to Carry a Household | Income, margin, and habits strong enough that she could stay home with the children |
| Strength Worth Trusting | Train the body — for her, for the work of providing, for the endurance fatherhood asks |
| Abide | Stay close to God. This one never gets checked off |
| Learning to Be a Father | Become — years early — the father your children will describe |
| How I Will Pursue Her | Decided in a clear season, acted on later. Not yet |

**Today** — the verse for the day, daily and weekly rhythms with streaks, and the next faithful step from each pillar.

**Journal** — prayers, reflections, and answered prayer, so you can look back and see what He actually did.

Add your own steps and your own rhythms anywhere. Nothing is fixed.

## Privacy

Everything lives in this browser's `localStorage`. There is no account, no server, and no analytics — nothing leaves the device. Back it up from **More → Export a backup**, and restore that file on any device.

## Running it

It is plain HTML, CSS, and ES modules. No build step, no dependencies.

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

Service workers need `https` or `localhost`, so open it at `localhost` rather than as a `file://` path.

### Tests

```sh
node --test "tests/*.test.mjs"
```

## Installing it on your phone

Once it is served over https (see below):

- **iPhone** — open it in Safari, then Share → *Add to Home Screen*.
- **Android** — open it in Chrome, then menu → *Install app*, or use the button under **More**.

After the first load it works with no signal at all.

## Hosting

`.github/workflows/pages.yml` runs the tests and publishes the repository root to GitHub Pages on every push to `main`. Turn it on once under **Settings → Pages → Build and deployment → Source: GitHub Actions**; the app then lives at `https://<user>.github.io/marrige-prep/`.

Every path in the app is relative, so it also works from any static host or subfolder.

## Layout

```
index.html              app shell, tab bar
manifest.webmanifest    install metadata
sw.js                   offline cache (bump CACHE when files change)
css/app.css             one stylesheet, light and dark
js/data.js              the pillars, steps, rhythms, and verses — edit these freely
js/store.js             state, persistence, streaks, progress
js/app.js               hash router and render loop
js/views/               today, path, pillar, journal, settings
tests/                  store tests, run with node --test
```

To change the content — different steps, different verses, a seventh pillar — edit `js/data.js`. Step ids are what progress is keyed to, so rename titles freely but keep ids stable.
