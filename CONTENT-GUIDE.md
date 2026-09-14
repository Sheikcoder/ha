# Hanif Abdullah — website content guide

All words, news items, timeline chapters, results and contact addresses live in
**`src/content/site.js`**. Edit that one file to update the site — no layout code needs to change.

| Section | Where to edit |
|---|---|
| Name, tagline, "Hope Always", emails, social links | `BRAND` |
| Menu order / labels | `NAV` |
| Home intro + latest news cards | `HOME` |
| About: story, goals, vision | `ABOUT` |
| Journey timeline (started tennis → first tournament → Spain → Thailand → future) | `JOURNEY.milestones` (set `status: 'next'` on the upcoming one) |
| Gallery photos & videos | `GALLERY` (put image files in `public/`, YouTube embed URLs in `embed`) |
| Results table, titles, rankings note | `RESULTS` |
| Partners: sponsors, equipment, academies | `PARTNERS` |
| Contact channels | `CONTACT.channels` |

## Display modes
The site ships with two looks, switchable from the toggle in the navigation (and in the mobile menu):
- **Wine** (default) — white and silver surfaces with burgundy accents; the 3D arena becomes a bright day-session stadium.
- **Dark** — lifted charcoal with silver and burgundy; the arena becomes a night session under floodlights.

The visitor's choice is remembered in the browser. To change the default, edit the fallback `'wine'` in `src/theme.jsx` and in the small inline script in `index.html`. All colours for both modes are defined once at the top of `src/styles.css`; the arena palettes live in `PALETTES` in `src/components/TennisScene.jsx`.

## Sound
Sound is off until the visitor taps the speaker button (in the navigation, the mobile menu, or the "Turn on sound" pill on the home page). The choice is remembered.
- Court effects (racket hit, bounce) and a soft stadium ambience are synthesised in the browser — no audio files needed.
- Background music is also generated (a slow, calm theme) **unless** a file named `public/audio/theme.mp3` exists — drop a licensed track there and it plays instead, looped, at a gentle volume. Levels are in `src/audio.js` (`musicBus`, `sfx`, `ambienceBus`).

## Performance notes
- Every 3D scene pauses automatically when it is scrolled off screen or the tab is in the background.
- The arena drops its pixel ratio if a device cannot hold 60 fps (`PerformanceMonitor` in `TennisScene.jsx`), and phones / low-core machines get lighter settings automatically (`src/perf.js`).
- Visitors with "reduce motion" enabled get slower ball play and no tilt/sheen effects.

## Brand rules baked into the design
- Colours: Deep Burgundy `#6E0F1F` + White (primary); Charcoal `#1B1B1E` + Silver `#C9CBD1` (secondary). Tokens are at the top of `src/styles.css`.
- Photography: black / white / burgundy, minimal editing, clean backgrounds. Photos in the gallery get a light grayscale/contrast treatment automatically so they feel consistent.
- Voice: professional, respectful, humble, hard-working — record losses as honestly as wins.

## Pages
Routing is hash-based (`#/about`, `#/journey/spain`, `#/contact/media`) so it works on any static host with no server configuration.

## Running
```
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```
