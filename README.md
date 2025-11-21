# Stoch - AI Funk & Disco Artist

🌐 **Live Site:** [https://egil10.github.io/stoch/](https://egil10.github.io/stoch/)

Welcome to **Stoch**, an AI-driven music project that crafts kaleidoscopic soundscapes where funk meets disco, where CHIC collides with Daft Punk, and where every key tells a story. This repository hosts five complete albums with full track listings, artwork, and an interactive web player—bringing the groove directly to your browser.

## 🎵 Featured Albums

### Chromatic Drift
A kaleidoscopic concept album exploring funk, disco, and future-soul across all 12 keys. Each track lives in a unique key, pulling references from CHIC, Prince, Parcels, Khruangbin, Daft Punk, Japanese City Pop, Egyptian Funk, and more. The album showcases spectrum-storytelling through instrumental funk tracks that journey from Nile Rodgers-style grooves to Arabian disco-funk.

**12 tracks** including:
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

### Elements
An electronic exploration of rhythmic elements, blending futuristic sound design with classic funk foundations. This album deconstructs and rebuilds funk & disco elements through an electronic lens, creating immersive soundscapes that pulse with energy and groove.

**14 tracks** including:
- Riding the High
- At Half Pulse / At Half Pulse (Revisited)
- Riding the High (Emphasis)
- Call Me Now
- Calling You
- Dropping In
- Rhodesian Sun
- Ride High Ride Low
- Ride With Me
- Falling Through the Sound
- Having Fallen Once
- At Ways End
- Rain & Echoes

### NORGE TIL VM
A celebration of Norwegian football spirit through funk and disco. This album captures the energy, passion, and unity of Norway's journey to the World Cup, blending infectious grooves with anthemic melodies that inspire and uplift. From the mountains to the fjords, from San Siro to Mexico 2026—every track pulses with the heartbeat of a nation united in football.

**14 tracks** including:
- Rødt Hvitt Blått Vi Står Sammen
- Slaget På San Siro
- Solbakkens Menn
- Fra Fjell Til Fjord
- Til VM Vi Skal
- Våre Helter
- Nordic Giants
- Bobb Nusa Anthem
- Legends in Motion
- Mot Mexico 2026
- Hver Pasning Hvert Spark
- Vi Reiser Til USA
- Til VM (Na-Na-Na)
- Til VM Vi Skal Igjen

### Bombaristoclat
A sun-soaked tropical escape through funk and disco. This album captures the essence of beachside vibes, island rhythms, and carefree summer energy. From surf-side grooves to Caribbean heatwaves, each track transports you to paradise with infectious melodies and laid-back funk that makes you want to dance in the sand.

**9 tracks** including:
- Bombaristoclat
- Beachside Love
- Ocean Breeze Interlude
- Clat
- Island Roamer
- Surf On It
- Beach Lovers
- Kingston Heatwave
- Sail Along

## 🎮 Interactive Web Player

The site features a fully-functional, modern music player with:

- **Track Playback**: Play any track directly in your browser
- **Album Controls**: Play entire albums, shuffle tracks, and repeat modes (off, one, all)
- **Now Playing Bar**: Persistent player bar at the bottom with track info, progress, and controls
- **Progress Seeking**: Click or tap anywhere on the progress bar to jump to that position
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Theme Toggle**: Switch between light and dark modes
- **Smooth Animations**: GPU-accelerated animations for high FPS performance

## 📁 Repository Structure

```
stoch/
├── index.html              # Main artist landing page
├── styles.css              # Complete stylesheet with responsive design
├── player.js               # Audio player logic and controls
├── theme.js                # Light/dark mode theme manager
├── visualizer.js           # Audio visualizer (optional)
├── albums/                 # All five complete albums
│   ├── Chromatic Drift/    # 12 MP3 tracks + cover art
│   ├── Better Times 3000/  # 12 MP3 tracks + cover art
│   ├── Elements/           # 14 MP3 tracks + cover art
│   ├── NORGE TIL VM/       # 14 MP3 tracks + cover art
│   └── Bombaristoclat/     # 9 MP3 tracks + cover art
├── assets/                 # Visual assets and artwork
│   └── images/             # Album covers and images
└── LICENSE                 # MIT License
```

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/egil10/stoch.git
cd stoch
```

2. Serve locally:
```bash
npx serve .
```

3. Open your browser:
```
http://localhost:3000
```

### Deployment

The site is configured for GitHub Pages deployment:

1. Set GitHub Pages to deploy from the root of the `main` branch
2. The site will be available at `https://[username].github.io/stoch/`

## 🎨 Features

### Player Functionality
- ✅ Play/pause individual tracks
- ✅ Play entire albums with one click
- ✅ Shuffle mode per album
- ✅ Repeat modes: Off, One, All
- ✅ Track progress with seek functionality
- ✅ Previous/next track navigation
- ✅ Volume control
- ✅ Track reset when switching songs

### Design & UX
- ✅ Modern, clean Scandinavian-style design
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Light/dark theme toggle
- ✅ Smooth animations and transitions
- ✅ Touch-optimized for mobile devices
- ✅ Accessible controls (44px minimum touch targets)

### Technical
- ✅ Vanilla JavaScript (no frameworks)
- ✅ CSS Grid and Flexbox layouts
- ✅ GPU-accelerated animations
- ✅ Web Audio API integration
- ✅ Local storage for theme preferences
- ✅ Semantic HTML5 structure

## 🎭 Creative Influences

- **Funk & Disco:** CHIC, Nile Rodgers, Bernard Edwards, Prince, Parcels
- **Modern Funk:** Daft Punk, Vulfpeck, Cory Wong, Chromeo
- **World Funk:** Japanese City Pop (Tatsuro Yamashita, Casiopea), Egyptian Funk (Hamid El Shaeri), French Disco (L'Impératrice, Jean Tonique)
- **Indie & Fusion:** Khruangbin, Tame Impala, Benny Sings
- **Classic Disco:** Bee Gees, Sister Sledge, Wild Cherry, Ohio Players

## 🔮 Future Ideas

- Add individual track pages with detailed production notes
- Create remix packs and stems folders per album
- Build an interactive visualizer for each track
- Add a making-of blog section
- Render album art variants and create a gallery
- Add playlist functionality
- Integrate with music streaming platforms

## 📝 Song Planning Workflow

1. Open the markdown file for the album you want to explore
2. Each album's markdown file contains detailed production notes for each track
3. When tracks are rendered, export the MP3 and move it into the appropriate album folder alongside the final artwork
4. Update the markdown file with any additional production notes or references

## 🤝 Contributing

This is a personal artist project, but suggestions and feedback are welcome! Feel free to open issues or submit pull requests for improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Welcome to the drift.** 🎸✨