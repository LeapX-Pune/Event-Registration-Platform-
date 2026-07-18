/* =====================================================
   EventPulse - Shared Theme Utilities
   ===================================================== */

function applyTheme(theme) {
  var next = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('eventpulse_theme', next);
  var icons = document.querySelectorAll('#themeIcon, #themeIconReg, #themeIconAdmin, #themeIconED');
  icons.forEach(function (icon) {
    icon.textContent = next === 'dark' ? 'dark_mode' : 'light_mode';
  });
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

(function initThemeEarly() {
  var saved = localStorage.getItem('eventpulse_theme');
  if (saved) applyTheme(saved);
})();
