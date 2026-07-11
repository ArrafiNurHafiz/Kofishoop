# Plan: Aplikasi Web Kalkulator Gaji Karyawan

## Context
Membuat aplikasi web satu halaman (single-page) menggunakan PHP dan HTML untuk menghitung total gaji karyawan berdasarkan golongan dan jumlah hari kerja. Aplikasi ini adalah tugas kuliah yang mensyaratkan penggunaan array asosiatif, fungsi `hitungGaji()`, dan tampilan struk rincian gaji.

## Struktur File
Hanya satu file yang akan dibuat:

- **`index.php`** — File tunggal yang berisi form HTML dan logika PHP dalam satu halaman

## Rancangan `index.php`

### 1. Bagian PHP (di atas, sebelum HTML)
- **Array Asosiatif**: `$tarifGaji` memetakan golongan ke tarif harian:
  - `'A' => 200000`
  - `'B' => 150000`
  - `'C' => 100000`

- **Fungsi `hitungGaji($gol, $hari)`**:
  - Mengakses array asosiatif `$tarifGaji` (via `global` atau parameter)
  - Menghitung `$gajiPokok = $tarifGaji[$gol] * $hari`
  - Menghitung `$tunjangan = ($hari > 20) ? 50000 : 0`
  - Menghitung `$total = $gajiPokok + $tunjangan`
  - Mengembalikan array `['gajiPokok' => ..., 'tunjangan' => ..., 'total' => ...]`

- **Handle Form Submission** (`if ($_SERVER['REQUEST_METHOD'] === 'POST')`):
  - Ambil input: `$_POST['nama']`, `$_POST['golongan']`, `$_POST['hari']`
  - Validasi sederhana (pastikan tidak kosong, hari > 0)
  - Panggil `hitungGaji($golongan, $hari)`
  - Simpan hasil untuk ditampilkan

### 2. Bagian HTML
- **Form Input**:
  - Nama Karyawan: `<input type="text">`
  - Golongan: `<select>` dengan option A, B, C
  - Jumlah Hari Kerja: `<input type="number">`
  - Tombol "Hitung": `<button type="submit">`

- **Tampilan Struk Gaji** (muncul setelah form disubmit):
  - Nama Karyawan
  - Gaji Pokok (format Rupiah)
  - Tunjangan Makan (format Rupiah)
  - Total Diterima (format Rupiah)

### 3. Format Rupiah
Gunakan `number_format()` PHP untuk menampilkan angka dalam format: `Rp 200.000`

### 4. Tampilan
- CSS sederhana inline atau internal `<style>` agar tampilan rapi
- Form di bagian kiri/atas, struk hasil di bagian kanan/bawah
- Menggunakan metode POST agar data tidak terlihat di URL

## Verifikasi
1. Buka `index.php` di browser (via `php -S localhost:8000` di direktori proyek)
2. Uji dengan data:
   - Nama: "Budi", Golongan: A, Hari: 22 → Gaji Pokok: 4.400.000, Tunjangan: 50.000, Total: 4.450.000
   - Nama: "Ani", Golongan: C, Hari: 15 → Gaji Pokok: 1.500.000, Tunjangan: 0, Total: 1.500.000
