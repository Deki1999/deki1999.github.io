// Theme auto-apply (no button version)
(function () {
  const KEY = 'site.theme';
  const root = document.documentElement;

  function getTheme() {
    try {
      return (
        localStorage.getItem(KEY) ||
        (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      );
    } catch (_) {
      return 'dark';
    }
  }

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (_) {}
  }

  applyTheme(getTheme());
})();

// === Scroll reveal (IntersectionObserver) ===
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Reset početno stanje (osiguraj da animacija krene)
  items.forEach((el) => {
    el.classList.remove('visible');
    void el.offsetWidth; // reflow
  });

  const ro = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target); // jednokratni reveal
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  items.forEach((el) => ro.observe(el));
})();