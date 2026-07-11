---
name: halaman-tentang-nutrishare
description: Halaman /tentang NutriShare — profil lengkap dari dokumen PKM Universitas Teknologi Digital Indonesia
metadata: 
  node_type: memory
  type: project
  originSessionId: bfe2a75d-9730-49c7-a701-733647b598b4
---

## Ringkasan
Halaman About (`/tentang`) dibuat sebagai halaman terpisah (bukan anchor) yang menceritakan secara detail tentang NUTRI-SHARE, termasuk latar belakang masalah food waste di Indonesia, solusi yang ditawarkan, teknologi Hybrid Entropy-TOPSIS, 5 kriteria prioritas distribusi, tim mahasiswa UTDI, dan keselarasan dengan SDGs.

## Struktur Halaman
- **Hero** — badge "Karya PKM Universitas Teknologi Digital Indonesia"
- **Latar Belakang** — paradoks pangan Indonesia (data FLW BAPPENAS, hidden hunger)
- **Solusi** — 3 pilar: Presisi Gizi, Hybrid Entropy-TOPSIS, SDGs Impact
- **Teknologi** — penjelasan Shannon Entropy dan TOPSIS + 5 kriteria prioritas (C1-C5)
- **Tim** — Karya Mahasiswa UTDI (Ketua Tim, Teknologi, Dosen Pembimbing)
- **SDGs** — SDG 2 (Zero Hunger) dan SDG 12 (Responsible Consumption)
- **CTA** — ajakan bergabung

## Files
- `src/pages/About.tsx` — halaman baru
- `src/main.tsx` — route `/tentang` ditambahkan
- `src/pages/Home.tsx` — link "Tentang" diarahkan ke `/tentang`

**Why:** Sebelumnya landing page hanya punya anchor #tentang yang isinya 2 kartu fitur — tidak mencakup latar belakang, teknologi, tim, atau visi proyek. Halaman About yang terpisah memungkinkan penyampaian narasi yang lebih kaya dan mendalam sesuai dokumen PKM.

**How to apply:** Route `/tentang` sudah aktif. Dari halaman utama, klik "Tentang" di nav atau footer.
