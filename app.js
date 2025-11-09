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
/* ===== Theme toggle v3 (robust): single-button, cleanup + observer ===== */
(() => {
  const KEY = 'site.theme';
  const root = document.documentElement;

  const qAll = (sel) => Array.from(document.querySelectorAll(sel));

  // Vrati SVA potencijalna theme dugmad (razni selektori + dugmad sa tekstom "Dark/Light")
  const findToggles = () => {
    const set = new Set([
      ...qAll('#theme'),
      ...qAll('.theme-toggle'),
      ...qAll('[data-theme-toggle]')
    ]);
    qAll('button').forEach(b => {
      const t = (b.textContent || '').trim().toLowerCase();
      if (t === 'dark' || t === 'light') set.add(b);
    });
    return Array.from(set);
  };

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    // Ažuriraj tekst na SVIH (preostalih) toggle dugmadi
    findToggles().forEach(b => b.textContent = theme === 'dark' ? 'Light' : 'Dark');
  };

  const toggle = () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, next);
    apply(next);
  };

  const ensureOneButton = () => {
    let btns = findToggles();

    // Ako nema nijednog — napravi jedan u body
    if (btns.length === 0) {
      const b = document.createElement('button');
      b.id = 'theme';
      b.className = 'theme-toggle';
      b.type = 'button';
      document.body.prepend(b);
      btns = [b];
    }

    // Ostavi samo PRVO, ostala ukloni
    if (btns.length > 1) {
      btns.slice(1).forEach(n => n.remove());
      btns = [btns[0]];
    }

    // Osiguraj listener na tom jednom
    const btn = btns[0];
    if (!btn._boundTheme) {
      btn.addEventListener('click', (e) => { e.preventDefault(); toggle(); });
      btn._boundTheme = true;
    }

    // Postavi labelu u skladu sa trenutno aktivnom temom
    const cur = root.getAttribute('data-theme') || 'dark';
    btn.textContent = (cur === 'dark') ? 'Light' : 'Dark';
  };

  // Inicijalizacija čim DOM bude spreman
  const init = () => {
    const stored = localStorage.getItem(KEY);
    const initial = stored || root.getAttribute('data-theme') || 'dark';
    apply(initial);
    ensureOneButton();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Delegacija (za slučaj da se kasnije doda dugme)
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t) return;
    if (t.matches('#theme, .theme-toggle, [data-theme-toggle]')) {
      e.preventDefault();
      toggle();
    }
  });

  // MutationObserver: ako se DOM promjeni i pojavi se još jedno dugme — očisti
  const mo = new MutationObserver(() => ensureOneButton());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
/* ===== Theme toggle v4: hard reset → single button ===== */
(() => {
  const KEY = 'site.theme';
  const root = document.documentElement;

  const getTheme = () => localStorage.getItem(KEY) || root.getAttribute('data-theme') || 'dark';
  const setTheme = (t) => { root.setAttribute('data-theme', t); localStorage.setItem(KEY, t); };

  const nukeAllThemeButtons = () => {
    const candidates = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    candidates.forEach(el => {
      const txt = (el.textContent || '').trim().toLowerCase();
      const looksLike = el.matches('#theme, .theme-toggle, [data-theme-toggle]')
        || /^(dark|light)$/.test(txt)
        || txt === 'tema' || txt === 'theme';
      if (looksLike && el.id !== 'theme__single') {
        try { el.remove(); } catch {}
      }
    });
  };

  const ensureSingleButton = () => {
    let btn = document.querySelector('#theme__single');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'theme__single';
      btn.type = 'button';
      btn.className = 'theme-toggle';
      // fiksno gore desno
      btn.style.position = 'fixed';
      btn.style.top = '16px';
      btn.style.right = '16px';
      btn.style.zIndex = '9999';
      document.body.appendChild(btn);
    }
    // labela
    const now = getTheme();
    btn.textContent = now === 'dark' ? 'Light' : 'Dark';

    if (!btn._bound) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const next = getTheme() === 'dark' ? 'light' : 'dark';
        setTheme(next);
        btn.textContent = next === 'dark' ? 'Light' : 'Dark';
      });
      btn._bound = true;
    }
  };

  const boot = () => {
    // primijeni temu
    setTheme(getTheme());
    // očisti sve moguće stare/dvostruke togglere i ostavi 1
    nukeAllThemeButtons();
    ensureSingleButton();

    // Ako se DOM kasnije promijeni i pojavi se novo “Dark/Light” dugme — odmah ga ukloni
    const mo = new MutationObserver(() => { nukeAllThemeButtons(); ensureSingleButton(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Sigurnosna delegacija (ako neko ručno ubaci #theme itd.)
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!t) return;
      if (t.matches('#theme, .theme-toggle, [data-theme-toggle]') && t.id !== 'theme__single') {
        e.preventDefault();
        const next = getTheme() === 'dark' ? 'light' : 'dark';
        setTheme(next);
        ensureSingleButton();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

/* === THEME TOGGLE — failsafe === */
(() => {
  const KEY = 'site.theme';
  const root = document.documentElement;

  const get = () => localStorage.getItem(KEY) || 'dark';
  const apply = (t) => {
    root.setAttribute('data-theme', t);
    const btn = document.getElementById('theme__single');
    if (btn) btn.textContent = t === 'dark' ? 'Dark' : 'Light';
  };
  const set = (t) => { localStorage.setItem(KEY, t); apply(t); };

  // Ensure one button exists
  let btn = document.getElementById('theme__single');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'theme__single';
    btn.className = 'theme-toggle';
    btn.type = 'button';
    document.body.appendChild(btn);
  }

  // Initial apply + label
  apply(get());

  // Toggle on click
  btn.addEventListener('click', () => {
    set(get() === 'dark' ? 'light' : 'dark');
  });
})();
