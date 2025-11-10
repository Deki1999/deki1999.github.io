// app.js
// Sve u IIFE da ne zagađujemo global scope
(() => {
  // === Tema (auto-apply, bez dugmeta) ============================
  const THEME_KEY = "site.theme";
  const root = document.documentElement;

  function getTheme() {
    try {
      return (
        localStorage.getItem(THEME_KEY) ||
        (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      );
    } catch {
      return "dark";
    }
  }
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {}
  }
  applyTheme(getTheme());

  // === Fade-in on scroll (IntersectionObserver) ==================
  (function revealOnScroll() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    // počisti početno stanje (sigurnije ako je HTML keširan)
    items.forEach((el) => {
      el.classList.remove("visible");
      // reflow da CSS tranzicija uvijek krene
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth;
    });

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target); // jednom i gotovo
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    items.forEach((el) => io.observe(el));
  })();

  // === Contact form (Formspree) ==================================
  (function contactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const tip = document.getElementById("formTip");
    const btn = document.getElementById("sendBtn");

    const setTip = (msg) => {
      if (tip) tip.textContent = msg;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.querySelector("#name")?.value.trim();
      const email = form.querySelector("#email")?.value.trim();
      const msg = form.querySelector("#message")?.value.trim();

      if (!name || !email || !msg) {
        setTip("Please fill all fields.");
        return;
      }

      btn && (btn.disabled = true);
      setTip("Sending…");

      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        if (res.ok) {
          setTip("Thanks! Your message was sent.");
          form.reset();
        } else {
          // pokušaj pročitati poruku od Formspree
          let m = "Oops, something went wrong. Try again later.";
          try {
            const data = await res.json();
            if (data && data.error) m = data.error;
            if (data && data.message) m = data.message;
          } catch {}
          setTip(m);
        }
      } catch {
        setTip("Network error. Please try again.");
      } finally {
        btn && (btn.disabled = false);
      }
    });
  })();

  // === Godina u footeru ==========================================
  document.getElementById("year")?.append(new Date().getFullYear());
})();