# Eterna — AI-Powered Digital Afterlife & Inheritance Executor

## Problem
Over **$140B in Bitcoin** is estimated lost forever because wallet owners passed away without sharing private keys. Current inheritance processes rely on slow bureaucratic systems (notaries, courts, lawyers — 6-24 months) and require trusting third parties (exchanges, legal firms) with sensitive financial data. Meanwhile, the crypto demographic skews young (25-40) with minimal estate planning — a growing risk as adoption accelerates. Keluarga tidak bisa mengakses aset digital anggota keluarganya yang meninggal, menyebabkan kesulitan finansial di saat paling dibutuhkan.

## Evidence
- **$140B+ Bitcoin** diperkirakan hilang permanen karena pemilik meninggal tanpa menyampaikan akses wallet
- **Proses warisan tradisional** memakan 6-24 bulan dengan biaya notaris dan pengadilan
- **Tidak ada solusi trustless** — semua solusi existing mengharuskan percaya pihak ketiga (exchange, lawyer, kustodian)
- **Crypto holder demographic** — banyak usia 25-40 tahun tanpa estate planning
- **User behavior**: "Saya tidak mau kasih private key ke siapapun sekarang" — kebutuhan akan delayed-trigger inheritance

## Users
- **Primary**: **Alex, Crypto Native (34)** — Software engineer, crypto holder sejak 2017, portfolio $250K+. Ingin memastikan aset digitalnya diwariskan ke orang tua yang tidak paham crypto, tanpa memberikan private key ke siapapun selama hidupnya.
- **Secondary**: **Sarah, Beneficiary (60)** — Orang tua yang tidak paham teknologi. Butuh notifikasi sederhana dan step-by-step guide untuk claim aset.
- **Not for**: Exchange/wallet providers yang ingin hold aset pengguna; inheritance untuk aset non-digital (tanah, properti fisik).

## Hypothesis
Kami percaya **AI Agent dengan multi-layer trigger mechanism** akan **memungkinkan crypto holders mengeksekusi wasiat digital secara trustless dan otonom** untuk **pemilik wallet crypto yang khawatir dengan nasib aset mereka setelah meninggal**.
Kami akan tahu kami benar ketika **user bisa setup wasiat digital dalam <5 menit dan AI Agent berhasil mengeksekusi distribusi aset secara otonom tanpa intervensi manusia dalam demo hackathon**.

## Success Metrics
| Metric | Target | How measured |
|---|---|---|
| Demo execution time (end-to-end) | < 3 menit | Stopwatch demo |
| Trigger mechanisms implemented | ≥ 2 layer | Code review (inactivity + guardian) |
| Asset types supported | ERC-20 tokens + ETH | Functional test |
| UI intuitiveness | Judge bisa setup will tanpa guidance | Demo observation |
| Will creation time | < 5 menit | UX measurement |
| Execution accuracy | 100% sesuai konfigurasi will | On-chain verification |

## Scope
**MVP** — Sebuah web app MVP yang memungkinkan:
1. User connect wallet dan membuat wasiat digital dengan beneficiary + persentase
2. Multi-layer trigger mechanism (inactivity period + guardian consensus)
3. AI Agent yang memonitor trigger dan mengeksekusi distribusi aset
4. Beneficiary notification via email
5. Full demo flow di Base Sepolia testnet

**Out of scope**
- Legal enforcement / notaris integration — kompleksitas hukum di luar scope hackathon
- NFT inheritance — fokus ke ERC-20 dan ETH dulu
- Mobile app — web-only untuk MVP
- Multi-chain support — satu chain (EVM) untuk MVP
- Fiat on-ramp/off-ramp — tidak relevan untuk demo
- Regulatory compliance penuh — akan dibahas di fase post-hackathon

## Delivery Milestones
<!-- Business outcomes, not engineering tasks. /plan turns each into a plan. -->
<!-- Status: pending | in-progress | complete -->

| # | Milestone | Outcome | Status | Plan |
|---|---|---|---|---|
| 1 | Smart Contract Development | Will creation, guardian voting, distribution logic on-chain | pending | — |
| 2 | Backend + AI Agent Engine | Trigger monitoring, execution validator, notification service | pending | — |
| 3 | Frontend: Will Builder UI | User dapat setup will, add beneficiaries, configure triggers | pending | — |
| 4 | Frontend: Beneficiary Portal | Beneficiary dapat view will dan claim assets | pending | — |
| 5 | Integration & Demo Polish | End-to-end flow working, demo script ready | pending | — |

## Open Questions
- [ ] Bagaimana handling gas fee untuk eksekusi? Dari owner wallet atau dari contract?
- [ ] Apa mekanisme recovery jika beneficiary kehilangan akses wallet-nya?
- [ ] Validitas legal: apakah AI Agent execution bisa diterima secara hukum?
- [ ] Bagaimana handling jika nilai aset tidak cukup untuk cover gas fee saat eksekusi?
- [ ] Apakah perlu time-lock mechanism untuk mencegah eksekusi premature?

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| False execution (salah trigger) | Low | Critical | Multi-layer trigger + confidence threshold ≥ 0.7 |
| Smart contract bug | Medium | High | Test coverage + audit post-hackathon |
| Guardian collusion | Low | High | Minimum 3 guardians, max threshold 2/3 |
| User tidak定期 heartbeat | Medium | Medium | Multiple reminders + grace period |
| Beneficiary tidak bisa claim | Medium | Medium | Email notification + support chat + extended deadline |
| Regulatory uncertainty | Medium | Medium | Konsultasi legal di fase post-hackathon |

*Status: DRAFT — requirements only. Implementation planning pending via /plan.*

---

**Detail Teknis Tambahan:**

### Tech Stack (Hackathon)
| Layer | Technology | Alasan |
|---|---|---|
| Frontend | Next.js + TailwindCSS + RainbowKit | Cepat, UX bagus, wallet integration mudah |
| Smart Contracts | Solidity + Hardhat | EVM, familiar untuk judges |
| Blockchain | Base Sepolia / Sepolia | Testnet gratis, finality cepat |
| Storage | IPFS (Pinata) | Decentralized, free tier available |
| AI/Backend | Node.js + OpenAI/Claude API | Quick setup, LLM untuk AI Agent logic |
| Notifications | SendGrid (email) | Free tier, reliable |

### Demo Flow (3 menit)
1. **0:00-0:30** — Hook: "$140B crypto lost forever"
2. **0:30-1:00** — Alex setup will (connect → add beneficiaries → set % → configure triggers)
3. **1:00-1:30** — Simulasi inactivity (dashboard shows "no heartbeat for 6 months")
4. **1:30-2:00** — Guardian vote (2/3 vote "deceased" → AI confidence score: 0.85)
5. **2:00-2:30** — AI Agent executes → assets distributed on-chain
6. **2:30-3:00** — Sarah receives email → claim portal → sees her allocation
