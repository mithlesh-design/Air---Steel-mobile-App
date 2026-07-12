# Air & Steel Mobile App

> Premium automotive culture digital magazine — dark, cinematic React Native/Expo mobile app for Android

## Project Overview

Air & Steel is a luxury editorial mobile app for automotive culture enthusiasts. The existing codebase is a React web app (Vite + React + TypeScript + Tailwind CSS) that is being ported to React Native with Expo for native Android (and iOS) delivery.

**Design identity:** Cinematic dark mode, editorial minimalism, brutalist typography, brand-orange (`#C85A00`) accent, Space Grotesk (display) + Inter (body) fonts.

## Stack

- **Framework:** React Native + Expo (SDK 52+)
- **Navigation:** Expo Router (file-based)
- **Animations:** React Native Reanimated + Moti
- **Icons:** lucide-react-native
- **State:** React Context (no external library)
- **Storage:** AsyncStorage (replaces localStorage)
- **PDF:** expo-file-system + react-native-pdf or expo-modules
- **Fonts:** expo-font (Space Grotesk, Inter from Google Fonts)
- **Platform target:** Android (primary), iOS (secondary)

## Screens

| Screen | Path | Notes |
|--------|------|-------|
| Splash | `/` | Auto-nav to login after 3s |
| Login | `/login` | OTP email flow |
| Signup | `/signup` | Name + email |
| Home | `/home` | Greeting, latest issue, articles |
| Archives | `/archives` | Volume list by generation |
| Cockpit | `/cockpit` | Dashboard / library |
| Reader | `/reader` | Magazine page swiper |
| PdfReader | `/pdf-reader` | PDF document viewer |
| Profile | `/profile` | Account settings |
| Cart | `/cart` | Purchase flow |
| Bookmarks | `/bookmarks` | Saved articles |
| Articles | `/articles` | All articles list |

## Design Tokens

```
Colors:
  bg-base:      #0A0A0A   (dark) / #EFEEEA (light)
  bg-card:      #141414   (dark) / #FFFFFF (light)
  border:       #2A2A2A   (dark) / #E0DFDB (light)
  brand-orange: #C85A00   (both modes)
  text:         #FFFFFF   (dark) / #0F0F0F (light)

Fonts:
  display: Space Grotesk (700 bold headings)
  body:    Inter (300/400/500 body text)

Radius:
  card:   24 (rounded-3xl equiv)
  button: 999 (pill)
  input:  16 (rounded-2xl equiv)
```

## Key Patterns

- All headings: UPPERCASE, Space Grotesk 700
- Animations: spring physics (stiffness 280-400, damping 24-30)
- Brand easing: cubic-bezier(0.22, 1, 0.36, 1) → Easing.bezier(0.22, 1, 0.36, 1)
- Touch feedback: scale 0.96-0.98 on press
- Floating bottom nav: `MenuOverlay` triggered by floating pill button
- No tab bar — navigation is via the floating command center

## Guardrails

- Never use `div`, `span`, `p`, `button`, `img` — React Native only uses View, Text, Pressable, Image
- Replace `className` Tailwind with `StyleSheet.create()` or inline style objects
- Replace `react-router` navigation with `expo-router` hooks (`useRouter`, `Link`)
- Replace `localStorage` with `AsyncStorage`
- Replace `motion/react` with `react-native-reanimated` + `Moti`
- Replace `lucide-react` with `lucide-react-native`
- All colors must use hex or rgba — no Tailwind CSS classes
- Safe area insets: use `useSafeAreaInsets()` from `react-native-safe-area-context`
- StatusBar: use `expo-status-bar`

## Branch Discipline

- `main` — stable, deployable
- `feature/*` — new screens or features
- `fix/*` — bug fixes
- Never commit directly to main; use PRs

## Commands

```bash
# Start dev server
npx expo start --android

# Build Android APK
npx expo build:android
# or with EAS
eas build --platform android

# Run on Android emulator
npx expo start --android
```

## Docs

- Specs: `docs/specs/`
- Plans: `docs/plans/`
- Design reference: `src/imports/design.md`
- Original web app: `src/` (reference only — do not modify)
