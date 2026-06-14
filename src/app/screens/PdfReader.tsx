import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "motion/react";
import { X, Bookmark, Maximize2, Minimize2, RotateCcw, AlignJustify } from "lucide-react";
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
  const [showContents, setShowContents] = useState(false);
  const [jumpValue, setJumpValue] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const speedSwipeActive = useRef(false);

  // Finger-tracking pager (normal mode)
  const x = useMotionValue(0);
  const draggingRef = useRef(false);

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
  }, [pdfLoaded, isExpanded]); // re-attach when the active container (normal vs expanded) changes

  const effectiveWidth = Math.max(100, Math.floor(containerWidth * zoomLevel));
  // Normal mode renders a smaller, framed card (consistent with the Silence reader)
  const cardWidth = Math.max(100, Math.floor(Math.min(containerWidth * 0.9, 320)));

  const jumpToPage = (n: number) => {
    if (!Number.isNaN(n)) setPageIndex(Math.min(numPages - 1, Math.max(0, n - 1)));
  };

  const goNext = useCallback(() => {
    if (pageIndex < numPages - 1) setPageIndex((i) => i + 1);
  }, [pageIndex, numPages]);

  const goPrev = useCallback(() => {
    if (pageIndex > 0) setPageIndex((i) => i - 1);
  }, [pageIndex]);

  // ── Finger-tracking pager: slide the track to the neighbour, then recentre ──
  const snapSpring = { type: "spring", stiffness: 300, damping: 30 } as const;

  const commit = useCallback((dir: number) => {
    const target = dir > 0 ? -containerWidth : containerWidth;
    animate(x, target, snapSpring).then(() => {
      setPageIndex((i) => Math.max(0, Math.min(numPages - 1, i + dir)));
      x.set(0);
    });
  }, [containerWidth, numPages, x]);

  const paginate = useCallback((dir: number) => {
    if (dir > 0 && pageIndex < numPages - 1) commit(1);
    else if (dir < 0 && pageIndex > 0) commit(-1);
  }, [pageIndex, numPages, commit]);

  const handleDragEnd = (info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    const hasNext = pageIndex < numPages - 1;
    const hasPrev = pageIndex > 0;
    const threshold = containerWidth * 0.25;
    if ((offset.x < -threshold || velocity.x < -500) && hasNext) commit(1);
    else if ((offset.x > threshold || velocity.x > 500) && hasPrev) commit(-1);
    else animate(x, 0, snapSpring);
  };

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
          <div className="flex items-center gap-2.5 mt-1">
            {/* Contents — jump to page */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setJumpValue(String(pageIndex + 1)); setShowContents(true); }}
              aria-label="Contents — jump to page"
              className="w-10 h-10 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center"
            >
              <AlignJustify size={14} className="text-white/70" />
            </motion.button>
            {/* Close */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center"
            >
              <X size={14} className="text-white/70" />
            </motion.button>
          </div>
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

        {/* ── EXPANDED: single page with scroll + zoom (unchanged) ── */}
        {pdfLoaded && !pdfError && isExpanded && (
          <div
            ref={containerRef}
            className="absolute inset-0 z-50 bg-[#080808] overflow-auto flex items-start justify-center"
            style={{
              touchAction: zoomLevel > 1 ? "auto" : "pan-y",
              paddingTop: 80,
              paddingBottom: 96,
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
            />
          </div>
        )}

        {/* ── NORMAL: finger-tracking page pager (cards follow the swipe) ── */}
        {pdfLoaded && !pdfError && !isExpanded && (
          <div className="flex-1 flex items-center justify-center px-4 overflow-hidden min-h-0">
            <div
              ref={containerRef}
              className="relative w-full h-full overflow-hidden"
              style={{ touchAction: "pan-y" }}
            >
              <motion.div
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{ x }}
                drag="x"
                dragElastic={0.12}
                dragConstraints={{
                  left: pageIndex < numPages - 1 ? -containerWidth : 0,
                  right: pageIndex > 0 ? containerWidth : 0,
                }}
                onPointerDown={() => { draggingRef.current = false; }}
                onDragStart={() => { draggingRef.current = true; }}
                onDragEnd={(_e, info) => handleDragEnd(info)}
                onClick={(e) => {
                  if (draggingRef.current) return;
                  const { left, width } = e.currentTarget.getBoundingClientRect();
                  paginate(e.clientX - left < width / 2 ? -1 : 1);
                }}
              >
                {[pageIndex - 1, pageIndex, pageIndex + 1].map((p) => {
                  if (p < 0 || p >= numPages) return null;
                  return (
                    <div
                      key={p}
                      className="absolute top-0 h-full flex items-center justify-center"
                      style={{
                        width: containerWidth,
                        transform: `translateX(${(p - pageIndex) * containerWidth}px)`,
                      }}
                    >
                      <div
                        className="rounded-[22px] overflow-hidden pointer-events-none"
                        style={{
                          boxShadow:
                            "0 0 0 1px rgba(255,255,255,0.07), 0 30px 80px -10px rgba(0,0,0,0.95), 0 0 60px -20px rgba(255,255,255,0.04)",
                        }}
                      >
                        <Page
                          pageNumber={p + 1}
                          width={cardWidth}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading={
                            <div
                              className="bg-[#111] animate-pulse"
                              style={{ width: cardWidth, height: Math.floor(cardWidth * 1.41) }}
                            />
                          }
                          className="block"
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        )}
      </Document>

      {/* ── PROGRESS BAR (normal mode) — slim fill, scales to any page count ── */}
      {pdfLoaded && !pdfError && !isExpanded && numPages > 0 && (
        <div className="shrink-0 flex justify-center px-8 pb-3 z-20">
          <div className="w-full max-w-[240px] h-0.5 bg-white/12 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/80 rounded-full"
              animate={{ width: `${((pageIndex + 1) / numPages) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      )}

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
              className="pointer-events-auto w-9 h-9 rounded-full media-control bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center"
            >
              <Minimize2 size={14} className="text-white/70" />
            </motion.button>
          </div>

          {/* Bottom controls — zoom only; page nav is by tapping the reader's left/right edges */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[60] pb-10 px-5 pt-4 flex items-center justify-center"
            style={{ background: "linear-gradient(to top, rgba(8,8,8,0.95) 60%, transparent)" }}
          >
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
              {zoomLevel > 1 ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setZoomLevel(1.0)}
                  aria-label="Reset zoom to 100%"
                  className="flex items-center gap-1 text-[11px] text-brand-orange tabular-nums px-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {Math.round(zoomLevel * 100)}%
                  <RotateCcw size={11} strokeWidth={2} />
                </motion.button>
              ) : (
                <span
                  className="text-[11px] text-white/50 tabular-nums w-9 text-center"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {Math.round(zoomLevel * 100)}%
                </span>
              )}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={zoomIn}
                disabled={zoomLevel >= 3.0}
                className="w-6 h-6 flex items-center justify-center text-white/70 disabled:opacity-25 text-xl font-light leading-none"
              >
                +
              </motion.button>
            </div>
          </div>
        </>
      )}

      {/* ── CONTENTS — jump to page (normal mode) ── */}
      <AnimatePresence>
        {showContents && !isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40"
              onClick={() => setShowContents(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-[#0D0D0D] border-l border-[#1E1E1E] z-50 flex flex-col"
            >
              {/* Header */}
              <div className="px-5 pt-12 pb-5 border-b border-[#1A1A1A] flex items-center justify-between">
                <div>
                  <div className="text-[8px] text-white/50 uppercase tracking-[0.25em] mb-1">
                    Contents
                  </div>
                  <div className="text-[14px] font-bold text-white uppercase tracking-wider">
                    Vol 1.0 · Genesis
                  </div>
                </div>
                <button
                  onClick={() => setShowContents(false)}
                  className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center"
                >
                  <X size={12} className="text-white/60" />
                </button>
              </div>

              {/* Jump-to-page body */}
              <div className="flex-1 px-5 pt-6 flex flex-col gap-6">
                <div>
                  <div className="text-[8px] text-white/40 uppercase tracking-[0.25em] mb-2">
                    Current Page
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-[40px] font-bold text-white leading-none tabular-nums"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {pageNum}
                    </span>
                    <span className="text-[14px] text-white/30 tabular-nums">/ {numPages}</span>
                  </div>
                </div>

                {/* Slider — live scrub */}
                <input
                  type="range"
                  min={1}
                  max={Math.max(1, numPages)}
                  value={pageIndex + 1}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    setJumpValue(String(n));
                    jumpToPage(n);
                  }}
                  aria-label="Scrub pages"
                  className="w-full accent-white"
                />

                {/* Number entry + Go */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={numPages}
                    value={jumpValue}
                    onChange={(e) => setJumpValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") jumpToPage(parseInt(jumpValue, 10)); }}
                    aria-label="Page number"
                    placeholder="Page #"
                    className="flex-1 min-h-[40px] rounded-xl bg-white/[0.06] border border-white/12 px-4 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/40 tabular-nums"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => jumpToPage(parseInt(jumpValue, 10))}
                    className="min-h-[40px] px-5 rounded-xl bg-white text-black text-[10px] uppercase tracking-[0.18em]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                  >
                    Go
                  </motion.button>
                </div>

                {/* Quick jumps */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => jumpToPage(1)}
                    className="flex-1 min-h-[40px] rounded-xl border border-[#2A2A2A] text-[9px] text-white/55 uppercase tracking-[0.18em]"
                  >
                    First Page
                  </button>
                  <button
                    onClick={() => jumpToPage(numPages)}
                    className="flex-1 min-h-[40px] rounded-xl border border-[#2A2A2A] text-[9px] text-white/55 uppercase tracking-[0.18em]"
                  >
                    Last Page
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
