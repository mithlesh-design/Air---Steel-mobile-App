import { motion } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { useNavigate } from "react-router";
import { useReader } from "../context/ReaderContext";
import { ArrowRight } from "lucide-react";
import LATEST_ISSUE_IMAGE from "../../imports/image-2.png";

const NIGHT_RUNNERS_IMAGE =
  "https://images.unsplash.com/photo-1598082630518-ad3583b480ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMGNpdHklMjBzdHJlZXQlMjBuZW9uJTIwcmFpbiUyMGRhcmt8ZW58MXx8fHwxNzc4MDcyMDAyfDA&ixlib=rb-4.1.0&q=80&w=1080";

const ANALOGUE_IMAGE =
  "https://images.unsplash.com/photo-1594051164364-8753eac89b0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYW5hbG9nJTIwZmlsbSUyMGNhbWVyYSUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzgwNzIwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080";

const VOL03_IMAGE =
  "https://images.unsplash.com/photo-1762522930348-070b98229e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwbWFnYXppbmUlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const VOL04_IMAGE =
  "https://images.unsplash.com/photo-1699349578489-54436281e9e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBnYXJhZ2UlMjB3b3Jrc2hvcCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

export function Home() {
  const navigate = useNavigate();
  const { openReader } = useReader();
  const greeting = getGreeting();

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
        {/* ── 1. GREETING ── */}
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
              {greeting}
            </div>
            <h1
              className="text-[40px] text-white uppercase leading-[0.92] tracking-[-0.01em] mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Hello,<br />Alex.
            </h1>
            <p
              className="text-[11px] text-white/40 leading-[1.65] max-w-[260px]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              Your allocation is confirmed. The signal has been isolated from the noise. A private briefing on rare provenance awaits your review.
            </p>
          </motion.div>
        </motion.div>

        {/* ── 2. FEATURED — card + editorial text below ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 mb-12"
        >
          {/* Row label */}
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
            <span
              className="text-[9px] text-white/40 uppercase tracking-[0.24em]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              Latest Issue
            </span>
          </motion.div>

          {/* Cover image card */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl border-2 border-[#1E1E1E] overflow-hidden cursor-pointer mb-5"
            style={{ aspectRatio: "3/4" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => openReader("featured")}
          >
            <img
              src={LATEST_ISSUE_IMAGE}
              alt="Volume 1.0 Genesis"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>

          {/* Story text below card */}
          <motion.div variants={itemVariants}>
            <div
              className="flex items-center gap-2 text-[9px] text-brand-orange uppercase tracking-[0.24em] mb-3"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              <span className="text-white/20">—</span> Cover Story
            </div>
            <h2
              className="text-[38px] text-white uppercase leading-[0.92] tracking-[-0.01em] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Volume 1.0<br />Genesis
            </h2>
            <p
              className="text-[11px] text-white/45 leading-[1.65] mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              100 pages of innovative storytelling, curated from renowned as well as sometimes peripheral pioneers of automotive culture. From the culture of Homo sapiens to the never-directed depths of Tokyo's underscore. Substance is weight, permanence is space, and unified ends story.
            </p>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="mx-6 h-px bg-[#1A1A1A] mb-10" />

        {/* ── 3. FEATURED ARTICLES ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <motion.div variants={itemVariants} className="px-6 mb-5 flex justify-between items-center">
            <h2
              className="text-[18px] text-white uppercase leading-tight tracking-[-0.01em]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Featured Articles
            </h2>
            <motion.button
              onClick={() => navigate("/archives")}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center gap-1 text-[9px] text-brand-orange uppercase tracking-[0.22em]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              View All <ArrowRight size={9} />
            </motion.button>
          </motion.div>

          <div
            className="flex gap-3 overflow-x-auto pb-1 px-6"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {[
              { city: "Tokyo", title: "Night Runners", img: NIGHT_RUNNERS_IMAGE },
              { city: "Los Angeles", title: "Analogue", img: ANALOGUE_IMAGE },
              { city: "Geneva", title: "The Silent Mile", img: VOL04_IMAGE },
              { city: "London", title: "Carbon Ritual", img: VOL03_IMAGE },
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                className="min-w-[190px] rounded-2xl border-2 border-[#1E1E1E] overflow-hidden relative shrink-0 cursor-pointer"
                style={{ aspectRatio: "4/3" }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={() => openReader("featured")}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-55"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div
                    className="text-[8px] text-white/35 uppercase tracking-[0.22em] mb-1"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    {card.city}
                  </div>
                  <div
                    className="text-[13px] text-white uppercase leading-tight tracking-[0.01em]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    {card.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mx-6 h-px bg-[#1A1A1A] mb-10" />

        {/* ── 4. FEATURED ISSUE ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 mb-10"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-5">
            <h2
              className="text-[18px] text-white uppercase leading-tight tracking-[-0.01em]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Featured Issue
            </h2>
            <motion.button
              onClick={() => navigate("/archives")}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center gap-1 text-[9px] text-brand-orange uppercase tracking-[0.22em]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              Archives <ArrowRight size={9} />
            </motion.button>
          </motion.div>

          {/* Single featured issue — same full-width format as Latest Issue */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl border-2 border-[#1E1E1E] overflow-hidden cursor-pointer mb-5"
            style={{ aspectRatio: "3/4" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => openReader("featured")}
          >
            <img
              src={LATEST_ISSUE_IMAGE}
              alt="Volume 1.0 Genesis"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div
              className="flex items-center gap-2 text-[9px] text-brand-orange uppercase tracking-[0.24em] mb-3"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              <span className="text-white/20">—</span> Cover Story
            </div>
            <h2
              className="text-[38px] text-white uppercase leading-[0.92] tracking-[-0.01em] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Volume 1.0<br />Genesis
            </h2>
            <p
              className="text-[11px] text-white/45 leading-[1.65]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              The origin. Where steel meets vision and the first signal is sent into the world.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}