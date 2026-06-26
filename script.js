(function () {
  const siteHeader = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

  function setMenuOpen(isOpen) {
    siteHeader?.classList.toggle("is-menu-open", isOpen);
    navToggle?.setAttribute("aria-expanded", String(isOpen));
    navToggle?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  navToggle?.addEventListener("click", () => {
    setMenuOpen(!siteHeader?.classList.contains("is-menu-open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  const pricingMatrix = {
    tiers: {
      launch: 49,
      scale: 149,
      command: 399
    },
    currency: {
      INR: { symbol: "₹", rate: 83.2, tariff: 1.08, locale: "en-IN", decimals: 0 },
      USD: { symbol: "$", rate: 1, tariff: 1, locale: "en-US", decimals: 0 },
      EUR: { symbol: "€", rate: .93, tariff: 1.04, locale: "de-DE", decimals: 0 }
    },
    billing: {
      monthly: { months: 1, discount: 1, suffix: "/mo" },
      annual: { months: 12, discount: .8, suffix: "/yr" }
    }
  };

  const priceNodes = Array.from(document.querySelectorAll("[data-price-node]"));
  const suffixNodes = Array.from(document.querySelectorAll(".price small"));
  const currencySelect = document.getElementById("currency-select");
  const billingInputs = Array.from(document.querySelectorAll("input[name='billing']"));

  let selectedCurrency = currencySelect ? currencySelect.value : "USD";
  let selectedBilling = "monthly";

  function calculatePrice(tierKey, currencyKey, billingKey) {
    const base = pricingMatrix.tiers[tierKey];
    const currency = pricingMatrix.currency[currencyKey];
    const billing = pricingMatrix.billing[billingKey];
    const finalValue = base * currency.rate * currency.tariff * billing.months * billing.discount;

    return currency.symbol + new Intl.NumberFormat(currency.locale, {
      maximumFractionDigits: currency.decimals,
      minimumFractionDigits: 0
    }).format(finalValue);
  }

  function updatePrices() {
    priceNodes.forEach((node) => {
      const tier = node.dataset.priceNode;
      node.classList.add("is-swapping");
      window.setTimeout(() => {
        node.textContent = calculatePrice(tier, selectedCurrency, selectedBilling);
        node.classList.remove("is-swapping");
      }, 90);
    });

    suffixNodes.forEach((node) => {
      node.textContent = pricingMatrix.billing[selectedBilling].suffix;
    });
  }

  if (currencySelect) {
    currencySelect.addEventListener("change", (event) => {
      selectedCurrency = event.target.value;
      updatePrices();
    });
  }

  billingInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      selectedBilling = event.target.value;
      updatePrices();
    });
  });

  updatePrices();

  const featureCards = Array.from(document.querySelectorAll("[data-feature-card]"));
  const mobileQuery = window.matchMedia("(max-width: 920px)");
  let activeFeatureIndex = 0;

  function setActiveFeature(index, options = {}) {
    activeFeatureIndex = index;
    const isCompactLayout = mobileQuery.matches;

    featureCards.forEach((card, cardIndex) => {
      const isActive = isCompactLayout || cardIndex === index;
      const trigger = card.querySelector(".feature-trigger");

      card.classList.toggle("is-active", isActive);
      if (trigger) {
        trigger.setAttribute("aria-expanded", String(isActive));
      }
    });

    if (options.focus && !isCompactLayout) {
      const trigger = featureCards[index]?.querySelector(".feature-trigger");
      trigger?.focus({ preventScroll: true });
    }
  }

  featureCards.forEach((card, index) => {
    const trigger = card.querySelector(".feature-trigger");

    card.addEventListener("mouseenter", () => {
      if (!mobileQuery.matches) {
        setActiveFeature(index);
      }
    });

    card.addEventListener("focusin", () => setActiveFeature(index));

    trigger?.addEventListener("click", () => {
      setActiveFeature(index, { focus: true });
    });
  });

  function syncFeatureMode() {
    setActiveFeature(activeFeatureIndex);
  }

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", syncFeatureMode);
  } else {
    mobileQuery.addListener(syncFeatureMode);
  }

  syncFeatureMode();

  const revealSections = Array.from(document.querySelectorAll(".feature-reveal"));
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  function wrapWords(node, startIndex) {
    if (!node) {
      return startIndex;
    }

    const parts = node.textContent.trim().split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    let wordIndex = startIndex;

    parts.forEach((part) => {
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        return;
      }

      const span = document.createElement("span");
      span.className = "reveal-word";
      span.style.setProperty("--word-index", wordIndex);
      span.textContent = part;
      fragment.appendChild(span);
      wordIndex += 1;
    });

    node.textContent = "";
    node.appendChild(fragment);
    return wordIndex;
  }

  revealSections.forEach((section) => {
    const heading = section.querySelector("h2");
    const copy = section.querySelector("p");
    const nextIndex = wrapWords(heading, 0);
    wrapWords(copy, nextIndex + 3);
  });

  if ("IntersectionObserver" in window) {
    const wordRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, {
      threshold: 0.38
    });

    const itemRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.18
    });

    revealSections.forEach((section) => wordRevealObserver.observe(section));
    revealItems.forEach((item) => itemRevealObserver.observe(item));
  } else {
    revealSections.forEach((section) => section.classList.add("is-visible"));
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
})();
