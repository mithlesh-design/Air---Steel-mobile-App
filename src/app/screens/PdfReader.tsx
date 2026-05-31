import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { X, Bookmark, Maximize2, Minimize2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PDF_URL = "/vol-1-genesis.pdf";
const SPEED_SWIPE_VELOCITY = 0.4;

export function PdfReader() {
  const navigate = useNavigate();

  const [numPages, setNumPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState(340);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const speedSwipeActive = useRef(false);

  // Track container width so Page fills it correctly in both normal + expanded modes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setContainerWidth(Math.floor(w));
    });
    obs.observe(el);
    const w = el.getBoundingClientRect().width;
    if (w > 0) setContainerWidth(Math.floor(w));
    return () => obs.disconnect();
  }, [pdfLoaded]); // re-attach once PDF loads so containerRef is rendered

  const effectiveWidth = Math.max(100, Math.floor(containerWidth * zoomLevel));

  const goNext = useCallback(() => {
    if (pageIndex < numPages - 1) setPageIndex((i) => i + 1);
  }, [pageIndex, numPages]);

  const goPrev = useCallback(() => {
    if (pageIndex > 0) setPageIndex((i) => i - 1);
  }, [pageIndex]);

  const triggerSpeedSwipe = useCallback((dir: number) => {
    const delays = [120, 120, 180, 260, 380];
    let current = pageIndex;
    delays.forEach((delay, i) => {
      const acc = delays.slice(0, i).reduce((a, b) => a + b, 0);
      setTimeout(() => {
        current = Math.max(0, Math.min(numPages - 1, current + dir));
        setPageIndex(current);
        if (i === delays.length - 1) speedSwipeActive.current = false;
      }, acc + delay);
    });
  }, [pageIndex, numPages]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    speedSwipeActive.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (zoomLevel > 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaT = Date.now() - touchStartTime.current;
    const velocity = Math.abs(deltaX) / deltaT;
    if (Math.abs(deltaX) < 15) return;
    const dir = deltaX < 0 ? 1 : -1;
    if (velocity > SPEED_SWIPE_VELOCITY && !speedSwipeActive.current) {
      speedSwipeActive.current = true;
      triggerSpeedSwipe(dir);
    } else {
      dir === 1 ? goNext() : goPrev();
    }
  };

  const collapse = () => { setIsExpanded(false); setZoomLevel(1.0); };
  const zoomIn  = () => setZoomLevel(z => parseFloat(Math.min(3.0, z + 0.25).toFixed(2)));
  const zoomOut = () => setZoomLevel(z => parseFloat(Math.max(0.75, z - 0.25).toFixed(2)));

  const pageNum = String(pageIndex + 1).padStart(3, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex-1 flex flex-col min-h-0 bg-[#080808] relative overflow-hidden"
    >
      {/* ── TOP BAR (hidden in expanded mode) ── */}
      {!isExpanded && (
        <div className="flex items-start justify-between px-5 pt-10 pb-4 shrink-0 z-20">
          <div>
            <div
              className="text-[9px] text-white/35 uppercase tracking-[0.25em] mb-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Vol 1.0
            </div>
            <div
              className="text-[18px] font-bold text-white uppercase tracking-[0.15em] leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Genesis
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center mt-1"
          >
            <X size={14} className="text-white/70" />
          </motion.button>
        </div>
      )}

      {/* ── SINGLE DOCUMENT — never remounts ── */}
      <Document
        file={PDF_URL}
        onLoadSuccess={({ numPages: n }) => { setNumPages(n); setPdfLoaded(true); }}
        onLoadError={() => setPdfError(true)}
        loading={null}
        error={null}
        className="flex-1 flex flex-col min-h-0"
      >
        {/* Loading state */}
        {!pdfLoaded && !pdfError && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
            <span
              className="text-[9px] text-white/30 uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Loading Volume 1.0
            </span>
          </div>
        )}

        {/* Error state */}
        {pdfError && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8">
            <p
              className="text-white/30 text-[12px] text-center leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Could not load Volume 1.0.{"\n"}Check your connection and try again.
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { setPdfError(false); setPdfLoaded(false); window.location.reload(); }}
              className="text-[9px] text-white/50 uppercase tracking-widest border border-white/15 rounded-full px-5 py-2.5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Retry
            </motion.button>
          </div>
        )}

        {/* ── PAGE CONTAINER — CSS switches between card and fullscreen ── */}
        {pdfLoaded && !pdfError && (
          <div
            ref={containerRef}
            className={
              isExpanded
                ? "absolute inset-0 z-50 bg-[#080808] overflow-auto flex items-start justify-center"
                : "flex-1 flex items-center justify-center px-4 overflow-hidden min-h-0"
            }
            style={{
              touchAction: zoomLevel > 1 ? "auto" : "pan-y",
              paddingTop: isExpanded ? 80 : 0,
              paddingBottom: isExpanded ? 96 : 0,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Invisible tap zones — only at normal zoom */}
            {zoomLevel === 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-0 top-0 h-full w-1/4 z-10 opacity-0"
                  aria-label="Previous page"
                />
                <button
                  onClick={goNext}
                  className="absolute right-0 top-0 h-full w-1/4 z-10 opacity-0"
                  aria-label="Next page"
                />
              </>
            )}

            <Page
              pageNumber={pageIndex + 1}
              width={effectiveWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <div
                  className="bg-[#111] animate-pulse rounded-xl"
                  style={{ width: effectiveWidth, height: Math.floor(effectiveWidth * 1.41) }}
                />
              }
              className={isExpanded ? "" : "rounded-xl overflow-hidden shadow-2xl"}
            />
          </div>
        )}
      </Document>

      {/* ── BOTTOM PILL (normal mode) ── */}
      {pdfLoaded && !pdfError && !isExpanded && (
        <div className="shrink-0 flex justify-center pb-8 px-6 z-20">
          <div className="flex items-center rounded-full border border-[#2A2A2A] overflow-hidden reader-pill-bg">
            {/* Page counter */}
            <div className="px-5 py-3.5 flex items-center gap-1.5">
              <span
                className="text-[14px] font-bold text-white tabular-nums"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {pageNum}
              </span>
              <span
                className="text-[12px] text-white/30 tabular-nums"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                / {numPages}
              </span>
            </div>
            <div className="w-px h-5 bg-white/12" />
            {/* Bookmark */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setBookmarked((b) => !b)}
              className="px-4 py-3.5 flex items-center justify-center"
            >
              <Bookmark
                size={16}
                className={`transition-colors duration-200 ${bookmarked ? "text-white fill-white" : "text-white/40"}`}
              />
            </motion.button>
            <div className="w-px h-5 bg-white/12" />
            {/* Expand */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setIsExpanded(true)}
              className="px-4 py-3.5 flex items-center justify-center"
            >
              <Maximize2 size={16} className="text-white/40" />
            </motion.button>
          </div>
        </div>
      )}

      {/* ── EXPANDED CONTROLS (overlaid, z-index above the page container) ── */}
      {isExpanded && (
        <>
          {/* Top controls */}
          <div className="absolute top-0 left-0 right-0 z-[60] flex items-start justify-between px-5 pt-12 pointer-events-none">
            <div className="pointer-events-auto bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <span
                className="text-[11px] text-white/60 tabular-nums"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {pageNum}
              </span>
              <span className="text-[11px] text-white/30 tabular-nums">/ {numPages}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={collapse}
              className="pointer-events-auto w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center"
            >
              <Minimize2 size={14} className="text-white/70" />
            </motion.button>
          </div>

          {/* Bottom controls */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[60] pb-10 px-5 pt-4 flex items-center justify-between"
            style={{ background: "linear-gradient(to top, rgba(8,8,8,0.95) 60%, transparent)" }}
          >
            {/* Prev */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={goPrev}
              disabled={pageIndex === 0}
              className="w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center disabled:opacity-25"
            >
              <ChevronLeft size={16} className="text-white/70" />
            </motion.button>

            {/* Zoom controls */}
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={zoomOut}
                disabled={zoomLevel <= 0.75}
                className="w-6 h-6 flex items-center justify-center text-white/70 disabled:opacity-25 text-xl font-light leading-none"
              >
                −
              </motion.button>
              <span
                className="text-[11px] text-white/50 tabular-nums w-9 text-center"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {Math.round(zoomLevel * 100)}%
              </span>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={zoomIn}
                disabled={zoomLevel >= 3.0}
                className="w-6 h-6 flex items-center justify-center text-white/70 disabled:opacity-25 text-xl font-light leading-none"
              >
                +
              </motion.button>
            </div>

            {/* Next */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={goNext}
              disabled={pageIndex === numPages - 1}
              className="w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center disabled:opacity-25"
            >
              <ChevronRight size={16} className="text-white/70" />
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
}
