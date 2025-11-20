// Modern Audio Player System for Stoch
class StochPlayer {
  constructor() {
    this.currentAudio = null;
    this.currentTrack = null;
    this.currentAlbum = null;
    this.playlists = new Map();
    this.albumModes = new Map(); // Store shuffle/repeat per album
    this.shuffledIndices = new Map();
    this.rafId = null; // RequestAnimationFrame ID
    this.isUpdating = false; // Prevent multiple update loops
    this.volume = 1.0; // Default volume
    
    this.nowPlayingBar = document.getElementById('now-playing-bar');
    this.init();
  }

  getAlbumMode(albumId) {
    if (!this.albumModes.has(albumId)) {
      this.albumModes.set(albumId, {
        shuffle: false,
        repeat: 'off' // 'off', 'one', 'all'
      });
    }
    return this.albumModes.get(albumId);
  }

  init() {
    // Initialize playlists from DOM
    this.setupPlaylists();
    // Setup event listeners
    this.setupEventListeners();
    // Initialize UI updates
    this.updateUI();
  }

  setupPlaylists() {
    const albums = document.querySelectorAll('[data-album-id]');
    albums.forEach(album => {
      const albumId = album.dataset.albumId;
      const tracks = Array.from(album.querySelectorAll('[data-track-src]'));
      
      const playlist = tracks.map((track, index) => ({
        element: track,
        src: track.dataset.trackSrc,
        name: track.dataset.trackName || `Track ${index + 1}`,
        index: index,
        audio: new Audio(track.dataset.trackSrc)
      }));

      // Setup audio event listeners
      playlist.forEach(track => {
        // Use passive event listeners and debounce metadata loading
        track.audio.addEventListener('loadedmetadata', () => {
          requestAnimationFrame(() => this.updateDuration(track));
        }, { passive: true });
      
        // Use more efficient timeupdate with throttling
      let lastUpdateTime = 0;
      track.audio.addEventListener('timeupdate', () => {
        const now = performance.now();
        // Throttle to ~60fps
        if (now - lastUpdateTime >= 16) {
          this.updateProgress(track);
          lastUpdateTime = now;
        }
      });
      track.audio.addEventListener('ended', () => {
        this.stopProgressUpdate();
        this.handleTrackEnd(track, albumId);
      });
      track.audio.addEventListener('play', () => {
        this.handleTrackPlay(track);
        this.updateProgress(track); // Start progress updates
        if (this.currentTrack === track && this.currentAudio) {
          this.currentAudio.volume = this.volume;
        }
        // Dispatch event for visualizer
        document.dispatchEvent(new CustomEvent('trackPlay', { detail: { track } }));
      });
      track.audio.addEventListener('pause', () => {
        this.stopProgressUpdate();
        this.handleTrackPause(track);
        // Dispatch event for visualizer
        document.dispatchEvent(new CustomEvent('trackPause', { detail: { track } }));
      });
    });

      this.playlists.set(albumId, playlist);
    });
  }

