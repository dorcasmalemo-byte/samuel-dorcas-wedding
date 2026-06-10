(function () {
  const config = window.WEDDING_CONFIG;
  const state = {
    lang: getInitialLanguage()
  };

  const selectors = {
    header: document.querySelector("[data-header]"),
    nav: document.querySelector("[data-nav]"),
    navToggle: document.querySelector("[data-nav-toggle]"),
    form: document.querySelector("[data-rsvp-form]"),
    formStatus: document.querySelector("[data-form-status]")
  };

  function getInitialLanguage() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    const savedLang = localStorage.getItem("wedding-language");
    return ["fr", "en"].includes(urlLang) ? urlLang : savedLang || "fr";
  }

  function getPath(obj, path) {
    return path.split(".").reduce((value, key) => (value ? value[key] : ""), obj);
  }

  function t(path) {
    return getPath(config.content[state.lang], path) || getPath(config.content.fr, path) || "";
  }

  function applyLanguage(lang) {
    state.lang = lang;
    localStorage.setItem("wedding-language", lang);
    document.documentElement.lang = lang;

    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });

    setFormAriaLabels();

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === lang);
    });

    const languageSelect = selectors.form?.elements.language;
    if (languageSelect) languageSelect.value = lang;

    renderWelcome();
    renderSchedule();
  }

  function applyImages() {
    setHeroImage(config.images.hero);
    renderHeroGallery();
    renderGalleryDecks();
    document.querySelectorAll("[data-image]").forEach((image) => {
      const key = image.dataset.image;
      image.src = config.images[key];
      image.onerror = () => {
        if (config.imageFallbacks?.[key] && image.src !== config.imageFallbacks[key]) {
          image.src = config.imageFallbacks[key];
        }
      };
    });
    document.querySelectorAll("[data-link]").forEach((link) => {
      link.href = config.links[link.dataset.link] || "#";
    });
  }

  function setHeroImage(src) {
    document.documentElement.style.setProperty("--hero-image", `url("${src}")`);
    const probe = new Image();
    probe.onerror = () => {
      if (config.imageFallbacks?.hero) {
        document.documentElement.style.setProperty("--hero-image", `url("${config.imageFallbacks.hero}")`);
      }
    };
    probe.src = src;
  }

  function setFormAriaLabels() {
    const form = selectors.form;
    if (!form) return;
    const labels = {
      fullName: t("form.name"),
      contact: t("form.contact"),
      attendance: t("form.attendance"),
      guests: t("form.guests"),
      language: t("form.language"),
      message: t("form.message")
    };
    Object.entries(labels).forEach(([name, label]) => {
      if (form.elements[name]) form.elements[name].setAttribute("aria-label", label);
    });
  }

  function renderHeroGallery() {
    const container = document.querySelector("[data-hero-gallery]");
    if (!container) return;
    const images = config.heroGallery || [config.images.hero];
    container.innerHTML = [0, 1, 2, 3, 4]
      .map((index) => {
        const src = images[index % images.length];
        return `
          <figure class="hero-photo-card hero-card-${index + 1}" style="--card-delay:${index * 0.16}s">
            <img src="${src}" alt="" data-rotating-image data-pool="hero" data-offset="${index}" />
          </figure>
        `;
      })
      .join("");
  }

  function renderGalleryDecks() {
    const container = document.querySelector("[data-gallery-grid]");
    if (!container) return;
    const decks = config.galleryDecks || [];
    container.innerHTML = decks
      .map((deck, index) => {
        const src = deck[0];
        return `
          <figure class="gallery-card reveal" style="--gallery-delay:${index * 0.12}s">
            <img src="${src}" alt="Wedding gallery image ${index + 1}" data-rotating-image data-pool="gallery-${index}" data-offset="0" />
            <figcaption>${String(index + 1).padStart(2, "0")}</figcaption>
          </figure>
        `;
      })
      .join("");
    setupRevealAnimation(container);
  }

  function renderWelcome() {
    const container = document.querySelector("[data-welcome-blocks]");
    if (!container) return;
    container.innerHTML = config.content[state.lang].welcome.blocks
      .map(
        (block, index) => `
          <article class="story-block reveal in-view">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h3>${block.title}</h3>
            <p>${block.text}</p>
          </article>
        `
      )
      .join("");
  }

  function setupPhotoRotations() {
    const pools = {
      hero: config.heroGallery || [config.images.hero],
      ...Object.fromEntries((config.galleryDecks || []).map((deck, index) => [`gallery-${index}`, deck]))
    };

    document.querySelectorAll("[data-rotating-image]").forEach((image, index) => {
      const pool = pools[image.dataset.pool] || [];
      if (pool.length < 2) return;
      let cursor = Number(image.dataset.offset || 0);
      window.setInterval(() => {
        cursor = (cursor + 1) % pool.length;
        image.classList.add("is-fading");
        window.setTimeout(() => {
          image.src = pool[cursor];
          image.classList.remove("is-fading");
        }, 420);
      }, 3600 + index * 640);
      image.onerror = () => {
        const fallback = config.imageFallbacks?.galleryOne || config.imageFallbacks?.hero;
        if (fallback && image.src !== fallback) image.src = fallback;
      };
    });
  }

  function renderSchedule() {
    const container = document.querySelector("[data-timeline]");
    if (!container) return;
    container.innerHTML = config.schedule
      .map(
        (item) => `
          <article class="timeline-item reveal in-view">
            <time>${item.time}</time>
            <h3>${item.title[state.lang]}</h3>
            <p>${item.text[state.lang]}</p>
          </article>
        `
      )
      .join("");
  }

  function updateCountdown() {
    const target = new Date(config.weddingDate).getTime();
    const now = Date.now();
    const distance = Math.max(0, target - now);
    const seconds = Math.floor(distance / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    setCount("days", String(days).padStart(3, "0"));
    setCount("hours", String(hours).padStart(2, "0"));
    setCount("minutes", String(minutes).padStart(2, "0"));
    setCount("seconds", String(remainingSeconds).padStart(2, "0"));
  }

  function setCount(key, value) {
    const node = document.querySelector(`[data-count="${key}"]`);
    if (node) node.textContent = value;
  }

  function setupNavigation() {
    const closeNav = () => {
      selectors.nav?.classList.remove("is-open");
      selectors.header?.classList.remove("nav-active");
      selectors.navToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    };

    selectors.navToggle?.addEventListener("click", () => {
      const isOpen = selectors.nav?.classList.toggle("is-open");
      selectors.header?.classList.toggle("nav-active", isOpen);
      selectors.navToggle?.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    selectors.nav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("scroll", () => {
      selectors.header?.classList.toggle("is-scrolled", window.scrollY > 24);
    });
  }

  function setupRevealAnimation(scope = document) {
    const revealNodes = scope.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.14 }
    );
    revealNodes.forEach((node) => observer.observe(node));
  }

  function setupForm() {
    selectors.form?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!selectors.form.checkValidity()) {
        selectors.formStatus.textContent = t("form.error");
        selectors.form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(selectors.form).entries());
      data.createdAt = new Date().toISOString();

      const existing = JSON.parse(localStorage.getItem("wedding-rsvps") || "[]");
      existing.push(data);
      localStorage.setItem("wedding-rsvps", JSON.stringify(existing));

      selectors.formStatus.textContent = t("form.success");
      selectors.form.reset();
      selectors.form.elements.language.value = state.lang;
    });
  }

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });

  applyImages();
  applyLanguage(state.lang);
  setupNavigation();
  setupRevealAnimation();
  setupPhotoRotations();
  setupForm();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();
