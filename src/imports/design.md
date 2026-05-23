# AIR & STEEL — Design Specification

> A premium editorial mobile application featuring a dark, cinematic aesthetic and distraction-free reading experience for automotive culture enthusiasts.

---

## 1. Design Philosophy

**Air & Steel** is a luxury digital magazine app built around the concept of **editorial minimalism meets automotive brutalism**. The interface treats content like a gallery exhibition — every screen is a deliberate composition of negative space, restrained typography, and cinematic depth. The design language borrows from high-end print magazines, architecture photography books, and automotive instrument clusters.

### Core Principles

| Principle | Description |
|---|---|
| **Cinematic Darkness** | Dark mode as the default identity (`#161616` base). Light exists only as contrast and accent. |
| **Editorial Restraint** | Content speaks; chrome disappears. No decorative borders, no gratuitous dividers. |
| **Tactile Luxury** | Every interaction — tap, swipe, pinch — has weight. Animations use `cubic-bezier(0.22, 1, 0.36, 1)` for a dampened, mechanical feel. |
| **Gallery-Grade Layout** | Generous whitespace. Typography drives hierarchy. Images are full-bleed when possible. |
| **Dual Identity** | Dark mode = "Air & Steel" (nocturnal, cinematic). Light mode = "Paper & Ink" (editorial, archival). |

---

## 2. Design Tokens

### 2.1 Color System

#### Semantic CSS Variables (Theme-Driven)

```yaml
# Light Mode — "Paper & Ink"
light:
  bg-primary:     "#F0F0F0"    # Page background
  bg-secondary:   "#FFFFFF"    # Card surfaces
  bg-tertiary:    "#E5E5E5"    # Inputs, deep elements
  text-primary:   "#111111"    # Headings, primary body
  text-secondary: "#555555"    # Captions, metadata
  text-inverse:   "#FFFFFF"    # Text on dark fills
  border-color:   "#E0E0E0"    # Card edges
  border-subtle:  "#EBEBEB"    # Input borders at rest

# Dark Mode — "Air & Steel" (Default)
dark:
  bg-primary:     "#161616"    # Deep charcoal base
  bg-secondary:   "#222222"    # Elevated card surfaces
  bg-tertiary:    "#2C2C2C"    # Inputs, recessed areas
  text-primary:   "#F2F2F2"    # High-contrast headings
  text-secondary: "#9CA3AF"    # Muted captions (neutral-400)
  text-inverse:   "#000000"    # Text on light fills
  border-color:   "#333333"    # Subtle card edges
  border-subtle:  "#262626"    # Near-invisible input borders
```

#### Neutral Palette (Hardcoded)

```yaml
neutral:
  50:  "#F9FAFB"
  100: "#F3F4F6"
  200: "#E5E7EB"
  300: "#D1D5DB"
  400: "#9CA3AF"
  500: "#6B7280"
  600: "#4B5563"
  700: "#374151"
  800: "#1F2937"
  850: "#1f1f1f"
  900: "#171717"
  925: "#0a0a0a"
  950: "#050505"
```

#### Accent Color

```yaml
accent:
  primary: "amber-700"     # Warm amber for CTAs, categories, active states
  highlight: "amber-600"   # Hover emphasis
  glow: "amber-500"        # Badges, price highlights
  subtle: "amber-900/10"   # Background tints for selected states
  error: "red-400"         # Destructive actions (Sign Out hover)
  success: "green-500"     # Payment confirmation
```

### 2.2 Typography

```yaml
fonts:
  display: '"Space Grotesk", sans-serif'   # Headings, brand, navigation labels
  body:    '"Inter", sans-serif'           # Body text, descriptions, reader content

weights:
  light:    300
  regular:  400
  medium:   500
  semibold: 600
  bold:     700

type_scale:
  # Headlines
  hero:        "text-4xl md:text-6xl lg:text-7xl"   # Cover story titles
  page-title:  "text-3xl md:text-5xl"                # Page headers (Home, Archives)
  section:     "text-xl md:text-2xl"                 # Section headers
  card-title:  "text-lg md:text-xl"                  # Card headings
  # Body
  body-lg:     "text-sm md:text-base"                # Primary descriptions
  body:        "text-xs md:text-sm"                  # Card subtitles, modal text
  # System
  label:       "text-[10px]"                         # Section labels, metadata
  micro:       "text-[9px]"                          # Badges, timestamps, tertiary info

letter_spacing:
  tight:    "tracking-tighter"    # Hero headlines
  standard: "tracking-wide"      # Body text
  wide:     "tracking-widest"     # Uppercase labels (0.1em)
  ultra:    "tracking-[0.2em]"    # Section headers, brand
  max:      "tracking-[0.3em]"   # Featured metadata

text_transform: "uppercase"  # Applied globally to all headings, labels, navigation
```

