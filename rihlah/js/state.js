// js/state.js - State Management & Defaults

const STORAGE_KEY = "estimasi_biaya_state_v1";

const DEFAULT_ITEMS = [
  {
    id: "i1",
    nama: "Sewa Bus Pariwisata",
    tipe: "fixed",
    qty: 1,
    harga: 3500000,
  },
  {
    id: "i2",
    nama: "Tol & Parkir",
    tipe: "fixed",
    qty: 1,
    harga: 450000,
  },
  {
    id: "i3",
    nama: "Tips Supir & Kenek",
    tipe: "fixed",
    qty: 1,
    harga: 300000,
  },
  {
    id: "i4",
    nama: "Tiket Masuk Wisata",
    tipe: "perpeserta",
    qty: 0,
    harga: 35000,
  },
  {
    id: "i5",
    nama: "Kaos / Merchandise",
    tipe: "perpeserta",
    qty: 0,
    harga: 65000,
  },
  {
    id: "i6",
    nama: "Snack & Air Mineral",
    tipe: "perpeserta",
    qty: 0,
    harga: 15000,
  },
  {
    id: "i7",
    nama: "Spanduk / Banner",
    tipe: "fixed",
    qty: 1,
    harga: 120000,
  },
  {
    id: "i8",
    nama: "P3K & Obat-obatan",
    tipe: "fixed",
    qty: 1,
    harga: 100000,
  },
];

let state = {
  judul: "Rihlah Santri & Pengurus",
  tujuan: "Pantai Indrayanti & HeHa Sky View",
  tanggal: "2026-05-15",
  peserta: 40,
  hari: 1,
  sesiMakan: 2,
  hargaMakan: 25000,
  margin: 10,
  round: 5000,
  items: JSON.parse(JSON.stringify(DEFAULT_ITEMS)),
  pesertaList: [],
};

async function loadState() {
  try {
    // 1. Try to load from Supabase DB first
    if (typeof loadFromDatabase === "function") {
      const dbState = await loadFromDatabase();
      if (dbState) {
        state = { ...state, ...dbState };
        if (!Array.isArray(state.items) || !state.items.length) {
          state.items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
        }
        if (!Array.isArray(state.pesertaList)) {
          state.pesertaList = [];
        }
        if (typeof setSyncStatus === "function") setSyncStatus("saved");
        return;
      }
    }

    // 2. Fallback to LocalStorage
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...state, ...parsed };
      if (!Array.isArray(state.items) || !state.items.length) {
        state.items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
      }
      if (!Array.isArray(state.pesertaList)) {
        state.pesertaList = [];
      }
    }
  } catch (e) {
    console.error("Failed to load state", e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
  if (typeof debouncedSaveDb === "function") {
    debouncedSaveDb();
  }
}

function resetState() {
  if (confirm("Reset semua data ke nilai default?")) {
    localStorage.removeItem(STORAGE_KEY);
    state = {
      judul: "Rihlah Santri & Pengurus",
      tujuan: "Pantai Indrayanti & HeHa Sky View",
      tanggal: "2026-05-15",
      peserta: 40,
      hari: 1,
      sesiMakan: 2,
      hargaMakan: 25000,
      margin: 10,
      round: 5000,
      items: JSON.parse(JSON.stringify(DEFAULT_ITEMS)),
      pesertaList: [],
    };
    initFormValues();
    renderAll();
    if (typeof saveToDatabase === "function") {
      saveToDatabase();
    }
    showToast("Data berhasil di-reset");
  }
}
