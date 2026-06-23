# Reader Auto-Resume & Bookmark Persistence — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Both the Silence reader (Reader.tsx) and Genesis PDF reader (PdfReader.tsx) automatically resume from the user's last read page and remember their bookmark state across sessions.

**Architecture:** A single custom hook `useReaderProgress(key, totalPages?)` centralises all localStorage read/write logic. Each reader replaces its scattered `useState` + `useEffect` calls with one hook call. No new UI — behaviour only.

**Tech Stack:** React 18, TypeScript, localStorage (browser-native, no new dependencies)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/app/hooks/useReaderProgress.ts` | Persist & restore page index + bookmark per reader |
| Modify | `src/app/screens/Reader.tsx` | Use hook; remove manual localStorage code |
| Modify | `src/app/screens/PdfReader.tsx` | Use hook; replace bare useState(0) / useState(false) |

---

## Task 1: Create `useReaderProgress` hook

**Files:**
- Create: `src/app/hooks/useReaderProgress.ts`

- [ ] **Step 1: Create the hooks directory and file**

```bash
mkdir -p "src/app/hooks"
```

Then create `src/app/hooks/useReaderProgress.ts` with this exact content:

```typescript
import { useState, useEffect } from "react";

/**
 * Persists and restores a reader's page position and bookmark state via localStorage.
 *
 * @param key       Unique reader identifier — becomes part of the storage key.
 *                  Use "silence" for Reader.tsx, "genesis" for PdfReader.tsx.
 * @param totalPages  Total number of pages in the publication. Pass 0 (default)
 *                  when the count isn't known yet (e.g. before a PDF loads).
 *                  Once it becomes a positive integer the saved index is clamped
 *                  to totalPages - 1 if it would otherwise be out of bounds.
 */
