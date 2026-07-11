# Kofishoop — Design System & Scroll Animation Bible

> _Where coffee meets code, and every scroll tells a story._

---

## 🎨 Brand DNA

| Token       | Value     | Usage                                         |
| ----------- | --------- | --------------------------------------------- |
| **Primary** | `#e60000` | CTA, accents, active states, badges           |
| **Ink**     | `#25282b` | Headings, nav background, dark sections       |
| **Canvas**  | `#ffffff` | Content bands, cards, modals                  |
| **Soft**    | `#f2f2f2` | Alternating section backgrounds, hover states |
| **Body**    | `#7e7e7e` | Paragraph text, secondary info                |
| **Muted**   | `#bebebe` | Placeholder, disabled, dividers               |
| **Font**    | `Inter`   | Single family — headings & body               |

### Typography Scale

```
Display Hero   144px / 800 / -1px     Hero title only
Display XL      90px / 800 / 0.93     Large headings
Display LG      48px / 300 / 1.08     Section titles
Display MD      40px / 300 / 1.1      Sub-section
Display SM      32px / 700 / 1.25     Card titles
Display XS      24px / 700 / 1.0      Small headings
Body LG         22px / 400 / 1.09     Hero tagline
Body MD         18px / 400 / 1.56     Content paragraphs
Body SM         16px / 400 / 1.25     General text
Caption         14px / 400 / 1.14     Meta, timestamps
Caption Up      12px / 600 / 0.57em   Eyebrow labels
```

### Radius

| Token   | Value                           |
| ------- | ------------------------------- |
| Pill    | `60px` (buttons, badges, chips) |
| Card    | `6px` (content cards, panels)   |
| Modal   | `12px` (auth modal, lightbox)   |
| Pricing | `16px` (membership cards)       |

---

## 🌀 Scroll Animation Map

Setiap section punya **personality animasi sendiri**. Mereka tidak saling bertabrakan — masing-masing dengan timing, arah, dan karakter yang unik.

```
┌─────────────────────────────────────────┐
│  🏠 HERO       → Parallax + Stagger    │
│  📖 TENTANG    → Scale & Float          │
│  ☕ LAYANAN    → Slide Tabs + Peel     │
│  🖼️ GALERI     → Masonry Cascade       │
│  💬 TESTIMONI  → Fade Carousel          │
│  ⭐ MEMBERSHIP → Card Lift + Table      │
│  📬 KONTAK     → Form Drift + Pin       │
└─────────────────────────────────────────┘
```

---

### 1. 🏠 HERO — `#hero`

**Personality:** Dramatic · Slow · Cinematic

```
[parallax-bg]     ← moves slower (z-index -1)
  ├─ overlay      ← static
  └─ content      ← stagger entrance
       ├─ eyebrow     → fadeSlideDown  0.2s delay
       ├─ title       → fadeSlideUp    0.4s delay
       ├─ tagline     → fadeSlideUp    0.6s delay
       └─ actions     → fadeSlideUp    0.8s delay
```

| Element        | Animation       | Duration | Delay | Easing                   |
| -------------- | --------------- | -------- | ----- | ------------------------ |
| Eyebrow        | `fadeSlideDown` | 0.6s     | 0.2s  | `ease-out`               |
| Title          | `fadeSlideUp`   | 0.6s     | 0.4s  | `ease-out`               |
| Tagline        | `fadeSlideUp`   | 0.6s     | 0.6s  | `ease-out`               |
| Actions        | `fadeSlideUp`   | 0.6s     | 0.8s  | `ease-out`               |
| Speechmark orb | `floatPulse`    | 3s       | 1s    | `ease-in-out` (infinite) |

**Scroll behavior:** Parallax — background image bergerak 40% lebih lambat dari scroll.

```css
/* Parallax on scroll */
.hero-bg {
  transform: translateY(var(--scroll-offset, 0));
  will-change: transform;
}
```

---

### 2. 📖 TENTANG — `#tentang`

**Personality:** Warm · Float · Soft Reveal

```
.text-block         → fadeInScale    (opacity 0→1, scale 0.95→1)
.image-box          → fadeSlideRight (opacity 0→1, x: -30→0)
.values-grid        → staggerFade    (per item, 100ms interval)
.stats-grid         → countUp        (angka naik satu per satu)
```

