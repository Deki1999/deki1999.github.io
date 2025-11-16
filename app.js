/* =====================================================
   THEME AUTO-APPLY (no button)
===================================================== */
(function () {
  const KEY = "site.theme";
  const root = document.documentElement;

  function getTheme() {
    try {
      return (
        localStorage.getItem(KEY) ||
        (matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark")
      );
    } catch {
      return "dark";
    }
  }

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
  }

  applyTheme(getTheme());
})();

/* =====================================================
   SCROLL REVEAL (fade-in)
===================================================== */
(function () {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
})();

/* =====================================================
   DEBUG HIGHLIGHT for sections
===================================================== */
(function () {
  const sections = ["about", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("debug-enter");
          setTimeout(() => e.target.classList.remove("debug-enter"), 600);
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((sec) => observer.observe(sec));
})();

/* =====================================================
   STAGGER REVEAL — project cards
===================================================== */
(function () {
  const section = document.getElementById("projects");
  if (!section) return;

  const cards = section.querySelectorAll(".card");
  cards.forEach((c, i) => {
    c.classList.add("reveal-item");
    c.style.setProperty("--d", `${i * 90}ms`);
  });

  const io = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          cards.forEach((c) => c.classList.add("visible"));
          o.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  io.observe(section);
})();

/* =====================================================
   STAGGER REVEAL — chips in About
===================================================== */
(function () {
  const about = document.getElementById("about");
  if (!about) return;

  const chips = about.querySelectorAll(".chip");
  chips.forEach((chip, i) => {
    chip.classList.add("reveal-chip");
    chip.style.setProperty("--d", `${i * 80}ms`);
  });

  const io = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          chips.forEach((c) => c.classList.add("visible"));
          o.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  io.observe(about);
})();

/* =====================================================
   SCROLL PROGRESS BAR
===================================================== */
(function () {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.backgroundSize = `${pct}% 100%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
})();

/* =====================================================
   ACTIVE NAV LINK (scrollspy)
===================================================== */
(function () {
  const links = document.querySelectorAll('.topnav a[href^="#"]');
  const sections = Array.from(links)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function onScroll() {
    const scrollY = window.scrollY + window.innerHeight / 3;
    let current = null;

    for (const sec of sections) {
      const top = sec.offsetTop;
      if (scrollY >= top) current = sec.id;
    }

    links.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`)
    );
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* =====================================================
   BACK TO TOP BUTTON
===================================================== */
(function () {
  const btn = document.getElementById("toTop");
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > 300) btn.classList.add("show");
    else btn.classList.remove("show");
  };

  window.addEventListener("scroll", toggle);
  toggle();

  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
})();

/* =====================================================
   PROJECT FILTERS
===================================================== */
(function () {
  const section = document.getElementById("projects");
  if (!section) return;

  const buttons = section.querySelectorAll(".pill");
  const cards = section.querySelectorAll(".card");

  const apply = (filter) => {
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/);
      card.hidden = !(filter === "all" || tags.includes(filter));
    });
  };

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      apply(btn.dataset.filter);
    })
  );

  apply("all");
})();

/* =====================================================
   CONTACT FORM — Formspree
===================================================== */
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        alert("Thanks for your message!");
        form.reset();
      } else {
        alert("There was a problem submitting your form.");
      }
    } catch {
      alert("Network error — please try again later.");
    }
  });
})();

/* =====================================================
   PARALLAX AVATAR
===================================================== */
(function () {
  if (!matchMedia("(pointer: fine)").matches) return;

  const hero = document.querySelector(".hero");
  const avatar = document.querySelector(".avatar");
  if (!hero || !avatar) return;

  const strength = 10;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    avatar.style.transform = `
      translate3d(${x * strength}px, ${y * strength}px, 0)
      rotateX(${y * -6}deg)
      rotateY(${x * 6}deg)
    `;
  });

  hero.addEventListener("mouseleave", () => {
    avatar.style.transform = "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)";
  });
})();