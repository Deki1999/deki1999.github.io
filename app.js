// === THEME AUTO-APPLY (no button version) ===
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
    try {
      localStorage.setItem(KEY, t);
    } catch (_) {}
  }

  applyTheme(getTheme());
})();

// === SCROLL REVEAL (fade-in on scroll) ===
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Reset početno stanje
  items.forEach((el) => {
    el.classList.remove('visible');
    void el.offsetWidth; // reflow
  });

  // Posmatraj sekcije i dodaj 'visible' kada uđu u viewport
  const obs = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          o.unobserve(e.target); // jednom po elementu
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  items.forEach((el) => obs.observe(el));
})();

// === CONTACT FORM (Formspree) ===
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        alert('Thanks for your message!');
        form.reset();
      } else {
        alert('There was a problem submitting your form.');
      }
    } catch {
      alert('Network error — please try again later.');
    }
  });
})();

// === STICKY NAV + SCROLLSPY ===
(function () {
  const links = [...document.querySelectorAll('.topnav a')];
  if (!links.length) return;

  const targets = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  // IntersectionObserver za sekcije
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = `#${e.target.id}`;
          links.forEach((a) =>
            a.classList.toggle('active', a.getAttribute('href') === id)
          );
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  targets.forEach((el) => spy.observe(el));

  // Klik na link — odmah aktiviraj
  links.forEach((a) =>
    a.addEventListener('click', () => {
      links.forEach((l) => l.classList.toggle('active', l === a));
    })
  );
})();

// === BACK-TO-TOP BUTTON ===
(function () {
  const btn = document.getElementById('toTop');
  if (!btn) return;

  const toggleBtn = () => {
    if (window.scrollY > 300) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  toggleBtn();

  window.addEventListener('scroll', toggleBtn, { passive: true });
  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
})();

// === END OF app.js ===