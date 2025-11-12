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
  
  // === Viewport debug highlight (sections) ===
(function(){
  const sections = ['about','projects','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if(!sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      e.target.classList.add('debug-enter');
      setTimeout(() => e.target.classList.remove('debug-enter'), 600);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  sections.forEach(s => io.observe(s));
})();

  // Reset početno stanje
  items.forEach((el) => {
    el.classList.remove('visible');
    void el.offsetWidth; // reflow
  });
  // === STAGGER REVEAL za kartice u #projects ===
(function () {
  const projectSection = document.getElementById('projects');
  if (!projectSection) return;

  // Sve kartice unutar projects
  const cards = projectSection.querySelectorAll('.card');
  if (!cards.length) return;

  // Neka kartice imaju početno stanje (ako nemaju .reveal, mi ćemo koristiti .reveal-item)
  cards.forEach((c, i) => {
    c.classList.add('reveal-item');
    // postavi “stagger” kašnjenje kroz CSS varijablu
    c.style.setProperty('--d', `${i * 90}ms`); // 0ms, 90ms, 180ms...
  });

  // Posmatraj samo sekciju (kad uđe u viewport, upali sve kartice)
  const obs = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          cards.forEach((c) => c.classList.add('visible'));
          o.unobserve(e.target); // jednom i gotovo
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  obs.observe(projectSection);
})();
// === STAGGER REVEAL za chips u #about ===
(function () {
  const about = document.getElementById('about');
  if (!about) return;

  const chips = about.querySelectorAll('.chips .chip');
  if (!chips.length) return;

  // početno stanje + kašnjenje po čipu
  chips.forEach((el, i) => {
    el.classList.add('reveal-chip');
    el.style.setProperty('--d', `${i * 80}ms`);
  });

  const obs = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          chips.forEach((c) => c.classList.add('visible'));
          o.unobserve(e.target); // jednokratno
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  );

  obs.observe(about);
})();

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

// === Scroll progress bar ===
(function(){
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  let ticking = false;
  const doc = document.documentElement;

  const getScrollY = () =>
    window.pageYOffset || doc.scrollTop || document.body.scrollTop || 0;

  function update() {
    const scrolled = getScrollY();
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (scrolled / max) * 100)) : 0;
    bar.style.backgroundSize = `${pct}% 100%`;
    ticking = false;
  }

  function onChange() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  update();
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange, { passive: true });
  window.addEventListener('orientationchange', onChange, { passive: true });
  window.addEventListener('load', onChange);
})();
// === Scroll progress bar ===
(function(){
  const bar = document.getElementById('scrollProgress');
  if(!bar) return;

  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.backgroundSize = `${pct}% 100%`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
})();

// === Viewport debug highlight (About/Projects/Contact) ===
(function(){
  const sections = ['about','projects','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if(!sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      e.target.classList.add('debug-enter');
      setTimeout(() => e.target.classList.remove('debug-enter'), 600);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  sections.forEach(s => io.observe(s));
})();