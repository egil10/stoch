// Theme Toggle System
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    // Apply stored or system theme
    this.applyTheme(this.currentTheme);
    
    // Set up toggle button
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
      this.updateToggleIcon();
    }
    
    // Re-initialize Lucide icons after theme is set
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 100);
    }
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(theme) {
    // Use requestAnimationFrame for smooth theme transitions
    requestAnimationFrame(() => {
      document.documentElement.setAttribute('data-theme', theme);
      this.currentTheme = theme;
      try {
        localStorage.setItem('theme', theme);
      } catch (e) {
        // localStorage might be disabled
      }
      this.updateToggleIcon();
      
      // Re-initialize Lucide icons after theme change
      if (typeof lucide !== 'undefined') {
        requestAnimationFrame(() => lucide.createIcons());
      }
    });
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  updateToggleIcon() {
    if (!this.themeToggle) return;
    
    const sunIcon = this.themeToggle.querySelector('.theme-icon-sun');
    const moonIcon = this.themeToggle.querySelector('.theme-icon-moon');
    
    if (this.currentTheme === 'dark') {
      // Show sun icon in dark mode (to switch to light)
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      // Show moon icon in light mode (to switch to dark)
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 50);
    }
  }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!window.themeManager.getStoredTheme()) {
      window.themeManager.applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});

