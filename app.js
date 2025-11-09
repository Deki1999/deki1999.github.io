/* ===== Portfolio JS (clean) ===== */
(() => {
  'use strict';

  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  /* ---------- Theme ---------- */
  const THEME_KEY = 'site.theme';
  const root = document.documentElement;

  const loadTheme  = () => localStorage.getItem(THEME_KEY) || 'dark';
  const saveTheme  = (t) => localStorage.setItem(THEME_KEY, t);
  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    const btn = $('#theme');
    if (btn) btn.textContent = (t === 'dark') ? 'Light' : 'Dark';
  };

  const ensureThemeBtn = () => {
    let btn = $('#theme');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'theme';
      btn.className = 'btn ghost small';
      btn.type = 'button';
      const host = $('.intro') || $('header') || document.body;
      host.appendChild(btn);
    }
    return btn;
  };

  const initTheme = () => {
    const cur = loadTheme();
    applyTheme(cur);
    const btn = ensureThemeBtn();
    btn.textContent = (cur === 'dark') ? 'Light' : 'Dark';
    if (!btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
        saveTheme(next);
        applyTheme(next);
      });
    }
  };

  /* ---------- Contact form (Formspree) ---------- */
  const initForm = () => {
    const form = $('#contactForm');
    const tip  = $('#formTip');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
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
          if (tip) tip.textContent = 'Oops, something went wrong. Try again later.';
        }
      } catch {
        if (tip) tip.textContent = 'Network error. Please try again.';
      }
    });
  };

  /* ---------- Year ---------- */
  const initYear = () => {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  };

  /* ---------- ToTop ---------- */
  const initToTop = () => {
    const btn = $('#toTop');
    if (!btn) return;
    const onScroll = () => {
      if (window.scrollY > 320) btn.classList.add('show');
      else btn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  /* ---------- Reveal ---------- */
  const initReveal = () => {
    const items = $$('.reveal');
    if (!items.length) return;
    const ro = new IntersectionObserver((ents) => {
      ents.forEach(e => e.isIntersecting && e.target.classList.add('show'));
    }, { threshold: .15 });
    items.forEach(el => ro.observe(el));
  };

  /* ---------- Boot ---------- */
  window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initForm();
    initYear();
    initToTop();
    initReveal();
  });
})();
// bump Sun Nov  9 03:10:26 CET 2025

/* --- Fallback: global click delegacija za theme toggle --- */
document.addEventListener('click', (e) => {
  const trg = e.target.closest('#theme, [data-theme-toggle]');
  if (!trg) return;
  try {
    const root = document.documentElement;
    const next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
    localStorage.setItem('site.theme', next);
    root.setAttribute('data-theme', next);
    const btn = document.getElementById('theme');
    if (btn) btn.textContent = (next === 'dark') ? 'Light' : 'Dark';
  } catch {}
}, { capture: true });

/* Theme: robust bind */
(function () {
  const KEY = 'site.theme';

  function apply(t){
    document.documentElement.setAttribute('data-theme', t);
    const b = document.getElementById('theme');
    if (b) b.textContent = (t === 'dark') ? 'Light' : 'Dark';
  }
  function cur(){
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }
  function toggle(){
    const nxt = (cur()==='dark') ? 'light' : 'dark';
    try { localStorage.setItem(KEY, nxt); } catch {}
    apply(nxt);
  }

  // Primarni bind nakon što DOM postoji
  document.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('theme');
    if (b && !b.dataset.bound) {
      b.addEventListener('click', toggle);
      b.dataset.bound = '1';
    }
    // Primijeni prethodno sačuvanu ili trenutnu temu i uskladi labelu
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) apply(saved);
      else apply(cur());
    } catch { apply(cur()); }
  });

  // Globalni fallback (ako nešto spriječi gore navedeno)
  document.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('#theme,[data-theme-toggle]')) {
      e.preventDefault();
      toggle();
    }
  }, { capture: true });
})();

