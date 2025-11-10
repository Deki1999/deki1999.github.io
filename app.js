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
      if (!e.isIntersecting) continue;

      // --- Anti-flash guard: ne otkrivaj elemente odmah na loadu
      const top = e.boundingClientRect.top;
      const scrolled = window.scrollY || document.documentElement.scrollTop;

      // Ako je korisnik skrolovao < 40px i element je već "dovoljno" u kadru,
      // sačekaj sledeći scroll pa će IO ponovo okinuti.
      if (scrolled < 40 && top < window.innerHeight * 0.9) {
        continue; // nemoj unobserve — pusti da se javi opet kad krene skrol
      }

      e.target.classList.add('visible');
      obs.unobserve(e.target); // jednokratni reveal
    }
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px',
  }
);

  items.forEach((el) => ro.observe(el));
})();