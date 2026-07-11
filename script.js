/* ========================================
   KOFISHOOP — JavaScript (Vodafone layout)
   Simplified: no sticky, no parallax
   ======================================== */

"use strict";

// =========================================
// 1. MOBILE HAMBURGER MENU
// =========================================
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target) && navMenu.classList.contains("active")) {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

// =========================================
// 2. SMOOTH SCROLL
// =========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight;
      const targetPos =
        target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetPos,
        behavior: "smooth",
      });
    }
  });
});

// =========================================
// 3. SCROLL REVEAL — per-section observer
// =========================================
const allRevealElements = document.querySelectorAll(".reveal");

// Per-section observer: adds visible-section class to the section parent
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible-section");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  },
);

document.querySelectorAll("section[id], #footer").forEach(function (section) {
  sectionObserver.observe(section);
});

// Individual reveal elements
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  },
);

allRevealElements.forEach((el) => revealObserver.observe(el));

// =========================================
// 4. TESTIMONI CAROUSEL
// =========================================
const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.querySelectorAll(".carousel-dot");
const slides = document.querySelectorAll(".carousel-slide");
let currentSlide = 0;
let carouselInterval;

function goToSlide(index) {
  if (!carouselTrack) return;
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;

  carouselTrack.style.transform = "translateX(-" + index * 100 + "%)";
  currentSlide = index;

  carouselDots.forEach((dot) => dot.classList.remove("active"));
  carouselDots[index].classList.add("active");
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function startCarousel() {
  stopCarousel();
  carouselInterval = setInterval(nextSlide, 5000);
}

function stopCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
}

carouselDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const slideIndex = parseInt(dot.getAttribute("data-slide"));
    goToSlide(slideIndex);
    resetCarousel();
  });
});

function resetCarousel() {
  stopCarousel();
  startCarousel();
}

const carousel = document.querySelector(".testimoni-carousel");
if (carousel) {
  carousel.addEventListener("mouseenter", stopCarousel);
  carousel.addEventListener("mouseleave", startCarousel);
}

let touchStartX = 0;
let touchEndX = 0;

if (carousel) {
  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopCarousel();
    },
    { passive: true },
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
      startCarousel();
    },
    { passive: true },
  );
}

goToSlide(0);
startCarousel();

// =========================================
// 5. FORM HANDLING
// =========================================
const kontakForm = document.getElementById("kontakForm");
const formToast = document.getElementById("formToast");

if (kontakForm) {
  kontakForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();
    const pesan = document.getElementById("pesan").value.trim();

    if (!nama || !email || !pesan) {
      alert("请填写所有字段！");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("请输入有效的邮箱地址。");
      return;
    }

    formToast.classList.add("show");
    kontakForm.reset();

    setTimeout(() => {
      formToast.classList.remove("show");
    }, 5000);
  });
}

// =========================================
// 6. LIGHTBOX GALERI
// =========================================
const galleryItems = document.querySelectorAll(
  ".gallery-featured, .gallery-card",
);
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");

const galleryData = [
  { img: "images/gallery-1.jpg", label: "拉花艺术 — 每一杯都是匠心之作" },
  { img: "images/gallery-2.jpg", label: "温馨氛围 — 像家一样舒适" },
  { img: "images/gallery-3.jpg", label: "匠心冲泡 — 专业咖啡师" },
  { img: "images/gallery-4.jpg", label: "阅读角落 — 享受安静时光" },
  { img: "images/gallery-5.jpg", label: "咖啡与书 — 完美的搭配" },
  { img: "images/gallery-6.jpg", label: "精选咖啡豆 — 来自印尼群岛" },
];

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    if (typeof galleryData[index] === "undefined") return;
    const data = galleryData[index];
    lightboxImg.style.backgroundImage = "url('" + data.img + "')";
    lightboxCaption.textContent = data.label;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    stopCarousel();
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  startCarousel();
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});

// =========================================
// 7. COUNTER ANIMATION
// =========================================
let counterAnimated = false;

function animateCounter() {
  if (counterAnimated) return;
  counterAnimated = true;

  document.querySelectorAll(".stat-number").forEach((el) => {
    const target = parseInt(el.dataset.target);
    if (!target) return;
    const inc = Math.ceil(target / 60);
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        el.textContent = target + (target < 100 ? "" : "+");
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, 20);
  });
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter();
        statObserver.disconnect();
      }
    });
  },
  { threshold: 0.3 },
);

const statsSection = document.querySelector(".about-stats");
if (statsSection) statObserver.observe(statsSection);

// =========================================
// 8. SERVICE TAB SWITCH
// =========================================
document.querySelectorAll(".service-tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document
      .querySelectorAll(".service-tab")
      .forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    const target = this.dataset.tab;
    document
      .querySelectorAll(".service-panel")
      .forEach((p) => p.classList.remove("active"));
    const panel = document.getElementById("panel-" + target);
    if (panel) panel.classList.add("active");
  });
});

// =========================================
// 9. GALLERY TAG FILTER
// =========================================
document.querySelectorAll(".gallery-tag").forEach((tag) => {
  tag.addEventListener("click", function () {
    document
      .querySelectorAll(".gallery-tag")
      .forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
  });
});

