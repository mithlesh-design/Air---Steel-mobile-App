import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { ArrowRight, Bookmark, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router";
import { useReader } from "../context/ReaderContext";

const VOL04_IMAGE =
  "https://images.unsplash.com/photo-1699349578489-54436281e9e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBnYXJhZ2UlMjB3b3Jrc2hvcCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const VOL03_IMAGE =
  "https://images.unsplash.com/photo-1762522930348-070b98229e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwbWFnYXppbmUlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const VOL02_IMAGE =
  "https://images.unsplash.com/photo-1772877357487-ca7dc84cc04e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwYXJjaGl0ZWN0dXJhbCUyMG1vZGVybmlzdCUyMGJ1aWxkaW5nJTIwZmFjYWRlfGVufDF8fHx8MTc3ODA3MjAwNnww&ixlib=rb-4.1.0&q=80&w=1080";

const VOL01_IMAGE =
  "https://images.unsplash.com/photo-1776231659026-8c3943737502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcnNwb3J0JTIwcmFjaW5nJTIwZGFyayUyMHNwZWVkJTIwbW90aW9uJTIwYmx1cnxlbnwxfHx8fDE3NzgwNzIwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080";

import GENESIS_IMAGE from "../../imports/image-2.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
};

const OWNED_VOLUMES = [
  { label: "Vol 1.0", pct: 100, img: GENESIS_IMAGE },
  { label: "Vol 04", pct: 68, img: VOL04_IMAGE },
  { label: "Vol 03", pct: 32, img: VOL03_IMAGE },
];

const DIGITAL_OWNED = 3;
const DIGITAL_TOTAL = 5;

