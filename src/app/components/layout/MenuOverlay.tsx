import { motion, AnimatePresence } from "motion/react";
import { X, Search, LogOut, Home, Archive, LayoutDashboard, User, ArrowRight, Bookmark, BookOpen } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { useReader } from "../../context/ReaderContext";
import { useNavigate, useLocation } from "react-router";
import { useState, useMemo, useEffect } from "react";

const navItems = [
  { label: "Home", path: "/home", icon: Home },
  { label: "Archives", path: "/archives", icon: Archive },
  { label: "Cockpit", path: "/cockpit", icon: LayoutDashboard },
  { label: "Profile", path: "/profile", icon: User },
];

type SearchResult = {
  id: string;
  label: string;
  sublabel: string;
  type: "volume" | "article";
  path: string;
};

const SEARCHABLE: SearchResult[] = [
  { id: "1.0", label: "Genesis", sublabel: "Vol 1.0", type: "volume", path: "/archives" },
  { id: "04",  label: "Silence", sublabel: "Vol 04", type: "volume", path: "/archives" },
  { id: "03",  label: "Neon",    sublabel: "Vol 03", type: "volume", path: "/archives" },
  { id: "02",  label: "Static",  sublabel: "Vol 02", type: "volume", path: "/archives" },
  { id: "01",  label: "Origin",  sublabel: "Vol 01", type: "volume", path: "/archives" },
  { id: "night-runners",           label: "Night Runners",              sublabel: "Article · Tokyo",      type: "article", path: "/archives" },
  { id: "analogue",                label: "Analogue",                   sublabel: "Article · Los Angeles", type: "article", path: "/archives" },
  { id: "the-silent-mile",         label: "The Silent Mile",            sublabel: "Article · Geneva",     type: "article", path: "/archives" },
  { id: "carbon-ritual",           label: "Carbon Ritual",              sublabel: "Article · London",     type: "article", path: "/archives" },
  { id: "architecture-of-silence", label: "The Architecture of Silence",sublabel: "Article · Cover Story",type: "article", path: "/archives" },
];

