import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { useReader } from "../context/ReaderContext";
import { useNavigate } from "react-router";
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
    subtitle: "Vol 1.0 – 1.5",
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
  const [openGenerations, setOpenGenerations] = useState<Set<string>>(new Set(["gen1"]));

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
      <TopBar />

      <main
        className="flex-1 overflow-y-auto pb-32"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {/* ── Page header ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 pt-1 pb-10"
        >
          <motion.div variants={itemVariants}>
            <div
              className="text-[9px] text-white/30 uppercase tracking-[0.28em] mb-3"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Complete Collection
            </div>
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
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 border-[#1E1E1E] bg-[#141414] mb-2"
                  >
                    <div className="text-left">
                      <div
                        className="text-[12px] text-white uppercase tracking-wider"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                      >
                        {gen.label}
                      </div>
                      <div
                        className="text-[8px] text-white/30 uppercase tracking-[0.22em] mt-0.5"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {gen.subtitle}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    >
                      <ChevronDown size={14} className="text-white/40" />
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
                              className="relative rounded-2xl border-2 border-[#1E1E1E] bg-[#141414] overflow-hidden cursor-pointer"
                              whileTap={{ scale: 0.97 }}
                              transition={{ type: "spring", stiffness: 400, damping: 28 }}
                              onClick={() =>
                                vol.owned ? navigate("/reader") : openReader("featured")
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
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                  <div>
                                    <div
                                      className="text-[8px] text-white/30 uppercase tracking-[0.22em] mb-1"
                                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                                    >
                                      Vol {vol.num}
                                    </div>
                                    <div
                                      className="text-[14px] text-white uppercase leading-tight"
                                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                                    >
                                      {vol.title}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div
                                      className={`text-[7px] uppercase tracking-wider border rounded-full px-2.5 py-1 ${
                                        vol.owned
                                          ? "border-white/20 text-white/50"
                                          : "border-white/10 text-white/25"
                                      }`}
                                      style={{ fontFamily: "'Inter', sans-serif" }}
                                    >
                                      {vol.status}
                                    </div>
                                    {!vol.owned && (
                                      <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate("/cart");
                                        }}
                                        className="flex items-center gap-1 text-[7px] text-brand-orange uppercase tracking-wider border border-brand-orange/30 rounded-full px-2 py-1"
                                      >
                                        <ShoppingBag size={8} /> Buy
                                      </motion.button>
                                    )}
                                  </div>
                                </div>

                                {/* Volume decoration */}
                                <div className="flex items-center">
                                  <div
                                    className="text-[32px] text-white/6 leading-none tracking-tighter"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                                  >
                                    {vol.num}
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
