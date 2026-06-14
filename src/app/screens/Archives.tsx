import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { ChevronDown, Plus, Check, Mail, ArrowRight } from "lucide-react";
import { useReader } from "../context/ReaderContext";
import { useCart } from "../context/CartContext";
import { isVolumeOwned } from "../data/ownership";
import { useLocation } from "react-router";
import GENESIS_IMAGE from "../../imports/image-2.png";
import COMING_SOON_IMAGE from "../../imports/archives_garage_collection.4955d91b.jpg";

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
      { num: "1.0", title: "Genesis", status: "Digital & Print", img: GENESIS_IMAGE },
      { num: "04", title: "Silence", status: "Digital & Print", img: VOL04_IMAGE },
      { num: "03", title: "Neon", status: "Digital & Print", img: VOL03_IMAGE },
      { num: "02", title: "Static", status: "Available", img: VOL02_IMAGE },
      { num: "01", title: "Origin", status: "Available", img: VOL01_IMAGE },
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
  const { openVolume } = useReader();
  const { cartItems } = useCart();
  const location = useLocation();
  const [openGenerations, setOpenGenerations] = useState<Set<string>>(new Set(["gen1"]));
  const [highlightedVol, setHighlightedVol] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);
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
            onClick={() => openVolume("1.0", isVolumeOwned("1.0"))}
          >
            <img
              src={GENESIS_IMAGE}
              alt="Volume 1.0 Genesis"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>

          <h2
            className="text-[32px] text-white uppercase leading-[0.92] tracking-[-0.01em] mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
          >
            Volume 1.0<br />Genesis
          </h2>
        </motion.div>

        <div className="mx-6 h-px bg-[#1A1A1A] mb-10" />

        {/* ── Coming Soon ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 mb-10"
        >
          <div
            className="relative rounded-2xl border-2 border-[#1E1E1E] overflow-hidden"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src={COMING_SOON_IMAGE}
              alt="Air & Steel garage — next volume teaser"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Legibility: bottom-weighted gradient + centre vignette for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/55" />
            <div className="absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_25%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

            {/* Content — bottom-anchored editorial block */}
            <div className="relative h-full w-full flex flex-col justify-end px-6 pt-10 pb-7">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                <span
                  className="text-[9px] text-white/55 uppercase tracking-[0.3em]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  Next Dispatch · Vol 1.1
                </span>
              </div>

              {/* Heading */}
              <h2
                className="text-[40px] text-white leading-[0.88] tracking-[-0.02em] mb-3"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  textShadow: "0 2px 24px rgba(0,0,0,0.55)",
                }}
              >
                Coming<br />Soon
              </h2>

              {/* Accent rule */}
              <div className="w-10 h-px bg-brand-orange/70 mb-4" />

              {/* Teaser + exclusivity */}
              <p
                className="text-[12px] text-white/65 leading-[1.6] mb-1.5 max-w-[280px]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                The next chapter in the Air &amp; Steel lineage.
              </p>
              <p
                className="text-[9px] text-white/45 uppercase tracking-[0.22em] mb-5"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                Priority access for subscribers
              </p>

              {/* Form / success — crossfade */}
              <AnimatePresence mode="wait" initial={false}>
                {notified ? (
                  <motion.div
                    key="notified"
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex items-center gap-2.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md px-5 min-h-[48px]"
                  >
                    <span className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span
                      className="text-[11px] text-white/85 uppercase tracking-[0.16em]"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      You're on the list
                    </span>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (notifyEmail.trim()) setNotified(true);
                    }}
                    className="flex flex-col gap-2.5"
                  >
                    {/* Email input with leading icon */}
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"
                      />
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        aria-label="Email address"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full min-h-[48px] rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 pl-11 pr-5 text-[13px] text-white placeholder:text-white/40 outline-none transition-colors duration-200 focus:border-brand-orange/60 focus:bg-white/[0.12]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>

                    {/* Notify Me */}
                    <motion.button
                      type="submit"
                      disabled={!notifyEmail.trim()}
                      whileTap={notifyEmail.trim() ? { scale: 0.98 } : {}}
                      aria-label="Notify me when Volume 1.1 launches"
                      className="w-full min-h-[48px] rounded-full flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.22em] transition-all duration-200 disabled:opacity-40"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        background: "#ffffff",
                        color: "#0A0A0A",
                      }}
                    >
                      Notify Me
                      <ArrowRight size={13} strokeWidth={2.2} />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
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
                        transition={{
                          height: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
                          opacity: { duration: 0.4, ease: "easeInOut" },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pb-1">
                          {gen.volumes.map((vol) => {
                            // Cart ids follow the ReaderOverlay VOLUME_META prefixes.
                            const cartPrefix = vol.num === "1.0" ? "vol-1" : `vol-${vol.num}`;
                            const inCart = cartItems.some(
                              (i) => i.id === `${cartPrefix}-digital` || i.id === `${cartPrefix}-print`,
                            );
                            return (
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
                              onClick={() => openVolume(vol.num, isVolumeOwned(vol.num))}
                            >
                              <div className="flex gap-4 p-4">
                                {/* Thumbnail */}
                                <div className="w-14 h-[72px] rounded-xl overflow-hidden shrink-0 relative">
                                  <img
                                    src={vol.img}
                                    alt={`Vol ${vol.num}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
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
                                  <div className="flex items-center mt-auto pt-2">
                                    {inCart ? (
                                      <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center bg-brand-orange/15 text-brand-orange"
                                        aria-label="Added to cart"
                                      >
                                        <Check size={14} strokeWidth={2.5} />
                                      </div>
                                    ) : (
                                      <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openVolume(vol.num, isVolumeOwned(vol.num), "acquire");
                                        }}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                        aria-label="Add to cart"
                                      >
                                        <Plus size={18} strokeWidth={2} />
                                      </motion.button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                            );
                          })}
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
