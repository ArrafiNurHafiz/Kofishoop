---
name: halaman-cara-kerja-dampak-pahlawan
description: "Tiga halaman standalone baru — Cara Kerja, Dampak, Pahlawan — dengan navigasi lengkap"
metadata: 
  node_type: memory
  type: project
  originSessionId: bfe2a75d-9730-49c7-a701-733647b598b4
---

## Ringkasan
Mengembangkan 3 halaman baru yang sebelumnya hanya anchor sections di landing page menjadi halaman penuh dengan konten kaya, animasi, dan data live dari API.

### 1. Cara Kerja (`/cara-kerja`)
- **Hero** dengan header "Bagaimana Cara Kerjanya?"
- **3 Steps Detail** — masing-masing dengan checklist rinci:
  1. Donor Publikasi Surplus Pangan (form donasi, gizi, lokasi)
  2. Hybrid Entropy-TOPSIS Alokasi Cerdas (bobot Entropy, peringkat TOPSIS, 5 kriteria)
  3. Kurir Antar & Verifikasi Serah Terima (klaim, tracking, konfirmasi)
- **Alur Sistem Lengkap** — timeline flowchart 6 langkah dari Registrasi hingga Review
- Setiap step dengan animasi card dan icon numerik

### 2. Dampak (`/dampak`)
- **Animated Counters** — 1200+ Kg, 850, 45+ mitra
- **Masalah vs Solusi** — side-by-side comparison dengan red/green cards
- **SDGs Alignment** — SDG 2 (Zero Hunger) dan SDG 12 (Responsible Consumption)
- **Dampak per Pihak** — untuk donor, penerima, dan masyarakat

### 3. Pahlawan (`/pahlawan`)
- **Data Live dari API** — top donors dari `/api/public/top-donors`
- **Stats Bar** — total donasi, donor aktif, rating rata-rata
- **Filter** — filter berdasarkan tipe (Semua / Hotel / Restoran / Kafe)
- **Donors Grid** — menampilkan logo, nama, tipe, total donasi, rating
- **Rank Badges** — #1 (gold/Trophy), #2 (silver/Medal), #3 (bronze/Award)

### Routing & Navigasi
- `src/main.tsx` — 3 route baru ditambahkan
- `src/pages/Home.tsx` — semua anchor diganti dengan Link ke halaman standalone

**Files baru:** `src/pages/HowItWorks.tsx`, `src/pages/Impact.tsx`, `src/pages/Heroes.tsx`

**Why:** Sebelumnya Cara Kerja, Dampak, dan Pahlawan hanya section pendek di landing page. Sekarang jadi halaman penuh dengan konten mendalam yang bisa diakses via nav/footer.

**How to apply:** Navigasi via navbar atau link di footer sudah otomatis mengarah ke halaman baru.
