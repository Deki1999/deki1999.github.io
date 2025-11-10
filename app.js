// =======================================================
// Theme auto-apply (verzija bez dugmeta)
// =======================================================
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

// =======================================================
// Reveal on scroll — ROBUST (bez potrebe za hard refresh)
// =======================================================
window.addEventListener('load', () => {
  const items = Array.from(document.querySelectorAll('.reveal'));
  if (!items.length) return;

  const inViewNow = el => {
    const h = window.innerHeight || document.documentElement.clientHeight;
    const r = el.getBoundingClientRect();
    // Dovoljno je da bar malo uđe u viewport
    return r.top <= h - 10 && r.bottom >= 0;
  };

  const markInView = () => {
    for (const el of items) {
      if (!el.classList.contains('visible') && inViewNow(el)) {
        el.classList.add('visible');
      }
    }
  };

  // inicijalne provere posle load-a
  markInView();                        // odmah
  requestAnimationFrame(markInView);   // posle prvog layout-a
  setTimeout(markInView, 60);          // mali delay zbog fontova/slika

  // IntersectionObserver za sve koji tek ulaze u viewport
  const ro = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('visible');
      obs.unobserve(e.target); // jednokratno
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => ro.observe(el));

  // fallback za promenu veličine / orijentacije
  window.addEventListener('resize', markInView, { passive: true });
  window.addEventListener('orientationchange', markInView, { passive: true });
});

// =======================================================
// Contact form (Formspree) — validacija + poruke
//  HTML očekuje:
//    <form id="contactForm" action="https://formspree.io/f/XXXX" method="POST">…
//    <div id="formTip" class="tip" role="status" aria-live="polite"></div>
//    <button id="sendBtn" type="submit">Send</button>
// =======================================================
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const tip = document.getElementById('formTip');
  const btn = document.getElementById('sendBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = (document.getElementById('name') || {}).value?.trim();
    const email = (document.getElementById('email') || {}).value?.trim();
    const msg = (document.getElementById('message') || {}).value?.trim();

    if (!name || !email || !msg) {
      if (tip) tip.textContent = 'Please fill all fields.';
      return;
    }

    if (btn) btn.disabled = true;
    if (tip) tip.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      if (res.ok) {
        if (tip) tip.textContent = 'Thanks! Your message was sent.';
        form.reset();
      } else {
        // pokušaj da izvučemo grešku iz JSON-a (Formspree)
        let msg = 'Oops, something went wrong. Try again later.';
        try {
          const data = await res.json();
          if (data && Array.isArray(data.errors) && data.errors[0]?.message) {
            msg = data.errors[0].message;
          }
        } catch (_) {}
        if (tip) tip.textContent = msg;
      }
    } catch (_) {
      if (tip) tip.textContent = 'Network error. Please try again.';
    } finally {
      if (btn) btn.disabled = false;
    }
  });
})();

// =======================================================
// Back-to-top dugme
//  HTML očekuje: <button id="toTop" class="btn to-top" aria-label="Back to top">Top</button>
//  CSS: .to-top{opacity:0;pointer-events:none;transition:.2s}.to-top.show{opacity:1;pointer-events:auto}
// =======================================================
(function () {
  const toTop = document.getElementById('toTop');
  if (!toTop) return;

  function update() {
    if (window.scrollY > 320) toTop.classList.add('show');
    else toTop.classList.remove('show');
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();