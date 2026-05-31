import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Check } from "lucide-react";
import { useReader } from "../../context/ReaderContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router";
import c1 from "../../../imports/C1_Model-T.jpg";
import c2 from "../../../imports/C2_Skyline.jpg";
import c3 from "../../../imports/C3_LeMans.jpg";
import c4 from "../../../imports/C4_Testarossa.jpg";
import c5 from "../../../imports/C5_Atlantic.jpg";
import coverImage from "../../../imports/image-2.png";
import p1 from "../../../imports/Preview_1.png";
import p2 from "../../../imports/Preview_2.png";
import p3 from "../../../imports/Preview_3.png";
import p4 from "../../../imports/Preview_4.png";
import p5 from "../../../imports/Preview_5.png";
import { ARTICLES } from "../../data/articles";

const PREVIEW_IMAGES = [
  { num: "01", src: c1 },
  { num: "02", src: c2 },
  { num: "03", src: c3 },
  { num: "04", src: c4 },
  { num: "05", src: c5 },
];

const ARTICLE_IMAGES = [
  { num: "01", src: p1 },
  { num: "02", src: p2 },
  { num: "03", src: p3 },
  { num: "04", src: p4 },
  { num: "05", src: p5 },
];

const SPEED_SWIPE_VELOCITY = 0.4;

