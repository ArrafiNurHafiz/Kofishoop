---
name: source-code-nutrishare
description: "Proyek NutriShare - platform donasi makanan dengan fitur TOPSIS, reviews, notifications"
metadata: 
  node_type: memory
  originSessionId: a85f605c-0e5d-4dde-906a-4b3d1203d323
---

# NutriShare — Source Code

Platform donasi makanan dengan Express backend, E2E test suite (Playwright), dan berbagai fitur sosial.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Frontend**: TailwindCSS (via CDN), vanilla JS
- **Testing**: Playwright E2E (53 tests)
- **Data**: In-memory DB (db.ts), file-based seed data

## Struktur
- `server/` — Express routes, db, middleware
- `public/` — Static files (HTML, CSS, JS, images)
- `tests/` — Playwright E2E tests (auth, api, donation, pages)

## Cara Menjalankan
```bash
npm run dev    # Dev server
npm test       # Run Playwright E2E tests
npx playwright test --ui  # UI mode
```

## Pola Penting
- Profile records: donor pakai `user_id`, recipient pakai `user_id_alt`
- Auth: query param `?role=donor|recipient`
- In-memory DB — tidak pakai database sungguhan
- Test sequential untuk donation lifecycle

## Related
- [[open-code-config]] — Konfigurasi OpenCode yang sudah dimigrasi