// =========================================
// 10. PARALLAX — Hero Background
// =========================================
(function () {
  const heroBg = document.getElementById("heroBg");
  if (!heroBg) return;

  window.addEventListener(
    "scroll",
    function () {
      const scrollY = window.scrollY;
      const heroSection = document.getElementById("hero");
      if (!heroSection) return;
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (scrollY <= heroBottom) {
        heroBg.style.transform = "translateY(" + scrollY * 0.35 + "px)";
      }
    },
    { passive: true },
  );
})();

// =========================================
// 11. NAVBAR — Scroll effect (glass)
// =========================================
(function () {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    },
    { passive: true },
  );

  // Check initial state
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  }
})();

// =========================================
// 12. RESIZE HANDLER
// =========================================
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    }
  }, 250);
});

// =========================================
// 13. AUTH — MODAL & EVENT HANDLERS
// =========================================
const authOverlay = document.getElementById("authOverlay");
const authClose = document.getElementById("authClose");
const authTabs = document.querySelectorAll(".auth-tab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const btnAuth = document.getElementById("btnAuth");
const btnAuthMobile = document.getElementById("btnAuthMobile");
const btnAuthText = document.getElementById("btnAuthText");
const authToast = document.getElementById("authToast");
const authToastMsg = document.getElementById("authToastMsg");
const authLoggedIn = document.getElementById("authLoggedIn");
const authDisplayName = document.getElementById("authDisplayName");
const authDisplayEmail = document.getElementById("authDisplayEmail");
const authAvatar = document.getElementById("authAvatar");
const btnLogout = document.getElementById("btnLogout");
const regStep1 = document.getElementById("regStep1");
const regStep2 = document.getElementById("regStep2");
const regStep1Next = document.getElementById("regStep1Next");
const regStep2Back = document.getElementById("regStep2Back");
const stepTypeError = document.getElementById("stepTypeError");
const memberTypeCards = document.querySelectorAll(".member-type-card");
let selectedMemberType = null;

// ---------- Toast ----------
function showAuthToast(msg, type) {
  if (!authToast) return;
  authToastMsg.textContent = msg;
  authToast.className = "auth-toast show " + (type || "success");
  clearTimeout(authToast._timer);
  authToast._timer = setTimeout(() => {
    authToast.classList.remove("show");
  }, 3500);
}

// ---------- Open / Close ----------
function openAuthModal() {
  if (!authOverlay) return;
  authOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  // If logged in, show logged-in view
  if (isLoggedIn()) {
    document
      .querySelectorAll(".auth-form")
      .forEach((f) => f.classList.remove("active"));
    document
      .querySelectorAll(".auth-tab")
      .forEach((t) => t.classList.remove("active"));
    authLoggedIn.classList.add("active");
    loadUserProfile();
  } else {
    switchAuthTab("login");
  }
}

function closeAuthModal() {
  if (!authOverlay) return;
  authOverlay.classList.remove("active");
  document.body.style.overflow = "";
  // Hide logged-in view on close
  authLoggedIn.classList.remove("active");
  // Reset register multi-step
  resetRegisterForm();
}

// ---------- Switch tab ----------
function switchAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.auth === tab);
  });
  document
    .querySelectorAll(".auth-form")
    .forEach((f) => f.classList.remove("active"));
  const targetForm = document.getElementById(tab + "Form");
  if (targetForm) targetForm.classList.add("active");
  authLoggedIn.classList.remove("active");
  // Clear errors
  loginError.classList.remove("show");
  loginError.textContent = "";
  registerError.classList.remove("show");
  registerError.textContent = "";

  // Reset register form when switching to login
  if (tab !== "register") {
    resetRegisterForm();
  }
}

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchAuthTab(tab.dataset.auth);
  });
});

// ---------- Reset register form ----------
function resetRegisterForm() {
  selectedMemberType = null;
  memberTypeCards.forEach((c) => c.classList.remove("selected"));
  document
    .querySelectorAll(".member-type-radio")
    .forEach((r) => (r.checked = false));
  if (regStep1) regStep1.style.display = "";
  if (regStep2) regStep2.style.display = "none";
  stepTypeError?.classList.remove("show");
}

// ---------- Member type card selection ----------
memberTypeCards.forEach((card) => {
  card.addEventListener("click", () => {
    memberTypeCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    const radio = card.querySelector(".member-type-radio");
    if (radio) radio.checked = true;
    selectedMemberType = card.dataset.type;
    stepTypeError?.classList.remove("show");
  });
});

// ---------- Step navigation ----------
if (regStep1Next) {
  regStep1Next.addEventListener("click", () => {
    if (!selectedMemberType) {
      stepTypeError.textContent = "Silakan pilih tipe member terlebih dahulu.";
      stepTypeError.classList.add("show");
      return;
    }
    stepTypeError.classList.remove("show");
    regStep1.style.display = "none";
    regStep2.style.display = "flex";
  });
}

