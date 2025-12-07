/* =====================================================
   PROJECT DATA
===================================================== */
const projects = [
  {
    title: "Typing Test",
    tags: ["ui", "typing"],
    img: "img/projects/typing-test.png",
    description:
      "Live WPM & accuracy, 10/30/60s, pause/resume, progress bar, sound toggle.",
    liveUrl: "https://deki1999.github.io/typing-test/",
    codeUrl: "https://github.com/Deki1999/typing-test",
  },
  {
    title: "Weather App",
    tags: ["api", "ui"],
    img: "img/projects/weather-app.png",
    description:
      "Open-Meteo API, geolocation & search, icons, °C/°F toggle, 24h chart.",
    liveUrl: "https://deki1999.github.io/weather-app/",
    codeUrl: "https://github.com/Deki1999/weather-app",
  },
  {
    title: "To-Do App",
    tags: ["ui", "storage"],
    img: "img/projects/to-do-app.png",
    description: "Tasks, filters, inline edit, localStorage.",
    liveUrl: "https://deki1999.github.io/todo-pro/",
    codeUrl: "https://github.com/Deki1999/todo-pro",
  },
  {
    title: "Pomodoro Timer",
    tags: ["ui"],
    img: "img/projects/pomodoro-timer.png",
    description: "Focus/break cycles with auto-start, progress bar and daily stats.",
    liveUrl: "https://deki1999.github.io/pomodoro-app/",
    codeUrl: "https://github.com/Deki1999/pomodoro-app",
  },
  {
    title: "Notes App",
    tags: ["storage", "ui"],
    img: "img/projects/notes-app.png",
    description:
      "LocalStorage persistence, search, pin, delete, responsive layout.",
    liveUrl: "https://deki1999.github.io/notes-app/",
    codeUrl: "https://github.com/Deki1999/notes-app",
  },
  {
    title: "Password Generator",
    tags: ["ui"],
    img: "img/projects/password-generator.png",
    description:
      "Create strong random passwords with length slider, character options, strength indicator and copy to clipboard.",
    liveUrl: "https://deki1999.github.io/password-generator/",
    codeUrl: "https://github.com/Deki1999/password-generator",
  },
  {
    title: "Movie Search App",
    tags: ["api", "ui"],
    img: "img/projects/movie-search.png",
    description:
      "Search any movie using the OMDb API — with posters, ratings and clean, simple UI.",
    liveUrl: "https://deki1999.github.io/movie-search/",
    codeUrl: "https://github.com/Deki1999/movie-search",
  },
  {
    title: "Dictionary App",
    tags: ["api", "ui"],
    img: "img/projects/dictionary.png",
    description:
      "Search English definitions, examples and synonyms using the Free Dictionary API.",
    liveUrl: "https://deki1999.github.io/dictionary-app/",
    codeUrl: "https://github.com/Deki1999/dictionary-app",
  },
  {
    title: "Expense Tracker",
    tags: ["ui", "storage"],
    img: "img/projects/expense-tracker.png",
    description: "Track daily expenses, categories, monthly totals and charts.",
    liveUrl: "https://deki1999.github.io/expense-tracker/",
    codeUrl: "https://github.com/Deki1999/expense-tracker",
  },
  {
    title: "🔶 Crypto Tracker",
    tags: ["api", "crypto"],
    img: "img/projects/crypto-tracker.png",
    description: "Real-time crypto prices, coin search, auto-refresh, clean UI.",
    liveUrl: "https://deki1999.github.io/crypto-tracker/",
    codeUrl: "https://github.com/Deki1999/crypto-tracker",
  },
];

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
/* ==============================
   THEME TOGGLE BUTTON (Dark ↔ Light)
================================= */
(function () {
  const KEY = "site.theme";
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");

  if (!btn) return;

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    localStorage.setItem(KEY, t);
    btn.textContent = t === "light" ? "🌙" : "☀️";
  }

  function getTheme() {
    return (
      localStorage.getItem(KEY) ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    );
  }

  // Init
  applyTheme(getTheme());

  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    applyTheme(current === "light" ? "dark" : "light");
  });
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
   RENDER PROJECT CARDS FROM DATA
===================================================== */
(function () {
  const section = document.getElementById("projects");
  if (!section) return;

  const grid = section.querySelector(".grid");
  if (!grid || !Array.isArray(projects)) return;

  grid.innerHTML = projects
    .map((p) => {
      const tags = (p.tags || []).join(" ");
      return `
        <article class="card" data-tags="${tags}">
          <img
            src="${p.img}"
            alt="${p.title} thumbnail"
            class="project-thumb"
            loading="lazy"
          />
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="actions">
            <a class="btn" href="${p.liveUrl}" target="_blank" rel="noreferrer noopener">
              Live
            </a>
            <a class="btn ghost" href="${p.codeUrl}" target="_blank" rel="noreferrer noopener">
              Code
            </a>
          </div>
        </article>
      `;
    })
    .join("");
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