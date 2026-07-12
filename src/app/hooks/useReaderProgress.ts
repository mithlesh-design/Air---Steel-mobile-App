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
