# Plan: Tampilan & UX Polish — NutriShare

## Context
NutriShare sudah memiliki fungsionalitas lengkap (donasi, TOPSIS, review, notifikasi, admin), tapi tampilan masih terasa polos dan UX belum mulus. Banyak halaman yang panjang tanpa navigasi yang jelas, tidak ada footer, form validation minim, dan tidak ada halaman 404. Tujuannya: bikin NutriShare terasa lebih **profesional, engaging, dan nyaman dipakai**.

## Strategy
Kerjakan dalam 3 fase — landing page dulu (paling kelihatan), lalu dashboard UX, lalu general polish.

---

## Fase 1: Landing Page Enhancement

### 1.1 Sticky Nav + Mobile Hamburger
- **File:** `src/pages/Home.tsx`
- Nav jadi sticky dengan background blur saat di-scroll
- Tambah hamburger menu untuk mobile (toggle sidebar)
- Tambah CTA "Daftar Donor" dan "Daftar Penerima" di nav (bukan cuma satu)
- Gunakan state `scrollY` untuk deteksi scroll position

### 1.2 Animated Impact Counter
- **File:** `src/pages/Home.tsx`
- Angka statistik (1.2+ Ton, 850, 45) animasi count-up saat masuk viewport
- Pake `motion` `whileInView` + interval counter
- Data angka di-hardcode (static, dari props)

### 1.3 "Cara Kerja" Section
- **File:** `src/pages/Home.tsx`
- 3-step visual: Donor Publikasi → TOPSIS Alokasi → Kurir Antar
- Masing-masing step dengan icon, judul, deskripsi singkat
- Animasi muncul bergantian

### 1.4 Footer
- **File:** `src/pages/Home.tsx`
- Footer dengan: logo NutriShare, nav links, kontak, copyright
- Background hijau tua, text putih

### 1.5 Custom Toast Theme
- **File:** `src/main.tsx`
- Ubah style react-hot-toast jadi hijau sukses, merah error, konsisten dengan brand
- Posisi tetap di top-center

---

## Fase 2: Dashboard UX Improvements

### 2.1 Shared Components
- **File:** `src/components/LoadingSpinner.tsx` (baru)
  - Komponen spinner reusable dengan prop `size` dan `label`
  - Dipakai di semua dashboard ganti placeholder "Memproses..."
- **File:** `src/components/ConfirmDialog.tsx` (baru)
  - Modal konfirmasi dengan backdrop blur — ganti `confirm()` native di AdminDashboard

### 2.2 Donor Dashboard
- **File:** `src/pages/DonorDashboard.tsx`
- Tambah filter tabs: Semua | Aktif | Dalam Perjalanan | Selesai
- Form input lebih rapi dengan section heading
- Tambah badge jumlah donasi di header
- Status badge lebih visual (icon + color)

### 2.3 Recipient Dashboard
- **File:** `src/pages/RecipientDashboard.tsx`
- Collapsible sections (AKG bisa di-collapse, Tracking bisa di-collapse)
- Tambah "Ringkasan Cepat" di atas: total donasi diterima hari ini, total kalori
- Notifikasi panel lebih accessible (keyboard trap, auto-focus)
- Peta map dibuat lebih kecil/scrollable

### 2.4 Admin Dashboard
- **File:** `src/pages/AdminDashboard.tsx`
- Ganti native `confirm()` dengan `ConfirmDialog`
- Stat cards lebih visual dengan icon per card
- Tabel dengan row hover yang lebih smooth
- Grafik Top Donor pakai gradient bar

---

## Fase 3: General Polish

### 3.1 Halaman 404
- **File:** `src/pages/NotFound.tsx` (baru)
- Tambah di router `src/main.tsx` dengan path `*`
- Desain friendly: ilustrasi, pesan "Halaman tidak ditemukan", tombol "Kembali ke Beranda"

### 3.2 Error Boundary
- **File:** `src/components/ErrorBoundary.tsx` (baru)
- Bungkus route di `main.tsx`
- Tampilkan fallback UI dengan tombol reload

### 3.3 Auth Pages Polish
- **File:** `src/pages/Auth.tsx`
- Password visibility toggle (eye icon lucide)
- Input validation feedback inline (email format, password min length)
- Loading spinner di tombol

### 3.4 Form Validation Feedback
- **Files:** `src/pages/RegisterDonor.tsx`, `src/pages/RegisterRecipient.tsx`
- Inline error messages per field (bukan cuma toast)
- Validate on blur, highlight border merah jika error
- Reuse pattern dengan helper function di `lib/validation.ts`

### 3.5 Page Transitions
- **File:** `src/main.tsx`, wrapped di `AppRouter`
- AnimatePresence + motion.div di setiap route
- Fade + slide subtle (0.2s)

---

## Files to Modify/Create

| File | Action |
|------|--------|
| `src/pages/Home.tsx` | Major: sticky nav, counter, cara kerja, footer |
| `src/main.tsx` | Minor: toast theme, error boundary, 404 route, transitions |
| `src/pages/DonorDashboard.tsx` | Medium: filter tabs, form polish |
| `src/pages/RecipientDashboard.tsx` | Medium: collapsible sections, quick summary |
| `src/pages/AdminDashboard.tsx` | Medium: confirm dialog, polish |
| `src/pages/Auth.tsx` | Minor: password toggle, validation |
| `src/pages/RegisterDonor.tsx` | Minor: inline validation |
| `src/pages/RegisterRecipient.tsx` | Minor: inline validation |
| `src/components/LoadingSpinner.tsx` | **New** |
| `src/components/ConfirmDialog.tsx` | **New** |
| `src/components/ErrorBoundary.tsx` | **New** |
| `src/pages/NotFound.tsx` | **New** |
| `src/lib/validation.ts` | **New** — helper functions for form validation |

## Verification
1. `npm run dev` — pastikan server jalan tanpa error
2. Buka landing page — cek sticky nav, counter animasi, footer, mobile responsive
3. Login sebagai donor/recipient/admin — cek dashboard masing-masing
4. Cek halaman 404 dengan akses `/random-page`
5. Cek error boundary dengan throw error di console
6. Cek form validation di register pages
7. `npm run lint` — pastikan TypeScript aman