| Element          | Animation        | Duration  | Trigger           |
| ---------------- | ---------------- | --------- | ----------------- |
| Section header   | `fadeSlideUp`    | 0.5s      | Intersection 0.15 |
| Text paragraphs  | `fadeInScale`    | 0.7s      | Intersection 0.2  |
| Value items (×4) | `staggerFade`    | 0.4s each | Cascade 100ms     |
| Stat numbers     | `countUp`        | 1.2s      | Intersection 0.3  |
| Image box        | `fadeSlideRight` | 0.6s      | Intersection 0.15 |

```css
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.value-item:nth-child(1) {
  transition-delay: 0ms;
}
.value-item:nth-child(2) {
  transition-delay: 100ms;
}
.value-item:nth-child(3) {
  transition-delay: 200ms;
}
.value-item:nth-child(4) {
  transition-delay: 300ms;
}
```

---

### 3. ☕ LAYANAN — `#layanan`

**Personality:** Clean · Slide · Tab Peeling

```
.tabs             → fadeSlideUp (group)
.panels           → panelPeel (content slides from behind active tab)
  panel-image     → fadeSlideRight (0→1, x: -40→0)
  panel-info      → fadeSlideLeft  (0→1, x: 40→0)
  highlights      → staggerFade (per item, 80ms)
```

| Element            | Animation        | Duration  | Easing                       |
| ------------------ | ---------------- | --------- | ---------------------------- |
| Tab bar            | `fadeSlideUp`    | 0.5s      | `ease-out`                   |
| Panel image        | `fadeSlideRight` | 0.5s      | `cubic-bezier(0.16,1,0.3,1)` |
| Panel info         | `fadeSlideLeft`  | 0.5s      | `cubic-bezier(0.16,1,0.3,1)` |
| Highlights stagger | `staggerFade`    | 0.3s each | `ease-out`                   |

**Tab switch animation (CSS):**

```css
.service-panel.active {
  animation: panelPeel 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes panelPeel {
  from {
    opacity: 0;
    clip-path: inset(0 0 0 100%);
  }
  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}
```

---

### 4. 🖼️ GALERI — `#galeri`

**Personality:** Artistic · Cascade · Reveal

```
.featured (large) → fadeSlideLeft  (0.3s after entry)
.card:nth-child(1) → fadeSlideUp   (0.5s delay)
.card:nth-child(2) → fadeSlideUp   (0.6s delay)
.card:nth-child(3) → fadeSlideUp   (0.7s delay)
.card:nth-child(4) → fadeSlideUp   (0.8s delay)
.card:nth-child(5) → fadeSlideUp   (0.9s delay)
```

**Cascade formula:** Setiap card muncul bergantian dengan interval 100ms, dimulai dari featured image.
Delay = `0.3s + (index × 0.1s)`

```css
.gallery-featured {
  transition-delay: 0.3s;
}
.gallery-card:nth-child(1) {
  transition-delay: 0.5s;
}
.gallery-card:nth-child(2) {
  transition-delay: 0.6s;
}
/* ... dst di-set via JS atau CSS nth-child */
```

**Lightbox entrance:**

```css
.lightbox.active .lightbox-content {
  animation: lightboxZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes lightboxZoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

### 5. 💬 TESTIMONI — `#testimoni`

**Personality:** Smooth · Infinite · Gentle

```
.carousel-track     → translateX slide (JS-driven, 0.5s ease)
  slide → slide     → crossfade effect
.dots               → scale pulse on active
.stats              → stats countUp on reveal
```

| Interaction    | Animation                  | Duration                           |
| -------------- | -------------------------- | ---------------------------------- |
| Auto slide     | `translateX`               | 0.5s `ease`                        |
| Dot active     | `scale(1.3)`               | 0.3s                               |
| Pause on hover | —                          | CSS `animation-play-state: paused` |
| Swipe (mobile) | `translateX` follow finger | 0.1s drag, 0.3s release            |

```css
.carousel-track {
  transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

---

### 6. ⭐ MEMBERSHIP — `#membership`

**Personality:** Premium · Lift · Polished

