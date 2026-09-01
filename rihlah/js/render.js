// js/render.js - Rendering Logic for Editor, Preview, and Stats

function renderEditor() {
  const tbody = document.getElementById("itemsBody");
  tbody.innerHTML = "";

  state.items.forEach((it, idx) => {
    const isFix = it.tipe === "fixed";
    const tr = document.createElement("tr");
    tr.dataset.id = it.id;

    const qtyPlaceholder = isFix ? "1" : `Ikuti Peserta (${state.peserta})`;
    const qtyDisplay = `<input type="number" min="0" step="0.1" value="${
      it.qty || ""
    }" data-id="${it.id}" data-field="qty" placeholder="${qtyPlaceholder}" title="${
      isFix
        ? "Jumlah unit"
        : "Kosongkan/isi 0 untuk ikuti jumlah peserta (" + state.peserta + ")"
    }" style="text-align:right" />`;
    tr.innerHTML = `
      <td class="col-handle" title="Seret untuk ubah urutan">⋮⋮</td>
      <td class="col-no">${idx + 1}</td>
      <td><input type="text" value="${escapeAttr(
        it.nama,
      )}" data-id="${it.id}" data-field="nama" placeholder="Nama item"/></td>
      <td>
        <span class="type-badge ${isFix ? "fix" : "var"}">${
          isFix ? "TETAP" : "PER ORANG"
        }</span>
        <select data-id="${it.id}" data-field="tipe" style="display:none">
          <option value="fixed" ${isFix ? "selected" : ""}>Tetap</option>
          <option value="perpeserta" ${!isFix ? "selected" : ""}>Per Peserta</option>
        </select>
      </td>
      <td class="num">${qtyDisplay}</td>
      <td><input type="number" min="0" value="${
        it.harga
      }" data-id="${it.id}" data-field="harga" style="text-align:right"/></td>
      <td class="col-total" data-total="${it.id}">${formatRp(
        computeItemEffective(it),
      )}</td>
      <td class="row-actions">
        <button class="danger" data-del="${
          it.id
        }" data-tip="Hapus item ini" title="Hapus" data-icon="close"></button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  injectIcons();
}

function renderPeserta() {
  const body = document.getElementById("pesertaBody");
  if (!body) return;
  body.innerHTML = "";
  const totalBayar = state.pesertaList.reduce((s, p) => s + (+p.bayar || 0), 0);
  const tarif = computeAll().tarifBulat;
  const totalTagihan = tarif * state.peserta;
  const sisa = totalTagihan - totalBayar;

  const tv = document.getElementById("tarifView");
  const pt = document.getElementById("pesertaTotal");
  const ps = document.getElementById("pesertaSisa");

  if (tv) tv.textContent = formatRp(tarif);
  if (pt) pt.textContent = formatRp(totalBayar);
  if (ps) ps.textContent = formatRp(sisa);

  if (!state.pesertaList.length) {
    body.innerHTML = `<tr><td colspan="6" class="empty-row">Belum ada peserta — klik + Baris atau ubah jumlah peserta</td></tr>`;
    return;
  }

  state.pesertaList.forEach((p, i) => {
    const status = p.status || "Belum";
    const statusClass =
      status === "Lunas" ? "lunas" : status === "Cicilan" ? "cicilan" : "belum";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color:var(--muted);font-weight:600;font-size:12px">${i + 1}</td>
      <td><input class="peserta-input" type="text" value="${escapeAttr(
        p.nama || "",
      )}" data-pid="${p.id}" data-pf="nama" placeholder="Nama peserta..."/></td>
      <td>
        <span class="peserta-status ${statusClass}">${status}</span>
        <select data-pid="${p.id}" data-pf="status" style="display:none;margin-top:4px">
          <option value="Belum" ${
            status === "Belum" ? "selected" : ""
          }>Belum</option>
          <option value="Lunas" ${
            status === "Lunas" ? "selected" : ""
          }>Lunas</option>
          <option value="Cicilan" ${
            status === "Cicilan" ? "selected" : ""
          }>Cicilan</option>
        </select>
      </td>
      <td><input class="peserta-input" type="date" value="${
        p.tanggal || ""
      }" data-pid="${p.id}" data-pf="tanggal"/></td>
      <td><input class="peserta-input" type="number" min="0" value="${
        p.bayar || 0
      }" data-pid="${p.id}" data-pf="bayar" style="text-align:right"/></td>
      <td><input class="peserta-input" type="text" value="${escapeAttr(
        p.ket || "",
      )}" data-pid="${p.id}" data-pf="ket" placeholder="-"/></td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll(".peserta-status").forEach((b) => {
    b.addEventListener("click", () => {
      const sel = b.nextElementSibling;
      b.style.display = "none";
      sel.style.display = "block";
      sel.focus();
    });
  });
}

function renderStats() {
  const r = computeAll();

  const elF = document.getElementById("statFixed");
  const elV = document.getElementById("statVar");
  const elG = document.getElementById("statGrand");
  const elP = document.getElementById("statPerOrang");
  const elT = document.getElementById("statTarif");
  const elS = document.getElementById("statSelisih");

  if (elF) elF.textContent = formatRp(r.totalFixed);
  if (elV) elV.textContent = formatRp(r.totalVar);
  if (elG) elG.textContent = formatRp(r.grandTotal);
  if (elP) elP.textContent = formatRp(r.perOrang);
  if (elT) elT.textContent = formatRp(r.tarifBulat);
  if (elS) elS.textContent = formatRp(r.selisihBulat);
}

function renderPreview() {
  const r = computeAll();

  const docTitle = document.getElementById("docTitle");
  if (docTitle)
    docTitle.textContent = state.judul || "RANCANGAN ANGGARAN BIAYA";

  const subInfo = document.getElementById("subInfo");
  if (subInfo) {
    subInfo.innerHTML = `
      <span class="chip">${icon("users", 12)} ${state.peserta} Peserta</span>
      <span class="chip">${icon("calendar", 12)} ${state.hari} Hari (${
        state.sesiMakan
      }x makan/hr)</span>
      <span class="chip">${icon("money", 12)} ${escapeHtml(state.tujuan)}</span>
    `;
  }

  const subInfoPerOrang = document.getElementById("subInfoPerOrang");
  if (subInfoPerOrang) {
    subInfoPerOrang.innerHTML = `
      <span class="chip">${icon("users", 12)} ${state.peserta} Peserta</span>
      <span class="chip">${icon("money", 12)} Biaya Riil: ${formatRp(
        r.perOrang,
      )}/org</span>
      <span class="chip" style="background:var(--good-soft);color:var(--good-ink)">${icon(
        "check",
        12,
      )} Tarif Iuran: ${formatRp(r.tarifBulat)}/org</span>
    `;
  }

  const pb = document.getElementById("previewBody");
  if (pb) {
    pb.innerHTML = "";
    r.rows.forEach((row) => {
      const cls = row.isFixed ? "ft-fixed" : "ft-var";
      const rinc = row.isFixed
        ? `${row.qty} unit × ${formatRp(row.harga)}`
        : isMakanName(row.nama)
          ? `${state.peserta} org × ${state.hari * state.sesiMakan} sesi × ${formatRp(
              state.hargaMakan,
            )}`
          : row.qty > 0 && row.qty !== state.peserta
            ? `${row.qty} item × ${formatRp(row.harga)}`
            : `${row.qty} org × ${formatRp(row.harga)}`;
      pb.insertAdjacentHTML(
        "beforeend",
        `
        <tr class="${cls}">
          <td>${row.idx}</td>
          <td>${escapeHtml(row.nama)}</td>
          <td style="color:#475569">${escapeHtml(rinc)}</td>
          <td class="num">${formatRp(row.total)}</td>
        </tr>
      `,
      );
    });
  }

  const pf = document.getElementById("previewFoot");
  if (pf) {
    pf.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:right;font-weight:700">SUBTOTAL BIAYA:</td>
        <td class="num" style="font-weight:700">${formatRp(r.subtotal)}</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align:right;font-weight:600;color:#64748b">DANA DARURAT / MARGIN (${
          state.margin
        }%):</td>
        <td class="num" style="font-weight:600;color:#64748b">${formatRp(
          r.danaDarurat,
        )}</td>
      </tr>
      <tr style="background:#f1f5f9">
        <td colspan="3" style="text-align:right;font-weight:800;font-size:12px">GRAND TOTAL ESTIMASI:</td>
        <td class="num" style="font-weight:800;font-size:12px;color:var(--primary)">${formatRp(
          r.grandTotal,
        )}</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align:right;font-weight:600">BIAYA PER PESERTA (EXACT):</td>
        <td class="num" style="font-weight:600">${formatRp(r.perOrang)}</td>
      </tr>
      <tr style="background:#d1fae5">
        <td colspan="3" style="text-align:right;font-weight:800;color:#047857">REKOMENDASI TARIF IURAN (PEMBULATAN):</td>
        <td class="num" style="font-weight:800;color:#047857">${formatRp(
          r.tarifBulat,
        )} / orang</td>
      </tr>
    `;
  }

  const pob = document.getElementById("perOrangBody");
  if (pob) {
    pob.innerHTML = "";
    r.rows.forEach((row) => {
      const cls = row.isFixed ? "ft-fixed" : "ft-var";
      const itemPerOrang = state.peserta ? row.total / state.peserta : 0;
      const dasar = row.isFixed
        ? `Total ${formatRp(row.total)} ÷ ${state.peserta} peserta`
        : isMakanName(row.nama)
          ? `${state.hari * state.sesiMakan} sesi × ${formatRp(state.hargaMakan)}`
          : row.qty > 0 && row.qty !== state.peserta
            ? `(${row.qty} item × ${formatRp(row.harga)}) ÷ ${state.peserta} org`
            : `1 org × ${formatRp(row.harga)}`;
      pob.insertAdjacentHTML(
        "beforeend",
        `
        <tr class="${cls}">
          <td>${row.idx}</td>
          <td>${escapeHtml(row.nama)}</td>
          <td style="color:#475569">${escapeHtml(dasar)}</td>
          <td class="num" style="font-weight:600">${formatRp(itemPerOrang)}</td>
        </tr>
      `,
      );
    });
  }

  const pof = document.getElementById("perOrangFoot");
  if (pof) {
    pof.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:right;font-weight:700">TOTAL BIAYA RIIL PER ORANG:</td>
        <td class="num" style="font-weight:700">${formatRp(r.perOrang)}</td>
      </tr>
      <tr style="background:#d1fae5">
        <td colspan="3" style="text-align:right;font-weight:800;color:#047857">TARIF IURAN FINAL (PEMBULATAN):</td>
        <td class="num" style="font-weight:800;color:#047857">${formatRp(
          r.tarifBulat,
        )} / orang</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align:right;font-weight:600;color:#047857">ESTIMASI SURPLUS / CASHOVER KELOMPOK:</td>
        <td class="num" style="font-weight:600;color:#047857">+${formatRp(
          r.selisihBulat,
        )}</td>
      </tr>
    `;
  }
}

function renderPreviewPeserta() {
  const ppb = document.getElementById("previewPesertaBody");
  const ppf = document.getElementById("previewPesertaFoot");
  if (!ppb || !ppf) return;

  ppb.innerHTML = "";
  const list = state.pesertaList || [];
  const tarif = computeAll().tarifBulat;

  if (!list.length) {
    ppb.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:12px">Belum ada daftar nama peserta — isi di tab Daftar Peserta</td></tr>`;
    ppf.innerHTML = "";
    return;
  }

  let totB = 0;
  list.forEach((p, i) => {
    const bayar = +p.bayar || 0;
    totB += bayar;
    const status = p.status || "Belum";
    const statusColor =
      status === "Lunas"
        ? "#047857"
        : status === "Cicilan"
          ? "#b45309"
          : "#b91c1c";
    ppb.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>${i + 1}</td>
        <td style="font-weight:600">${escapeHtml(p.nama || "-")}</td>
        <td><span style="color:${statusColor};font-weight:700">${status}</span></td>
        <td>${p.tanggal || "-"}</td>
        <td class="num">${formatRp(bayar)}</td>
        <td style="color:#64748b">${escapeHtml(p.ket || "-")}</td>
      </tr>
    `,
    );
  });

  const totTagihan = tarif * state.peserta;
  const sisa = totTagihan - totB;

  ppf.innerHTML = `
    <tr>
      <td colspan="4" style="text-align:right;font-weight:700">TOTAL TERKUMPUL:</td>
      <td class="num" style="font-weight:700;color:#047857">${formatRp(totB)}</td>
      <td></td>
    </tr>
    <tr>
      <td colspan="4" style="text-align:right;font-weight:700">TARGET TOTAL (${state.peserta} pes × ${formatRp(
        tarif,
      )}):</td>
      <td class="num" style="font-weight:700">${formatRp(totTagihan)}</td>
      <td></td>
    </tr>
    <tr style="background:#fef3c7">
      <td colspan="4" style="text-align:right;font-weight:800;color:#b45309">SISA BELUM TERBAYAR:</td>
      <td class="num" style="font-weight:800;color:#b45309">${formatRp(
        sisa,
      )}</td>
      <td></td>
    </tr>
  `;
}

function renderAll() {
  renderEditor();
  renderPeserta();
  renderStats();
  renderPreview();
}
