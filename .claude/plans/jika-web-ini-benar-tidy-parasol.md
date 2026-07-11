# Rancangan Fitur Kurir/Delivery Management untuk NUTRI-SHARE

## Konteks

Saat ini NUTRI-SHARE **tidak memiliki sistem kurir internal**. Alur donasi hanya berupa konfirmasi digital tanpa pengiriman nyata. Fitur ini akan menambahkan kurir relawan yang bisa mengambil dan mengantarkan donasi dari donor ke penerima dengan live GPS tracking.

---

## ⚙️ Ketentuan dari Owner

| Pertanyaan | Jawaban |
|-----------|---------|
| Kurir: relawan atau karyawan? | **Relawan** (tanpa bayaran) |
| Live GPS tracking? | **Ya, wajib** real-time |
| Max delivery per kurir? | **1 normal, maksimal 2** jika permintaan berlebih |
| Insentif? | **Tip dari donatur** (opsional) |

---

## 1. Role Baru: `courier` (Kurir Relawan)

Tambah enum `'courier'` di field `role` tabel `users`.

Registrasi kurir membutuhkan:
- Nama, email, password
- No. telepon
- Jenis kendaraan (motor/mobil)
- Wilayah operasi (kecamatan/kota)
- Photo KTP (verifikasi admin)

---

## 2. Database: Tabel Baru

### `deliveries` — Melacak setiap pengiriman

```python
class Delivery(SQLModel, table=True):
    __tablename__ = "deliveries"
    id: Optional[int] = Field(default=None, primary_key=True)
    donation_id: int = Field(foreign_key="donations.id")
    courier_id: int = Field(foreign_key="users.id")
    status: str = Field(default="assigned")
    # assigned → picked_up → in_transit → delivered → completed
    pickup_at: Optional[str] = None
    delivered_at: Optional[str] = None
    completed_at: Optional[str] = None
    tip_amount: Optional[float] = None     # tip dari donatur
    tip_paid: int = Field(default=0)        # 0/1
    notes: Optional[str] = None
    created_at: str
```

### `courier_locations` — GPS Tracking real-time

```python
class CourierLocation(SQLModel, table=True):
    __tablename__ = "courier_locations"
    id: Optional[int] = Field(default=None, primary_key=True)
    courier_id: int = Field(foreign_key="users.id")
    delivery_id: int = Field(foreign_key="deliveries.id")
    latitude: float
    longitude: float
    recorded_at: str
```

### `courier_profiles` — Data tambahan kurir

```python
class CourierProfile(SQLModel, table=True):
    __tablename__ = "courier_profiles"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(unique=True, foreign_key="users.id")
    vehicle_type: str      # 'motor' | 'mobil'
    service_area: str      # wilayah operasi
    total_deliveries: int = Field(default=0)
    rating: float = Field(default=0)
    phone: str = Field(default="")
    photo_url: str = Field(default="")
```

---

## 3. Status Flow Donasi + Delivery

```
DONASI:
active → claimed → in_delivery → completed

DELIVERY:
assigned → picked_up → in_transit → delivered → completed
```

| Status Donasi | Arti |
|---------------|------|
| `active` | Dipublikasi, menunggu klaim |
| `claimed` | Diklaim, menunggu approve + assign kurir |
| `in_delivery` | Kurir sedang proses antar |
| `completed` | Selesai (penerima konfirmasi) |

| Status Delivery | Arti |
|----------------|------|
| `assigned` | Kurir ditugaskan, menunggu pickup |
| `picked_up` | Barang sudah diambil dari donor |
| `in_transit` | Dalam perjalanan ke penerima |
| `delivered` | Sampai di penerima |
| `completed` | Penerima konfirmasi terima |

---

## 4. API Endpoints Baru

### Admin
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/admin/couriers` | List semua kurir (verified) |
| `POST` | `/api/admin/deliveries/assign` | Assign kurir + approve claim |
| `GET` | `/api/admin/deliveries` | Semua delivery |

### Kurir
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/courier/deliveries` | List delivery ditugaskan |
| `POST` | `/api/courier/deliveries/{id}/pickup` | Ambil barang (sets pickup_at) |
| `POST` | `/api/courier/deliveries/{id}/deliver` | Antar sampai (sets delivered_at) |
| `POST` | `/api/courier/location` | Kirim posisi GPS terbaru |
| `GET` | `/api/courier/stats` | Statistik pengiriman |

### Tracking (Publik)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/deliveries/{donation_id}/track` | Posisi kurir + status real-time |

