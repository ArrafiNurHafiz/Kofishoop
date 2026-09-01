// js/db.js - Supabase Client & Persistence Layer

const SUPABASE_URL = "https://ygpgywvdowrrgjlyhurb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncGd5d3Zkb3dycmdqbHlodXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyODY2NDYsImV4cCI6MjEwMzg2MjY0Nn0.cwHxGAV4Ty7QaYrPRaiEY8KnPiQJ2dQDNxF-17nSjIE";

let supabaseClient = null;
if (typeof supabase !== "undefined") {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const DEFAULT_SESSION_ID = "default";
let saveTimeout = null;

function setSyncStatus(status) {
  const el = document.getElementById("syncStatus");
  if (!el) return;
  if (status === "saving") {
    el.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b;margin-right:4px;"></span> Menyimpan...`;
  } else if (status === "saved") {
    el.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;margin-right:4px;"></span> Tersimpan di DB`;
  } else if (status === "error") {
    el.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;margin-right:4px;"></span> Gagal sync`;
  }
}

async function loadFromDatabase() {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("rihlah_sessions")
      .select("*")
      .eq("id", DEFAULT_SESSION_ID)
      .maybeSingle();

    if (error) {
      console.warn("DB load warning:", error.message);
      return null;
    }
    if (data) {
      return {
        judul: data.judul,
        tujuan: data.tujuan,
        tanggal: data.tanggal,
        peserta: data.peserta,
        hari: data.hari,
        sesiMakan: data.sesi_makan,
        hargaMakan: data.harga_makan,
        margin: data.margin,
        round: data.round,
        items: data.items || [],
        pesertaList: data.peserta_list || [],
      };
    }
  } catch (err) {
    console.error("DB connection error:", err);
  }
  return null;
}

async function saveToDatabase() {
  if (!supabaseClient) return;
  setSyncStatus("saving");

  const payload = {
    id: DEFAULT_SESSION_ID,
    judul: state.judul || "",
    tujuan: state.tujuan || "",
    tanggal: state.tanggal || "",
    peserta: state.peserta || 0,
    hari: state.hari || 1,
    sesi_makan: state.sesiMakan !== undefined ? state.sesiMakan : 2,
    harga_makan: state.hargaMakan || 0,
    margin: state.margin || 0,
    round: state.round || 1000,
    items: state.items || [],
    peserta_list: state.pesertaList || [],
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabaseClient
      .from("rihlah_sessions")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("DB save failed:", error.message);
      setSyncStatus("error");
    } else {
      setSyncStatus("saved");
    }
  } catch (err) {
    console.error("DB save error:", err);
    setSyncStatus("error");
  }
}

function debouncedSaveDb() {
  if (saveTimeout) clearTimeout(saveTimeout);
  setSyncStatus("saving");
  saveTimeout = setTimeout(() => {
    saveToDatabase();
  }, 600);
}
