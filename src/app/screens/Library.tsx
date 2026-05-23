import { motion } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { ArrowRight, Bookmark } from "lucide-react";
import { useNavigate } from "react-router";
import { useReader } from "../context/ReaderContext";

const VOL04_IMAGE =
  "https://images.unsplash.com/photo-1699349578489-54436281e9e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBnYXJhZ2UlMjB3b3Jrc2hvcCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

const VOL03_IMAGE =
  "https://images.unsplash.com/photo-1762522930348-070b98229e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwbWFnYXppbmUlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080";

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

export function Library() {
  const navigate = useNavigate();
  const { openReader } = useReader();

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
              className="text-[9px] text-white/30 uppercase tracking-[0.28em] mb-3"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Personal Vault
            </div>
            <h1
              className="text-[40px] text-white uppercase leading-[0.92] tracking-[-0.01em] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Library
            </h1>
            <div
              className="text-[9px] text-white/30 uppercase tracking-[0.24em]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Member: Alex S.
            </div>
          </motion.div>
        </motion.div>

        {/* Digital Collection */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <motion.div variants={itemVariants} className="px-6 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            <span
              className="text-[11px] text-white uppercase tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Digital Collection
            </span>
            <span
              className="text-[8px] text-white/25 ml-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              2 Volumes
            </span>
          </motion.div>

          <div
            className="flex gap-4 overflow-x-auto pb-2 px-6"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {[
              { vol: "04", title: "Silence", img: VOL04_IMAGE, progress: 68 },
              { vol: "03", title: "Neon", img: VOL03_IMAGE, progress: 32 },
            ].map((item, i) => (
              <motion.div
                key={item.vol}
                variants={itemVariants}
                className="min-w-[150px] space-y-3 shrink-0 cursor-pointer"
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={() => openReader("featured")}
              >
                <div
                  className="rounded-2xl border-2 border-[#2A2A2A] bg-[#141414] relative overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={item.img}
                    alt={`Vol ${item.vol}`}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Read Now overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                      <span className="text-[8px] text-white uppercase tracking-widest">
                        Read Now
                      </span>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-[7px] text-white/40 uppercase tracking-widest mb-0.5">
                      Vol 0{item.vol}
                    </div>
                    <div className="text-[9px] font-bold text-white uppercase tracking-wider">
                      {item.title}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-0.5 bg-white/10 rounded-full">
                      <div
                        className="h-full bg-brand-orange rounded-full transition-all duration-700"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="text-[6px] text-white/30 uppercase tracking-widest mt-1">
                      {item.progress}% read
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add more placeholder */}
            <motion.div
              variants={itemVariants}
              className="min-w-[150px] shrink-0"
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => navigate("/archives")}
            >
              <div
                className="rounded-2xl border-2 border-dashed border-[#2A2A2A] bg-[#141414]/50 flex flex-col items-center justify-center cursor-pointer"
                style={{ aspectRatio: "3/4" }}
              >
                <div className="text-brand-orange/40 text-2xl mb-2">+</div>
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
                className="rounded-2xl border-2 border-[#2A2A2A] bg-[#141414] overflow-hidden cursor-pointer"
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={() => openReader("featured")}
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-12 h-14 rounded-xl overflow-hidden shrink-0 relative">
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
                      <div className="text-[11px] font-bold text-white uppercase tracking-wider truncate group-hover:text-white/70 transition-colors duration-300">
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
        </motion.div>

        {/* Physical Shelf */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 mb-8"
        >
          <motion.div variants={itemVariants} className="mb-4 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span
              className="text-[11px] text-white uppercase tracking-widest"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Physical Shelf
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex gap-3 mb-4">
              {[
                { vol: "04", img: VOL04_IMAGE },
                { vol: "03", img: VOL03_IMAGE },
              ].map((item) => (
                <div
                  key={item.vol}
                  className="flex-1 aspect-square rounded-2xl border-2 border-[#2A2A2A] bg-[#141414] overflow-hidden relative"
                >
                  <img
                    src={item.img}
                    alt={`Vol ${item.vol}`}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      Vol 0{item.vol}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex-1 aspect-square rounded-2xl border-2 border-dashed border-[#2A2A2A] bg-[#141414]/40 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white/20 text-xl mb-1">+</div>
                  <div className="text-[7px] text-white/20 uppercase tracking-wider">Vol 02</div>
                </div>
              </div>
            </div>

            <div className="text-center text-[8px] text-white/20 uppercase tracking-widest mb-4">
              Complete your collection
            </div>

            <motion.button
              onClick={() => navigate("/archives")}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="w-full text-[9px] uppercase tracking-widest border-2 border-[#2A2A2A] rounded-full py-4 text-white/50 flex items-center justify-center gap-2"
            >
              Visit Archives <ArrowRight size={10} />
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}