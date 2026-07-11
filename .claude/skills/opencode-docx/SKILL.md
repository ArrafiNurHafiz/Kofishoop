---
name: opencode-docx
description: >
  Gunakan skill ini setiap kali pengguna meminta pembuatan dokumen Word (.docx) yang terstruktur
  untuk kebutuhan akademik atau profesional: essay, artikel ilmiah, jurnal, laporan (laporan
  penelitian, laporan kerja, laporan keuangan), dan proposal (proposal penelitian, proposal
  bisnis, proposal kegiatan). Trigger ketika pengguna menyebut kata-kata seperti "buat dokumen",
  "buat essay", "buat laporan", "buat jurnal", "buat proposal", "buat artikel", ".docx",
  "Word document", "dokumen terstruktur", atau meminta hasil tulisan dalam format Word yang rapi
  dan profesional. Juga gunakan ketika pengguna memberikan teks/konten dan meminta diformat
  menjadi dokumen Word yang proper. SELALU gunakan skill ini untuk output dokumen akademik atau
  profesional — jangan hanya menampilkan teks biasa di chat.
---

# OpenCode DOCX — Dokumen Akademik & Profesional Terstruktur

Skill ini menghasilkan file `.docx` berkualitas tinggi untuk 5 jenis dokumen: **essay**, **artikel ilmiah**, **jurnal**, **laporan**, dan **proposal**. Setiap jenis memiliki struktur, gaya, dan konvensi tersendiri.

---

## Setup Cepat

```bash
npm install -g docx
```

Gunakan pola dasar dari docx skill (lihat `/mnt/skills/public/docx/SKILL.md`) untuk API docx-js. Skill ini menambahkan template dan aturan struktur khusus per jenis dokumen.

---

## Alur Kerja

1. **Identifikasi jenis dokumen** → pilih template yang sesuai (lihat bagian Jenis Dokumen)
2. **Kumpulkan konten** → judul, penulis, isi, referensi, dll.
3. **Buat dokumen** dengan JavaScript menggunakan pola di bawah
4. **Validasi** → pastikan file valid dan dapat dibuka
5. **Sajikan ke pengguna** dengan `present_files`

---

## Konfigurasi Dasar (Berlaku untuk Semua Jenis)

```javascript
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
        PageNumber, NumberFormat, Header, Footer, TableOfContents,
        LevelFormat, BorderStyle, Table, TableRow, TableCell,
        WidthType, ShadingType, VerticalAlign, PageBreak } = require('docx');
const fs = require('fs');

// Ukuran halaman A4 (standar Indonesia)
const PAGE = {
  width: 11906,   // A4 width DXA
  height: 16838,  // A4 height DXA
  margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 } // 2.5cm kiri, 2cm lainnya
};

// Palet warna profesional
const COLORS = {
  primary: "1F3864",    // Biru tua — judul utama
  secondary: "2E75B6",  // Biru medium — heading
  accent: "4472C4",     // Biru terang — highlight
  dark: "1A1A1A",       // Hampir hitam — body text
  gray: "595959",       // Abu — caption, catatan kaki
  lightGray: "F2F2F2",  // Latar tabel header
  border: "BFBFBF",     // Border tabel
  white: "FFFFFF",
};

// Spasi baris: EXACT 240 = single, 360 = 1.5x, 480 = double
const LINE_SPACING = {
  single:  { line: 240, lineRule: "exact" },
  onehalf: { line: 360, lineRule: "exact" },
  double:  { line: 480, lineRule: "exact" },
};
```

---

## Jenis Dokumen & Template

### 1. ESSAY

**Struktur:** Pendahuluan → Pembahasan (3–5 paragraf argumen) → Kesimpulan → Daftar Pustaka

