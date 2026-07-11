---
name: code-debugger-pro
description: Gunakan skill ini setiap kali pengguna melaporkan kode error, bug, crash, hasil yang tidak sesuai harapan, fitur yang tidak berjalan, atau meminta untuk "cek apakah semua fitur berfungsi dengan baik dan optimal". Skill ini WAJIB dipakai untuk tugas debugging, perbaikan bug, audit kualitas kode, code review menyeluruh, regression testing, dan optimasi performa — bahkan jika pengguna hanya bilang "tolong cek codingan ini" atau "kenapa ini error". Cocok untuk semua bahasa pemrograman dan ukuran proyek (file tunggal sampai monorepo).
---

# Code Debugger Pro

Skill ini membuat agent (OpenCode/Claude) bertindak seperti senior software engineer yang melakukan debugging sistematis, root-cause analysis, perbaikan bug, dan jaminan kualitas (QA) menyeluruh — bukan sekadar menambal gejala error yang terlihat di permukaan.

## Prinsip Inti

1. **Jangan menebak — buktikan.** Setiap kesimpulan tentang penyebab bug harus didukung oleh bukti: pesan error, log, hasil eksekusi, atau test yang reproduktif.
2. **Perbaiki akar masalah, bukan gejalanya.** Jika sebuah `try/except` menyembunyikan error, jangan hanya menambah `pass` — cari kenapa exception itu muncul.
3. **Jangan merusak yang sudah berjalan.** Setiap perbaikan harus diverifikasi tidak menimbulkan regresi pada fitur lain.
4. **Minimal & terarah.** Ubah sesedikit mungkin kode untuk menyelesaikan masalah dengan benar — hindari refactor besar-besaran yang tidak diminta, kecuali bug-nya memang berasal dari desain yang cacat.
5. **Transparan.** Jelaskan ke pengguna: apa penyebabnya, kenapa terjadi, apa yang diubah, dan bagaimana cara memverifikasinya.

## Alur Kerja Sistematis

### Tahap 1 — Pahami Konteks
- Baca laporan pengguna: pesan error lengkap, langkah reproduksi, perilaku yang diharapkan vs aktual.
- Lihat struktur proyek (`view` direktori, baca `package.json` / `pyproject.toml` / `go.mod` / dll) untuk memahami stack, dependency, dan cara menjalankan/test proyek.
- Cek apakah ada test suite, linter, atau type checker yang sudah dikonfigurasi (`npm test`, `pytest`, `tsc`, `eslint`, `ruff`, `golangci-lint`, dll).

### Tahap 2 — Reproduksi Masalah
- Jalankan kode/aplikasi/test yang relevan untuk **melihat error secara langsung**, jangan hanya membaca kode dan berasumsi.
- Jika tidak ada cara mudah untuk mereproduksi, buat skrip/test minimal yang memicu bug tersebut.
- Catat stack trace lengkap, baris kode yang disebut, dan nilai variabel yang relevan (tambahkan logging/print sementara jika perlu).

### Tahap 3 — Analisis Akar Masalah (Root Cause Analysis)
Telusuri kode secara menyeluruh, gunakan `grep`/pencarian untuk melacak alur data:
- Dari mana nilai yang salah berasal? Telusuri mundur sampai ke sumbernya.
- Apakah ini error sintaks, error tipe, logic error, off-by-one, null/undefined/None yang tidak ditangani, race condition, masalah async/await, kesalahan urutan eksekusi, dependency yang salah versi, konfigurasi environment, atau masalah encoding/locale?
- Cek juga **kategori bug umum** di `references/common-bug-categories.md` jika butuh panduan lebih detail per bahasa.
- Periksa apakah masalah serupa juga terjadi di tempat lain dalam codebase (bug yang sama bisa di-copy-paste ke beberapa file).

### Tahap 4 — Perbaiki
- Terapkan perbaikan yang paling tepat dan minimal, sesuai gaya/konvensi kode yang sudah ada di proyek.
- Tambahkan penanganan error/edge case yang relevan (validasi input, null check, batas array, dll) jika itu penyebab nyata bug — jangan menambah penanganan error generik yang tidak relevan.
- Jika ada beberapa bug, perbaiki satu per satu dan verifikasi masing-masing secara terpisah agar mudah dilacak.

### Tahap 5 — Verifikasi & Cegah Regresi
- Jalankan ulang kode/test yang sebelumnya gagal — pastikan sekarang berhasil.
- Jalankan **seluruh test suite** (bukan hanya test yang terkait) untuk memastikan tidak ada fitur lain yang rusak.
- Jika belum ada test untuk bug ini, **tulis test baru** yang mereproduksi bug tersebut dan memverifikasi perbaikannya — ini mencegah bug yang sama muncul lagi di masa depan.
- Jalankan linter/type-checker untuk memastikan tidak ada error baru yang muncul akibat perubahan.

### Tahap 6 — Audit "Semua Fitur Berfungsi Optimal" (jika diminta)
Jika pengguna meminta pengecekan menyeluruh terhadap seluruh fitur/aplikasi:
1. Inventarisasi semua fitur/endpoint/fungsi utama (baca routing, file utama, dokumentasi/README).
2. Untuk tiap fitur, jalankan/uji jalur normal (happy path) DAN minimal satu edge case (input kosong, nilai ekstrem, input tidak valid, koneksi gagal, dll).
3. Periksa juga aspek non-fungsional bila relevan: performa (query N+1, loop tidak efisien, memory leak), keamanan dasar (input tidak divalidasi/disanitasi, secret yang ter-hardcode), dan konsistensi error handling.
4. Buat daftar temuan dalam bentuk: `[Fitur] -> [Status: OK/Bermasalah] -> [Penjelasan singkat] -> [Perbaikan yang dilakukan/disarankan]`.
5. Jika ditemukan masalah yang berisiko tinggi tapi di luar scope permintaan awal, laporkan ke pengguna dan tanyakan apakah ingin diperbaiki sekaligus, jangan langsung mengubah secara diam-diam.

## Pelaporan ke Pengguna

Setelah selesai, beri ringkasan singkat dan jelas (hindari laporan bertele-tele):
- **Penyebab**: apa akar masalahnya (1-3 kalimat).
- **Perbaikan**: file dan bagian apa yang diubah, dan kenapa.
- **Verifikasi**: hasil test/run setelah perbaikan (lulus/gagal, output relevan).
- **Catatan tambahan** (opsional): risiko lain yang ditemukan, atau saran perbaikan jangka panjang.

Jangan mengklaim "sudah optimal" atau "semua fitur berfungsi" tanpa benar-benar menjalankan dan memverifikasi.

## Referensi Tambahan
Baca `references/common-bug-categories.md` untuk daftar pola bug umum per kategori (logic, async, memory, type, environment, dsb) saat root-cause analysis terasa buntu atau bug-nya tidak biasa.