### 2.3 Spacing & Layout

```yaml
layout:
  page-padding:    "px-5"
  content-max:     "max-w-md md:max-w-3xl lg:max-w-5xl"
  content-center:  "mx-auto"
  page-top:        "pt-24"      # Below fixed header
  page-bottom:     "pb-32"      # Above floating menu
  section-gap:     "mb-12 to mb-20"
  card-gap:        "gap-4 md:gap-6"

border-radius:
  card:    "rounded-3xl"         # 1.5rem — all cards, inputs
  button:  "rounded-full"        # Pill buttons
  modal:   "rounded-3xl"         # Command center
  image:   "rounded-3xl"         # Image containers
  preview: "rounded-sm"          # Preview modal (sharp contrast)
  input:   "rounded-2xl"         # Form fields
  tag:     "rounded-full"        # Badges, pills
```

### 2.4 Shadows & Depth

```yaml
shadows:
  card:        "shadow-lg"
  card-hover:  "shadow-2xl"
  modal:       "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"   # Light
  modal-dark:  "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"   # Dark
  floating:    "shadow-xl"        # Floating menu button
  glow-amber:  "shadow-[0_0_20px_rgba(146,64,14,0.3)]"        # Purchase CTA
  glow-select: "shadow-[0_0_30px_rgba(217,119,6,0.08)]"       # Selected edition

elevation_strategy: |
  Depth is communicated through subtle brightness shifts rather than heavy shadows.
  Cards use `brightness-90` at rest → `brightness-100` on hover.
  Dark mode relies on border contrast (#333 on #161616) over shadow.
```

### 2.5 Animation System

```yaml
timing_function:
  luxury: "cubic-bezier(0.22, 1, 0.36, 1)"    # Primary easing — dampened overshoot

keyframe_animations:
  fade-in:
    duration: "1.2s"
    easing: luxury
    from: { opacity: 0 }
    to:   { opacity: 1 }

  slide-up:
    duration: "1.0s"
    easing: luxury
    from: { translateY: "40px", opacity: 0 }
    to:   { translateY: "0", opacity: 1 }

  blur-in:
    duration: "0.8s"
    easing: luxury
    from: { opacity: 0, blur: "10px", scale: 0.99 }
    to:   { opacity: 1, blur: "0", scale: 1 }

interaction_transitions:
  default:  "transition-all duration-300"
  slow:     "transition-all duration-500"
  glacial:  "transition-all duration-700"
  theme:    "transition-colors duration-500"      # Theme switch
  press:    "active:scale-95"                     # Tap feedback
  press-sm: "active:scale-[0.98]"                # Large card tap
  hover-lift: "hover:-translate-y-1"             # Card hover
  hover-lift-lg: "hover:-translate-y-2"          # Issue card hover
  hover-scale: "hover:scale-105"                 # Image zoom
  hover-slide: "hover:translate-x-1"             # Bookmark items
```

---

## 3. Component Library

### 3.1 Buttons

| Variant | Style | Use Case |
|---|---|---|
| `primary` | Solid fill (`bg-text-primary text-bg-primary`), pill shape, shadow | Main CTAs |
| `outline` | Transparent with border, pill shape | Secondary actions |
| `text` | No background, underline on hover, trailing arrow icon | Inline navigation links |
| `ghost` | Transparent, border on hover | Tertiary actions |

All buttons: `px-6 py-4`, `text-xs font-bold`, `tracking-[0.15em] uppercase`, `rounded-full`, `active:scale-95`.

### 3.2 Inputs

- **Style**: Floating label pattern inside a `rounded-2xl` card container
- **Container**: `bg-bg-secondary`, `border border-border-subtle`, `px-5 pt-6 pb-3`
- **Focus**: Border transitions to `border-text-primary`
- **Label**: Animates from placeholder position to top-left on focus (`text-[10px] uppercase tracking-[0.2em]`)