```
.pricing-card           → fadeSlideUp + hover lift
  card:nth-child(1)     → delay 0.1s
  card:nth-child(2)     → delay 0.2s (featured)
  card:nth-child(3)     → delay 0.3s
  hover                 → translateY(-4px) + shadow
  featured hover        → translateY(-12px)
.comparison-table       → tableRowSlide (rows appear bottom-to-top)
```

| Element        | Animation             | Duration    | Trigger          |
| -------------- | --------------------- | ----------- | ---------------- |
| Pricing cards  | `fadeSlideUp` stagger | 0.5s        | Cascade 100ms    |
| Card hover     | `translateY` lift     | 0.3s        | `hover`          |
| Featured badge | `pulse`               | 2s infinite | Page load        |
| Table rows     | `tableRowSlide`       | 0.4s each   | Intersection 0.2 |

```css
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(230, 0, 0, 0.08);
}

@keyframes tableRowSlide {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 7. 📬 KONTAK — `#kontak`

**Personality:** Grounded · Drift · Pin

```
.form               → fadeSlideUp  (opacity 0→1, y: 30→0)
.info-cards          → slideInFromRight (per card, 100ms stagger)
  card:nth-child(1)  → delay 0.2s
  card:nth-child(2)  → delay 0.35s
  card:nth-child(3)  → delay 0.5s
  card:nth-child(4)  → delay 0.65s
  card:hover         → translateX(6px) + border-color
```

```css
.info-card:nth-child(1) {
  transition-delay: 0.2s;
}
.info-card:nth-child(2) {
  transition-delay: 0.35s;
}
.info-card:nth-child(3) {
  transition-delay: 0.5s;
}
.info-card:nth-child(4) {
  transition-delay: 0.65s;
}

.form-toast.show {
  animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## ⚡ Shared Animations

### Scroll Reveal System (current)

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Future Enhancement: Per-Section Reveal

Ganti class `reveal` menjadi per-section untuk animasi yang berbeda:

```css
#hero .reveal {
  transform: translateY(0);
} /* handled by keyframes */
#tentang .reveal {
  transform: scale(0.95);
}
#layanan .reveal {
  transform: translateX(-20px);
}
#galeri .reveal {
  transform: translateY(40px);
}
#testimoni .reveal {
  transform: translateY(0);
} /* handled by carousel */
#membership .reveal {
  transform: translateY(30px);
}
#kontak .reveal {
  transform: translateY(30px);
}
```

---

## 🎯 Interaction Patterns

| Element             | Hover                                     | Active                  | Focus |
| ------------------- | ----------------------------------------- | ----------------------- | ----- |
| `.btn-primary`      | Darker red `#cc0000` + `translateY(-2px)` | Scale 0.98              | Ring  |
| `.btn-outline-*`    | Fill bg + white text                      | Scale 0.98              | Ring  |
| `.pricing-card`     | Lift + shadow + red border                | —                       | —     |
| `.info-card`        | `translateX(6px)` + red border            | —                       | —     |
| `.member-type-card` | Red border + pink bg                      | Scale 0.98 + red border | —     |
| `.gallery-card`     | Image `scale(1.03)`                       | —                       | —     |
| `.footer-social a`  | `translateY(-4px) scale(1.1)` + red bg    | —                       | —     |
| `.nav-link`         | Color to white                            | —                       | —     |

---

## 📱 Responsive Behavior

| Breakpoint   | Changes                                                                         |
| ------------ | ------------------------------------------------------------------------------- |
| **< 1024px** | Grid → single column, font sizes scale down, pricing gap reduced                |
| **< 768px**  | Hamburger menu, auth button in mobile nav, pricing stack, gallery single column |
| **< 480px**  | Container padding 16px, hero title 48px, comparison table hide 3rd/4th col      |

---

## 🎬 Page Load Timeline

```
0ms      ──► 200ms    ──► 400ms    ──► 600ms    ──► 800ms
eyebrow       title        tagline       actions       complete
↓fadeSlide    ↓fadeSlide   ↓fadeSlide    ↓fadeSlide
  Down          Up           Up            Up
```

## ♿ Reduced Motion

Semua animasi di-nonaktifkan saat `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

---

> _Designed with ☕ by Kofishoop · Setiap scroll adalah cerita._