```javascript
function buatEssay({ judul, penulis, institusi, paragrafPendahuluan,
                     paragrafPembahasan, paragrafKesimpulan, referensi }) {
  return new Document({
    styles: getStyles(),
    sections: [{
      properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
      headers: { default: headerDokumen(judul) },
      footers: { default: footerHalaman() },
      children: [
        // Judul
        paragrafJudul(judul),
        paragrafSubjudul(`${penulis}${institusi ? ' — ' + institusi : ''}`),
        garis(),

        // Pendahuluan
        headingH1("Pendahuluan"),
        ...paragrafPendahuluan.map(t => paragrafBody(t)),

        // Pembahasan
        headingH1("Pembahasan"),
        ...paragrafPembahasan.map(t => paragrafBody(t)),

        // Kesimpulan
        headingH1("Kesimpulan"),
        ...paragrafKesimpulan.map(t => paragrafBody(t)),

        // Daftar Pustaka
        headingH1("Daftar Pustaka"),
        ...referensi.map(r => paragrafReferensi(r)),
      ]
    }]
  });
}
```

---

### 2. ARTIKEL ILMIAH

**Struktur:** Abstrak → Pendahuluan → Metode → Hasil → Pembahasan → Kesimpulan → Referensi

```javascript
function buatArtikel({ judul, penulis, afiliasi, abstrak, kataKunci,
                       pendahuluan, metode, hasil, pembahasan, kesimpulan, referensi }) {
  return new Document({
    styles: getStyles(),
    sections: [{
      properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
      headers: { default: headerDokumen(judul) },
      footers: { default: footerHalaman() },
      children: [
        paragrafJudul(judul),
        paragrafSubjudul(penulis),
        paragrafCaption(afiliasi),
        garis(),

        // Abstrak — kotak tersendiri
        headingH1("Abstrak"),
        paragrafAbstrak(abstrak),
        paragrafCaption(`Kata Kunci: ${kataKunci.join(', ')}`),
        spasi(),

        headingH1("1. Pendahuluan"),
        ...pendahuluan.map(t => paragrafBody(t)),

        headingH1("2. Metode Penelitian"),
        ...metode.map(t => paragrafBody(t)),

        headingH1("3. Hasil"),
        ...hasil.map(t => paragrafBody(t)),

        headingH1("4. Pembahasan"),
        ...pembahasan.map(t => paragrafBody(t)),

        headingH1("5. Kesimpulan"),
        ...kesimpulan.map(t => paragrafBody(t)),

        headingH1("Referensi"),
        ...referensi.map(r => paragrafReferensi(r)),
      ]
    }]
  });
}
```

---

### 3. JURNAL / KARYA ILMIAH

**Struktur:** Halaman Judul → Abstrak → Daftar Isi (opsional) → Bab I–V → Daftar Pustaka → Lampiran

```javascript
function buatJurnal({ judul, penulis, nim, pembimbing, institusi, prodi,
                      tahun, abstrak, kataKunci, bab, daftarPustaka, lampiran }) {
  const children = [
    // Halaman Judul
    paragrafJudul(judul),
    spasi(),
    paragrafSubjudul("Karya Ilmiah"),
    spasi(),
    paragrafBody(`Disusun oleh:\n${penulis}\nNIM: ${nim}`, AlignmentType.CENTER),
    spasi(),
    paragrafBody(institusi, AlignmentType.CENTER),
    paragrafBody(prodi, AlignmentType.CENTER),
    paragrafBody(tahun.toString(), AlignmentType.CENTER),
    halamanBaru(),

    // Abstrak
    headingH1("ABSTRAK"),
    paragrafAbstrak(abstrak),
    paragrafCaption(`Kata Kunci: ${kataKunci.join(', ')}`),
    halamanBaru(),
  ];

  // Bab-bab
  bab.forEach((b, i) => {
    children.push(headingH1(`BAB ${angkaRomawi(i+1)}: ${b.judul.toUpperCase()}`));
    b.subBab?.forEach(sb => {
      children.push(headingH2(`${i+1}.${sb.nomor} ${sb.judul}`));
      sb.konten.forEach(t => children.push(paragrafBody(t)));
    });
    if (i < bab.length - 1) children.push(halamanBaru());
  });

  // Daftar Pustaka
  children.push(halamanBaru(), headingH1("DAFTAR PUSTAKA"));
  daftarPustaka.forEach(r => children.push(paragrafReferensi(r)));

  // Lampiran
  if (lampiran?.length) {
    children.push(halamanBaru(), headingH1("LAMPIRAN"));
    lampiran.forEach((l, i) => {
      children.push(headingH2(`Lampiran ${i+1}: ${l.judul}`));
      l.konten.forEach(t => children.push(paragrafBody(t)));
    });
  }

  return new Document({
    styles: getStyles(),
    sections: [{
      properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
      headers: { default: headerDokumen(judul) },
      footers: { default: footerHalaman() },
      children
    }]
  });
}
```

