// @ts-nocheck

/* =============== THEME =============== */
const themeBtn = document.querySelector("#theme");
const yearEl   = document.querySelector("#year");
yearEl && (yearEl.textContent = new Date().getFullYear());

const THEME_KEY = "site.theme";
function loadTheme(){ try { return localStorage.getItem(THEME_KEY) || "dark"; } catch { return "dark"; } }
function saveTheme(t){ try { localStorage.setItem(THEME_KEY, t); } catch {} }
function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  themeBtn && (themeBtn.textContent = t === "dark" ? "Dark" : "Light");
}
let theme = loadTheme(); applyTheme(theme);
themeBtn?.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  saveTheme(theme); applyTheme(theme);
});

/* =============== SCROLL REVEAL =============== */
const ro = new IntersectionObserver((entries)=>{
  for (const e of entries) if (e.isIntersecting) {
    e.target.classList.add("show");
    ro.unobserve(e.target);
  }
},{ threshold:.15 });
document.querySelectorAll(".reveal").forEach(el => ro.observe(el));

/* =============== CONTACT FORM =============== */
const form = document.querySelector("#contactForm");
const tip  = document.querySelector("#formTip");

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
      redirect: "follow",
    });

    // Formspree + _next obično vrati redirect (opaqueredirect / status 0),
    // zato to tretiramo kao uspjeh.
    if (res.ok || res.redirected || res.type === "opaqueredirect" || res.status === 0) {
      tip.textContent = "Thanks! Your message was sent.";
      form.reset();
    } else {
      let msg = "Oops, something went wrong. Try again later.";
      try {
        const data = await res.json();
        if (data?.errors?.length) msg = data.errors[0].message;
      } catch {}
      tip.textContent = msg;
    }
  } catch {
    tip.textContent = "Network error. Please try again.";
  }
});

/* =============== BACK TO TOP =============== */
const toTop = document.querySelector("#toTop");
function updateToTopBtn(){
  if (window.scrollY > 320) toTop?.classList.add("show");
  else toTop?.classList.remove("show");
}
updateToTopBtn();
document.addEventListener("scroll", updateToTopBtn);
toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
