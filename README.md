# Stoch - Discography

🌐 **Live Site:** [https://egil10.github.io/stoch/](https://egil10.github.io/stoch/)

Welcome to the production log and artist site for **Stoch**, an AI-driven music project that bends funk, disco, and futuristic textures across every key. This repository hosts two complete albums, artwork assets, song blueprints, and track notes, keeping the creative flow organized from first riff to final master.

## Albums

### Chromatic Drift
A kaleidoscopic concept album exploring funk, disco, and future-soul across 12 keys. Each track lives in a unique key, pulling references from CHIC, Prince, Parcels, Khruangbin, Daft Punk, Japanese City Pop, Egyptian Funk, and more. The album showcases spectrum-storytelling through instrumental funk tracks that journey from Nile Rodgers-style grooves to Arabian disco-funk.

**14 tracks** including:
- Another Day of Spring (A)
- Ain't it Sharp (A#)
- Brown Emotion (B)
- Chromatic Drift (C)
- Caring About You (C#)
- Daft Unc (D)
- Dental Degree (D#)
- Evening Hour (E)
- Factory Fever (F)
- Fuji Funkline (F#)
- Golden Riviera (G)
- Gulfstream (G#)
- And more...

### Better Times 3000
A warm, nostalgic disco-funk album inspired by the golden era of 1970s and 1980s dance music. Features Chic-inspired instrumentation with Nile Rodgers-style guitar, Bernard Edwards-influenced bass, and warm female backing vocals throughout. The album blends classic disco energy with modern production polish, creating a timeless sound that feels like dancing through the golden hour.

**12 tracks** including:
- Stay With Me Tonight
- Echoes of You
- Slow Burning Lights
- Rhythm in My Veins / Rhythm Still in My Veins
- Golden Hour Love
- Touch of Midnight
- Forever Feels Like This
- Swaying With the Stars
- Cold but Free / Cold No More
- Dawn of the Night

## Repository layout

- `index.html` / `styles.css` - Artist landing site with album showcases, located at the repo root for GitHub Pages deployment
- `albums/` - Contains both albums with their complete track listings, cover art, and markdown documentation
  - `albums/Chromatic Drift/` - Album cover art (PNG), all 14 MP3 tracks, and production notes
  - `albums/Better Times 3000/` - Album cover art (PNG), all 12 MP3 tracks, and production notes
- `assets/` - Visual collateral, sketches, alternate covers, typography experiments
- `docs/` - Template and documentation files for song planning workflow

## Song planning workflow

1. Open the markdown file for the album you want to explore
2. Each album's markdown file contains detailed production notes for each track
3. When tracks are rendered, export the MP3 and move it into the appropriate album folder alongside the final artwork
4. Update the markdown file with any additional production notes or references

## GitHub Pages site

The site showcases both albums with:
- Featured album covers and artwork
- Complete track listings for each album
- Playable audio tracks
- Artist bio and creative process
- Links to streaming platforms and social media

**Preview locally:** run `npx serve .` (or use any static-file server) from the repo root and open `http://localhost:3000`.

**Publish:** set GitHub Pages to deploy from the root of the `main` branch. The vibrant artist page highlights both albums, track details, and contact links.

## Creative influences

- **Funk & Disco:** CHIC, Nile Rodgers, Bernard Edwards, Prince, Parcels
- **Modern Funk:** Daft Punk, Vulfpeck, Cory Wong, Chromeo
- **World Funk:** Japanese City Pop (Tatsuro Yamashita, Casiopea), Egyptian Funk (Hamid El Shaeri), French Disco (L'Impératrice, Jean Tonique)
- **Indie & Fusion:** Khruangbin, Tame Impala, Benny Sings
- **Classic Disco:** Bee Gees, Sister Sledge, Wild Cherry, Ohio Players

## Next ideas

- Add individual track pages with detailed production notes
- Create remix packs and stems folders per album
- Build an interactive visualizer for each track
- Add a making-of blog section
- Render album art variants and create a gallery

Have fun drifting through the spectrum.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
