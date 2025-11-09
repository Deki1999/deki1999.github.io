/* year + theme */
const themeBtn = document.querySelector("#theme");
const yearEl = document.querySelector("#year");
yearEl && (yearEl.textContent = new Date().getFullYear());

const THEME_KEY = "site.theme";
function loadTheme() { try { return localStorage.getItem(THEME_KEY) || "dark"; } catch {} }
function saveTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch {} }
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  themeBtn.textContent = t === "dark" ? "Light" : "Dark";
}
let theme = loadTheme(); applyTheme(theme);
themeBtn?.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme(theme); saveTheme(theme);
});

/* scroll reveal */
const ro = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) e.target.classList.add("show");
}, { threshold: .15 });
document.querySelectorAll(".reveal").forEach(el => ro.observe(el));

/* contact form — Formspree POST */
const form = document.querySelector("#contactForm");
const tip = document.querySelector("#formTip");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#name")?.value.trim();
  const email = document.querySelector("#email")?.value.trim();
  const msg = document.querySelector("#message")?.value.trim();

  if (!name || !email || !msg) {
    tip.textContent = "Please fill all fields.";
    return;
  }

  tip.textContent = "Sending…";

  try {
    const res = await fetch(form.action, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form),
      cache: "no-store",
    });

    if (res.ok || res.type === "opaque" || res.status === 0) {
      tip.textContent = "Thanks! Your message was sent.";
      form.reset();
      return;
    }

    const data = await res.json().catch(() => ({}));
    tip.textContent =
      data?.errors?.[0]?.message || "Oops, something went wrong. Try again later.";
  } catch (err) {
    tip.textContent = "Thanks! Your message was sent.";
    form.reset();
  }
});

/* back-to-top button */
const toTop = document.querySelector("#toTop");
function updateToTopBtn() {
  if (window.scrollY > 320) toTop.classList.add("show");
  else toTop.classList.remove("show");
}
window.addEventListener("scroll", updateToTopBtn);

/* ===== Theme toggle failsafe (auto-attach) ===== */
(() => {
  const KEY = 'site.theme';
  const root = document.documentElement;
  const btn  = document.querySelector('#theme');
  if (!btn) return; // nema dugmeta, ništa

  const apply = (t) => {
    root.setAttribute('data-theme', t);
    btn.textContent = t === 'dark' ? 'Light' : 'Dark';
  };

  let theme = localStorage.getItem(KEY) || (root.getAttribute('data-theme') || 'dark');
  apply(theme);

  btn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, theme);
    apply(theme);
  });
})();

/* ===== Improved theme wiring (multi-button safe) ===== */
(() => {
  if (window.__THEME_WIRED__) return; window.__THEME_WIRED__ = true;

  const KEY  = 'site.theme';
  const root = document.documentElement;

  // Pronađi SVA moguća toggle dugmad
  const getToggles = () => {
    const set = new Set([
      ...document.querySelectorAll('#theme, .theme-toggle, [data-theme-toggle]')
    ]);
    // Heuristika: svako <button> koje piše "Dark" ili "Light"
    document.querySelectorAll('button').forEach(b => {
      const t = (b.textContent || '').trim().toLowerCase();
      if (t === 'dark' || t === 'light') set.add(b);
    });
    return Array.from(set);
  };

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    getToggles().forEach(b => {
      b.textContent = theme === 'dark' ? 'Light' : 'Dark';
    });
  };

  let theme = localStorage.getItem(KEY) || root.getAttribute('data-theme') || 'dark';
  apply(theme);

  getToggles().forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault?.();
      theme = theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(KEY, theme);
      apply(theme);
    });
  });
})();
/* ===== Theme toggle v2: single-button + delegation ===== */
(() => {
  const KEY='site.theme';
  const root=document.documentElement;
  const $all = (sel) => Array.from(document.querySelectorAll(sel));

  const findToggles = () => {
    const set = new Set([
      ...$all('#theme'),
      ...$all('.theme-toggle'),
      ...$all('[data-theme-toggle]')
    ]);
    $all('button').forEach(b=>{
      const t=(b.textContent||'').trim().toLowerCase();
      if(t==='dark'||t==='light') set.add(b);
    });
    return Array.from(set);
  };

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    findToggles().forEach(b => b.textContent = theme === 'dark' ? 'Light' : 'Dark');
  };

  const toggle = () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, next);
    apply(next);
  };

  // init
  apply(localStorage.getItem(KEY) || root.getAttribute('data-theme') || 'dark');

  // zadrži samo jedno dugme
  const all = findToggles();
  if (all.length > 1) all.slice(1).forEach(n => n.remove());

  // kreiraj ako ne postoji
  if (findToggles().length === 0) {
    const btn = document.createElement('button');
    btn.id = 'theme';
    btn.className = 'theme-toggle';
    btn.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
    document.body.prepend(btn);
  }

  findToggles().forEach(b => b.addEventListener('click', e => { e.preventDefault(); toggle(); }));
  document.addEventListener('click', e => {
    if (e.target && e.target.matches('#theme, .theme-toggle, [data-theme-toggle]')) {
      e.preventDefault(); toggle();
    }
  });
})();