/* Theme: emergency fallback bind */
(function () {
  const KEY = 'site.theme';

  function apply(t){
    document.documentElement.setAttribute('data-theme', t);
    const b = document.getElementById('theme');
    if (b) b.textContent = (t === 'dark') ? 'Light' : 'Dark';
  }
  function cur(){
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  // Primarni bind (ako naš raniji kod iz nekog razloga ne okine)
  document.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('theme');
    if (b && !b.dataset.emergencyBound) {
      b.addEventListener('click', () => {
        const nxt = (cur()==='dark') ? 'light' : 'dark';
        try { localStorage.setItem(KEY, nxt); } catch {}
        apply(nxt);
      });
      b.dataset.emergencyBound = '1';
    }

    // Uskladi labelu sa postojećim stanjem
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) apply(saved); else apply(cur());
    } catch { apply(cur()); }
  });

  // Dodatna delegacija kao osiguranje
  document.addEventListener('click', (e) => {
    const t = e.target && e.target.closest ? e.target.closest('#theme,[data-theme-toggle]') : null;
    if (!t) return;
    e.preventDefault();
    const nxt = (cur()==='dark') ? 'light' : 'dark';
    try { localStorage.setItem(KEY, nxt); } catch {}
    apply(nxt);
  }, { capture:true });
})();

/* THEME: ultra-safe capture bind */
(function(){
  const KEY = 'site.theme';
  const root = document.documentElement;

  function apply(t){
    root.setAttribute('data-theme', t);
    const b = document.getElementById('theme');
    if (b) b.textContent = (t === 'dark') ? 'Light' : 'Dark';
  }

  // Uskladi stanje pri učitavanju (ako postoji u localStorage)
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) apply(saved);
  } catch {}

  // Globalni capture handler: uhvati klik PRE svih drugih listener-a
  document.addEventListener('click', function(ev){
    const b = ev.target && ev.target.closest ? ev.target.closest('#theme') : null;
    if (!b) return;
    ev.preventDefault();
    ev.stopPropagation();

    const cur = root.getAttribute('data-theme') || 'dark';
    const nxt = (cur === 'dark') ? 'light' : 'dark';

    try { localStorage.setItem(KEY, nxt); } catch {}
    apply(nxt);
    console.log('THEME =>', nxt);
  }, true);
})();
// --- Theme toggle (robust, single-source-of-truth) ---
(function () {
  if (window.__themeInit) return; window.__themeInit = true;

  const KEY = 'site.theme';
  const root = document.documentElement;

  function getPref() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) return saved;
    } catch (_) {}
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function labelFor(t) { return t === 'dark' ? 'Light' : 'Dark'; }

  function apply(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (_) {}
    const b = document.getElementById('theme');
    if (b) b.textContent = labelFor(t);
  }

  function toggle() {
    const cur = root.getAttribute('data-theme') || 'dark';
    apply(cur === 'dark' ? 'light' : 'dark');
  }

  // Init na load
  apply(getPref());

  // Direktno veži ako postoji
  const btnNow = document.getElementById('theme');
  if (btnNow && !btnNow.dataset.bound) {
    btnNow.addEventListener('click', toggle);
    btnNow.dataset.bound = '1';
  }

  // Fallback delegacija (ako se dugme kasnije rerendera)
  document.addEventListener('click', (e) => {
    const t = e.target.closest('#theme,[data-theme-toggle]');
    if (t && !t.dataset.bound) {
      t.addEventListener('click', toggle, { once: false });
      t.dataset.bound = '1';
    }
  });
})();
 // --- end theme toggle ---
// === Theme button auto-create (no-HTML edit) ===
(function(){
  const KEY = 'site.theme';
  const root = document.documentElement;

  function currentTheme(){
    try {
      return localStorage.getItem(KEY) ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    } catch(_) { return 'dark'; }
  }
  function applyTheme(t){
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch(_) {}
    const b = document.getElementById('theme');
    if (b) b.textContent = (t === 'dark' ? 'Light' : 'Dark');
  }
  function toggleTheme(){
    const cur = root.getAttribute('data-theme') || currentTheme();
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  }

  // 1) Osiguraj da je postavljen početni theme
  if (!root.getAttribute('data-theme')) applyTheme(currentTheme());

  // 2) Ako dugme ne postoji – napravi ga i ubaci u <header> ili u body
  function ensureBtn(){
    let btn = document.getElementById('theme');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'theme';
      btn.type = 'button';
      btn.className = 'btn ghost small';
      btn.textContent = (root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark');

      // Probaj u header; ako ga nema, stavi na kraj body-ja
      const hdr = document.querySelector('header') || document.body;
      hdr.appendChild(btn);
    }
    if (!btn.dataset.bound) {
      btn.addEventListener('click', toggleTheme);
      btn.dataset.bound = '1';
    }
  }
  ensureBtn();

  // 3) Ako neko dinamički promijeni header, re-ensure
  const obs = new MutationObserver(() => ensureBtn());
  obs.observe(document.body, { childList:true, subtree:true });

  // Izvezi globalno (nije obavezno, ali pomaže debug)
  window.__toggleTheme = toggleTheme;
})();
 // === end: Theme button auto-create ===