---

### 4. LAPORAN

**Jenis laporan:** penelitian, kerja praktik, keuangan, kegiatan, audit

**Struktur:** Cover → Kata Pengantar → Daftar Isi → Bab Pendahuluan → Bab Isi → Bab Penutup → Lampiran

```javascript
function buatLaporan({ judul, jenis, penyusun, kepada, tanggal, ringkasan,
                       pendahuluan, isi, penutup, lampiran }) {
  const children = [
    // Cover
    paragrafJudul(`LAPORAN ${jenis.toUpperCase()}`),
    paragrafJudul(judul),
    spasi(2),
    paragrafBody(`Disampaikan kepada:\n${kepada}`, AlignmentType.CENTER),
    spasi(),
    paragrafBody(`Disusun oleh:\n${penyusun}`, AlignmentType.CENTER),
    paragrafBody(tanggal, AlignmentType.CENTER),
    halamanBaru(),

    // Ringkasan Eksekutif
    headingH1("RINGKASAN EKSEKUTIF"),
    paragrafAbstrak(ringkasan),
    halamanBaru(),

    // Pendahuluan
    headingH1("BAB I: PENDAHULUAN"),
    headingH2("1.1 Latar Belakang"),
    paragrafBody(pendahuluan.latarBelakang),
    headingH2("1.2 Tujuan"),
    ...pendahuluan.tujuan.map(t => paragrafBody(t)),
    headingH2("1.3 Ruang Lingkup"),
    paragrafBody(pendahuluan.ruangLingkup),
    halamanBaru(),
  ];

  // Bab isi dinamis
  isi.forEach((bab, i) => {
    children.push(headingH1(`BAB ${angkaRomawi(i+2)}: ${bab.judul.toUpperCase()}`));
    bab.konten.forEach(item => {
      if (item.type === 'heading') children.push(headingH2(item.text));
      else if (item.type === 'tabel') children.push(buatTabel(item.data, item.headers));
      else children.push(paragrafBody(item.text));
    });
    children.push(halamanBaru());
  });

  // Penutup
  children.push(headingH1(`BAB ${angkaRomawi(isi.length+2)}: PENUTUP`));
  children.push(headingH2("Kesimpulan"), paragrafBody(penutup.kesimpulan));
  children.push(headingH2("Saran"), paragrafBody(penutup.saran));

  if (lampiran?.length) {
    children.push(halamanBaru(), headingH1("LAMPIRAN"));
    lampiran.forEach((l, i) => {
      children.push(headingH2(`Lampiran ${i+1}: ${l.judul}`));
      l.konten.forEach(t => children.push(paragrafBody(t)));
    });
  }

  return new Document({ styles: getStyles(), sections: [{ properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } }, headers: { default: headerDokumen(judul) }, footers: { default: footerHalaman() }, children }] });
}
```

---

### 5. PROPOSAL

**Jenis:** penelitian, bisnis, kegiatan/event, hibah/grant

**Struktur:** Cover → Latar Belakang → Rumusan Masalah → Tujuan → Manfaat → Metode/Rencana → Anggaran → Penutup

