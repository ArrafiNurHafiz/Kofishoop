// js/app.js - Application Initialization, Event Handlers & PDF Export

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function showOverlay(show) {
  const o = document.getElementById("overlay");
  if (o) o.classList.toggle("show", !!show);
}

function initFormValues() {
  document.getElementById("judul").value = state.judul || "";
  document.getElementById("tujuan").value = state.tujuan || "";
  document.getElementById("tanggal").value = state.tanggal || "";
  document.getElementById("peserta").value = state.peserta || 0;
  document.getElementById("hari").value = state.hari || 1;
  document.getElementById("sesiMakan").value =
    state.sesiMakan !== undefined ? state.sesiMakan : 2;
  document.getElementById("hargaMakan").value = state.hargaMakan || 0;
  document.getElementById("margin").value = state.margin || 0;
  document.getElementById("marginVal").textContent = (state.margin || 0) + "%";
  document.getElementById("round").value = state.round || 1000;
}

function numInput(id, stateKey, min = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("input", (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val) || val < min) val = min;
    state[stateKey] = val;
    saveState();
    renderStats();
    renderPreview();
    if (stateKey === "peserta") {
      renderEditor();
      renderPeserta();
    }
  });
}

function initEvents() {
  // Simple text bindings
  ["judul", "tujuan", "tanggal"].forEach((k) => {
    const el = document.getElementById(k);
    if (el) {
      el.addEventListener("input", (e) => {
        state[k] = e.target.value;
        saveState();
        renderPreview();
      });
    }
  });

  // Numeric inputs
  numInput("peserta", "peserta", 1);
  numInput("hari", "hari", 1);
  numInput("sesiMakan", "sesiMakan", 0);
  numInput("hargaMakan", "hargaMakan", 0);

  // Steppers
  document.querySelectorAll(".stepper-btns button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const step = parseInt(btn.getAttribute("data-step"), 10) || 1;
      const input = document.getElementById(targetId);
      if (!input) return;
      let val = parseInt(input.value, 10) || 0;
      val = Math.max(0, val + step);
      input.value = val;
      input.dispatchEvent(new Event("input"));
    });
  });

  // Range Slider
  const marginEl = document.getElementById("margin");
  if (marginEl) {
    marginEl.addEventListener("input", (e) => {
      state.margin = parseFloat(e.target.value) || 0;
      document.getElementById("marginVal").textContent = state.margin + "%";
      saveState();
      renderStats();
      renderPreview();
    });
  }

  // Select Round
  const roundEl = document.getElementById("round");
  if (roundEl) {
    roundEl.addEventListener("change", (e) => {
      state.round = parseInt(e.target.value, 10) || 1000;
      saveState();
      renderStats();
      renderPreview();
    });
  }

  // Tabs
  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document
        .querySelectorAll(".tab")
        .forEach((x) => x.classList.remove("active"));
      document
        .querySelectorAll(".tab-panel")
        .forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      const panel = document.getElementById(t.getAttribute("data-tab"));
      if (panel) panel.classList.add("active");
    });
  });

  // Table items delegation
  const itemsBody = document.getElementById("itemsBody");
  if (itemsBody) {
    itemsBody.addEventListener("input", (e) => {
      const el = e.target;
      const id = el.getAttribute("data-id");
      const field = el.getAttribute("data-field");
      if (!id || !field) return;

      const item = state.items.find((x) => x.id === id);
      if (!item) return;

      if (field === "harga" || field === "qty") {
        item[field] = parseFloat(el.value) || 0;
        const totCell = itemsBody.querySelector(`[data-total="${id}"]`);
        if (totCell) totCell.textContent = formatRp(computeItemEffective(item));
      } else {
        item[field] = el.value;
      }

      saveState();
      renderStats();
      renderPreview();
    });

    itemsBody.addEventListener("click", (e) => {
      const delBtn = e.target.closest("[data-del]");
      if (delBtn) {
        const id = delBtn.getAttribute("data-del");
        state.items = state.items.filter((x) => x.id !== id);
        saveState();
        renderAll();
        showToast("Item dihapus");
        return;
      }

      const badge = e.target.closest(".type-badge");
      if (badge) {
        const tr = badge.closest("tr");
        const id = tr.dataset.id;
        const item = state.items.find((x) => x.id === id);
        if (!item) return;
        item.tipe = item.tipe === "fixed" ? "perpeserta" : "fixed";
        saveState();
        renderAll();
      }
    });
  }

  // Add Item
  const btnAddItem = document.getElementById("btnAddItem");
  if (btnAddItem) {
    btnAddItem.addEventListener("click", () => {
      const newItem = {
        id: "i_" + Date.now(),
        nama: "Item Baru",
        tipe: "perpeserta",
        qty: 0,
        harga: 0,
      };
      state.items.push(newItem);
      saveState();
      renderAll();
      showToast("Item baru ditambahkan");
    });
  }

  // Peserta bindings
  const pesertaBody = document.getElementById("pesertaBody");
  if (pesertaBody) {
    pesertaBody.addEventListener("input", (e) => {
      const el = e.target;
      const pid = el.getAttribute("data-pid");
      const pf = el.getAttribute("data-pf");
      if (!pid || !pf) return;

      const p = state.pesertaList.find((x) => x.id === pid);
      if (!p) return;

      if (pf === "bayar") {
        p[pf] = parseFloat(el.value) || 0;
      } else {
        p[pf] = el.value;
      }
      saveState();
      renderPeserta();
      renderPreview();
    });

    pesertaBody.addEventListener("change", (e) => {
      const el = e.target;
      if (el.tagName === "SELECT") {
        const pid = el.getAttribute("data-pid");
        const p = state.pesertaList.find((x) => x.id === pid);
        if (p) {
          p.status = el.value;
          saveState();
          renderPeserta();
          renderPreview();
        }
      }
    });
  }

  // Sync Peserta Count
  const btnSyncPeserta = document.getElementById("btnSyncPeserta");
  if (btnSyncPeserta) {
    btnSyncPeserta.addEventListener("click", () => {
      const target = state.peserta;
      const cur = state.pesertaList.length;
      if (cur < target) {
        for (let i = cur + 1; i <= target; i++) {
          state.pesertaList.push({
            id: "p_" + Date.now() + "_" + i,
            nama: "Peserta " + i,
            status: "Belum",
            tanggal: "",
            bayar: 0,
            ket: "",
          });
        }
      } else if (cur > target) {
        if (
          confirm(
            `Kurangi daftar peserta dari ${cur} menjadi ${target} orang? Data baris terakhir akan dihapus.`,
          )
        ) {
          state.pesertaList = state.pesertaList.slice(0, target);
        }
      }
      saveState();
      renderPeserta();
      renderPreview();
      showToast("Daftar disinkronkan dengan jumlah peserta");
    });
  }

  const btnAddPeserta = document.getElementById("btnAddPeserta");
  if (btnAddPeserta) {
    btnAddPeserta.addEventListener("click", () => {
      state.pesertaList.push({
        id: "p_" + Date.now(),
        nama: "Peserta Baru",
        status: "Belum",
        tanggal: "",
        bayar: 0,
        ket: "",
      });
      saveState();
      renderPeserta();
      renderPreview();
    });
  }

  // Reset & Print
  const btnReset = document.getElementById("btnReset");
  if (btnReset) btnReset.addEventListener("click", resetState);

  const btnPrint = document.getElementById("btnPrint");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  // Modal Export Handlers
  const modal = document.getElementById("exportModal");
  const btnOpenModal = document.getElementById("btnOpenExportModal");
  const btnCloseModal = document.getElementById("btnCloseExportModal");
  const btnCancelExport = document.getElementById("btnCancelExport");
  const btnStartExport = document.getElementById("btnStartExport");

  if (btnOpenModal) {
    btnOpenModal.addEventListener("click", () => {
      if (modal) modal.classList.add("show");
    });
  }

  const closeModalFn = () => {
    if (modal) modal.classList.remove("show");
  };

  if (btnCloseModal) btnCloseModal.addEventListener("click", closeModalFn);
  if (btnCancelExport) btnCancelExport.addEventListener("click", closeModalFn);

  if (btnStartExport) {
    btnStartExport.addEventListener("click", () => {
      closeModalFn();
      exportPDF();
    });
  }
}

