import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { useReader } from "../context/ReaderContext";
import { useLocation } from "react-router";

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
  const location = useLocation();
  const [highlightedArticle, setHighlightedArticle] = useState<string | null>(null);
  const articleRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const target = (location.state as { highlight?: string } | null)?.highlight;
    if (!target) return;
    const t1 = setTimeout(() => {
      articleRefs.current[target]?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedArticle(target);
    }, 300);
    const t2 = setTimeout(() => setHighlightedArticle(null), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [location.state]);

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
              ref={(el) => { articleRefs.current[article.id] = el; }}
              variants={itemVariants}
              className="rounded-2xl overflow-hidden cursor-pointer relative border-2"
              style={{ aspectRatio: "16/9" }}
              animate={{
                borderColor: highlightedArticle === article.id ? "rgba(255,255,255,0.85)" : "rgba(30,30,30,0)",
                boxShadow: highlightedArticle === article.id
                  ? "0 0 0 2px rgba(255,255,255,0.25), 0 0 28px 4px rgba(255,255,255,0.12)"
                  : "0 0 0 0px rgba(255,255,255,0)",
              }}
              transition={{ duration: 0.35 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openReader(article.id)}
            >
              <img
                src={article.img}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Section badge — top left */}
              <div className="absolute top-4 left-4 drop-shadow-md">
                <span
                  className="text-[7px] uppercase tracking-[0.22em] border border-[#FFFFFF]/30 rounded-full px-2.5 py-1 text-[#FFFFFF]/80"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {article.section}
                </span>
              </div>

              {/* Text — bottom left */}
              <div className="absolute bottom-0 left-0 right-0 p-4 drop-shadow-md">
                <div
                  className="text-[8px] uppercase tracking-[0.22em] mb-1.5 text-[#FFFFFF]/60"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {article.location}
                </div>
                <div
                  className="text-[18px] uppercase leading-tight tracking-tight text-[#FFFFFF]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                >
                  {article.title}
                </div>
                <div
                  className="text-[11px] mt-1 leading-snug text-[#FFFFFF]/60"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
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
