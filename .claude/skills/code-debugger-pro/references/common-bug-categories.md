# Kategori Bug Umum & Cara Mendiagnosisnya

Gunakan daftar ini sebagai checklist tambahan saat root-cause analysis terasa sulit atau bug tergolong "aneh"/intermiten.

## 1. Logic Error
- Kondisi if/else terbalik atau kurang satu kasus.
- Operator perbandingan salah (`=` vs `==`/`===`, `<` vs `<=`).
- Off-by-one pada loop, slicing array, atau pagination.
- Urutan operasi salah (mis. validasi dilakukan setelah data dipakai).

**Cara cek**: tambahkan logging di titik-titik keputusan, atau jalankan dengan debugger/step-through pada input yang diketahui hasilnya.

## 2. Type & Null/Undefined Error
- Variabel `None`/`null`/`undefined` yang diakses propertinya.
- Konversi tipe implisit yang tidak terduga (string ↔ number, truthy/falsy).
- Mismatch tipe antara API response dan tipe yang diharapkan kode.

**Cara cek**: jalankan type-checker (`tsc`, `mypy`, `ruff`), cek schema/response API yang sebenarnya vs yang diasumsikan kode.

## 3. Async / Concurrency
- `await` yang terlewat sehingga Promise belum selesai saat dipakai.
- Race condition: dua proses mengubah state yang sama tanpa lock/sinkronisasi.
- Callback dipanggil lebih dari sekali atau tidak sama sekali.
- Event listener tidak di-cleanup, menyebabkan efek menumpuk.

**Cara cek**: tambahkan logging dengan timestamp, jalankan beberapa kali untuk lihat konsistensi, cek urutan eksekusi aktual vs yang diasumsikan.

## 4. State Management (Frontend)
- State stale karena closure lama (terutama di React hooks).
- Mutasi langsung pada state/array/object yang seharusnya immutable.
- Re-render tidak terjadi karena dependency array salah/kurang.

**Cara cek**: cek dependency array useEffect/useMemo, pastikan setState tidak memutasi referensi lama.

## 5. Memory & Performance
- Memory leak: event listener, timer, atau subscription tidak dibersihkan.
- Query database N+1 (loop yang melakukan query per item).
- Algoritma O(n²) atau lebih buruk pada data besar.
- Pemrosesan file/data besar dimuat sekaligus ke memori.

**Cara cek**: profiling sederhana (waktu eksekusi sebelum/sesudah), cek jumlah query yang dieksekusi, periksa apakah ada `.map`/loop bersarang pada data besar.

## 6. Environment & Konfigurasi
- Environment variable hilang/salah, atau berbeda antara dev dan production.
- Versi dependency tidak cocok (lockfile vs package.json).
- Path file relatif yang berbeda tergantung working directory.
- Perbedaan timezone, locale, atau encoding (UTF-8 vs lainnya).

**Cara cek**: bandingkan `.env`/config antar environment, cek versi terinstal dengan lockfile, jalankan dari direktori berbeda untuk tes path.

## 7. Input Validation & Edge Case
- Input kosong, `0`, string kosong, array kosong, atau nilai negatif tidak ditangani.
- Input dengan karakter khusus, Unicode, atau ukuran sangat besar.
- Batas pagination/limit yang melebihi data yang tersedia.

**Cara cek**: uji manual dengan input ekstrem di atas, atau tulis test parametrik untuk semua kasus tersebut.

## 8. Integrasi & Dependency Eksternal
- API eksternal mengembalikan format/skema berbeda dari yang diasumsikan.
- Timeout atau error jaringan tidak ditangani (tidak ada retry/fallback).
- Versi library yang dipakai punya breaking change dari versi yang diasumsikan kode.

**Cara cek**: panggil API/dependency secara langsung dan bandingkan response aktual dengan yang diharapkan kode; cek changelog versi library.

## 9. Build & Deployment
- Kode berjalan di lokal tapi gagal di build/produksi (env var, asset path, minifikasi).
- Cache (browser, CDN, build cache) menyebabkan kode lama masih terpakai.

**Cara cek**: jalankan build production secara lokal, bersihkan cache, cek log build untuk warning yang diabaikan.

---

**Tips umum**: jika bug sulit direproduksi, coba isolasi dengan membuat reproduksi minimal (minimal reproducible example) — hapus bagian kode satu per satu sampai bug hilang, bagian terakhir yang dihapus adalah biang keladinya.