function exportPDF() {
  if (typeof html2pdf === "undefined") {
    alert(
      "Library html2pdf belum siap. Coba lagi sebentar atau gunakan Cetak / PDF browser.",
    );
    return;
  }

  const incHal1 = document.getElementById("chkHal1")?.checked;
  const incHal2 = document.getElementById("chkHal2")?.checked;

  if (!incHal1 && !incHal2) {
    alert("Pilih minimal satu bagian yang ingin di-download!");
    return;
  }

  showOverlay(true);

  // Clone document to detached container to isolate from mobile viewport styles
  const srcDoc = document.getElementById("docPreview");
  const clone = srcDoc.cloneNode(true);
  clone.id = "docExportClone";
  clone.className = "doc pdf-clone-render";

  const sec1 = clone.querySelector('.doc-section[data-section="operasional"]');
  const sec2 = clone.querySelector('.doc-section[data-section="perpeserta"]');

  if (sec1) sec1.style.display = incHal1 ? "block" : "none";
  if (sec2) {
    sec2.style.display = incHal2 ? "block" : "none";
    if (incHal2 && !incHal1) {
      sec2.classList.remove("doc-page-break");
    }
  }

  // Explicit inline styling on clone & tables to avoid any html2canvas truncation
  clone.style.cssText =
    "width: 700px !important; min-width: 700px !important; max-width: 700px !important; margin: 0 !important; padding: 16px 20px !important; box-shadow: none !important; background: #ffffff !important; box-sizing: border-box !important;";

  clone.querySelectorAll(".doc-table-wrap").forEach((wrap) => {
    wrap.style.cssText =
      "width: 100% !important; overflow: visible !important; margin-bottom: 12px !important;";
  });

  clone.querySelectorAll("table.doc-table").forEach((tbl) => {
    tbl.style.cssText =
      "width: 100% !important; min-width: 100% !important; table-layout: auto !important; border-collapse: collapse !important; font-size: 10px !important;";
  });

  clone.querySelectorAll(".doc-table th, .doc-table td").forEach((cell) => {
    cell.style.padding = "5px 6px";
    cell.style.fontSize = "10px";
    cell.style.boxSizing = "border-box";
  });

  // Wrapper with fixed desktop-like canvas size
  const exportContainer = document.createElement("div");
  exportContainer.style.position = "absolute";
  exportContainer.style.top = "0";
  exportContainer.style.left = "-9999px";
  exportContainer.style.width = "720px";
  exportContainer.style.background = "#ffffff";
  exportContainer.style.zIndex = "-1000";
  exportContainer.appendChild(clone);
  document.body.appendChild(exportContainer);

  let suffix = "Lengkap";
  if (incHal1 && !incHal2) suffix = "Operasional";
  if (!incHal1 && incHal2) suffix = "PerPeserta";

  const opt = {
    margin: [8, 8, 8, 8],
    filename: `RAB_${(state.judul || "Rihlah").replace(/\s+/g, "_")}_${suffix}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      width: 720,
      windowWidth: 720,
      scrollY: 0,
      scrollX: 0,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  html2pdf()
    .set(opt)
    .from(clone)
    .save()
    .then(() => {
      document.body.removeChild(exportContainer);
      showOverlay(false);
      showToast("PDF berhasil diunduh!");
    })
    .catch((err) => {
      console.error(err);
      if (document.body.contains(exportContainer)) {
        document.body.removeChild(exportContainer);
      }
      showOverlay(false);
      alert("Gagal mengunduh PDF. Silakan gunakan tombol Cetak.");
    });
}

// Boot
document.addEventListener("DOMContentLoaded", async () => {
  await loadState();
  initFormValues();
  initEvents();
  renderAll();
  injectIcons();
});