export function ReaderOverlay() {
  const { isReaderOpen, closeReader, currentArticleId } = useReader();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const articleData = currentArticleId ? ARTICLES[currentArticleId] ?? null : null;
  const activeImages = articleData ? ARTICLE_IMAGES : PREVIEW_IMAGES;
  const [imgIdx, setImgIdx] = useState(0);
  const [view, setView] = useState<"preview" | "curation" | "acquire">("preview");
  const [selectedFormat, setSelectedFormat] = useState<"digital" | "print" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const speedSwipeActive = useRef(false);

  useEffect(() => {
    if (isReaderOpen) {
      setImgIdx(0);
      setView("preview");
      setSelectedFormat(null);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [isReaderOpen]);

  const goToImg = (idx: number) => {
    setImgIdx(Math.max(0, Math.min(activeImages.length - 1, idx)));
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

    if (Math.abs(deltaX) < 15) return;

    const direction = deltaX < 0 ? 1 : -1;

    if (velocity > SPEED_SWIPE_VELOCITY && !speedSwipeActive.current) {
      speedSwipeActive.current = true;
      triggerSpeedSwipe(direction);
    } else {
      goToImg(imgIdx + direction);
    }
  };

  const triggerSpeedSwipe = (direction: number) => {
    const delays = [120, 120, 180, 260, 380];
    let current = imgIdx;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    delays.forEach((delay, i) => {
      const accumulated = delays.slice(0, i).reduce((a, b) => a + b, 0);
      const t = setTimeout(() => {
        current = Math.max(0, Math.min(activeImages.length - 1, current + direction));
        setImgIdx(current);
        if (i === delays.length - 1) {
          speedSwipeActive.current = false;
        }
      }, accumulated + delay);
      timeouts.push(t);
    });
  };

  const current = activeImages[imgIdx];

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

          {/* Full-screen panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="absolute inset-x-0 inset-y-0 z-50 flex flex-col reader-overlay-bg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── ARTICLE DETAIL VIEW ── */}
            {articleData ? (
              <div className="absolute inset-0 flex flex-col reader-overlay-bg">
                {/* Image carousel */}
                <div className="shrink-0 relative" style={{ height: 300 }}>
                  <div
                    className="absolute inset-0 reader-img-bg"
                    style={{ touchAction: "none" }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={(e) => {
                      const { clientX, currentTarget } = e;
                      const { left, width } = currentTarget.getBoundingClientRect();
                      const relX = clientX - left;
                      goToImg(imgIdx + (relX < width / 2 ? -1 : 1));
                    }}
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
                  </div>

                  {/* × close */}
                  <motion.button
                    onClick={closeReader}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="absolute top-12 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/15 text-white/70 z-10"
                  >
                    <X size={13} strokeWidth={2} />
                  </motion.button>

                  {/* Right arrow hint */}
                  {imgIdx < activeImages.length - 1 && (
                    <motion.button
                      onClick={() => goToImg(imgIdx + 1)}
                      whileTap={{ scale: 0.88 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/15 text-white/60 z-10"
                    >
                      <ChevronRight size={13} strokeWidth={2} />
                    </motion.button>
                  )}

                  {/* Counter */}
                  <div
                    className="absolute bottom-3 right-4 text-white/50 uppercase tracking-widest z-10"
                    style={{ fontSize: 9, letterSpacing: "0.2em" }}
                  >
                    {current.num}&nbsp;/&nbsp;{String(activeImages.length).padStart(2, "0")}
                  </div>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10">
                    {activeImages.map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-full transition-all duration-300 ${
                          i === imgIdx ? "w-4 h-1 bg-white" : "w-1 h-1 bg-white/35"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Scrollable content */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-5 pt-5 pb-10"
                  style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
                >
                  {/* Tags row */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="border border-white/30 text-white uppercase px-2 py-1"
                      style={{ fontSize: 7, letterSpacing: "0.2em", fontFamily: "'Inter', sans-serif" }}
                    >
                      {articleData.tag}
                    </span>
                    <span
                      className="text-white/40 uppercase"
                      style={{ fontSize: 7, letterSpacing: "0.2em", fontFamily: "'Inter', sans-serif" }}
                    >
                      {articleData.section}
                    </span>
                  </div>

                  {/* Title */}
                  <h1
                    className="text-white font-bold uppercase leading-tight mb-2"
                    style={{ fontSize: 26, letterSpacing: "-0.01em", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {articleData.title}
                  </h1>

                  {/* Subtitle */}
                  <p
                    className="text-white/45 leading-relaxed mb-5"
                    style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    {articleData.subtitle}
                  </p>

                  {/* Briefing label */}
                  <div
                    className="text-white/30 uppercase tracking-[0.3em] mb-2"
                    style={{ fontSize: 8, fontFamily: "'Inter', sans-serif" }}
                  >
                    Briefing
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/8 mb-4" />

                  {/* Body */}
                  <p
                    className="text-white/55 leading-relaxed mb-8"
                    style={{ fontSize: 12, lineHeight: 1.8, fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    {articleData.briefing}
                  </p>

                </div>
              </div>
            ) : (
            <AnimatePresence mode="wait" initial={false}>
              {view === "preview" ? (
                <motion.div
                  key="preview"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 32, stiffness: 280 }}
                  className="absolute inset-0 flex flex-col"
                >
                  {/* Full-screen image */}
                  <div
                    className="flex-1 relative overflow-hidden reader-img-bg"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={(e) => {
                      const { clientX, currentTarget } = e;
                      const { left, width } = currentTarget.getBoundingClientRect();
                      const relX = clientX - left;
                      if (relX < width / 2) {
                        goToImg(imgIdx - 1);
                      } else if (imgIdx === PREVIEW_IMAGES.length - 1) {
                        setView("curation");
                      } else {
                        goToImg(imgIdx + 1);
                      }
                    }}
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                    {/* × close button */}
                    <motion.button
                      onClick={closeReader}
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="absolute top-12 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/15 text-white/70 z-10"
                    >
                      <X size={13} strokeWidth={2} />
                    </motion.button>

                    {/* IMG counter */}
                    <div
                      className="absolute bottom-4 right-4 text-white/50 uppercase tracking-widest"
                      style={{ fontSize: 9, letterSpacing: "0.2em" }}
                    >
                      {current.num}&nbsp;/&nbsp;{String(PREVIEW_IMAGES.length).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Bottom strip */}
                  <div className="shrink-0 px-5 pb-8 pt-4 flex flex-col items-center gap-3">
                    {/* Dot indicators */}
                    <div className="flex gap-1.5">
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

                    {/* Proceed to Curation Insights */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setView("curation")}
                      className="flex items-center gap-1.5 text-white/50 uppercase"
                      style={{ fontSize: 9, letterSpacing: "0.28em", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      Curation Insights
                      <ChevronRight size={10} strokeWidth={2} />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="curation"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 32, stiffness: 280 }}
                  className="absolute inset-0 flex flex-col reader-overlay-bg"
                >
                  {/* Cover image */}
                  <div className="shrink-0 relative" style={{ height: "42%" }}>
                    <img
                      src={coverImage}
                      alt="Volume 1.0 Genesis"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none" />

                    {/* × close button */}
                    <motion.button
                      onClick={closeReader}
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="absolute top-12 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/15 text-white/70 z-10"
                    >
                      <X size={13} strokeWidth={2} />
                    </motion.button>
                  </div>

                  {/* Scrollable content */}
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-5 pt-6 pb-10"
                    style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
                  >
                    {/* Eyebrow */}
                    <div
                      className="text-[8px] text-white/40 uppercase tracking-[0.3em] mb-4"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                    >
                      Curation Insights
                    </div>

                    {/* Title */}
                    <h1
                      className="text-white font-bold uppercase leading-none"
                      style={{
                        fontSize: 32,
                        letterSpacing: "-0.01em",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      Volume 1.0
                    </h1>
                    <h2
                      className="font-bold uppercase leading-none mb-4"
                      style={{
                        fontSize: 26,
                        letterSpacing: "-0.01em",
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "rgba(255,255,255,0.38)",
                      }}
                    >
                      Genesis
                    </h2>

                    {/* Divider */}
                    <div className="h-px bg-white/10 mb-5" />

                    {/* Description */}
                    <div
                      className="text-white/55 leading-relaxed mb-7"
                      style={{ fontSize: 12, lineHeight: 1.75, fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      <p className="mb-4">
                        In the inaugural volume of Air &amp; Steel Magazine, we take you to a pilgrimage through the formative milestones of the automotive timeline. Volume 1.0: Genesis is a curated journey through motoring history, from the singular moment of invention to the high-octane dawn of global motorsport.
                      </p>
                      <p className="mb-4">
                        We explore the machines that defied convention: the outliers, the icons, and the experiments that paved the way for the legendary. Beyond rubber and steel, we document the human impulse — the unrelenting passion for speed and the pursuit of excellence that transformed the early automobile into a cultural legacy.
                      </p>
                      <p>
                        Genesis is more than a tour of history, it is a testament to the vigor that took us from the first patent to the modern grid.
                      </p>
                    </div>

                    {/* CTAs — conditional on ownership */}
                    {(() => {
                      const hasDigital =
                        currentArticleId === "volume" ||
                        cartItems.some((i) => i.id === "vol-1-digital");

                      if (hasDigital) {
                        return (
                          <div className="flex flex-col gap-3 mb-4">
                            {/* Read Digital → Cockpit */}
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => { closeReader(); navigate("/cockpit"); }}
                              className="w-full py-4 flex items-center justify-center bg-white text-black uppercase tracking-widest"
                              style={{
                                fontSize: 11,
                                letterSpacing: "0.22em",
                                fontWeight: 600,
                                fontFamily: "'Space Grotesk', sans-serif",
                              }}
                            >
                              Read Digital
                            </motion.button>

                            {/* Acquire Print Edition */}
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => { setSelectedFormat("print"); setView("acquire"); }}
                              className="w-full py-4 flex items-center justify-center border border-white/25 text-white/70 uppercase tracking-widest"
                              style={{
                                fontSize: 11,
                                letterSpacing: "0.22em",
                                fontWeight: 600,
                                fontFamily: "'Space Grotesk', sans-serif",
                              }}
                            >
                              Acquire Print Edition
                            </motion.button>
                          </div>
                        );
                      }

                      return (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setSelectedFormat(null); setView("acquire"); }}
                          className="w-full py-4 flex items-center justify-center bg-white text-black uppercase tracking-widest mb-4"
                          style={{
                            fontSize: 11,
                            letterSpacing: "0.22em",
                            fontWeight: 600,
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          Acquire Volume 1.0
                        </motion.button>
                      );
                    })()}

                    {/* Back to preview */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setView("preview")}
                      className="w-full flex items-center justify-center gap-1.5 text-white/35 uppercase"
                      style={{ fontSize: 9, letterSpacing: "0.24em", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      ← Back to Preview
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {/* ── ACQUIRE VIEW ── */}
              {view === "acquire" && (
                <motion.div
                  key="acquire"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex flex-col reader-overlay-bg"
                >
                  {/* × close */}
                  <motion.button
                    onClick={closeReader}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="absolute top-12 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/8 border border-white/12 text-white/60 z-10"
                  >
                    <X size={13} strokeWidth={2} />
                  </motion.button>

                  {/* Header */}
                  <div className="shrink-0 px-5 pt-14 pb-5">
                    <div
                      className="text-[8px] text-white/40 uppercase tracking-[0.3em] mb-2"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                    >
                      Acquire
                    </div>
                    <h1
                      className="text-white font-bold leading-none mb-1"
                      style={{ fontSize: 28, fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Volume 1.0
                    </h1>
                    <div
                      className="text-white/30 uppercase"
                      style={{ fontSize: 8, letterSpacing: "0.28em", fontFamily: "'Inter', sans-serif" }}
                    >
                      Choose Your Format
                    </div>
                  </div>

                  {/* Format cards */}
                  <div className="shrink-0 px-4 flex gap-3">
                    {(() => {
                      const hasDigital =
                        currentArticleId === "volume" ||
                        cartItems.some((i) => i.id === "vol-1-digital");
                      return ([
                        {
                          key: "digital" as const,
                          delivery: "Instant Download",
                          price: "₹499",
                          name: "Digital Edition",
                          features: ["High-Resolution Format", "Any Device", "Ad-Free Experience", "Lifetime Access"],
                          priceVal: 499,
                        },
                        {
                          key: "print" as const,
                          delivery: "Pan-India Shipping",
                          price: "₹1,999",
                          name: "Print Edition",
                          features: ["120 GMS Matte Paper", "150+ Pages", "Limited Production", "Curation Accessories"],
                          priceVal: 1999,
                        },
                      ] as const).map((opt) => {
                        const selected = selectedFormat === opt.key;
                        const isOwned = opt.key === "digital" && hasDigital;
                        return (
                        <motion.button
                          key={opt.key}
                          whileTap={isOwned ? {} : { scale: 0.97 }}
                          onClick={() => !isOwned && setSelectedFormat(opt.key)}
                          className="flex-1 rounded-2xl p-4 text-left relative transition-colors duration-200"
                          style={{
                            background: isOwned ? "rgba(255,255,255,0.02)" : selected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                            border: isOwned ? "1.5px solid rgba(255,255,255,0.05)" : selected ? "1.5px solid rgba(255,255,255,0.9)" : "1.5px solid rgba(255,255,255,0.08)",
                            opacity: isOwned ? 0.55 : 1,
                            cursor: isOwned ? "default" : "pointer",
                          }}
                        >
                          {/* Owned badge */}
                          {isOwned && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5">
                              <Check size={8} strokeWidth={3} className="text-white/60" />
                              <span className="text-[7px] text-white/50 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Owned</span>
                            </div>
                          )}
                          {/* Checkmark */}
                          {selected && !isOwned && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                              <Check size={10} strokeWidth={3} className="text-black" />
                            </div>
                          )}

                          <div
                            className="text-white/40 uppercase mb-3"
                            style={{ fontSize: 7, letterSpacing: "0.2em", fontFamily: "'Inter', sans-serif" }}
                          >
                            {opt.delivery}
                          </div>
                          <div
                            className="text-white font-bold leading-none mb-0.5"
                            style={{ fontSize: 22, fontFamily: "'Space Grotesk', sans-serif" }}
                          >
                            {opt.price}
                          </div>
                          <div
                            className="text-white/80 mb-3"
                            style={{ fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
                          >
                            {opt.name}
                          </div>
                          <ul className="space-y-1.5">
                            {opt.features.map((f) => (
                              <li
                                key={f}
                                className="text-white/40 flex items-start gap-1.5"
                                style={{ fontSize: 9, fontFamily: "'Inter', sans-serif" }}
                              >
                                <span className="mt-px opacity-60">•</span>{f}
                              </li>
                            ))}
                          </ul>
                        </motion.button>
                      );
                    });
                    })()}
                  </div>

                  {/* CTA */}
                  <div className="shrink-0 px-4 mt-5 pb-10">
                    <motion.button
                      whileTap={{ scale: selectedFormat ? 0.98 : 1 }}
                      disabled={!selectedFormat}
                      onClick={() => {
                        if (!selectedFormat) return;
                        addToCart({
                          id: `vol-1-${selectedFormat}`,
                          title: "Genesis",
                          vol: "Vol 1.0",
                          format: selectedFormat === "digital" ? "Digital" : "Print",
                          price: selectedFormat === "digital" ? 499 : 1999,
                          img: coverImage,
                        });
                        closeReader();
                        navigate("/cart");
                      }}
                      className="w-full py-4 rounded-full flex items-center justify-center uppercase transition-all duration-200"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.22em",
                        fontWeight: 600,
                        fontFamily: "'Space Grotesk', sans-serif",
                        background: selectedFormat ? "#ffffff" : "rgba(255,255,255,0.06)",
                        color: selectedFormat ? "#000000" : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {selectedFormat
                        ? `Add ${selectedFormat === "digital" ? "Digital" : "Print"} Edition to Cart`
                        : "Confirm Format"}
                    </motion.button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
