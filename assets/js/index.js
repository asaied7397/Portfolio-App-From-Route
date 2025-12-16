var themeToggleButton = document.getElementById("theme-toggle-button");
var settingsToggleButton = document.getElementById("settings-toggle");
var settingsSidebar = document.getElementById("settings-sidebar");
var closeSettingsButton = document.getElementById("close-settings");
var testimonialsSection = document.getElementById("testimonials");
var carouselTrack = document.getElementById("testimonials-carousel");
var slides = carouselTrack
  ? Array.from(carouselTrack.querySelectorAll(".testimonial-card"))
  : [];
var nextBtn = document.getElementById("next-testimonial");
var prevBtn = document.getElementById("prev-testimonial");
var indicators = testimonialsSection
  ? Array.from(testimonialsSection.querySelectorAll(".carousel-indicator"))
  : [];
var currentSlideIndex = 0;
var scrollToTopBtn = document.getElementById("scroll-to-top");
var portfolioFilterButtons = document.querySelectorAll("[data-filter]");
var portfolioItems = document.querySelectorAll("[data-category]");
var fontButtons = document.querySelectorAll("[data-font]");
var themeButtons = document.querySelectorAll(".mythemeclass");

//color change
themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    themeButtons.forEach((otherBtn) => {
      var existingBorder = otherBtn.querySelector(".border-element");
      if (existingBorder) {
        otherBtn.removeChild(existingBorder);
      }
    });
    var primary, secondary, accent;
    primary = btn.getAttribute("data-primary");
    secondary = btn.getAttribute("data-secondary");
    accent = btn.getAttribute("data-accent");
    localStorage.setItem("primary", primary);
    localStorage.setItem("secondary", secondary);
    localStorage.setItem("accent", accent);
    var border = document.createElement("div");
    border.classList.add("border-element");
    btn.style.position = "relative";
    border.style = `
      content: "";
      position: absolute;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      border: 2px solid ${primary};
      border-radius: 50%;
      pointer-events: none;
    `;
    btn.appendChild(border);
    document.documentElement.style = `--color-primary: ${primary}; --color-secondary: ${secondary}; --color-accent: ${accent};`;
  });
});

//font change
fontButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.body.classList.forEach((cls) => {
      if (cls.startsWith("font-")) {
        document.body.classList.remove(cls);
      }
    });

    fontButtons.forEach((btn) => {
      if (btn.classList.contains("active")) {
        btn.classList.replace("active", "border-slate-200");
        btn.classList.replace("border-primary", "dark:border-slate-700");
      }
    });

    btn.classList.replace("border-slate-200", "active");
    btn.classList.replace("dark:border-slate-700", "border-primary");
    localStorage.setItem("data-font", `${btn.getAttribute("data-font")}`);

    document.body.classList.add(`font-${btn.getAttribute("data-font")}`);
    localStorage.setItem("font", `font-${btn.getAttribute("data-font")}`);
  });
});

//dark and light theme applying
themeToggleButton.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "nothing");
  }
});

// close and open sidebar menu
settingsToggleButton.addEventListener("click", () => {
  settingsSidebar.classList.toggle("translate-x-full");
  if (settingsSidebar.classList.contains("translate-x-full")) {
    settingsToggleButton.style = "transform:translateY(-50%); right: 0rem;";
  } else {
    settingsToggleButton.style = "transform:translateY(-50%); right: 20rem;";
  }
});

closeSettingsButton.addEventListener("click", () => {
  settingsSidebar.classList.add("translate-x-full");
  settingsToggleButton.style = "transform:translateY(-50%); right: 0rem;";
});

document.addEventListener("click", (e) => {
  if (
    !settingsSidebar.contains(e.target) &&
    !settingsToggleButton.contains(e.target) &&
    !settingsSidebar.classList.contains("translate-x-full")
  ) {
    settingsSidebar.classList.add("translate-x-full");
    settingsToggleButton.style = "transform:translateY(-50%); right: 0rem;";
  }
});

//scroll spy on page and set colors from localstorage
document.addEventListener("DOMContentLoaded", () => {
  var primary, secondary, accent;
  primary = localStorage.getItem("primary");
  secondary = localStorage.getItem("secondary");
  accent = localStorage.getItem("accent");
  document.documentElement.style = `--color-primary: ${primary}; --color-secondary: ${secondary}; --color-accent: ${accent};`;
  document.documentElement.classList.replace(
    "dark",
    localStorage.getItem("theme")
  );
  document.body.classList.add(localStorage.getItem("font"));
  fontButtons.forEach((btn) => {
    if (btn.getAttribute("data-font") === localStorage.getItem("data-font")) {
      btn.classList.replace("border-slate-200", "active");
      btn.classList.replace("dark:border-slate-700", "border-primary");
    }
  });

  var navLinks = Array.from(document.querySelectorAll("nav a[href^='#']"));
  var sections = Array.from(document.querySelectorAll("section[id]"));

  var linkById = new Map(
    navLinks.map((link) => {
      var id = link.getAttribute("href").slice(1);
      return [id, link];
    })
  );

  function setActiveSection(id) {
    navLinks.forEach((a) => {
      var isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", isActive);
    });
  }

  var visibility = new Map(sections.map((section) => [section.id, 0]));

  var observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        var id = entry.target.id;
        var ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
        visibility.set(id, ratio);
      });

      var bestId = null;
      var bestRatio = 0;

      visibility.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      if (bestId && linkById.has(bestId)) {
        setActiveSection(bestId);
      }
    },
    {
      threshold: [0.25, 0.5, 0.75],
    }
  );

  sections.forEach((section) => observer.observe(section));
});

//Carousel in testimonials section
function goToTestimonialSlide(index) {
  var slidesCount = slides.length - 2;
  currentSlideIndex = (index + slidesCount) % slidesCount;
  //   console.log(slides.length, currentSlideIndex, index);
  carouselTrack.style.transform =
    "translateX(" + (currentSlideIndex * 100) / 3 + "%)";
  updateIndicators(currentSlideIndex);
}

function updateIndicators(activeIndex) {
  indicators.forEach((indicator, i) => {
    var isActive = i === activeIndex;
    indicator.classList.toggle("bg-accent", isActive);
    indicator.classList.toggle("bg-slate-400", !isActive);
    indicator.classList.toggle("dark:bg-slate-600", !isActive);
  });
}

indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", function () {
    goToTestimonialSlide(index);
  });
});

nextBtn?.addEventListener("click", function () {
  goToTestimonialSlide(currentSlideIndex + 1);
});

prevBtn?.addEventListener("click", function () {
  goToTestimonialSlide(currentSlideIndex - 1);
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollToTopBtn.classList.remove("opacity-0", "invisible");
    scrollToTopBtn.classList.add("opacity-100", "visible");
  } else {
    scrollToTopBtn.classList.remove("opacity-100", "visible");
    scrollToTopBtn.classList.add("opacity-0", "invisible");
  }
});

//scroll to top btn
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//portfolio section navs and tabs
if (portfolioFilterButtons.length && portfolioItems.length) {
  portfolioFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      var filterValue = button.dataset.filter;
      portfolioFilterButtons.forEach((btn) => {
        btn.classList.toggle("active", btn === button);
        btn.classList.toggle("bg-linear-to-r", btn === button);
        btn.classList.toggle("from-primary", btn === button);
        btn.classList.toggle("to-secondary", btn === button);
      });

      portfolioItems.forEach((item) => {
        var itemCategory = item.dataset.category;
        var shouldShow = filterValue === "all" || itemCategory === filterValue;
        item.hidden = !shouldShow;
      });
    });
  });
}