  setupEventListeners() {
    // Play/Pause buttons - use passive listeners for better performance
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="play-track"]')) {
        const trackEl = e.target.closest('[data-track-src]');
        this.playTrack(trackEl);
      } else if (e.target.closest('[data-action="play-album"]')) {
        const albumEl = e.target.closest('[data-album-id]');
        if (albumEl) {
          const albumId = albumEl.dataset.albumId;
          this.playAlbum(albumId);
        }
      } else if (e.target.closest('[data-action="toggle-shuffle"]')) {
        this.toggleShuffle(e);
      } else if (e.target.closest('[data-action="toggle-repeat"]')) {
        this.toggleRepeat(e);
      } else if (e.target.closest('[data-action="seek"]')) {
        const progressBar = e.target.closest('.progress-bar');
        if (progressBar && this.currentTrack) {
          const rect = progressBar.getBoundingClientRect();
          const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          this.seek(percent);
        }
      } else if (e.target.closest('[data-action="prev-track"]') || e.target.closest('#prev-track-btn')) {
        this.playPreviousTrack();
      } else if (e.target.closest('[data-action="next-track"]') || e.target.closest('#next-track-btn')) {
        this.playNextTrack();
      } else if (e.target.closest('#now-playing-main-play-btn') || e.target.closest('#now-playing-play-btn')) {
        if (this.currentTrack) {
          if (this.currentTrack.audio.paused) {
            this.currentTrack.audio.play();
            this.updateTrackUI(this.currentTrack, true);
          } else {
            this.currentTrack.audio.pause();
            this.updateTrackUI(this.currentTrack, false);
          }
        }
      } else if (e.target.closest('#volume-btn')) {
        const volumeControl = document.getElementById('volume-control');
        if (volumeControl) {
          volumeControl.style.display = volumeControl.style.display === 'none' ? 'flex' : 'none';
        }
      }
    });

    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.volume = e.target.value / 100;
        if (this.currentAudio) {
          this.currentAudio.volume = this.volume;
        }
      });
    }

    // Now playing bar seek
    const nowPlayingProgressBar = document.getElementById('now-playing-progress-bar');
    if (nowPlayingProgressBar) {
      nowPlayingProgressBar.addEventListener('click', (e) => {
        if (this.currentTrack && this.currentTrack.audio.duration) {
          const rect = nowPlayingProgressBar.getBoundingClientRect();
          const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          this.seek(percent);
        }
      });
    }
  }

  playTrack(trackElement) {
    const src = trackElement.dataset.trackSrc;
    const albumEl = trackElement.closest('[data-album-id]');
    const albumId = albumEl.dataset.albumId;
    const playlist = this.playlists.get(albumId);
    const track = playlist.find(t => t.src === src);

    if (!track) return;

    // Pause current track if different
    if (this.currentAudio && this.currentAudio !== track.audio) {
      this.currentAudio.pause();
      if (this.currentTrack) {
        this.updateTrackUI(this.currentTrack, false);
      }
    }

    // Toggle play/pause if same track
    if (this.currentTrack === track) {
      if (track.audio.paused) {
        track.audio.play();
      } else {
        track.audio.pause();
      }
    } else {
      // Play new track
      this.currentTrack = track;
      this.currentAlbum = { id: albumId, element: albumEl };
      this.currentAudio = track.audio;
      track.audio.volume = this.volume;
      track.audio.play();
      this.updateTrackUI(track, true);
      this.updateNowPlayingBar(track, albumEl);
      this.showNowPlayingBar();
    }
  }

  playAlbum(albumId, startIndex = 0) {
    const playlist = this.playlists.get(albumId);
    if (!playlist || playlist.length === 0) return;

    const mode = this.getAlbumMode(albumId);
    let indices;
    if (mode.shuffle) {
      indices = this.getShuffledIndices(albumId);
      startIndex = indices.indexOf(startIndex);
      if (startIndex === -1) startIndex = 0;
    } else {
      indices = playlist.map((_, i) => i);
    }

    const track = playlist[indices[startIndex]];
    this.playTrack(track.element);
  }

  getShuffledIndices(albumId) {
    if (!this.shuffledIndices.has(albumId)) {
      const playlist = this.playlists.get(albumId);
      const indices = Array.from({ length: playlist.length }, (_, i) => i);
      // Fisher-Yates shuffle
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      this.shuffledIndices.set(albumId, indices);
      this.originalIndices.set(albumId, [...indices]);
    }
    return this.shuffledIndices.get(albumId);
  }

  handleTrackEnd(track, albumId) {
    const mode = this.getAlbumMode(albumId);

    if (mode.repeat === 'one') {
      track.audio.currentTime = 0;
      track.audio.play();
    } else {
      const nextTrack = this.getNextTrack();
      if (nextTrack) {
        this.playTrack(nextTrack.element);
      } else {
        // No next track, stop playing
        this.currentTrack = null;
        this.currentAudio = null;
        this.currentAlbum = null;
        this.updateTrackUI(track, false);
        this.hideNowPlayingBar();
      }
    }
  }

  handleTrackPlay(track) {
    this.updateTrackUI(track, true);
    if (track === this.currentTrack && this.currentAlbum) {
      this.showNowPlayingBar();
      this.updateNowPlayingBar(track, this.currentAlbum.element);
    }
  }

  handleTrackPause(track) {
    this.updateTrackUI(track, false);
  }

  toggleShuffle(e) {
    const albumEl = e.target.closest('[data-album-id]');
    if (!albumEl) return;
    const albumId = albumEl.dataset.albumId;
    const mode = this.getAlbumMode(albumId);
    mode.shuffle = !mode.shuffle;
    
    const btn = albumEl.querySelector('[data-action="toggle-shuffle"]');
    if (btn) {
      btn.classList.toggle('active', mode.shuffle);
      btn.setAttribute('aria-label', mode.shuffle ? 'Shuffle: On' : 'Shuffle: Off');
    }
  }

  toggleRepeat(e) {
    const albumEl = e.target.closest('[data-album-id]');
    if (!albumEl) return;
    const albumId = albumEl.dataset.albumId;
    const mode = this.getAlbumMode(albumId);
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(mode.repeat);
    mode.repeat = modes[(currentIndex + 1) % modes.length];
    
    const btn = albumEl.querySelector('[data-action="toggle-repeat"]');
    if (btn) {
      btn.classList.toggle('active', mode.repeat !== 'off');
      btn.classList.toggle('repeat-one', mode.repeat === 'one');
      btn.setAttribute('aria-label', `Repeat: ${mode.repeat}`);
    }
  }

  seek(percent) {
    if (!this.currentTrack || !this.currentTrack.audio) return;
    const newTime = percent * this.currentTrack.audio.duration;
    this.currentTrack.audio.currentTime = newTime;
    this.updateProgress(this.currentTrack);
  }

  updateDuration(track) {
    const trackEl = track.element;
    const durationEl = trackEl.querySelector('.track-duration');
    if (durationEl && !isNaN(track.audio.duration)) {
      durationEl.textContent = this.formatTime(track.audio.duration);
    }
  }

  updateProgress(track) {
    if (!track.audio || !this.currentTrack || this.currentTrack !== track) {
      this.stopProgressUpdate();
      return;
    }
    
    // Use requestAnimationFrame for smooth updates
    if (!this.isUpdating && track.audio && !track.audio.paused) {
      this.isUpdating = true;
      this.rafId = requestAnimationFrame(() => this.updateProgressFrame(track));
    }
  }

  updateProgressFrame(track) {
    if (!track.audio || !this.currentTrack || this.currentTrack !== track || track.audio.paused) {
      this.stopProgressUpdate();
      return;
    }
    
    const trackEl = track.element;
    const progressBar = trackEl.querySelector('.progress-bar-fill');
    const currentTimeEl = trackEl.querySelector('.track-time');
    
    if (progressBar && track.audio.duration) {
      const percent = Math.min((track.audio.currentTime / track.audio.duration) * 100, 100);
      // Use transform for better performance (GPU accelerated)
      progressBar.style.transform = `scaleX(${percent / 100})`;
      progressBar.style.transformOrigin = 'left';
    }
    
    if (currentTimeEl) {
      currentTimeEl.textContent = this.formatTime(track.audio.currentTime);
    }

    // Update now playing bar progress
    this.updateNowPlayingProgress(track);
    
    // Continue updating if still playing
    if (track.audio && !track.audio.paused) {
      this.rafId = requestAnimationFrame(() => this.updateProgressFrame(track));
    } else {
      this.stopProgressUpdate();
    }
  }

  stopProgressUpdate() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isUpdating = false;
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  updateTrackUI(track, isPlaying) {
    const trackEl = track.element;
    const playBtn = trackEl.querySelector('[data-action="play-track"]');
    const progressBar = trackEl.querySelector('.progress-bar-fill');
    
    if (playBtn) {
      playBtn.classList.toggle('playing', isPlaying);
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    }
    
    if (isPlaying) {
      trackEl.classList.add('is-playing');
    } else {
      trackEl.classList.remove('is-playing');
    }

    // Update now playing bar buttons
    this.updateNowPlayingButtons(isPlaying);
  }

  showNowPlayingBar() {
    if (this.nowPlayingBar) {
      this.nowPlayingBar.style.display = 'grid';
      this.nowPlayingBar.classList.remove('hidden');
      // Add bottom padding to body to prevent content from being hidden
      document.body.style.paddingBottom = '90px';
    }
  }

  hideNowPlayingBar() {
    if (this.nowPlayingBar) {
      this.nowPlayingBar.classList.add('hidden');
      setTimeout(() => {
        if (this.nowPlayingBar.classList.contains('hidden')) {
          this.nowPlayingBar.style.display = 'none';
        }
      }, 300);
      document.body.style.paddingBottom = '0';
    }
  }

  updateNowPlayingBar(track, albumEl) {
    if (!this.nowPlayingBar || !track) return;

    const artworkImg = document.getElementById('now-playing-img');
    const trackName = document.getElementById('now-playing-name');
    const albumName = document.getElementById('now-playing-album');
    const totalTime = document.getElementById('now-playing-total-time');

    // Get album artwork
    const albumArtwork = albumEl.querySelector('.album-showcase__artwork img');
    if (artworkImg && albumArtwork) {
      artworkImg.src = albumArtwork.src;
      artworkImg.alt = track.name;
    }

    // Update track info
    if (trackName) {
      trackName.textContent = track.name;
      trackName.onclick = () => {
        track.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
    }

    // Get album name
    const albumTitle = albumEl.querySelector('.album-title');
    if (albumName && albumTitle) {
      albumName.textContent = albumTitle.textContent;
    }

    // Update duration
    if (totalTime && track.audio.duration) {
      totalTime.textContent = this.formatTime(track.audio.duration);
    }

    // Update play button in now playing bar artwork
    const artworkPlayBtn = document.getElementById('now-playing-play-btn');
    if (artworkPlayBtn) {
      artworkPlayBtn.onclick = () => {
        if (this.currentTrack) {
          if (this.currentTrack.audio.paused) {
            this.currentTrack.audio.play();
            this.updateTrackUI(this.currentTrack, true);
          } else {
            this.currentTrack.audio.pause();
            this.updateTrackUI(this.currentTrack, false);
          }
        }
      };
    }

    // Update main play button
    const mainPlayBtn = document.getElementById('now-playing-main-play-btn');
    if (mainPlayBtn) {
      mainPlayBtn.onclick = () => {
        if (this.currentTrack) {
          if (this.currentTrack.audio.paused) {
            this.currentTrack.audio.play();
            this.updateTrackUI(this.currentTrack, true);
          } else {
            this.currentTrack.audio.pause();
            this.updateTrackUI(this.currentTrack, false);
          }
        }
      };
    }
  }

  updateNowPlayingProgress(track) {
    if (!track.audio || !track.audio.duration) return;

    const progressFill = document.getElementById('now-playing-progress-fill');
    const currentTime = document.getElementById('now-playing-current-time');
    const totalTime = document.getElementById('now-playing-total-time');

    if (progressFill) {
      const percent = Math.min((track.audio.currentTime / track.audio.duration) * 100, 100);
      progressFill.style.transform = `scaleX(${percent / 100})`;
    }

    if (currentTime) {
      currentTime.textContent = this.formatTime(track.audio.currentTime);
    }

    if (totalTime && track.audio.duration) {
      totalTime.textContent = this.formatTime(track.audio.duration);
    }
  }

  updateNowPlayingButtons(isPlaying) {
    const mainPlayBtn = document.getElementById('now-playing-main-play-btn');
    const artworkPlayBtn = document.getElementById('now-playing-play-btn');

    [mainPlayBtn, artworkPlayBtn].forEach(btn => {
      if (btn) {
        btn.classList.toggle('playing', isPlaying);
        btn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
      }
    });
  }

  getNextTrack() {
    if (!this.currentTrack || !this.currentAlbum) return null;

    const albumId = this.currentAlbum.id;
    const playlist = this.playlists.get(albumId);
    const mode = this.getAlbumMode(albumId);
    let currentIndex;

    if (mode.shuffle) {
      const shuffled = this.getShuffledIndices(albumId);
      currentIndex = shuffled.indexOf(this.currentTrack.index);
      if (currentIndex < shuffled.length - 1) {
        return playlist[shuffled[currentIndex + 1]];
      } else if (mode.repeat === 'all') {
        this.shuffledIndices.delete(albumId);
        return playlist[this.getShuffledIndices(albumId)[0]];
      }
    } else {
      currentIndex = this.currentTrack.index;
      if (currentIndex < playlist.length - 1) {
        return playlist[currentIndex + 1];
      } else if (mode.repeat === 'all') {
        return playlist[0];
      }
    }

    return null;
  }

  getPreviousTrack() {
    if (!this.currentTrack || !this.currentAlbum) return null;

    const albumId = this.currentAlbum.id;
    const playlist = this.playlists.get(albumId);
    const mode = this.getAlbumMode(albumId);
    let currentIndex;

    if (mode.shuffle) {
      const shuffled = this.getShuffledIndices(albumId);
      currentIndex = shuffled.indexOf(this.currentTrack.index);
      if (currentIndex > 0) {
        return playlist[shuffled[currentIndex - 1]];
      } else if (mode.repeat === 'all') {
        return playlist[shuffled[shuffled.length - 1]];
      }
    } else {
      currentIndex = this.currentTrack.index;
      if (currentIndex > 0) {
        return playlist[currentIndex - 1];
      } else if (mode.repeat === 'all') {
        return playlist[playlist.length - 1];
      }
    }

    return null;
  }

  playNextTrack() {
    const nextTrack = this.getNextTrack();
    if (nextTrack) {
      this.playTrack(nextTrack.element);
    } else {
      this.hideNowPlayingBar();
    }
  }

  playPreviousTrack() {
    // If track is more than 3 seconds in, restart it; otherwise go to previous
    if (this.currentTrack && this.currentTrack.audio.currentTime > 3) {
      this.currentTrack.audio.currentTime = 0;
    } else {
      const prevTrack = this.getPreviousTrack();
      if (prevTrack) {
        this.playTrack(prevTrack.element);
      }
    }
  }

  updateUI() {
    // Update all track durations on load
    this.playlists.forEach(playlist => {
      playlist.forEach(track => {
        if (track.audio.readyState >= 2) {
          this.updateDuration(track);
        }
      });
    });
  }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.stochPlayer = new StochPlayer();
});

