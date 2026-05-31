import { motion } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { useReader } from "../context/ReaderContext";

const ALL_ARTICLES = [
  {
    id: "night-runners",
    location: "Tokyo",
    section: "Nightside",
    title: "Night Runners",
    subtitle: "Where the city sleeps and the machines wake.",
    img: "https://images.unsplash.com/photo-1598082630518-ad3583b480ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMGNpdHklMjBzdHJlZXQlMjBuZW9uJTIwcmFpbiUyMGRhcmt8ZW58MXx8fHwxNzc4MDcyMDAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "analogue",
    location: "Los Angeles",
    section: "Feature",
    title: "Analogue",
    subtitle: "Restoring pre-digital machines in a world saturated with screens.",
    img: "https://images.unsplash.com/photo-1594051164364-8753eac89b0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYW5hbG9nJTIwZmlsbSUyMGNhbWVyYSUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzgwNzIwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "the-silent-mile",
    location: "Geneva",
    section: "Cover Story",
    title: "The Silent Mile",
    subtitle: "A test track no map shows and few have seen.",
    img: "https://images.unsplash.com/photo-1699349578489-54436281e9e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBnYXJhZ2UlMjB3b3Jrc2hvcCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "carbon-ritual",
    location: "London",
    section: "Material",
    title: "Carbon Ritual",
    subtitle: "The obsessive craft behind hand-laid carbon fibre.",
    img: "https://images.unsplash.com/photo-1762522930348-070b98229e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwbWFnYXppbmUlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc4MDcyMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "architecture-of-silence",
    location: "Switzerland · Japan",
    section: "Cover Story",
    title: "The Architecture of Silence",
    subtitle: "Brutalist design principles reshaping the modern workshop.",
    img: "https://images.unsplash.com/photo-1557226217-bf0da2478e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBhcmNoaXRlY3R1cmUlMjBkYXJrJTIwY29uY3JldGUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzgwNzIwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

export function Articles() {
  const { openReader } = useReader();

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
        {/* Page header */}
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
              Free to Read
            </div>
            <div className="flex items-end justify-between">
              <h1
                className="text-[40px] text-white uppercase leading-[0.92] tracking-[-0.01em]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
              >
                Featured<br />Articles
              </h1>
              <span
                className="text-[10px] text-white/30 mb-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {ALL_ARTICLES.length} Articles
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Article list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 space-y-4"
        >
          {ALL_ARTICLES.map((article) => (
            <motion.div
              key={article.id}
              variants={itemVariants}
              className="rounded-2xl overflow-hidden cursor-pointer relative"
              style={{ aspectRatio: "16/9" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => openReader(article.id)}
            >
              <img
                src={article.img}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Section badge — top left */}
              <div className="absolute top-4 left-4">
                <span
                  className="text-[7px] uppercase tracking-[0.22em] border border-white/25 rounded-full px-2.5 py-1"
                  style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.6)" }}
                >
                  {article.section}
                </span>
              </div>

              {/* Text — bottom left */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div
                  className="text-[8px] uppercase tracking-[0.22em] mb-1.5"
                  style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.45)" }}
                >
                  {article.location}
                </div>
                <div
                  className="text-[18px] uppercase leading-tight tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#ffffff" }}
                >
                  {article.title}
                </div>
                <div
                  className="text-[11px] mt-1 leading-snug"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.45)" }}
                >
                  {article.subtitle}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </motion.div>
  );
}
