import { motion } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router";

const VOL04_IMAGE =
  "https://images.unsplash.com/photo-1699349578489-54436281e9e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBnYXJhZ2UlMjB3b3Jrc2hvcCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";
const VOL03_IMAGE =
  "https://images.unsplash.com/photo-1762522930348-070b98229e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwbWFnYXppbmUlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const BOOKMARKS = [
  { vol: "Vol 04 / Page 12", title: "The Aesthetics of Void",  progress: 68, img: VOL04_IMAGE },
  { vol: "Vol 03 / Page 45", title: "Neon Tokyo Nights",       progress: 32, img: VOL03_IMAGE },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

export function Bookmarks() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col min-h-0"
    >
      <TopBar showBack />

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
              className="text-[9px] text-white/30 uppercase tracking-[0.28em] mb-3"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Cockpit
            </div>
            <div className="flex items-end justify-between">
              <h1
                className="text-[40px] text-white uppercase leading-[0.92] tracking-[-0.01em]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
              >
                Bookmarks
              </h1>
              <span
                className="text-[10px] text-white/30 mb-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {BOOKMARKS.length} Saved
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bookmark cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 space-y-3"
        >
          {BOOKMARKS.map((bm, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="rounded-2xl border border-[#2A2A2A] bg-[#141414] overflow-hidden cursor-pointer"
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => navigate("/reader")}
            >
              <div className="flex gap-4 p-4">
                {/* Thumbnail */}
                <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 relative">
                  <img
                    src={bm.img}
                    alt={bm.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div
                      className="text-[8px] text-white/35 uppercase tracking-widest mb-1.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {bm.vol}
                    </div>
                    <div
                      className="text-[13px] font-bold text-white uppercase leading-tight"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {bm.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-0.5 bg-white/8 rounded-full">
                      <div
                        className="h-full bg-white/50 rounded-full"
                        style={{ width: `${bm.progress}%` }}
                      />
                    </div>
                    <span
                      className="text-[8px] text-white/30 tabular-nums"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {bm.progress}%
                    </span>
                  </div>
                </div>

                {/* Bookmark icon */}
                <div className="flex items-center pl-1">
                  <Bookmark size={14} className="text-white fill-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {BOOKMARKS.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-6 flex flex-col items-center text-center py-20"
          >
            <div className="w-14 h-14 rounded-full bg-[#141414] border-2 border-[#2A2A2A] flex items-center justify-center mb-4">
              <Bookmark size={18} className="text-white/20" />
            </div>
            <div
              className="text-[13px] text-white/50 uppercase tracking-wider mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              No bookmarks yet
            </div>
            <p
              className="text-[11px] text-white/25"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Articles you bookmark while reading will appear here.
            </p>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
