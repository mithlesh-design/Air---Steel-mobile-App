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
import genesisCurationImage from "../../../imports/G_Curation_Insights_01.372b9f4f.jpg";
import p1 from "../../../imports/Preview_1.png";
import p2 from "../../../imports/Preview_2.png";
import p3 from "../../../imports/Preview_3.png";
import p4 from "../../../imports/Preview_4.png";
import p5 from "../../../imports/Preview_5.png";
import { ARTICLES } from "../../data/articles";

type VolumeMeta = {
  title: string;
  subtitle: string;
  description: JSX.Element;
  img: string;
  curationImg?: string;
  cartIdPrefix: string;
  readerPath: string;
};

const VOLUME_META: Record<string, VolumeMeta> = {
  "1.0": {
    title: "Volume 1.0",
    subtitle: "Genesis",
    img: coverImage,
    curationImg: genesisCurationImage,
    cartIdPrefix: "vol-1",
    readerPath: "/pdf-reader",
    description: (
      <>
        <p className="mb-4">
          In the inaugural volume of Air &amp; Steel Magazine, we take you to a pilgrimage through the formative milestones of the automotive timeline. Volume 1.0: Genesis is a curated journey through motoring history, from the singular moment of invention to the high-octane dawn of global motorsport.
        </p>
        <p className="mb-4">
          We explore the machines that defied convention: the outliers, the icons, and the experiments that paved the way for the legendary. Beyond rubber and steel, we document the human impulse — the unrelenting passion for speed and the pursuit of excellence that transformed the early automobile into a cultural legacy.
        </p>
        <p>
          Genesis is more than a tour of history, it is a testament to the vigor that took us from the first patent to the modern grid.
        </p>
      </>
    ),
  },
  "04": {
    title: "Volume 04",
    subtitle: "Silence",
    img: "https://images.unsplash.com/photo-1699349578489-54436281e9e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBnYXJhZ2UlMjB3b3Jrc2hvcCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    cartIdPrefix: "vol-04",
    readerPath: "/reader",
    description: (
      <>
        <p className="mb-4">
          Silence is not the absence of sound — it is the presence of intention. Volume 04 examines the architects of stillness: the collectors, engineers, and designers who have made restraint their most radical statement.
        </p>
        <p className="mb-4">
          From climate-controlled vaults in Switzerland to minimalist Tokyo ateliers, we document the spaces where machines are not stored but enshrined. Here, the void amplifies the object.
        </p>
        <p>
          This is a volume for those who understand that the most powerful thing a machine can do is stand still.
        </p>
      </>
    ),
  },
  "03": {
    title: "Volume 03",
    subtitle: "Neon",
    img: "https://images.unsplash.com/photo-1762522930348-070b98229e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwbWFnYXppbmUlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    cartIdPrefix: "vol-03",
    readerPath: "/reader",
    description: (
      <>
        <p className="mb-4">
          When the city sleeps, a different culture surfaces. Volume 03: Neon is a portrait of the underground — the drivers, the builders, and the streets that only reveal themselves past midnight.
        </p>
        <p className="mb-4">
          We trace the neon-lit corridors of Tokyo, the underpasses of Los Angeles, and the rain-slicked expressways of Geneva, finding in each a subculture defined not by daylight ambition but by nocturnal ritual.
        </p>
        <p>
          Neon is about the machines that come alive in the dark, and the people who live to chase them.
        </p>
      </>
    ),
  },
  "02": {
    title: "Volume 02",
    subtitle: "Static",
    img: "https://images.unsplash.com/photo-1772877357487-ca7dc84cc04e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwYXJjaGl0ZWN0dXJhbCUyMG1vZGVybmlzdCUyMGJ1aWxkaW5nJTIwZmFjYWRlfGVufDF8fHx8MTc3ODA3MjAwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    cartIdPrefix: "vol-02",
    readerPath: "/reader",
    description: (
      <>
        <p className="mb-4">
          In an era of constant motion, Volume 02: Static is a meditation on the art of pause. We examine what happens when the world's most kinetic objects are asked to stand still — and what they reveal when they do.
        </p>
        <p className="mb-4">
          Featuring long-form portraiture of machines at rest, architectural studies of the garages that contain them, and essays from the craftspeople who care for them across decades.
        </p>
        <p>
          Static is for those who understand that stillness is not the opposite of speed — it is its other face.
        </p>
      </>
    ),
  },
  "01": {
    title: "Volume 01",
    subtitle: "Origin",
    img: "https://images.unsplash.com/photo-1776231659026-8c3943737502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcnNwb3J0JTIwcmFjaW5nJTIwZGFyayUyMHNwZWVkJTIwbW90aW9uJTIwYmx1cnxlbnwxfHx8fDE3NzgwNzIwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    cartIdPrefix: "vol-01",
    readerPath: "/reader",
    description: (
      <>
        <p className="mb-4">
          Before the icons, there were the originals. Volume 01: Origin traces the bloodlines of the machines that started it all — the first experiments, the forgotten prototypes, and the visionaries who believed that steel could move faster than thought.
        </p>
        <p className="mb-4">
          This is the volume that began the Air &amp; Steel lineage: raw, unrefined, and essential. A record of the moments before the world knew what it was building.
        </p>
        <p>
          Origin is where everything starts, and where everything returns.
        </p>
      </>
    ),
  },
};

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
  const { isReaderOpen, closeReader, currentArticleId, currentVolumeId, currentVolumeOwned, volumeInitialView } = useReader();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const articleData = currentArticleId ? ARTICLES[currentArticleId] ?? null : null;
  const activeImages = articleData ? ARTICLE_IMAGES : PREVIEW_IMAGES;
  const meta = VOLUME_META[currentVolumeId ?? "1.0"] ?? VOLUME_META["1.0"];
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
      setView(volumeInitialView);
      setSelectedFormat(null);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [isReaderOpen, volumeInitialView]);

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

    // Articles advance one image at a time — speed-swipe (multi-jump) is volume-only.
    if (!articleData && velocity > SPEED_SWIPE_VELOCITY && !speedSwipeActive.current) {
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

          {/* Pop-up card panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="absolute inset-x-3 top-12 bottom-6 z-50 flex flex-col reader-overlay-bg overflow-hidden rounded-[28px] border border-white/12 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]"
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
                  </div>

                  {/* × close */}
                  <motion.button
                    onClick={closeReader}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full media-control flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/15 text-white/70 z-10"
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

                    {/* × close button */}
                    <motion.button
                      onClick={closeReader}
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full media-control flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/15 text-white/70 z-10"
                    >
                      <X size={13} strokeWidth={2} />
                    </motion.button>
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
                  {/* × close button — pinned to the card while content scrolls */}
                  <motion.button
                    onClick={closeReader}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full media-control flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/15 text-white/70 z-20"
                  >
                    <X size={13} strokeWidth={2} />
                  </motion.button>

                  {/* Scrollable content — cover image scrolls together with the text */}
                  <div
                    ref={scrollRef}
                    className="absolute inset-0 overflow-y-auto pb-10"
                    style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
                  >
                    {/* Cover image (part of the scroll) */}
                    <div className="relative w-full" style={{ height: "42%" }}>
                      <img
                        src={meta.curationImg ?? meta.img}
                        alt={`${meta.title} ${meta.subtitle}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Text content */}
                    <div className="px-5 pt-6">
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
                      {meta.title}
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
                      {meta.subtitle}
                    </h2>

                    {/* Divider */}
                    <div className="h-px bg-white/10 mb-5" />

                    {/* Description */}
                    <div
                      className="text-white/55 leading-relaxed mb-7"
                      style={{ fontSize: 12, lineHeight: 1.75, fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      {meta.description}
                    </div>

                    {/* CTAs — conditional on ownership */}
                    {(() => {
                      const hasDigital =
                        currentVolumeOwned ||
                        cartItems.some((i) => i.id === `${meta.cartIdPrefix}-digital`);

                      if (hasDigital) {
                        return (
                          <div className="flex flex-col gap-3 mb-4">
                            {/* Read Digital → reader */}
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => { closeReader(); navigate(meta.readerPath); }}
                              className="w-full py-4 rounded-full flex items-center justify-center bg-white text-black uppercase tracking-widest"
                              style={{
                                fontSize: 11,
                                letterSpacing: "0.22em",
                                fontWeight: 600,
                                fontFamily: "'Space Grotesk', sans-serif",
                              }}
                            >
                              Read {meta.subtitle}
                            </motion.button>

                            {/* Acquire Print Edition */}
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => { setSelectedFormat("print"); setView("acquire"); }}
                              className="w-full py-4 rounded-full flex items-center justify-center border border-white/25 text-white/70 uppercase tracking-widest"
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
                          className="w-full py-4 rounded-full flex items-center justify-center bg-white text-black uppercase tracking-widest mb-4"
                          style={{
                            fontSize: 11,
                            letterSpacing: "0.22em",
                            fontWeight: 600,
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          Acquire {meta.title}
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
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/8 border border-white/12 text-white/60 z-10"
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
                      {meta.title}
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
                        currentVolumeOwned ||
                        cartItems.some((i) => i.id === `${meta.cartIdPrefix}-digital`);
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
                          id: `${meta.cartIdPrefix}-${selectedFormat}`,
                          title: meta.subtitle,
                          vol: meta.title,
                          format: selectedFormat === "digital" ? "Digital" : "Print",
                          price: selectedFormat === "digital" ? 499 : 1999,
                          img: meta.img,
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
