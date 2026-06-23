# Reader Auto-Resume & Bookmark Persistence

**Date:** 2026-06-23  
**Status:** Approved

## Problem

- `PdfReader.tsx` (Vol 1.0 — Genesis) always starts at page 1 on every visit — no position persistence.
- `Reader.tsx` (Vol 04 — Silence) already persists `pageIndex` to localStorage but uses a one-off implementation scoped to that file and does not persist the bookmark state.
- Neither reader persists the bookmark — it resets to `false` on every session.

## Goals

1. Both readers resume from the last read position automatically (silent, no prompt).
2. Both readers persist the bookmark state across sessions.

## Approach

**Custom hook `useReaderProgress`** — extracts read/write localStorage logic into a single reusable hook. Each reader calls it with a unique key and gets back `pageIndex`, `setPageIndex`, `bookmarked`, `setBookmarked`.

Rejected alternatives:
- **Inline per-reader**: duplicates the same logic in two files.
- **Centralize in ReaderContext**: `ReaderContext` manages the overlay, not the full-screen readers — mixing concerns.

## Implementation

### 1. New hook — `src/app/hooks/useReaderProgress.ts`

**Signature:**
```ts
useReaderProgress(key: string, maxIndex?: number): {
  pageIndex: number;
  setPageIndex: (i: number) => void;
  bookmarked: boolean;
  setBookmarked: (b: boolean) => void;
}
```

**Storage keys:**
- Page position: `air-steel-{key}-page`
- Bookmark: `air-steel-{key}-bookmarked`

**Behaviour:**
- On mount, reads both values from `localStorage`.
- `pageIndex` is validated to be a non-negative integer. If `maxIndex` is provided and the saved value exceeds it, the value is clamped to `maxIndex - 1`. Falls back to `0` if absent or invalid.
- `bookmarked` is `true` only if the stored string is exactly `"true"`, otherwise `false`.
- Both values are written back to `localStorage` in a `useEffect` on every change.
- `maxIndex` defaults to `Infinity`, so the Silence reader (fixed 5-page array) needs no clamping argument.

### 2. Reader.tsx — `src/app/screens/Reader.tsx`

- Remove the existing manual `localStorage` initializer on `pageIndex` (lines 54–58).
- Remove the existing `useEffect` that writes `pageIndex` to `localStorage` (lines 60–62).
- Remove `const [bookmarked, setBookmarked] = useState(false)`.
- Replace all three with: `const { pageIndex, setPageIndex, bookmarked, setBookmarked } = useReaderProgress("silence")`.
- **Key migration:** old key was `"air-steel-reader-position"`. New key is `"air-steel-silence-page"`. Saved position in the old key is abandoned (harmless — 5-page array, starting fresh is acceptable).
- No visual changes.

### 3. PdfReader.tsx — `src/app/screens/PdfReader.tsx`

- Remove `const [pageIndex, setPageIndex] = useState(0)`.
- Remove `const [bookmarked, setBookmarked] = useState(false)`.
- Replace both with: `const { pageIndex, setPageIndex, bookmarked, setBookmarked } = useReaderProgress("genesis", numPages)`.
- `numPages` is `0` until the PDF loads. The hook holds the saved index as-is until `numPages > 0`, then clamps on the next render where `maxIndex` becomes valid.
- No visual changes.

## Data Model

| Key | Value | Reader |
|-----|-------|--------|
| `air-steel-silence-page` | `"0"` – `"4"` | Reader.tsx |
| `air-steel-silence-bookmarked` | `"true"` / `"false"` | Reader.tsx |
| `air-steel-genesis-page` | `"0"` – `"{numPages-1}"` | PdfReader.tsx |
| `air-steel-genesis-bookmarked` | `"true"` / `"false"` | PdfReader.tsx |

## Out of Scope

- Resume prompt / "Continue from page X?" UI (user chose silent resume).
- Per-article position in `ReaderOverlay.tsx` (that's a preview overlay, not a reader).
- Scroll position within expanded article text.