if (regStep2Back) {
  regStep2Back.addEventListener("click", () => {
    regStep2.style.display = "none";
    regStep1.style.display = "";
  });
}

// ---------- Button Auth click ----------
if (btnAuth) {
  btnAuth.addEventListener("click", openAuthModal);
}
if (btnAuthMobile) {
  btnAuthMobile.addEventListener("click", openAuthModal);
}
if (authClose) {
  authClose.addEventListener("click", closeAuthModal);
}
if (authOverlay) {
  authOverlay.addEventListener("click", (e) => {
    if (e.target === authOverlay) closeAuthModal();
  });
}

// ---------- Login submit ----------
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // Validation
    if (!email || !password) {
      loginError.textContent = "Harap isi email dan password.";
      loginError.classList.add("show");
      return;
    }
    if (password.length < 6) {
      loginError.textContent = "Password minimal 6 karakter.";
      loginError.classList.add("show");
      return;
    }

    // Loading state
    loginBtn.classList.add("auth-btn-loading");
    loginBtn.disabled = true;
    loginError.classList.remove("show");

    try {
      const result = await loginMember(email, password);
      showAuthToast(
        "Selamat datang kembali, " + (result.user?.email || "") + "!",
        "success",
      );
      closeAuthModal();
      updateAuthUI();
    } catch (err) {
      loginError.textContent = err.message || "Login gagal. Coba lagi.";
      loginError.classList.add("show");
    } finally {
      loginBtn.classList.remove("auth-btn-loading");
      loginBtn.disabled = false;
    }
  });
}

// ---------- Register submit ----------
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    // Validation
    if (!name || name.length < 2) {
      registerError.textContent = "Nama lengkap minimal 2 karakter.";
      registerError.classList.add("show");
      return;
    }
    if (!email) {
      registerError.textContent = "Harap isi email.";
      registerError.classList.add("show");
      return;
    }
    if (password.length < 6) {
      registerError.textContent = "Password minimal 6 karakter.";
      registerError.classList.add("show");
      return;
    }

    // Loading state
    registerBtn.classList.add("auth-btn-loading");
    registerBtn.disabled = true;
    registerError.classList.remove("show");

    try {
      const result = await registerMember(
        email,
        password,
        name,
        phone,
        selectedMemberType,
      );
      showAuthToast(
        "Pendaftaran berhasil! Silakan cek email untuk verifikasi.",
        "success",
      );
      switchAuthTab("login");
      // Pre-fill email
      document.getElementById("loginEmail").value = email;
    } catch (err) {
      registerError.textContent =
        err.message || "Pendaftaran gagal. Coba lagi.";
      registerError.classList.add("show");
    } finally {
      registerBtn.classList.remove("auth-btn-loading");
      registerBtn.disabled = false;
    }
  });
}

// ---------- Pricing CTA buttons (trigger auth modal) ----------
document.querySelectorAll(".btn-auth-trigger").forEach(function (btn) {
  btn.addEventListener("click", function () {
    openAuthModal();
  });
});

// ---------- Logout ----------
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    try {
      await logoutMember();
      showAuthToast("Berhasil keluar.", "success");
      closeAuthModal();
      updateAuthUI();
    } catch (err) {
      showAuthToast("Gagal keluar: " + err.message, "error");
    }
  });
}

// ---------- Load user profile (for logged-in view) ----------
async function loadUserProfile() {
  try {
    const member = await getMemberSession();
    if (member) {
      authDisplayName.textContent =
        member.full_name || member.email || "Member";
      authDisplayEmail.textContent = member.email || "";
      const initial = (member.full_name ||
        member.email ||
        "K")[0].toUpperCase();
      authAvatar.textContent = initial;
    }
  } catch {
    authDisplayName.textContent = "Member";
    authDisplayEmail.textContent = "";
  }
}

// ---------- Update navbar UI based on session ----------
function updateAuthUI() {
  const loggedIn = isLoggedIn();
  if (btnAuth) {
    if (loggedIn) {
      btnAuth.innerHTML =
        '<i class="fas fa-user-check"></i> <span>Member</span>';
    } else {
      btnAuth.innerHTML = '<i class="fas fa-user"></i> <span>Masuk</span>';
    }
  }
  if (btnAuthMobile) {
    if (loggedIn) {
      btnAuthMobile.innerHTML =
        '<i class="fas fa-user-check"></i> <span>Member</span>';
    } else {
      btnAuthMobile.innerHTML =
        '<i class="fas fa-user"></i> <span>Masuk</span>';
    }
  }
}

// ---------- Keyboard: Escape to close ----------
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && authOverlay?.classList.contains("active")) {
    closeAuthModal();
  }
});

// ---------- Init: check session on load ----------
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
});

// Also check on load in case DOMContentLoaded already fired
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  updateAuthUI();
}

// ---------- Listen auth state changes ----------
try {
  const sub = onAuthChange((event) => {
    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      updateAuthUI();
    } else if (event === "SIGNED_OUT") {
      updateAuthUI();
    }
  });
} catch (e) {
  // Supabase not loaded yet — will catch on user action
}

console.log("Kofishoop — Premium Animations Active ✨");
