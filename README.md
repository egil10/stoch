# Chromatic Drift by Stoch

Welcome to the production log for **Chromatic Drift**, Stoch's AI-driven concept album that bends funk, disco, and futuristic textures across every key. This repository keeps artwork assets, song blueprints, and track notes in one place so the creative flow stays organized from first riff to final master.

## Repository layout
- `index.html` / `styles.css` - colorful GitHub Pages landing site located at the repo root so Pages can publish directly from the `main` branch.
- `chromatic-drift-cover/` - drop the final album art plus every mastered MP3 in this folder (a `.gitkeep` file holds the directory in git until the real files show up).
- `assets/` - stash sketches, alternate covers, typography experiments, or any visual collateral before they’re final enough for the main cover folder.
- `song-plans/` - contains one markdown plan per musical key (`A.md`, `A#.md`, ... `G#.md`) plus the reusable `template.md`.

## Song planning workflow
1. Open the markdown file for the key you want to explore.
2. Copy the contents of `song-plans/template.md` into that key file.
3. Fill in the details: references, tone, instrumentation, structure, and any Suno notes.
4. When the track is rendered, export the MP3 and move it into `chromatic-drift-cover/` alongside the final artwork.

## Song template preview
The template in `song-plans/template.md` captures everything needed to brief Suno (or any collaborator): song number, key, genre, reference artists/songs, instrumentation checklist, vocal direction, and a full timeline from intro to outro. Keeping that single source of truth means you can tweak instrumentation or references once and propagate the ideas across all keys.

## GitHub Pages site
- **Preview locally:** run `npx serve .` (or use any static-file server) from the repo root and open `http://localhost:3000`.
- **Publish:** set GitHub Pages to deploy from the root of the `main` branch. The vibrant one-pager highlights the album concept, per-key moods, calls-to-action, and contact links.

## Next ideas
- Track production status in each key file (e.g., demo, mix, master).
- Add stems/notes folders per song once arrangements solidify.
- Render album art variants and drop them into `chromatic-drift-cover/` for quick comparisons.

Have fun drifting through the spectrum.