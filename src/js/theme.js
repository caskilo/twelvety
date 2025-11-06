/**
 * Theme Toggle - Manages light/dark mode
 * Respects system preference by default, allows user override
 */

const THEME_KEY = 'site-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

/**
 * Get the user's theme preference
 * Priority: localStorage > system preference
 */
function getThemePreference() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) {
    return stored;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEME_DARK;
  }
  
  return THEME_LIGHT;
}

/**
 * Apply theme to document
 */
function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeToggleIcon(theme);
}

/**
 * Update the theme toggle button icon
 */
function updateThemeToggleIcon(theme) {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.setAttribute('aria-label', `Switch to ${theme === THEME_LIGHT ? 'dark' : 'light'} mode`);
    toggle.textContent = theme === THEME_LIGHT ? '🌙' : '☀️';
  }
}

/**
 * Toggle between light and dark mode
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || getThemePreference();
  const next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  applyTheme(next);
}

/**
 * Initialize theme on page load
 */
function initTheme() {
  const theme = getThemePreference();
  applyTheme(theme);
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
      }
    });
  }
  
  // Attach toggle listener
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', toggleTheme);
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}
