// 8-bit Audio Visualizer
class BitVisualizer {
  constructor() {
    this.canvas = document.getElementById('visualizer-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: false }) : null;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.animationFrame = null;
    this.isActive = false;
    this.audioSource = null;
    this.currentAudioElement = null;
    this.canvasSize = 120;
    this.pixelSize = 4; // 8-bit pixel aesthetic
    
    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    this.setupCanvas();
    this.setupToggle();
    
    // Watch for audio playing
    document.addEventListener('audioPlaying', () => {
      if (!this.isActive) return;
      this.startVisualizer();
    });

    document.addEventListener('audioStopped', () => {
      this.stopVisualizer();
    });
  }

  setupCanvas() {
    if (!this.canvas || !this.ctx) return;
    
    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvasSize * dpr;
    this.canvas.height = this.canvasSize * dpr;
    this.canvas.style.width = this.canvasSize + 'px';
    this.canvas.style.height = this.canvasSize + 'px';
    this.ctx.scale(dpr, dpr);
    
    // Pixelated rendering for 8-bit look
    this.ctx.imageSmoothingEnabled = false;
  }

  setupToggle() {
    const toggle = document.getElementById('visualizer-toggle');
    if (!toggle) return;

    // Load saved preference
    const saved = localStorage.getItem('visualizer-enabled');
    if (saved === 'true') {
      this.isActive = true;
      toggle.classList.add('active');
      this.startVisualizer();
    }

    toggle.addEventListener('click', () => {
      this.isActive = !this.isActive;
      toggle.classList.toggle('active');
      localStorage.setItem('visualizer-enabled', this.isActive.toString());
      
      if (this.isActive) {
        this.startVisualizer();
      } else {
        this.stopVisualizer();
        this.clearCanvas();
      }
    });
  }

  async startVisualizer() {
    if (!this.isActive || !this.canvas || !this.ctx) return;

    // Get current audio from player
    if (!window.stochPlayer || !window.stochPlayer.currentAudio) {
      return;
    }

    const audioElement = window.stochPlayer.currentAudio;
    if (!audioElement || audioElement.paused) return;

    try {
      // Create audio context if needed
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create analyser
      if (!this.analyser) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256; // 8-bit style lower resolution
        this.analyser.smoothingTimeConstant = 0.8;
        
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
      }

      // Connect audio source if not already connected
      // Only create new source if audio element changed
      if (!this.audioSource || this.currentAudioElement !== audioElement) {
        // Disconnect old source if exists
        if (this.audioSource) {
          try {
            this.audioSource.disconnect();
          } catch (e) {}
        }
        
        this.currentAudioElement = audioElement;
        this.audioSource = this.audioContext.createMediaElementSource(audioElement);
        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      }

      this.draw();
    } catch (error) {
      console.warn('Visualizer error:', error);
    }
  }

  stopVisualizer() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    this.clearCanvas();
  }

  disconnectAudio() {
    // Disconnect audio source but keep context
    if (this.audioSource) {
      try {
        this.audioSource.disconnect();
        if (this.analyser) {
          this.analyser.disconnect();
        }
        this.audioSource = null;
        this.currentAudioElement = null;
      } catch (e) {
        // Ignore disconnect errors
      }
    }
  }

  clearCanvas() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.fillStyle = 'rgba(5, 1, 10, 1)';
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
  }

  draw() {
    if (!this.isActive || !this.analyser || !this.ctx || !this.canvas) return;

    this.animationFrame = requestAnimationFrame(() => this.draw());

    if (!window.stochPlayer || !window.stochPlayer.currentAudio || 
        window.stochPlayer.currentAudio.paused) {
      this.clearCanvas();
      return;
    }

    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);

    // Clear canvas with dark background
    this.ctx.fillStyle = 'rgba(5, 1, 10, 0.9)';
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

    // Draw 8-bit style circle visualizer
    this.drawCircleVisualizer();
  }

  drawCircleVisualizer() {
    const centerX = this.canvasSize / 2;
    const centerY = this.canvasSize / 2;
    const maxRadius = this.canvasSize / 2 - 10;
    const dataPoints = Math.min(this.dataArray.length, 64); // 8-bit: fewer data points
    const angleStep = (Math.PI * 2) / dataPoints;

    // Draw multiple circles for layered effect
    for (let layer = 0; layer < 3; layer++) {
      this.ctx.strokeStyle = layer === 0 ? '#ff5f6d' : layer === 1 ? '#36cfd3' : '#ffc371';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();

      for (let i = 0; i < dataPoints; i++) {
        const dataIndex = Math.floor((i / dataPoints) * this.dataArray.length);
        const value = this.dataArray[dataIndex] / 255;
        
        // Apply rhythm boost for lower frequencies
        let boostedValue = value;
        if (dataIndex < 10) {
          boostedValue = Math.min(1, value * 1.5);
        }
        
        const radius = 20 + (boostedValue * (maxRadius - 20)) * (1 - layer * 0.3);
        const angle = (i * angleStep) - Math.PI / 2;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.closePath();
      this.ctx.stroke();
    }

    // Draw center point that pulses
    const bassValue = this.dataArray[0] / 255;
    const centerSize = 4 + (bassValue * 6);
    this.ctx.fillStyle = '#ff5f6d';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Alternative: Line visualizer (8-bit style)
  drawLineVisualizer() {
    const barWidth = this.canvasSize / 32; // 32 bars for 8-bit look
    const barMaxHeight = this.canvasSize - 20;
    let x = 0;

    for (let i = 0; i < 32; i++) {
      const dataIndex = Math.floor((i / 32) * this.dataArray.length);
      const barHeight = (this.dataArray[dataIndex] / 255) * barMaxHeight;

      // 8-bit color palette
      const colors = ['#ff5f6d', '#36cfd3', '#ffc371', '#ff5f6d'];
      this.ctx.fillStyle = colors[i % colors.length];
      
      // Draw bar with pixelated look
      this.ctx.fillRect(x, this.canvasSize - barHeight - 10, barWidth - 1, barHeight);
      
      x += barWidth;
    }
  }

  // Cleanup when audio stops
  cleanup() {
    this.stopVisualizer();
    this.disconnectAudio();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
    }
  }
}

// Initialize visualizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.bitVisualizer = new BitVisualizer();
});

// Listen for player events
document.addEventListener('trackPlay', () => {
  if (window.bitVisualizer && window.bitVisualizer.isActive) {
    setTimeout(() => window.bitVisualizer.startVisualizer(), 100);
  }
});

document.addEventListener('trackPause', () => {
  if (window.bitVisualizer) {
    window.bitVisualizer.clearCanvas();
    window.bitVisualizer.disconnectAudio();
  }
});

// Listen for track changes
document.addEventListener('trackEnd', () => {
  if (window.bitVisualizer) {
    window.bitVisualizer.disconnectAudio();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.bitVisualizer) {
    window.bitVisualizer.cleanup();
  }
});

