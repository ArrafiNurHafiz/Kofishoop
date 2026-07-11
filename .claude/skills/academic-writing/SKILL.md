---
name: academic-writing
description: >
  Skill untuk menghasilkan tulisan akademik dan profesional berkualitas tinggi. Gunakan skill ini SETIAP KALI pengguna meminta bantuan menulis atau memperbaiki: jurnal ilmiah, artikel akademik, esai, laporan (laporan praktikum, laporan kerja, laporan penelitian), proposal (proposal penelitian, proposal skripsi, proposal proyek), makalah, abstrak, tinjauan pustaka, skripsi/tesis, dan dokumen formal lainnya. Juga gunakan untuk: menyusun kerangka tulisan, memperbaiki gaya bahasa akademik, memformat sitasi, menerjemahkan tulisan informal ke formal, atau kapanpun pengguna menyebut "tulis", "buat", "susun", "revisi" dalam konteks dokumen akademik atau profesional.
---

# Academic Writing Skill

Skill ini memandu Claude dalam menghasilkan tulisan akademik dan profesional yang terstruktur, koheren, dan sesuai standar keilmuan.

---

## 1. Identifikasi Jenis Dokumen

Sebelum menulis, kenali jenis dokumennya dan sesuaikan pendekatan:

| Jenis Dokumen | Ciri Utama | Lihat Referensi |
|---|---|---|
| Jurnal Ilmiah | IMRaD, peer-reviewed, sitasi ketat | `references/jurnal.md` |
| Artikel/Makalah | Argumen terfokus, referensi ilmiah | `references/artikel.md` |
| Esai | Tesis + argumen + refleksi | `references/esai.md` |
| Laporan | Faktual, sistematis, berbasis data | `references/laporan.md` |
| Proposal | Rencana ke depan, justifikasi | `references/proposal.md` |
| Abstrak | Ringkasan padat ≤250 kata | Panduan di bawah |
| Tinjauan Pustaka | Sintesis sumber, bukan anotasi | Panduan di bawah |

---

## 2. Prinsip Universal Tulisan Akademik

### Struktur
- Setiap paragraf: **satu gagasan utama** (topik sentence → pengembangan → transisi)
- Alur logis: umum → khusus, atau kronologis, atau problem → solusi
- Gunakan heading/subheading yang hierarkis dan deskriptif

### Bahasa
- Formal, impersonal (hindari "saya rasa", "menurut hemat penulis" jika tidak perlu)
- Kalimat aktif lebih diutamakan daripada pasif (kecuali metode penelitian)
- Hindari kolokialisme, singkatan tidak baku, kata emotif berlebihan
- Konsisten dalam penggunaan istilah teknis

### Argumen
- Setiap klaim didukung bukti atau sitasi
- Akui limitasi dan counter-argument bila relevan
- Bedakan fakta vs. interpretasi vs. opini penulis

### Sitasi (default: APA 7th)
```
Dalam teks: (Penulis, Tahun) atau Penulis (Tahun)
Daftar pustaka: Penulis, A. A. (Tahun). Judul. Penerbit. https://doi.org/xxx
```
Tanyakan kepada pengguna jika ingin format lain: APA, MLA, Chicago, IEEE, Vancouver, Turabian.

---

## 3. Alur Kerja Penulisan

### Langkah 1 — Klarifikasi (jika informasi kurang)
Tanyakan hal berikut SEBELUM mulai menulis jika belum jelas:
- Topik / judul / pertanyaan penelitian
- Jenis dokumen dan panjang yang diinginkan
- Audiens (dosen, jurnal tertentu, umum)
- Bahasa (Indonesia / Inggris / bilingual)
- Gaya sitasi yang digunakan
- Apakah ada template/panduan khusus dari institusi

### Langkah 2 — Susun Kerangka
Selalu buat kerangka terlebih dahulu untuk dokumen >500 kata. Sajikan kepada pengguna untuk dikonfirmasi sebelum penulisan penuh.

### Langkah 3 — Tulis
- Tulis bagian per bagian sesuai kerangka yang disetujui
- Gunakan placeholder `[SUMBER]` atau `[DATA]` jika pengguna perlu melengkapi data spesifik
- Tandai bagian yang perlu disesuaikan dengan konteks pengguna dengan `[*catatan: ...]`

### Langkah 4 — Review dan Perbaikan
Setelah draft selesai, tawarkan:
- Cek koherensi argumen
- Perbaikan gaya bahasa
- Pengecekan format sitasi
- Saran penguatan (tambah bukti, perkuat transisi)

---

## 4. Panduan Cepat: Abstrak

Struktur abstrak empiris (IMRaD mini):
1. **Latar belakang/tujuan** (1-2 kalimat) — mengapa penelitian ini penting
2. **Metode** (1-2 kalimat) — apa yang dilakukan
3. **Hasil** (2-3 kalimat) — temuan utama dengan angka jika ada
4. **Simpulan/Implikasi** (1-2 kalimat) — apa artinya

Abstrak non-empiris (esai/tinjauan):
1. Pernyataan topik dan tujuan
2. Pendekatan/argumen utama
3. Temuan/posisi utama
4. Kontribusi

---

## 5. Panduan Cepat: Tinjauan Pustaka

**Bukan** anotasi bibliografi — melainkan **sintesis** yang menjawab pertanyaan penelitian.

Struktur yang disarankan:
```
1. Pendahuluan tinpus — ruang lingkup, sumber yang dikaji, cara pengorganisasian
2. Tubuh — kelompokkan berdasarkan tema/konsep/perdebatan, BUKAN per buku
3. Identifikasi gap — apa yang belum diteliti
4. Penutup — ringkasan posisi dan relevansinya bagi penelitian ini
```

Pola kalimat sintesis:
- "Beberapa peneliti berpendapat... (Autor, 2020; Autor2, 2021), sementara Autor3 (2019) menunjukkan..."
- "Temuan ini konsisten dengan... namun bertentangan dengan..."

---

## 6. Panduan Cepat: Paragraf Akademik

```
[Topik Sentence] — nyatakan gagasan utama paragraf
[Elaborasi] — jelaskan/definisikan
[Bukti/Contoh] — sitasi, data, ilustrasi
[Analisis] — hubungkan bukti ke argumen
[Transisi] — jembatan ke paragraf berikutnya
```

---

## 7. Checklist Sebelum Menyerahkan Draft

- [ ] Setiap klaim ada dukungan (bukti/sitasi/logika)
- [ ] Tidak ada paragraf yatim (hanya 1 kalimat)
- [ ] Konsistensi istilah teknis di seluruh dokumen
- [ ] Heading mengikuti hierarki yang logis
- [ ] Format sitasi konsisten (satu gaya)
- [ ] Abstrak/ringkasan eksekutif mencerminkan isi dokumen
- [ ] Simpulan menjawab tujuan/pertanyaan di pendahuluan

---

## 8. Referensi Lanjutan

Untuk panduan detail setiap jenis dokumen, baca file referensi yang relevan:

- `references/jurnal.md` — Struktur IMRaD, penulisan metode, hasil, diskusi
- `references/laporan.md` — Laporan praktikum, kerja lapangan, penelitian, KKN
- `references/proposal.md` — Proposal skripsi/tesis, hibah penelitian, proyek
- `references/esai.md` — Academic essay, argumentative essay, reflective essay
- `references/artikel.md` — Artikel opini ilmiah, artikel tinjauan (review article)

Baca file referensi yang relevan SEBELUM menulis jenis dokumen tersebut.
