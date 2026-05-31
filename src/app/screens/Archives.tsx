import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { ChevronDown, ShoppingCart, Eye } from "lucide-react";
import { useReader } from "../context/ReaderContext";
import { useNavigate, useLocation } from "react-router";
import GENESIS_IMAGE from "../../imports/image-2.png";

const VOL04_IMAGE =
  "https://images.unsplash.com/photo-1699349578489-54436281e9e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBnYXJhZ2UlMjB3b3Jrc2hvcCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const VOL03_IMAGE =
  "https://images.unsplash.com/photo-1762522930348-070b98229e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwbWFnYXppbmUlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const VOL02_IMAGE =
  "https://images.unsplash.com/photo-1772877357487-ca7dc84cc04e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwYXJjaGl0ZWN0dXJhbCUyMG1vZGVybmlzdCUyMGJ1aWxkaW5nJTIwZmFjYWRlfGVufDF8fHx8MTc3ODA3MjAwNnww&ixlib=rb-4.1.0&q=80&w=1080";

const VOL01_IMAGE =
  "https://images.unsplash.com/photo-1776231659026-8c3943737502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcnNwb3J0JTIwcmFjaW5nJTIwZGFyayUyMHNwZWVkJTIwbW90aW9uJTIwYmx1cnxlbnwxfHx8fDE3NzgwNzIwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080";

type Volume = {
  num: string;
  title: string;
  status: string;
  owned: boolean;
  img: string;
};

type Generation = {
  id: string;
  label: string;
  subtitle: string;
  volumes: Volume[];
};

const GENERATIONS: Generation[] = [
  {
    id: "gen1",
    label: "Generation 1",
    subtitle: "",
    volumes: [
      { num: "1.0", title: "Genesis", status: "Digital & Print", owned: true, img: GENESIS_IMAGE },
      { num: "04", title: "Silence", status: "Digital & Print", owned: true, img: VOL04_IMAGE },
      { num: "03", title: "Neon", status: "Digital & Print", owned: true, img: VOL03_IMAGE },
      { num: "02", title: "Static", status: "Available", owned: false, img: VOL02_IMAGE },
      { num: "01", title: "Origin", status: "Available", owned: false, img: VOL01_IMAGE },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
};

export function Archives() {
  const { openReader } = useReader();
  const navigate = useNavigate();
  const location = useLocation();
  const [openGenerations, setOpenGenerations] = useState<Set<string>>(new Set(["gen1"]));
  const [highlightedVol, setHighlightedVol] = useState<string | null>(null);
  const volRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const target = (location.state as { highlight?: string } | null)?.highlight;
    if (!target) return;
    // Ensure the generation containing this volume is expanded
    setOpenGenerations((prev) => new Set([...prev, "gen1"]));
    // Short delay so the accordion animation settles before scrolling
    const t1 = setTimeout(() => {
      volRefs.current[target]?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedVol(target);
    }, 350);
    const t2 = setTimeout(() => setHighlightedVol(null), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [location.state]);

  const toggleGeneration = (id: string) => {
    setOpenGenerations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col min-h-0"
    >
      <TopBar showBack />

      <main
        className="flex-1 overflow-y-auto pb-32"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {/* ── Page header ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 pt-1 pb-8"
        >
          <motion.div variants={itemVariants}>
            <h1
              className="text-[40px] text-white uppercase leading-[0.92] tracking-[-0.01em]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Archives
            </h1>
          </motion.div>
        </motion.div>

        {/* ── Latest Issue hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 mb-10"
        >
          <div
            className="text-[9px] text-white/30 uppercase tracking-[0.24em] mb-4"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
          >
            Latest Issue
          </div>

          <motion.div
            className="relative rounded-2xl border-2 border-[#1E1E1E] overflow-hidden cursor-pointer mb-5"
            style={{ aspectRatio: "3/4" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => openReader("featured")}
          >
            <img
              src={GENESIS_IMAGE}
              alt="Volume 1.0 Genesis"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>

          <h2
            className="text-[32px] text-white uppercase leading-[0.92] tracking-[-0.01em] mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
          >
            Volume 1.0<br />Genesis
          </h2>
        </motion.div>

        <div className="mx-6 h-px bg-[#1A1A1A] mb-10" />

        {/* ── Air & Steel Archives — Generations ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <h2
              className="text-[18px] text-white uppercase leading-tight tracking-[-0.01em]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Air &amp; Steel Archives
            </h2>
            <div
              className="text-[9px] text-white/30 uppercase tracking-[0.24em] mt-1"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              All Editions
            </div>
          </motion.div>

          <div className="space-y-3 pb-4">
            {GENERATIONS.map((gen) => {
              const isOpen = openGenerations.has(gen.id);
              return (
                <motion.div key={gen.id} variants={itemVariants}>
                  {/* Generation header */}
                  <motion.button
                    onClick={() => toggleGeneration(gen.id)}
                    whileTap={{ opacity: 0.7 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="w-full flex items-center justify-between py-3 mb-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-1 h-1 rounded-full bg-brand-orange" />
                      <span
                        className="text-[10px] text-white/50 uppercase tracking-[0.28em]"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        {gen.label}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    >
                      <ChevronDown size={12} className="text-white/30" />
                    </motion.div>
                  </motion.button>

                  {/* Volume list */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 28 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pb-1">
                          {gen.volumes.map((vol) => (
                            <motion.div
                              key={vol.num}
                              ref={(el) => { volRefs.current[vol.num] = el; }}
                              className="relative rounded-2xl border-2 bg-[#141414] overflow-hidden cursor-pointer"
                              animate={{
                                borderColor: highlightedVol === vol.num ? "rgba(255,255,255,0.85)" : "rgba(30,30,30,1)",
                                boxShadow: highlightedVol === vol.num
                                  ? "0 0 0 2px rgba(255,255,255,0.25), 0 0 28px 4px rgba(255,255,255,0.12)"
                                  : "0 0 0 0px rgba(255,255,255,0)",
                              }}
                              transition={{ duration: 0.35 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                vol.owned ? navigate(vol.num === "1.0" ? "/pdf-reader" : "/reader") : openReader("featured")
                              }
                            >
                              <div className="flex gap-4 p-4">
                                {/* Thumbnail */}
                                <div className="w-14 h-[72px] rounded-xl overflow-hidden shrink-0 relative">
                                  <img
                                    src={vol.img}
                                    alt={`Vol ${vol.num}`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <div
                                    className="text-[8px] text-white/30 uppercase tracking-[0.22em] mb-1"
                                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                                  >
                                    Vol {vol.num}
                                  </div>
                                  <div
                                    className="text-[15px] text-white uppercase leading-tight"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                                  >
                                    {vol.title}
                                  </div>
                                </div>

                                {/* Volume decoration & Icons */}
                                <div className="flex flex-col items-end justify-between ml-2">
                                  <div
                                    className="text-[36px] text-white/6 leading-none tracking-tighter"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                                  >
                                    {vol.num}
                                  </div>
                                  <div className="flex items-center gap-3 mt-auto pt-2">
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openReader("featured");
                                      }}
                                      className="text-white/30 hover:text-white transition-colors"
                                    >
                                      <Eye size={14} />
                                    </motion.button>
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate("/cart");
                                      }}
                                      className="text-white/30 hover:text-brand-orange transition-colors"
                                    >
                                      <ShoppingCart size={14} />
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
