// Theme auto-apply (no button version)
(function () {
  const KEY = 'site.theme';
  const root = document.documentElement;

  function getTheme() {
    try {
      return localStorage.getItem(KEY) ||
        (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    } catch (_) { return 'dark'; }
  }

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (_) {}
  }

  applyTheme(getTheme());
})();