### Tip
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/deliveries/{id}/tip` | Donatur beri tip ke kurir |

---

## 5. Live GPS Tracking (Real)

### Cara Kerja

1. **Kurir** → browser request izin geolocation
2. Setiap **10 detik**, kirim posisi ke `POST /api/courier/location`
3. Backend simpan di tabel `courier_locations`
4. **Donor/Penerima** → polling via `GET /api/deliveries/{donation_id}/track` (setiap 5 detik)
5. Peta update marker kurir secara real-time

### Di Frontend

`LiveTrackingModal.tsx` diperbarui:
- Gunakan **Geolocation API** browser (`navigator.geolocation.watchPosition`)
- Kirim posisi via interval ke backend
- Polling posisi kurir dari backend untuk donor/penerima
- Marker kurir bergerak real di peta (bukan simulasi linear)

### Jika GPS tidak tersedia
- Fallback ke input manual alamat atau pilih lokasi di peta
- Tampilkan pesan "Aktifkan GPS untuk tracking real-time"

---

## 6. Halaman Baru

### CourierDashboard (`/courier`)
- List delivery:
  - **Siap Ambil** (assigned → tombol "Ambil Barang")
  - **Dalam Perjalanan** (picked_up/in_transit → tombol "Sudah Sampai")
  - **Riwayat** (delivered/completed)
- Tombol "Mulai Tracking GPS" → aktifkan Geolocation API
- Total pengiriman + rating
- **Tip yang diterima** dari donatur

### RegisterCourier (`/register/courier`)
- Nama, email, password
- No. telepon
- Jenis kendaraan (motor/mobil)
- Wilayah operasi
- Upload foto KTP
- Submit → pending verifikasi admin

---

## 7. Notifikasi Baru

| Tipe | Untuk | Trigger |
|------|-------|---------|
| `delivery_assigned` | Kurir | Admin assign delivery |
| `delivery_pickup_reminder` | Kurir | Jika belum pickup >30 menit |
| `courier_picked_up` | Donor | Barang sudah diambil kurir |
| `courier_in_transit` | Penerima | Kurir mulai antar |
| `courier_arrived` | Penerima | Kurir sampai |
| `tip_received` | Kurir | Donatur kasih tip |
| `delivery_completed` | Donor+Penerima | Semua selesai |

---

## 8. Fitur Tip untuk Kurir

- Donatur bisa memberi tip **setelah delivery selesai**
- Tip bersifat **sukarela** (bisa dilewati)
- Ditampilkan di dashboard kurir sebagai penghargaan
- Tersimpan di kolom `tip_amount` tabel `deliveries`

---

## 9. Files yang Akan Dibuat/Dimodifikasi

**Backend (baru):**
| File | Perubahan |
|------|-----------|
| `backend/models.py` | Tambah `Delivery`, `CourierLocation`, `CourierProfile` |
| `backend/schemas.py` | Tambah schema untuk delivery, location, tip |
| `backend/routers/courier.py` | **Baru** — semua endpoint kurir |
| `backend/routers/deliveries.py` | **Baru** — admin assign + public tracking |
| `backend/services/delivery.py` | **Baru** — logic penugasan, max 2 delivery |
| `backend/main.py` | Register router baru |
| `backend/services/notifications.py` | Tambah tipe notifikasi delivery |

**Frontend (baru):**
| File | Perubahan |
|------|-----------|
| `frontend/src/pages/CourierDashboard.tsx` | **Baru** — dashboard kurir |
| `frontend/src/pages/RegisterCourier.tsx` | **Baru** — registrasi kurir |
| `frontend/src/components/LiveTrackingModal.tsx` | **Update** — GPS real + polling |
| `frontend/src/main.tsx` | Tambah route `/courier`, `/register/courier` |
| `frontend/src/types.ts` | Tambah tipe `Delivery`, `CourierLocation` |

---

## 10. Aturan Bisnis

| Aturan | Detail |
|--------|--------|
| **Max 2 delivery per kurir** | Jika kurir sudah punya 2 delivery aktif (assigned/picked_up/in_transit), tidak bisa ditugaskan lagi |
| **1 delivery = 1 donasi** | Satu delivery untuk satu donasi |
| **Kurir harus verified** | Admin harus verifikasi kurir dulu sebelum bisa ditugaskan |
| **Tip opsional** | Donatur bisa skip, tidak mempengaruhi flow |
| **GPS wajib** | Kurir harus aktifkan GPS saat pickup, jika tidak → fallback manual |

---

## 11. Prioritas Implementasi

### Phase 1 (Foundation)
1. Role `courier` + RegisterCourier page
2. Tabel `Delivery`, `CourierProfile`, `CourierLocation`
3. Courier dashboard basic (list delivery, pickup, deliver)
4. Admin assign courier ke delivery

### Phase 2 (Live Tracking)
5. GPS Geolocation API → kirim posisi ke backend
6. Tracking endpoint → polling donor/penerima
7. LiveTrackingModal diperbarui dengan GPS real

### Phase 3 (Polish)
8. Tip system
9. Notifikasi delivery
10. Rating kurir
11. Batch logic (max 2 delivery)

---

## 12. Verifikasi

- [ ] Register kurir → admin verifikasi → kurir login
- [ ] Admin approve claim + assign kurir
- [ ] Kurir lihat delivery assigned
- [ ] Kurir pickup → donor dapat notif
- [ ] GPS tracking aktif → posisi terkirim tiap 10 detik
- [ ] Donor/penerima lihat posisi kurir real-time di peta
- [ ] Kurir deliver → penerima konfirmasi
- [ ] Selesai → donatur kasih tip (opsional)
- [ ] Semua test backend `pytest backend/tests/` lulus
- [ ] Build frontend `npm run build` sukses