export function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useMenu();
  const { openReader } = useReader();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isMenuOpen) setSearch("");
  }, [isMenuOpen]);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return SEARCHABLE.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel.toLowerCase().includes(q)
    );
  }, [search]);

  const handleNav = (path: string) => {
    closeMenu();
    setSearch("");
    navigate(path);
  };

  const handleSearchResult = (item: SearchResult) => {
    closeMenu();
    setSearch("");
    if (item.type === "article") {
      openReader(item.id);
    } else {
      navigate("/archives", { state: { highlight: item.id } });
    }
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={closeMenu}
          />

          {/* Pop-up panel — centered overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="absolute inset-x-4 bottom-24 z-50 bg-[#0D0D0D] border-2 border-[#1E1E1E] rounded-3xl overflow-hidden shadow-[0_32px_80px_-8px_rgba(0,0,0,0.9)]"
            style={{ maxHeight: "78vh" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                <span className="text-[9px] text-white/50 uppercase tracking-[0.2em]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Command Center
                </span>
              </div>
              <motion.button
                onClick={closeMenu}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="p-1.5 -mr-0.5 text-white/40 rounded-full"
              >
                <X size={15} />
              </motion.button>
            </div>

            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(78vh - 58px)", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
              {/* Search */}
              <div className="px-5 pt-4 pb-3">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                    size={13}
                  />
                  <input
                    type="text"
                    placeholder="Search volumes, articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#141414] border-2 border-[#222] rounded-xl pl-10 pr-4 py-3 text-white text-[11px] outline-none placeholder:text-white/20 tracking-wide focus:border-white/30 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Navigation or Search Results */}
              {search.trim() ? (
                <div className="px-5 pb-4">
                  <div className="text-[8px] text-white/25 uppercase tracking-[0.2em] mb-2.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    Results
                  </div>
                  {results.length === 0 ? (
                    <div className="py-6 flex flex-col items-center gap-2">
                      <Search size={16} className="text-white/15" />
                      <span className="text-[9px] text-white/25 uppercase tracking-widest">
                        No results found
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {results.map((item) => (
                        <motion.button
                          key={item.id}
                          onClick={() => handleSearchResult(item)}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                          className="w-full flex items-center gap-3 px-3.5 py-3 bg-[#141414] border-2 border-[#222] rounded-2xl text-left"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#1E1E1E] flex items-center justify-center shrink-0">
                            {item.type === "volume" ? (
                              <BookOpen size={11} className="text-white/40" />
                            ) : (
                              <Bookmark size={11} className="text-white/40" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-[10px] text-white/80 font-bold uppercase tracking-wide truncate"
                              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                            >
                              {item.label}
                            </div>
                            <div
                              className="text-[8px] text-white/30 uppercase tracking-wider truncate"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {item.sublabel}
                            </div>
                          </div>
                          <span
                            className={`text-[7px] uppercase tracking-widest border rounded-full px-2 py-0.5 shrink-0 ${
                              item.type === "volume"
                                ? "border-brand-orange/30 text-brand-orange"
                                : "border-white/15 text-white/30"
                            }`}
                          >
                            {item.type}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Navigation */}
                  <div className="px-5 pb-4">
                    <div className="text-[8px] text-white/25 uppercase tracking-[0.2em] mb-2.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      Navigation
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                          <motion.button
                            key={item.path}
                            onClick={() => handleNav(item.path)}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left ${
                              isActive
                                ? "bg-white text-[#0A0A0A] border-white"
                                : "bg-[#141414] border-[#222] text-white/70"
                            }`}
                          >
                            <Icon
                              size={13}
                              className={isActive ? "text-[#0A0A0A]" : "text-white/40"}
                            />
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                isActive ? "text-[#0A0A0A]" : ""
                              }`}
                              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                            >
                              {item.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Access */}
                  <div className="px-5 pb-4">
                    <div className="text-[8px] text-white/25 uppercase tracking-[0.2em] mb-2.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      Quick Access
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Bookmarks */}
                      <motion.button
                        onClick={() => { closeMenu(); setSearch(""); navigate("/cockpit", { state: { scrollTo: "bookmarks" } }); }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        className="bg-[#141414] border-2 border-[#222] p-4 rounded-2xl text-left flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-7 h-7 rounded-xl bg-[#1E1E1E] flex items-center justify-center">
                            <Bookmark size={12} className="text-brand-orange fill-brand-orange/40" />
                          </div>
                          <ArrowRight size={9} className="text-white/20" />
                        </div>
                        <div>
                          <span className="text-white/80 text-[10px] font-bold uppercase tracking-wide block">
                            Bookmarks
                          </span>
                          <span className="text-[7px] text-white/25 uppercase tracking-widest">
                            2 Saved Articles
                          </span>
                        </div>
                      </motion.button>

                      {/* Continue Reading */}
                      <motion.button
                        onClick={() => {
                          closeMenu();
                          openReader("resume");
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        className="bg-[#141414] border-2 border-[#222] p-4 rounded-2xl text-left flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-7 h-7 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
                            <BookOpen size={11} className="text-brand-orange" />
                          </div>
                          <ArrowRight size={9} className="text-brand-orange" />
                        </div>
                        <div>
                          <span className="text-[7px] text-brand-orange uppercase tracking-wider block mb-0.5">
                            Continue Reading
                          </span>
                          <span className="text-white/80 text-[10px] font-bold uppercase tracking-wide truncate block leading-snug">
                            Architecture of...
                          </span>
                          <div className="h-0.5 bg-white/10 rounded-full mt-2">
                            <div className="w-[68%] h-full bg-brand-orange rounded-full" />
                          </div>
                          <span className="text-[7px] text-white/25 uppercase tracking-widest mt-1 block">
                            Vol 04 · 68%
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </>
              )}

              {/* Footer links */}
              <div className="px-5 py-4 border-t border-[#1A1A1A] flex justify-between items-center">
                <motion.button
                  onClick={() => handleNav("/login")}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="text-[9px] uppercase tracking-widest text-white/30 flex items-center gap-2"
                >
                  <LogOut size={11} />
                  Sign Out
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}