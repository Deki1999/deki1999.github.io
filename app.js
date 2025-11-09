// @ts-nocheck
/* year + theme */
const themeBtn = document.querySelector("#theme");
const yearEl = document.querySelector("#year");
yearEl && (yearEl.textContent = new Date().getFullYear());

const THEME_KEY = "site.theme";
function loadTheme(){ try { return localStorage.getItem(THEME_KEY) || "dark"; } catch { return "dark"; } }
function saveTheme(t){ try { localStorage.setItem(THEME_KEY, t); } catch {} }
function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  themeBtn.textContent = (t === "dark") ? "Dark" : "Light";
}
let theme = loadTheme(); applyTheme(theme);
themeBtn.addEventListener("click", () => { theme = theme === "dark" ? "light" : "dark"; saveTheme(theme); applyTheme(theme); });

/* scroll reveal */
const ro = new IntersectionObserver((entries)=>{
  for (const e of entries){ if (e.isIntersecting) { e.target.classList.add("show"); ro.unobserve(e.target); } }
},{threshold:.15});
document.querySelectorAll(".reveal").forEach(el => ro.observe(el));

/* contact form -> mailto */
/* contact form -> Formspree POST */
const form = document.querySelector("#contactForm");
const tip  = document.querySelector("#formTip");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const msg = document.querySelector("#message").value.trim();
  if (!name || !email || !msg) {
    tip.textContent = "Please fill all fields.";
    return;
  }

  tip.textContent = "Sending…";
  try {
    const res = await fetch(form.action, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    });

    if (res.ok) {
      tip.textContent = "Thanks! Your message was sent.";
      form.reset();
    } else {
      tip.textContent = "Oops, something went wrong. Try again later.";
    }
  } catch (err) {
    tip.textContent = "Network error. Please try again.";
  }
});
/* back-to-top button */
const toTop = document.querySelector("#toTop");
function updateTopBtn(){
  if (window.scrollY > 320) toTop.classList.add("show");
  else toTop.classList.remove("show");
}
window.addEventListener("scroll", updateTopBtn);
toTop?.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
updateTopBtn();// trigger 1762647496
