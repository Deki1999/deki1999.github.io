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