### 3.3 Cards

#### ArticleCard
- Full-width, vertical layout: image → metadata → title → subtitle
- Image: `rounded-3xl`, hover scales 105%, container lifts `-translate-y-1`
- Category label: `text-amber-700 text-[10px] tracking-[0.2em]`
- Title: `font-sans font-medium uppercase`, transitions from `text-secondary` → `text-primary` on hover

#### IssueCard
- Fixed-width horizontal scroll items (`w-64 md:w-80` large, `w-40` small)
- Cover image: `aspect-[3/4]`, `rounded-3xl`
- Hover: lifts `-translate-y-2`, shadow upgrades to `2xl`
- Volume label transitions to `amber-700` on hover

### 3.4 PreviewModal
- Portal-rendered, centered overlay
- **Backdrop**: `bg-black/60 dark:bg-black/90 backdrop-blur-sm`
- **Layout**: Stacked on mobile (image top, content bottom) → side-by-side on tablet (`md:flex-row`)
- **Image section**: Swipeable carousel with touch gesture support, `ChevronLeft`/`ChevronRight` navigation
- **Content section**: Type badge (`amber-700`), title, description, optional synopsis ("Briefing" section)
- **CTA**: Full-width — amber glow for purchase (`bg-amber-800`), outline for owned content

### 3.5 Command Menu (Navigation Hub)
- Centered modal with `rounded-3xl`, `backdrop-blur-md` backdrop
- **Search bar**: `rounded-xl`, with `Search` icon, auto-focus on open
- **Navigation grid**: 2×2 grid of pill-shaped nav buttons, active state inverts colors
- **Quick access**: Resume reading + Saved articles shortcuts
- **Footer**: Sign Out, Support, Legal links
- Entry animation: `translate-y-8 opacity-0 scale-95` → `translate-y-0 opacity-100 scale-100`

### 3.6 Theme Toggle
- Custom SVG icons: "High Beam" (headlight with beams) for dark → light, "Headlight Off" (housing only) for light → dark
- Automotive metaphor: toggling headlights on/off
- `active:scale-95` tap feedback

### 3.7 PlaceholderImage
- Diagonal stripe pattern overlay (45° hatching at 10% opacity)
- Gradient overlay: `from-black/40 via-transparent to-black/10` (light) / `from-black/80 to-black/20` (dark)
- Centered rotated text label ("IMG", "COVER") at 50% opacity

---

## 4. Screen Specifications

### 4.1 Splash Screen
- Full-screen centered, `z-[100]`
- Ambient amber glow: `w-64 h-64 bg-amber-900/10 rounded-full blur-3xl animate-pulse`
- Brand mark: "AIR&STEEL" in `text-sm font-bold tracking-tighter uppercase`
- Duration: 2500ms before transitioning to Login/Home
- Animation: `animate-fade-in`

### 4.2 Login Screen
- Centered card: `max-w-xs`, `rounded-[2.5rem]`, `backdrop-blur-xl`, `animate-blur-in`
- Brand header → floating label inputs (Email, Password) → primary CTA ("Enter")
- Toggle between Sign In / Sign Up modes
- Floating `ThemeToggle` at `fixed bottom-6 right-6`

### 4.3 Home Screen
- **Greeting section**: "Hello, Alex." — personalized, `text-3xl md:text-5xl`, editorial briefing paragraph
- **Cover Story hero card**: Full-width `min-h-[70vh]`, `rounded-[2rem]`, diagonal stripe texture, centered image placeholder with gloss reflection, bottom-anchored headline typography, `hover:scale-[1.01]`
- **The Nightside** (horizontal scroll): Aspect-video cards (`w-64 md:w-80`), location tags in `amber-500`, hover reveals arrow icon
- **Issues carousel**: `IssueCard` components in horizontal scroll with `snap-x snap-mandatory`

### 4.4 Archives Screen
- **Page header**: "Archives" in `tracking-widest uppercase`
- **Latest Release highlight**: Volume number in display type (`text-4xl md:text-6xl`), full-bleed cover image (`aspect-[3/4] md:aspect-[21/9]`), hover reveals `Eye` icon with `backdrop-blur-md`
- **Featured Article**: Full `ArticleCard` component
- **The Vault**: All issues in a vertical list (mobile) → 2-column grid (tablet), each with wide thumbnail (`aspect-[2.2/1]`), purchase badges, and circular action buttons (arrow or shopping bag)

