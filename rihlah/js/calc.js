// js/calc.js - Calculation Engine

function formatRp(num) {
  if (num === null || num === undefined || isNaN(num)) return "Rp 0";
  return "Rp " + Math.round(num).toLocaleString("id-ID");
}

function parseRp(str) {
  if (typeof str === "number") return str;
  if (!str) return 0;
  return Number(String(str).replace(/[^\d]/g, "")) || 0;
}

function isMakanName(name) {
  return /makan/i.test(name || "");
}

function computeItem(it, p, h, sm, hm) {
  const isFix = it.tipe === "fixed";
  let q;
  if (isFix) {
    q = it.qty !== undefined && it.qty !== null && it.qty !== "" ? it.qty : 1;
  } else {
    q = it.qty > 0 ? it.qty : p;
  }
  const pr = isMakanName(it.nama) ? sm * hm * h : it.harga || 0;
  return {
    ...it,
    qty: q,
    harga: pr,
    total: q * pr,
  };
}

function computeItemEffective(it) {
  return computeItem(
    it,
    state.peserta,
    state.hari,
    state.sesiMakan,
    state.hargaMakan,
  ).total;
}

function computeMakanTotal(p, h, sm, hm) {
  return p * h * sm * hm;
}

function computeAll(pCustom) {
  const p = pCustom !== undefined ? pCustom : state.peserta;
  const h = state.hari;
  const sm = state.sesiMakan;
  const hm = state.hargaMakan;

  let totalFixed = 0;
  let totalVar = 0;
  const rows = [];

  state.items.forEach((it, idx) => {
    const isFix = it.tipe === "fixed";
    let q;
    if (isFix) {
      q = it.qty !== undefined && it.qty !== null && it.qty !== "" ? it.qty : 1;
    } else {
      q = it.qty > 0 ? it.qty : p;
    }
    const pr = isMakanName(it.nama) ? sm * hm * h : it.harga || 0;
    const tot = q * pr;

    if (isFix) {
      totalFixed += tot;
    } else {
      totalVar += tot;
    }

    rows.push({
      idx: idx + 1,
      id: it.id,
      nama: it.nama,
      tipe: it.tipe,
      isFixed: isFix,
      qty: q,
      harga: pr,
      total: tot,
    });
  });

  const subtotal = totalFixed + totalVar;
  const danaDarurat = Math.round(subtotal * (state.margin / 100));
  const grandTotal = subtotal + danaDarurat;
  const perOrang = p > 0 ? grandTotal / p : 0;
  const rnd = state.round || 1;
  const tarifBulat = Math.ceil(perOrang / rnd) * rnd;
  const selisihBulat = tarifBulat * p - grandTotal;

  return {
    peserta: p,
    totalFixed,
    totalVar,
    subtotal,
    danaDarurat,
    grandTotal,
    perOrang,
    tarifBulat,
    selisihBulat,
    rows,
  };
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str);
}
