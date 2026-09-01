// js/auth.js - Simple Password Auth & Permission Lock

const AUTH_KEY = "rihlah_admin_auth";
const ADMIN_PASS = "admin123";

let isLoggedIn = false;

function checkAuth() {
  isLoggedIn = sessionStorage.getItem(AUTH_KEY) === "true";
  updateAuthUI();
}

function login(pass) {
  if (pass === ADMIN_PASS) {
    sessionStorage.setItem(AUTH_KEY, "true");
    isLoggedIn = true;
    updateAuthUI();
    if (typeof showToast === "function") showToast("Login Admin Berhasil");
    return true;
  }
  if (typeof showToast === "function") showToast("Password Salah!");
  return false;
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  isLoggedIn = false;
  updateAuthUI();
  if (typeof showToast === "function")
    showToast("Anda telah Logout (Mode Read-Only)");
}

function updateAuthUI() {
  const btnAuth = document.getElementById("btnAuth");
  const tabBiaya = document.querySelector('.tab[data-tab="tab-biaya"]');
  const tabPeserta = document.querySelector('.tab[data-tab="tab-peserta"]');
  const tabPreview = document.querySelector('.tab[data-tab="tab-preview"]');

  if (btnAuth) {
    if (isLoggedIn) {
      btnAuth.textContent = "Logout Admin";
      btnAuth.classList.remove("primary");
    } else {
      btnAuth.textContent = "Login Admin";
      btnAuth.classList.add("primary");
    }
  }

  if (!isLoggedIn) {
    // Hide editor tabs for guests
    if (tabBiaya) tabBiaya.style.display = "none";
    if (tabPeserta) tabPeserta.style.display = "none";

    // Switch to preview tab automatically if current active tab is hidden
    if (
      tabBiaya?.classList.contains("active") ||
      tabPeserta?.classList.contains("active")
    ) {
      tabBiaya?.classList.remove("active");
      tabPeserta?.classList.remove("active");
      document.getElementById("tab-biaya")?.classList.remove("active");
      document.getElementById("tab-peserta")?.classList.remove("active");

      tabPreview?.classList.add("active");
      document.getElementById("tab-preview")?.classList.add("active");
    }
  } else {
    // Show all tabs for admin
    if (tabBiaya) tabBiaya.style.display = "block";
    if (tabPeserta) tabPeserta.style.display = "block";
  }

  // Toggle editor input locks
  const editorInputs = document.querySelectorAll(
    ".editor-pane input, .editor-pane select, .editor-pane button:not(#btnAuth,#btnOpenExportModal,#btnPrint)",
  );
  editorInputs.forEach((el) => {
    if (el.closest("#tab-preview") || el.closest(".topbar-actions")) return;
    if (!isLoggedIn) {
      el.disabled = true;
      el.style.pointerEvents = "none";
      el.style.opacity = "0.7";
    } else {
      el.disabled = false;
      el.style.pointerEvents = "auto";
      el.style.opacity = "1";
    }
  });

  const btnReset = document.getElementById("btnReset");
  if (btnReset) {
    btnReset.style.display = isLoggedIn ? "inline-flex" : "none";
  }
}
