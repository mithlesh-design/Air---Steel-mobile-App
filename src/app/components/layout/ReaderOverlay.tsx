import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useReader } from "../../context/ReaderContext";
import preview1 from "../../../imports/Preview_1.png";
import preview2 from "../../../imports/Preview_2.png";
import preview3 from "../../../imports/Preview_3.png";
import preview4 from "../../../imports/Preview_4.png";
import preview5 from "../../../imports/Preview_5.png";

const PREVIEW_IMAGES = [
  { num: "01", src: preview1 },
  { num: "02", src: preview2 },
  { num: "03", src: preview3 },
  { num: "04", src: preview4 },
  { num: "05", src: preview5 },
];

const SPEED_SWIPE_VELOCITY = 0.4; // px/ms threshold for speed swipe

export function ReaderOverlay() {
  const { isReaderOpen, closeReader } = useReader();
  const [imgIdx, setImgIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Touch tracking
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const speedSwipeActive = useRef(false);

  useEffect(() => {
    if (isReaderOpen) {
      setImgIdx(0);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [isReaderOpen]);

  const goToImg = (idx: number) => {
    setImgIdx(Math.max(0, Math.min(PREVIEW_IMAGES.length - 1, idx)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    speedSwipeActive.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaT = Date.now() - touchStartTime.current;
    const velocity = Math.abs(deltaX) / deltaT;

    if (Math.abs(deltaX) < 15) return; // ignore taps

    const direction = deltaX < 0 ? 1 : -1; // negative deltaX = swipe left = next

    if (velocity > SPEED_SWIPE_VELOCITY && !speedSwipeActive.current) {
      speedSwipeActive.current = true;
      triggerSpeedSwipe(direction);
    } else {
      goToImg(imgIdx + direction);
    }
  };

  // Speed Swipe: rapid cascade then decelerate and stop
  const triggerSpeedSwipe = (direction: number) => {
    const delays = [120, 120, 180, 260, 380]; // accelerate then decelerate
    let current = imgIdx;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    delays.forEach((delay, i) => {
      const accumulated = delays.slice(0, i).reduce((a, b) => a + b, 0);
      const t = setTimeout(() => {
        current = Math.max(0, Math.min(PREVIEW_IMAGES.length - 1, current + direction));
        setImgIdx(current);
        if (i === delays.length - 1) {
          speedSwipeActive.current = false;
        }
      }, accumulated + delay);
      timeouts.push(t);
    });
  };

  const current = PREVIEW_IMAGES[imgIdx];

  return (
    <AnimatePresence>
      {isReaderOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={closeReader}
          />

          {/* Full-screen preview panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="absolute inset-x-0 inset-y-0 z-50 flex flex-col reader-overlay-bg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── IMAGE SECTION ── */}
            <div className="shrink-0 px-4 pt-6 pb-0">
              <div className="relative">
                {/* Image container with swipe handlers */}
                <div
                  className="relative overflow-hidden rounded-lg reader-img-bg"
                  style={{ height: 280 }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={imgIdx}
                      src={current.src}
                      alt={`Preview ${current.num}`}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* × close button */}
                  <motion.button
                    onClick={closeReader}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border-2 border-white/15 text-white/70 z-10"
                  >
                    <X size={13} strokeWidth={2} />
                  </motion.button>

                  {/* IMG counter */}
                  <div
                    className="absolute bottom-3 right-4 text-white/50 uppercase tracking-widest"
                    style={{ fontSize: 9, letterSpacing: "0.2em" }}
                  >
                    {current.num}&nbsp;/&nbsp;{String(PREVIEW_IMAGES.length).padStart(2, "0")}
                  </div>

                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                    {PREVIEW_IMAGES.map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-full transition-all duration-300 ${
                          i === imgIdx
                            ? "w-4 h-1 bg-white"
                            : "w-1 h-1 bg-white/35"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── SCROLLABLE CONTENT — Curation Insights ── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 pt-7 pb-10"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
              {/* Curation Insights label */}
              <div
                className="text-[8px] text-white/40 uppercase tracking-[0.3em] mb-5"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                Curation Insights
              </div>

              {/* Volume label */}
              <div
                className="text-[9px] text-brand-orange uppercase tracking-[0.24em] mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                Latest Issue
              </div>

              {/* Volume title */}
              <h1
                className="text-white font-bold uppercase leading-tight mb-3"
                style={{
                  fontSize: 32,
                  letterSpacing: "-0.01em",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Volume 1.0<br />Genesis
              </h1>

              {/* Description */}
              <p
                className="text-white/55 leading-relaxed mb-6"
                style={{ fontSize: 12, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}
              >
                100 pages of innovative storytelling, curated from renowned as well as sometimes peripheral pioneers of automotive culture. From the culture of Homo sapiens to the never-directed depths of Tokyo's underscore. Substance is weight, permanence is space, and unified ends story.
              </p>

              {/* Edition metadata */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Print & Digital", value: "Included" },
                  { label: "On Sale", value: "₹4,500" },
                  { label: "Free India", value: "Free Notes" },
                  { label: "Genesis", value: "Vol 1.0" },
                ].map((meta) => (
                  <div
                    key={meta.label}
                    className="bg-white/4 border border-white/8 rounded-xl p-3"
                  >
                    <div
                      className="text-[7px] text-white/30 uppercase tracking-widest mb-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {meta.label}
                    </div>
                    <div
                      className="text-[10px] text-white/80 uppercase tracking-wide"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                    >
                      {meta.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* I'm Interested CTA */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 flex items-center justify-center text-white uppercase tracking-widest border-2 border-white/22 hover:bg-white/5 transition-colors duration-200"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  fontWeight: 600,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                I'm Interested
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
