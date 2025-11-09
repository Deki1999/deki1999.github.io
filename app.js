// @ts-nocheck

/* 1) Theme */
const themeBtn = document.querySelector("#theme");
const yearEl = document.querySelector("#year");
yearEl && (yearEl.textContent = new Date().getFullYear());
const THEME_KEY = "site.theme";
function loadTheme(){ try { return localStorage.getItem(THEME_KEY) || "dark"; } catch { return "dark"; } }
function saveTheme(t){ try { localStorage.setItem(THEME_KEY, t); } catch {} }
function applyTheme(t){ document.documentElement.setAttribute("data-theme", t); if (themeBtn) themeBtn.textContent = (t === "dark") ? "Dark" : "Light"; }
let theme = loadTheme(); applyTheme(theme);
themeBtn?.addEventListener("click", () => { theme = theme === "dark" ? "light" : "dark"; saveTheme(theme); applyTheme(theme); });

/* 2) Reveal on scroll */
const ro = new IntersectionObserver((entries)=>{ for (const e of entries){ if (e.isIntersecting){ e.target.classList.add("show"); ro.unobserve(e.target); } } }, {threshold:.15});
document.querySelectorAll(".reveal").forEach(el => ro.observe(el));

/* 3) Contact form (Formspree) */
const form = document.querySelector("#contactForm");
const tip  = document.querySelector("#formTip");
const sendBtn = document.querySelector("#sendBtn");
// ensure action set
if (form && (!form.action || !/formspree\.io\/f\//i.test(form.action))) {
  form.action = "https://formspree.io/f/mwpaeqrj"\;
  form.method = "POST";
}
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name  = document.querySelector("#name")?.value.trim();
  const email = document.querySelector("#email")?.value.trim();
  const msg   = document.querySelector("#message")?.value.trim();
  document.querySelector("#replyTo")?.setAttribute("value", email || "");
  if (!name || !email || !msg){ tip.textContent = "Please fill all fields."; return; }
  tip.textContent = "Sending…"; if (sendBtn) sendBtn.disabled = true;
  try{
    const res = await fetch(form.action, { method:"POST", headers:{ "Accept":"application/json" }, body: new FormData(form) });
    if (res.ok){ tip.textContent = "Thanks! Your message was sent."; form.reset(); }
    else {
      let m = `Error ${res.status}`;
      try { const data = await res.json(); if (data?.errors?.length) m = data.errors.map(e=>e.message).join(" · "); } catch {}
      tip.textContent = m;
    }
  } catch { tip.textContent = "Network error. Please try again."; }
  finally { if (sendBtn) sendBtn.disabled = false; }
});

/* 4) Back-to-top */
const toTop = document.querySelector("#toTop");
function updateToTopBtn(){ if (!toTop) return; if (window.scrollY > 320) toTop.classList.add("show"); else toTop.classList.remove("show"); }
window.addEventListener("scroll", updateToTopBtn); updateToTopBtn();

// trigger to ensure file changes are detected
// ts: EOF