function getStoredReadingTime(): string {
  try {
    const secs = parseInt(localStorage.getItem("air-steel-reading-time") || "9240", 10);
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${String(h).padStart(3, "0")}h ${String(m).padStart(2, "0")}m`;
  } catch {
    return "002h 34m";
  }
}

const bookmarks = [
  {
    vol: "Vol 04 / Page 12",
    title: "The Aesthetics of Void",
    progress: 68,
    img: VOL04_IMAGE,
  },
  {
    vol: "Vol 03 / Page 45",
    title: "Neon Tokyo Nights",
    progress: 32,
    img: VOL03_IMAGE,
  },
];

// Collection grid — 2 cols × 5 rows = 10 slots
const COLLECTION_SLOTS = [
  { num: "1.0", title: "Genesis", owned: true, img: GENESIS_IMAGE },
  { num: "04", title: "Silence", owned: true, img: VOL04_IMAGE },
  { num: "03", title: "Neon", owned: true, img: VOL03_IMAGE },
  { num: "02", title: "Static", owned: false, img: VOL02_IMAGE },
  { num: "01", title: "Origin", owned: false, img: VOL01_IMAGE },
  { num: "", title: "", owned: false, img: "" },
  { num: "", title: "", owned: false, img: "" },
  { num: "", title: "", owned: false, img: "" },
  { num: "", title: "", owned: false, img: "" },
  { num: "", title: "", owned: false, img: "" },
];

export function Cockpit() {
  const navigate = useNavigate();
  const { openReader } = useReader();
  const [activeVolIdx, setActiveVolIdx] = useState(0);
  const [readingTime] = useState(getStoredReadingTime);

  // Rotate Box A every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVolIdx((i) => (i + 1) % OWNED_VOLUMES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const isCollectionComplete = DIGITAL_OWNED === DIGITAL_TOTAL;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col min-h-0"
    >
      <TopBar />

      <main
        className="flex-1 overflow-y-auto pb-32"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 pt-2 pb-8"
        >
          <motion.div variants={itemVariants}>
            <div
              className="text-[9px] text-white/30 uppercase tracking-[0.28em] mb-3 flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              <LayoutDashboard size={9} className="text-white/30" />
              Personal Vault
            </div>
            <h1
              className="text-[40px] text-white uppercase leading-[0.92] tracking-[-0.01em] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Cockpit
            </h1>
            <div
              className="text-[9px] text-white/30 uppercase tracking-[0.24em]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Member: Alex S.
            </div>
          </motion.div>
        </motion.div>

        {/* Reading Activity Dashboard — Boxes A / B / C */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-[#141414] border-2 border-[#2A2A2A] rounded-2xl p-5"
          >
            <div className="flex items-center mb-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Reading Activity</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* Box A — rotating volume completion */}
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeVolIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="text-[20px] font-bold text-white tracking-tight mb-0.5">
                      {OWNED_VOLUMES[activeVolIdx].pct}%
                    </div>
                    <div className="text-[7px] text-white/30 uppercase tracking-widest">
                      {OWNED_VOLUMES[activeVolIdx].label}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Box B — total reading time */}
              <div className="text-center">
                <div className="text-[16px] font-bold text-white tracking-tight mb-0.5 leading-tight">
                  {readingTime}
                </div>
                <div className="text-[7px] text-white/30 uppercase tracking-widest">
                  Read
                </div>
              </div>

              {/* Box C — digital collection x/y */}
              <div className="text-center">
                <div
                  className={`text-[20px] font-bold tracking-tight mb-0.5 ${
                    isCollectionComplete ? "text-[#C9A84C]" : "text-white"
                  }`}
                >
                  {DIGITAL_OWNED}/{DIGITAL_TOTAL}
                </div>
                <div className="text-[7px] text-white/30 uppercase tracking-widest">
                  Digital
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Digital Library */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <motion.div variants={itemVariants} className="px-6 mb-5 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            <span
              className="text-[11px] text-white uppercase tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Digital Library
            </span>
            <span
              className="text-[8px] text-white/25 ml-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {OWNED_VOLUMES.length} Volumes
            </span>
          </motion.div>

          <div
            className="flex gap-5 overflow-x-auto pb-3 px-6"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {OWNED_VOLUMES.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="min-w-[185px] space-y-3 shrink-0 cursor-pointer"
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={() => navigate("/reader")}
              >
                <div
                  className="rounded-2xl border-2 border-[#2A2A2A] bg-[#141414] relative overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={item.img}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-[7px] text-white/40 uppercase tracking-widest mb-0.5">
                      {item.label}
                    </div>
                    {/* Progress bar */}
                    <div className="h-0.5 bg-white/10 rounded-full">
                      <div
                        className="h-full bg-brand-orange rounded-full transition-all duration-700"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <div className="text-[6px] text-white/30 uppercase tracking-widest mt-1.5">
                      {item.pct}% read
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add more placeholder */}
            <motion.div
              variants={itemVariants}
              className="min-w-[185px] shrink-0"
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => navigate("/archives")}
            >
              <div
                className="rounded-2xl border-2 border-dashed border-[#2A2A2A] bg-[#141414]/50 flex flex-col items-center justify-center cursor-pointer"
                style={{ aspectRatio: "3/4" }}
              >
                <div className="text-brand-orange/40 text-3xl mb-2">+</div>
                <div className="text-[8px] text-white/25 uppercase tracking-widest text-center px-3">
                  Add Volume
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bookmarks */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 mb-10"
        >
          <motion.div variants={itemVariants} className="mb-4 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span
              className="text-[11px] text-white uppercase tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Bookmarks
            </span>
            <span
              className="text-[8px] text-white/25 ml-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              2 Saved
            </span>
          </motion.div>

          <div className="space-y-3">
            {bookmarks.map((bm, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-[#2A2A2A] bg-[#141414] overflow-hidden cursor-pointer"
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={() => openReader("featured")}
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-16 rounded-xl overflow-hidden shrink-0 relative">
                    <img
                      src={bm.img}
                      alt={bm.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="text-[7px] text-white/35 uppercase tracking-widest mb-1">
                        {bm.vol}
                      </div>
                      <div className="text-[11px] font-bold text-white uppercase tracking-wider truncate">
                        {bm.title}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-0.5 bg-white/8 rounded-full">
                        <div
                          className="h-full bg-brand-orange/60 rounded-full"
                          style={{ width: `${bm.progress}%` }}
                        />
                      </div>
                      <span className="text-[7px] text-white/30">{bm.progress}%</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Bookmark size={12} className="text-white fill-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-3">
            <motion.button
              onClick={() => navigate("/cockpit")}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="w-full text-[9px] uppercase tracking-widest border border-[#2A2A2A] rounded-full py-3 text-white/40 flex items-center justify-center gap-2"
            >
              See All <ArrowRight size={9} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Collection Grid (2×5) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 mb-8"
        >
          <motion.div variants={itemVariants} className="mb-5 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span
              className="text-[11px] text-white uppercase tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Collection
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div
              className="text-[8px] text-white/25 uppercase tracking-[0.22em] mb-3"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Generation 1 &nbsp;·&nbsp; Vol 1.0 – 1.5
            </div>

            <div className="grid grid-cols-2 gap-2">
              {COLLECTION_SLOTS.map((slot, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border overflow-hidden relative cursor-pointer ${
                    slot.owned
                      ? "border-[#2A2A2A] bg-[#141414]"
                      : "border-dashed border-[#222] bg-[#141414]/40"
                  }`}
                  style={{ aspectRatio: "3/4" }}
                  onClick={() => slot.owned ? navigate("/reader") : undefined}
                >
                  {slot.img ? (
                    <>
                      <img
                        src={slot.img}
                        alt={slot.title}
                        className={`absolute inset-0 w-full h-full object-cover ${
                          slot.owned ? "opacity-70" : "opacity-20"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="text-[7px] text-white/40 uppercase tracking-widest mb-0.5">
                          Vol {slot.num}
                        </div>
                        <div
                          className="text-[10px] text-white uppercase leading-tight"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                        >
                          {slot.title}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/10 text-xl">—</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