```javascript
function buatProposal({ judul, jenis, pengusul, kepada, tanggal,
                        latarBelakang, rumusanMasalah, tujuan, manfaat,
                        metode, jadwal, anggaran, penutup }) {
  const children = [
    // Cover
    paragrafJudul(`PROPOSAL ${jenis.toUpperCase()}`),
    paragrafJudul(judul),
    spasi(2),
    paragrafBody(`Diajukan kepada:\n${kepada}`, AlignmentType.CENTER),
    spasi(),
    paragrafBody(`Diusulkan oleh:\n${pengusul}`, AlignmentType.CENTER),
    paragrafBody(tanggal, AlignmentType.CENTER),
    halamanBaru(),

    headingH1("A. LATAR BELAKANG"),
    paragrafBody(latarBelakang),

    headingH1("B. RUMUSAN MASALAH"),
    ...rumusanMasalah.map(r => paragrafBody(r)),

    headingH1("C. TUJUAN"),
    ...tujuan.map(t => paragrafBody(t)),

    headingH1("D. MANFAAT"),
    ...manfaat.map(m => paragrafBody(m)),

    headingH1("E. METODE / RENCANA KEGIATAN"),
    ...metode.map(m => {
      const hasil = [];
      if (m.heading) hasil.push(headingH2(m.heading));
      hasil.push(paragrafBody(m.text));
      return hasil;
    }).flat(),

    headingH1("F. JADWAL PELAKSANAAN"),
    buatTabelJadwal(jadwal),

    headingH1("G. RENCANA ANGGARAN BIAYA"),
    buatTabelAnggaran(anggaran),

    headingH1("H. PENUTUP"),
    paragrafBody(penutup),
  ];

  return new Document({ styles: getStyles(), sections: [{ properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } }, headers: { default: headerDokumen(judul) }, footers: { default: footerHalaman() }, children }] });
}
```

---

## Helper Functions

```javascript
// ── STYLES ────────────────────────────────────────────────────────────────
function getStyles() {
  return {
    default: {
      document: { run: { font: "Times New Roman", size: 24, color: COLORS.dark } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 28, bold: true, font: "Arial", color: COLORS.primary },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        run: { size: 24, bold: true, font: "Arial", color: COLORS.secondary },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal",
        run: { size: 24, bold: true, italics: true, font: "Arial", color: COLORS.accent },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 }
      },
    ]
  };
}

// ── PARAGRAF ───────────────────────────────────────────────────────────────
function paragrafJudul(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 36, font: "Arial", color: COLORS.primary })]
  });
}

function paragrafSubjudul(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 24, font: "Arial", color: COLORS.secondary })]
  });
}

function paragrafCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 20, italics: true, color: COLORS.gray })]
  });
}

function paragrafBody(text, alignment = AlignmentType.JUSTIFIED) {
  return new Paragraph({
    alignment,
    spacing: { ...LINE_SPACING.onehalf, before: 0, after: 160 },
    indent: { firstLine: 720 }, // indentasi paragraf pertama
    children: [new TextRun({ text, size: 24, font: "Times New Roman" })]
  });
}

function paragrafAbstrak(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { ...LINE_SPACING.single, before: 80, after: 80 },
    indent: { left: 720, right: 720 },
    children: [new TextRun({ text, size: 22, font: "Times New Roman", italics: true })]
  });
}

function paragrafReferensi(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { ...LINE_SPACING.single, before: 80, after: 80 },
    indent: { left: 720, hanging: 720 }, // hanging indent untuk APA
    children: [new TextRun({ text, size: 22, font: "Times New Roman" })]
  });
}

function headingH1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 28, font: "Arial" })]
  });
}

function headingH2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial" })]
  });
}

function garis() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.secondary, space: 1 } },
    spacing: { before: 120, after: 240 },
    children: []
  });
}

function spasi(n = 1) {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: 240 * n },
    children: [new TextRun("")]
  });
}

function halamanBaru() {
  return new Paragraph({
    children: [new PageBreak()]
  });
}

// ── HEADER & FOOTER ────────────────────────────────────────────────────────
function headerDokumen(judul) {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.secondary } },
        spacing: { after: 120 },
        children: [new TextRun({ text: judul.length > 60 ? judul.substring(0, 57) + "..." : judul,
                                 size: 18, font: "Arial", color: COLORS.gray })]
      })
    ]
  });
}

function footerHalaman() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border } },
        spacing: { before: 120 },
        children: [
          new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial" }),
          new TextRun({ text: " / ", size: 18, font: "Arial" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: "Arial" }),
        ]
      })
    ]
  });
}

// ── TABEL ──────────────────────────────────────────────────────────────────
function buatTabel(rows, headers) {
  const borderCell = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
  const borders = { top: borderCell, bottom: borderCell, left: borderCell, right: borderCell };
  const colCount = headers.length;
  const colWidth = Math.floor(9026 / colCount); // A4 content width

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h =>
      new TableCell({
        borders,
        width: { size: colWidth, type: WidthType.DXA },
        shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: h, bold: true, color: COLORS.white, size: 20, font: "Arial" })]
        })]
      })
    )
  });

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map(cell =>
        new TableCell({
          borders,
          width: { size: colWidth, type: WidthType.DXA },
          shading: { fill: ri % 2 === 0 ? COLORS.white : COLORS.lightGray, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text: cell, size: 20, font: "Times New Roman" })]
          })]
        })
      )
    })
  );

  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: Array(colCount).fill(colWidth),
    rows: [headerRow, ...dataRows]
  });
}

function buatTabelJadwal(jadwal) {
  // jadwal = [{ kegiatan, mulai, selesai, penanggungJawab }]
  return buatTabel(
    jadwal.map(j => [j.kegiatan, j.mulai, j.selesai, j.penanggungJawab || "-"]),
    ["No.", "Kegiatan", "Waktu Mulai", "Waktu Selesai", "Penanggung Jawab"]
  );
}

function buatTabelAnggaran(anggaran) {
  // anggaran = [{ item, satuan, jumlah, hargaSatuan, total }]
  const rows = anggaran.map(a => [a.item, a.satuan, a.jumlah.toString(),
    `Rp ${a.hargaSatuan.toLocaleString('id-ID')}`, `Rp ${a.total.toLocaleString('id-ID')}`]);
  const totalKeseluruhan = anggaran.reduce((sum, a) => sum + a.total, 0);
  rows.push(["", "", "", "TOTAL", `Rp ${totalKeseluruhan.toLocaleString('id-ID')}`]);
  return buatTabel(rows, ["Item", "Satuan", "Jumlah", "Harga Satuan", "Total"]);
}

// ── UTILITAS ───────────────────────────────────────────────────────────────
function angkaRomawi(n) {
  const map = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],
               [50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  return map.reduce((r,[v,s]) => { while(n>=v){r+=s;n-=v;} return r; }, "");
}
```