### 4.5 Library (Dashboard) Screen
- **Header**: "Library" + member identifier
- **Digital Collection**: Horizontal scrolling owned volumes, `rounded-3xl` cards with `aspect-[3/4]` covers, "Read Now" overlay on hover
- **Bookmarks**: List (mobile) → 2-column grid (tablet), thumbnail + volume/page reference
- **Physical Shelf**: Horizontal scroll of physical edition thumbnails
- **Archive CTA**: Centered "Visit Archives" outline button

### 4.6 Reader Screen
- **Full-screen immersive** (`fixed inset-0`)
- **Dual view modes**:
  - **Carousel**: Pages at `85vw × 70vh`, `rounded-3xl`, active page at full opacity, adjacent pages at `scale-95 opacity-50 blur-[1px]`, gloss overlay
  - **Reader**: Pages at `100vw × 100vh`, no borders, pinch-to-zoom enabled (1×–4× scale with pan)
- **Page content**: SVG-generated placeholder pages with volume header, page number, abstract content block, footer
- **Controls dock**: Floating bottom bar (`rounded-full`, `backdrop-blur-xl`) with page counter (tabular-nums), bookmark toggle (amber fill when active), jump-to-bookmark, view mode toggle
- **Auto-hide**: Controls fade out after 3s in reader mode, tap to toggle
- **Bookmark ribbon**: Amber flag (`w-6 h-10 bg-amber-600`) pinned to top-right of bookmarked pages
- **End-of-volume prompt**: "Volume Complete" pill with "Start Over" amber CTA

### 4.7 Profile Screen
- **Max-width constraint**: `max-w-xl mx-auto`
- **Header accent**: `h-1 w-12 bg-amber-700 rounded-full` underline
- **Personal Details**: Floating label inputs (read-only), saved address card, payment method card with "Default" amber badge
- **Purchase History**: Minimal list rows with date and price
- **Settings**: Theme toggle (segmented `Dark | Light` control with inversion animation), Orientation Lock toggle
- **Sign Out**: Full-width outline button

### 4.8 Payment (Checkout) Screen
- **Secure header**: Lock icon + "Secure Checkout" badge in `rounded-full` pill
- **Edition selector**: Two `rounded-3xl` cards (Digital ₹299, Hard Copy ₹999), selected state has amber border + glow shadow, animated checkmark
- **Order summary**: Price in `text-4xl font-bold`, product description, delivery badge
- **Payment method**: Apple Pay (inverted solid) vs Card (amber border), radio-style selection
- **CTA**: Full-width `h-16` button, bouncing dots animation during processing
- **Success state**: Green checkmark in glowing circle, "Order Confirmed", progress bar, auto-redirect to Library

---

## 5. Navigation Architecture

```
┌─────────────────────────────────────────┐
│              App (ThemeProvider)         │
│  ┌───────────────────────────────────┐  │
│  │         HashRouter                │  │
│  │                                   │  │
│  │  /          → Redirect            │  │
│  │  /login     → Login (full screen) │  │
│  │                                   │  │
│  │  ┌─ Layout (header + menu) ────┐  │  │
│  │  │  /home      → Home         │  │  │
│  │  │  /archives  → Archives     │  │  │
│  │  │  /dashboard → Library      │  │  │
│  │  │  /profile   → Profile      │  │  │
│  │  └────────────────────────────┘  │  │
│  │                                   │  │
│  │  /reader/:id  → Reader (full)     │  │
│  │  /checkout/:id → Payment (full)   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

- **Layout-wrapped pages**: Have fixed header (brand + theme toggle), floating menu trigger, and Command Center modal
- **Full-screen pages**: Reader and Payment manage their own chrome and navigation
- **Page transitions**: `animate-blur-in` on route change via `PageTransition` wrapper
- **Scroll reset**: `ScrollToTop` component resets to top on every navigation

---

## 6. Interaction Patterns

### Touch Gestures
| Gesture | Context | Action |
|---|---|---|
| Horizontal swipe | Reader (carousel/reader mode) | Navigate pages (snap scroll) |
| Horizontal swipe | Preview modal image gallery | Cycle through images |
| Pinch-to-zoom | Reader (reader mode only) | Scale 1×–4× with pan support |
| Single tap | Reader (reader mode) | Toggle controls visibility |
| Single tap | Reader (carousel mode) | Enter reader mode on tapped page |
| Press/hold | All buttons | `active:scale-95` feedback |

### State Transitions
| Transition | Animation |
|---|---|
| Theme switch | `transition-colors duration-500` on body and all semantic vars |
| Modal open | Scale 95%→100%, translateY 8→0, opacity 0→1 (500ms cubic-bezier) |
| Modal close | Reverse with 300ms delay on container visibility |
| Menu trigger hide | `translate-y-24 opacity-0` when command menu is open |
| Page enter | `animate-blur-in` (blur 10px→0, scale 0.99→1, opacity 0→1) |
| Controls auto-hide | `translate-y-24 opacity-0` after 3s timeout in reader mode |

---

## 7. Responsive Strategy

```yaml
breakpoints:
  mobile:  "default"       # < 768px — single column, compact spacing
  tablet:  "md: (768px)"   # Side-by-side modal, 2-col grids, wider cards
  desktop: "lg: (1024px)"  # Max content width 5xl, larger hero typography