export function useReaderProgress(key: string, totalPages: number = 0) {
  const pageKey = `air-steel-${key}-page`;
  const bookmarkKey = `air-steel-${key}-bookmarked`;

  const [pageIndex, setPageIndex] = useState<number>(() => {
    const saved = localStorage.getItem(pageKey);
    const parsed = saved !== null ? parseInt(saved, 10) : NaN;
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  });

  const [bookmarked, setBookmarked] = useState<boolean>(() => {
    return localStorage.getItem(bookmarkKey) === "true";
  });

  // Clamp saved index once totalPages becomes known (handles the PDF load case).
  // Also guards against a manually tampered localStorage value in the static reader.
  useEffect(() => {
    if (totalPages > 0 && pageIndex >= totalPages) {
      setPageIndex(totalPages - 1);
    }
  }, [totalPages, pageIndex]);

  // Persist page index on every change.
  useEffect(() => {
    localStorage.setItem(pageKey, String(pageIndex));
  }, [pageIndex, pageKey]);

  // Persist bookmark on every change.
  useEffect(() => {
    localStorage.setItem(bookmarkKey, String(bookmarked));
  }, [bookmarked, bookmarkKey]);

  return { pageIndex, setPageIndex, bookmarked, setBookmarked };
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors related to the new file.

- [ ] **Step 3: Commit**

```bash
git add src/app/hooks/useReaderProgress.ts
git commit -m "feat: add useReaderProgress hook for page + bookmark persistence"
```

---

## Task 2: Wire Reader.tsx (Vol 04 — Silence)

**Files:**
- Modify: `src/app/screens/Reader.tsx` lines 1–63

The Silence reader already has partial localStorage code. We're replacing it entirely with the hook.

- [ ] **Step 1: Add the hook import**

In `src/app/screens/Reader.tsx`, find the existing import block at the top (line 1):

```typescript
import { useState, useCallback, useRef, useEffect } from "react";
```

Replace it with:

```typescript
import { useState, useCallback, useRef } from "react";
import { useReaderProgress } from "../hooks/useReaderProgress";
```

(`useEffect` is no longer needed at the top level — the hook handles it internally.)

- [ ] **Step 2: Replace the pageIndex + bookmarked state declarations**

Find these lines (approximately lines 54–63):

```typescript
  const [pageIndex, setPageIndex] = useState<number>(() => {
    const saved = localStorage.getItem("air-steel-reader-position");
    const parsed = saved ? parseInt(saved, 10) : NaN;
    return !isNaN(parsed) && parsed >= 0 && parsed < MAGAZINE_PAGES.length ? parsed : 0;
  });

  useEffect(() => {
    localStorage.setItem("air-steel-reader-position", String(pageIndex));
  }, [pageIndex]);
  const [bookmarked, setBookmarked] = useState(false);
```

Replace the entire block with:

```typescript
  const { pageIndex, setPageIndex, bookmarked, setBookmarked } =
    useReaderProgress("silence", MAGAZINE_PAGES.length);
```

- [ ] **Step 3: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Manual verification — position resume**

1. Run the dev server: `pnpm dev` (or `npm run dev`)
2. Navigate to the Silence reader (`/reader`)
3. Flip to page 3 (index 2 — "Carbon & Steel")
4. Close the reader (press X) and navigate back to the reader
5. Expected: reader opens on "Carbon & Steel", not the cover page
6. Open DevTools → Application → Local Storage → verify key `air-steel-silence-page` = `"2"`

- [ ] **Step 5: Manual verification — bookmark persistence**

1. While on any page, tap the Bookmark button (bottom pill bar) to fill it
2. Close and reopen the reader
3. Expected: bookmark is still filled (white)
4. Verify key `air-steel-silence-bookmarked` = `"true"` in DevTools Local Storage

- [ ] **Step 6: Commit**

```bash
git add src/app/screens/Reader.tsx
git commit -m "feat: wire Silence reader to useReaderProgress (position + bookmark persist)"
```

---

## Task 3: Wire PdfReader.tsx (Vol 1.0 — Genesis)

**Files:**
- Modify: `src/app/screens/PdfReader.tsx` lines 1–26

The Genesis PDF reader has no position persistence at all. We're adding it via the hook.

- [ ] **Step 1: Add the hook import**

In `src/app/screens/PdfReader.tsx`, find the existing import block (line 1):

```typescript
import { useState, useCallback, useRef, useEffect } from "react";
```

Replace it with:

```typescript
import { useState, useCallback, useRef, useEffect } from "react";
import { useReaderProgress } from "../hooks/useReaderProgress";
```

(`useEffect` stays — PdfReader still uses it for the ResizeObserver.)

- [ ] **Step 2: Replace pageIndex + bookmarked state declarations**

Find these two lines (approximately lines 17–22):

```typescript
  const [numPages, setNumPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
```

Replace with:

```typescript
  const [numPages, setNumPages] = useState(0);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const { pageIndex, setPageIndex, bookmarked, setBookmarked } =
    useReaderProgress("genesis", numPages);
```

Note: `numPages` is `0` on mount. The hook holds the raw saved index until `numPages > 0` (after the PDF loads), then its internal clamp effect fires — capping the index to `numPages - 1` if the saved value is out of range.

- [ ] **Step 3: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Manual verification — position resume**

1. Navigate to the Genesis reader (`/pdf-reader`)
2. Wait for the PDF to load
3. Swipe or click to advance to page 5
4. Close the reader and navigate back to `/pdf-reader`
5. Expected: PDF opens directly on page 5 (not page 1)
6. Verify key `air-steel-genesis-page` = `"4"` in DevTools Local Storage

- [ ] **Step 5: Manual verification — out-of-range clamp**

1. In DevTools Local Storage, manually set `air-steel-genesis-page` to `"9999"`
2. Navigate to `/pdf-reader` and let the PDF finish loading
3. Expected: reader lands on the last page (not a blank/crash), and `air-steel-genesis-page` is updated to the correct last-page index

- [ ] **Step 6: Manual verification — bookmark persistence**

1. Tap the Bookmark button in the bottom pill bar (fills it white)
2. Close and reopen the Genesis reader
3. Expected: bookmark is still filled
4. Verify key `air-steel-genesis-bookmarked` = `"true"` in DevTools Local Storage

- [ ] **Step 7: Commit**

```bash
git add src/app/screens/PdfReader.tsx
git commit -m "feat: wire Genesis PDF reader to useReaderProgress (position + bookmark persist)"
```

---

## Final Check

- [ ] Both readers open on their last-visited page after a full browser refresh
- [ ] Both readers remember bookmark state after a full browser refresh
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No console errors in either reader during normal navigation
