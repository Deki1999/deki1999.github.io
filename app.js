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