adaptive_patterns:
  - "ArticleCard featured: aspect-[4/5] → md:aspect-[21/9]"
  - "Archives cover: aspect-[3/4] → md:aspect-[21/9]"
  - "Preview modal: flex-col → md:flex-row"
  - "Vault grid: space-y-10 → md:grid-cols-2"
  - "Bookmarks: space-y-3 → md:grid-cols-2"
  - "Content width: max-w-md → md:max-w-3xl → lg:max-w-5xl"
  - "Hover lift: translate-x-1 (mobile feel) → -translate-y-1 (desktop feel)"
```

---

## 8. Data Models

```typescript
interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  imageUrl: string;
  readTime: string;
  content: string;
  isLocked?: boolean;
}

interface Issue {
  id: string;
  volume: string;
  title: string;
  date: string;
  coverUrl: string;
  description: string;
}

interface User {
  name: string;
  email: string;
  memberSince: string;
  ownedIssues: string[];
}

interface NavigationItem {
  label: string;
  path: string;
}

interface PreviewData {
  id: string;
  type: 'Volume' | 'Article';
  title: string;
  subtitle?: string;
  description: string;
  synopsis?: string;
  meta: string;
  price?: string;
  isOwned?: boolean;
}
```

---

## 9. Technical Stack

```yaml
framework: "React 19.2 + TypeScript 5.8"
routing:   "react-router-dom 7.13 (HashRouter)"
styling:   "Tailwind CSS (CDN) + CSS custom properties"
icons:     "lucide-react 0.563"
build:     "Vite 6.2 + @vitejs/plugin-react 5.0"
fonts:     "Google Fonts (Space Grotesk, Inter)"
state:     "React useState/useContext (no external state library)"
theming:   "CSS custom properties toggled via class on <html> (dark/light)"
```

---

## 10. Iconography

All icons sourced from **Lucide React** at consistent sizing:

| Size | Usage |
|---|---|
| `12px` | Inline labels (BookOpen, Bookmark, Package) |
| `14px` | Button trailing icons, card actions, navigation arrows |
| `16px` | Search bar, nav grid icons, menu trigger |
| `18px` | Reader controls (Bookmark, Maximize, X) |
| `20px` | Payment method icons, modal close, header close |
| `24px` | Archive cover hover reveal (Eye) |

Custom SVG icons for **ThemeToggle**: automotive headlight metaphor (high beam / off).

---

## 11. Accessibility & UX Notes

```yaml
scrollbar: "Hidden via ::-webkit-scrollbar { width: 0 } and scrollbar-width: none"
text_select: "Disabled globally (user-select: none) except .allow-select, inputs, textareas"
tap_highlight: "Disabled (-webkit-tap-highlight-color: transparent)"
font_smoothing: "Antialiased on both WebKit and Firefox"
overscroll: "Disabled (overscroll-behavior-y: none)"
viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
safe_areas: "viewport-fit=cover for notch-aware layout"
theme_persistence: "localStorage key: air_steel_theme"
default_theme: "dark"
```

---

*Last updated: May 2026*
