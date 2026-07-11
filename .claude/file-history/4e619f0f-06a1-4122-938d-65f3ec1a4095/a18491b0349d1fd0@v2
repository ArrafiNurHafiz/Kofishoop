# POI Data Enrichment — Google Maps-Level Completeness

## Context
Aplikasi MAPID saat ini hanya punya 8 POI dengan field minimal (nama, deskripsi, lokasi, kategori, foto). Untuk bersaing dengan Google Maps, tiap POI perlu data lengkap: rating, ulasan, fasilitas, kontak, jam buka detail, social media, metode bayar, dll.

## Perubahan

### 1. Migration baru — 16 kolom tambahan ke `pois`
**File:** `database/migrations/YYYY_MM_DD_HHMMSS_add_poi_details.php`

```php
Schema::table('pois', function (Blueprint $table) {
    $table->string('phone', 30)->nullable()->after('photo_url');
    $table->string('whatsapp', 30)->nullable()->after('phone');
    $table->string('website', 255)->nullable()->after('whatsapp');
    $table->decimal('rating', 2, 1)->nullable()->after('website');
    $table->unsignedInteger('review_count')->default(0)->after('rating');
    $table->string('business_status', 30)->nullable()->after('review_count');
    $table->string('google_place_id', 255)->nullable()->after('business_status');
    $table->string('google_maps_url', 255)->nullable()->after('google_place_id');
    $table->json('photos')->nullable()->after('google_maps_url');
    $table->json('facilities')->nullable()->after('photos');
    $table->json('payment_methods')->nullable()->after('facilities');
    $table->json('opening_hours_details')->nullable()->after('payment_methods');
    $table->string('menu_url', 255)->nullable()->after('opening_hours_details');
    $table->json('social_media')->nullable()->after('menu_url');
    $table->string('popularity', 20)->nullable()->after('social_media');
    $table->boolean('is_verified')->default(false)->after('popularity');
});
```

### 2. Model Poi.php — update `$fillable` & `$casts`
**File:** `app/Models/Poi.php`

**fillable** — tambah semua field baru.

**casts** — tambah:
- `rating => 'decimal:1'`
- `photos => 'array'`
- `facilities => 'array'`
- `payment_methods => 'array'`
- `opening_hours_details => 'array'`
- `social_media => 'array'`
- `is_verified => 'boolean'`

### 3. Seeder — data realistis per POI
**File:** `database/seeders/DatabaseSeeder.php`

8 POI masing-masing diisi data Google Maps-style. Contoh per kategori:

**Kuliner:**
- Gudeg Permata: `rating: 4.5, review_count: 1280, phone: "0274-123456", whatsapp: "0812-3456-7890", facilities: ["wifi", "parkir", "ac", "musala"], payment_methods: ["cash", "qris", "kartu_kredit"], opening_hours_details: {monday: [{open:"07:00", close:"17:00"}], ...}, popularity: "high", is_verified: true`
- Angkringan Malioboro: `rating: 4.2, facilities: ["parkir"], payment_methods: ["cash", "qris"], popularity: "high"`
- Sate Klathak Pak Pong: `rating: 4.6, review_count: 3400, phone: ..., whatsapp: ..., facilities: ["wifi", "parkir", "ac"], popularity: "high"`

**Wisata:**
- Taman Sari: `rating: 4.4, review_count: 5600, website: "https://tamansari.xyz", facilities: ["parkir", "toilet", "musala", "pemandu"], opening_hours_details: ..., popularity: "high"`
- Kampung Perak: `rating: 4.3, facilities: ["parkir", "toilet"], popularity: "medium"`
- Museum Affandi: `rating: 4.7, website: "https://affandi.com", facilities: ["parkir", "toilet", "museum_kafe"], popularity: "medium"`

**Penginapan:**
- The Phoenix Hotel: `rating: 4.5, review_count: 2100, phone: "0274-123456", facilities: ["wifi", "parkir", "kolam", "restoran", "gym"], payment_methods: ["kartu_kredit", "qris", "cash"], popularity: "high", is_verified: true`
- Omah Kitiran: `rating: 4.3, facilities: ["wifi", "parkir", "sarapan", "dapur_bersama"], popularity: "medium"`

### 4. Frontend — Popup Detail (_popup.blade.php)
**File:** `resources/views/map/_popup.blade.php`

Tambah section baru di detail rows (antara "Jam Buka" dan "Harga"):
- **⭐ Rating** — bintang emas + `review_count` ulasan
- **📞 Telepon** — tombol klik untuk call/WhatsApp
- **🌐 Website** — link eksternal
- **🏪 Status bisnis** — badge hijau/kuning/merah

Tambah section baru di bawah tags:
- **🛠️ Fasilitas** — badges (Wifi, Parkir, AC, dll.)
- **💳 Pembayaran** — badges (Cash, QRIS, Kartu Kredit)
- **📱 Sosial Media** — link Instagram/TikTok
- **📸 Galeri** — jika `photos` array ada, tampilkan thumbnails

Update JS functions di `Alpine.data('popupState')`:
- `ratingStars(score)` — return HTML bintang
- `facilityIcon(facility)` — mapping facility → icon emoji
- `socialLinks(social)` — generate link href

### 5. Frontend — Sidebar Card (_sidebar.blade.php)
**File:** `resources/views/map/_sidebar.blade.php`

- Tambah **rating stars** di card (setelah harga, sebelum nearest_stop)
- Jika `is_verified` true, tambah badge centang "Terverifikasi"

### 6. API — PoiController
**File:** `app/Http/Controllers/Api/V1/PoiController.php`

Tidak perlu perubahan signifikan — kolom baru otomatis ke-serialize karena model raw serialization.

### Proses
1. `php artisan make:migration add_poi_details_to_pois_table`
2. Edit migration file (isi kolom)
3. Edit `app/Models/Poi.php` (fillable + casts)
4. Edit `database/seeders/DatabaseSeeder.php` (data per POI)
5. Edit `resources/views/map/_popup.blade.php` (UI detail baru)
6. Edit `resources/views/map/_sidebar.blade.php` (rating + verified badge)
7. `php artisan migrate:fresh --seed`
8. `npm run build`
9. Verifikasi: buka peta, klik POI, lihat data lengkap

### Verifikasi
- [ ] `php artisan migrate:fresh --seed` sukses tanpa error
- [ ] Semua POI tampil di peta dengan marker foto
- [ ] Popup detail menampilkan: rating bintang, telepon/WhatsApp, website, fasilitas, payment, status bisnis, galeri foto, sosial media
- [ ] Sidebar card menampilkan rating + verified badge
- [ ] `npm run build` sukses
- [ ] `php artisan test` (jika ada) tidak error