---

## Contoh Penggunaan Lengkap

### Essay Singkat

```javascript
const doc = buatEssay({
  judul: "Dampak Kecerdasan Buatan terhadap Dunia Kerja",
  penulis: "Ahmad Fauzi",
  institusi: "Universitas Gadjah Mada",
  paragrafPendahuluan: [
    "Perkembangan kecerdasan buatan (AI) dalam dekade terakhir telah membawa perubahan..."
  ],
  paragrafPembahasan: [
    "Sektor manufaktur menjadi yang paling terdampak oleh otomasi berbasis AI...",
    "Di sisi lain, lapangan kerja baru bermunculan seiring kebutuhan akan tenaga ahli..."
  ],
  paragrafKesimpulan: [
    "AI tidak sekadar menggantikan pekerjaan, melainkan juga menciptakan ekosistem kerja baru..."
  ],
  referensi: [
    "Brynjolfsson, E., & McAfee, A. (2014). The Second Machine Age. W.W. Norton & Company.",
    "World Economic Forum. (2023). Future of Jobs Report 2023. WEF."
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/user-data/outputs/essay-ai-kerja.docx", buffer);
  console.log("File berhasil dibuat.");
});
```

---

## Catatan Penting

- **Font default**: Times New Roman 12pt untuk body, Arial untuk heading — sesuai standar akademik Indonesia
- **Ukuran halaman**: A4 (bukan US Letter)
- **Margin**: 2.5cm kiri, 2cm kanan/atas/bawah (standar skripsi/laporan Indonesia)
- **Spasi**: 1.5x untuk body text, 1x untuk abstrak dan referensi
- **Indentasi paragraf**: gunakan `firstLine: 720` (0.5 inch ≈ 1.27cm)
- **Referensi APA**: gunakan hanging indent (`left: 720, hanging: 720`)
- **Nomor halaman**: ditampilkan di footer tengah, format "N / Total"
- **Judul di header**: dipersingkat otomatis jika >60 karakter

Untuk fitur lanjutan (watermark, TOC dinamis, catatan kaki, multi-kolom), lihat `/mnt/skills/public/docx/SKILL.md`.
