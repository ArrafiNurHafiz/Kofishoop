# Landing Page Kofishoop — Rencana Implementasi

## Konteks

Membuat landing page satu halaman untuk **Kofishoop** (kedai kopi) dengan nuansa tenang (calm/cozy), target audiens mahasiswa, warna dominan coklat, menggunakan HTML/CSS/JS murni.

## Struktur Halaman

1. **Navigasi Sticky** — logo + menu (Hero, Tentang, Layanan, Galeri, Testimoni, Kontak), transparan di atas, solid saat scroll.
2. **Hero** — Judul besar "Kofishoop", tagline, ilustrasi/elemen dekoratif, CTA button. *Parallax subtle di background.*
3. **Tentang** — Filosofi kedai, cerita singkat, nilai-nilai (cozy, student-friendly).
4. **Layanan/Fitur** — Grid kartu (3-4 item): menu kopi, tempat nugas, wi-fi gratis, diskon mahasiswa.
5. **Galeri** — Grid foto suasana kedai, produk, aktivitas. *Lightbox preview sederhana.*
6. **Testimoni** — Carousel/slider quotes dari pelanggan.
7. **Kontak / CTA** — Form kontak (nama, email, pesan — frontend only, tampilan sukses), jam operasional, alamat, media sosial.
8. **Footer** — Copyright, navigasi ringkas, social links.

## Animasi (CSS + JS)

- **Scroll Reveal** — elemen muncul dengan fade-in + slide-up saat masuk viewport (IntersectionObserver).
- **Parallax** — background hero bergerak lebih lambat (CSS `background-attachment: fixed` atau JS scroll).
- **Smooth Scroll** — navigasi smooth scroll ke section.
- **Hover lembut** — kartu, tombol, nav link dengan transisi halus.

## Palet Warna (Nuansa Coklat Tenang)

| Peran        | Warna        | Kode        |
|-------------|-------------|-------------|
| Background  | Krem/off-white | `#FDF8F0` |
| Background 2| Coklat muda | `#F5E6D3` |
| Primer      | Coklat kopi | `#6B4226` |
| Sekunder    | Coklat medium | `#8B5E3C` |
| Aksen       | Karamel/emas | `#C68642` |
| Teks        | Coklat tua  | `#2C1810` |
| Teks tipis  | Coklat abu  | `#7D6B5A` |

## File yang Dibuat

```
kofishoop/
├── index.html      — Semua struktur HTML
├── style.css       — Semua styling (responsif + animasi)
└── script.js       — Interaktivitas (scroll reveal, smooth scroll, form, carousel)
```

(Single page, file terpisah agar rapi — tidak perlu framework/build tools.)

## Detail Per Section

### Navigasi
- Sticky di atas (`position: fixed`), z-index tinggi.
- Background transparan saat di hero → berubah solid putih/krem saat scroll.
- Link smooth-scroll ke section ID.

### Hero
- Full viewport height.
- Background gradien coklat + pattern/texture kopi (CSS).
- Judul besar "Kofishoop" dengan font bold/elegan.
- Tagline: "Tempat Ngopi dan Nugas Favorit Mahasiswa"
- Parallax effect: background scroll lebih lambat.

### Tentang
- Layout dua kolom (teks kiri, dekorasi kanan).
- Cerita singkat lahirnya Kofishoop (fiktif).
- Vibes: tempat nyaman buat belajar, diskusi, atau sekadar melepas penat.

### Layanan
- Grid 2-3 kolom (responsif).
- Kartu dengan ikon (CSS/emoji): Menu Spesial, Wi-Fi Cepat, Ruang Nugas, Diskon Pelajar.
- Hover effect: kartu naik sedikit dengan shadow.

### Galeri
- Masonry-like grid atau grid 3 kolom.
- Kotak gambar dengan warna solid (placeholder — bisa diganti foto asli).
- Klik: lightbox sederhana (overlay CSS + JS).

### Testimoni
- Carousel otomatis (geser tiap 5 detik) + navigasi dot.
- Setiap slide: quote, nama, status (Mahasiswa ...).

### Kontak
- Form: Nama (text), Email (email), Pesan (textarea).
- Validasi: required + format email.
- Submit: tampilkan alert/toast sukses, reset form.
- Side info: jam buka (08.00-22.00), alamat, IG @kofishoop.

### Footer
- Background coklat tua, teks putih.
- Copyright 2026.
- Link medsos (IG, TikTok, Twitter — dengan ikon).

## Responsivitas

- Mobile-first CSS.
- Breakpoint: 768px (tablet), 480px (mobile).
- Navigasi jadi hamburger menu di mobile.

## Urutan Implementasi

1. Buat struktur `index.html` — semua section dengan placeholder.
2. Buat `style.css` — styling lengkap (warna, layout, responsif, animasi).
3. Buat `script.js` — navigasi sticky, smooth scroll, scroll reveal, carousel, form handling, lightbox.
4. Review dan finalisasi.

## Verifikasi

- Buka `index.html` di browser — semua section muncul rapi.
- Scroll: parallax berjalan, sticky nav berubah, scroll reveal memicu animasi.
- Klik nav link: smooth scroll ke section.
- Form: isi dan submit → muncul notifikasi sukses.
- Resize browser: layout responsif, hamburger menu berfungsi.
- Carousel testimoni: otomatis bergeser, klik dot navigasi.
