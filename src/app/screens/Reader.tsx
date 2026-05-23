import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bookmark, Maximize2, Minimize2, AlignJustify, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

// Magazine spread images — editorial, high-quality, dark editorial photography
const MAGAZINE_PAGES = [
  {
    num: 93,
    image:
      "https://images.unsplash.com/photo-1557226217-bf0da2478e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBhcmNoaXRlY3R1cmUlMjBkYXJrJTIwY29uY3JldGUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzgwNzIwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    section: "Cover Story",
    headline: "The Architecture\nof Silence",
    body: "Modern high-end garages are moving away from the cluttered, oil-stained aesthetic of the past towards a clean, brutalist minimalism. \"The Architecture of Silence\" takes you inside three architecturally significant workshops in Switzerland and Japan — where concrete meets carbon fiber, and every tool has its place.\n\nHere, the environment itself becomes a medium. Architects have long understood that the spaces we inhabit shape our thinking. These cathedral-like workshops impose a kind of reverent quiet — not through sound dampening alone, but through the deliberate removal of excess. Nothing competes with the machine.",
  },
  {
    num: 94,
    image:
      "https://images.unsplash.com/photo-1769641241031-3d4266780e17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkYXJrJTIwZ2FyYWdlJTIwd29ya3Nob3AlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc4MDc0MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    section: "Feature",
    headline: "The Private\nGarage",
    body: "For the ultra-wealthy, the garage has evolved into something far more personal — a curated space that reveals as much about character as any art collection. We profile four collectors whose private garages function less as storage and more as shrines to mechanical perfection.\n\nFrom a former Le Mans driver's 14-car climate-controlled vault in Zurich, to a tech founder's minimalist Tokyo bunker with just three cars and an obsessive focus on provenance — these spaces redefine what it means to live with machines.",
  },
  {
    num: 95,
    image:
      "https://images.unsplash.com/photo-1768334431181-a9e82f158eaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwZWRpdG9yaWFsJTIwZGFyayUyMG1vb2R5JTIwcHJpbnQlMjBsYXlvdXR8ZW58MXx8fHwxNzc4MDc0MTY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    section: "Material",
    headline: "Carbon &\nSteel",
    body: "Two materials define the modern performance automobile: carbon fiber, born in aerospace, and high-tensile steel, forged in tradition. Their relationship is neither rivalry nor compromise — it is a precise dialogue between weight and strength, flex and rigidity.\n\nWe speak with the master craftsmen at three ateliers who work exclusively at this intersection. Men and women who regard a chassis not as a component, but as a statement of intent. The weave, the layup, the cure time — these are not technical details. They are poetry.",
  },
  {
    num: 96,
    image:
      "https://images.unsplash.com/photo-1751819224947-01b829fbb4ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBjb25jcmV0ZSUyMGJydXRhbGlzdCUyMGludGVyaW9yJTIwZGFyayUyMG1pbmltYWx8ZW58MXx8fHwxNzc4MDc0MTY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    section: "Environment",
    headline: "Void as\nMedium",
    body: "There is a particular kind of courage in leaving a space empty. In an age of maximalism — where every surface competes for attention — the designers and collectors who choose restraint are making a radical statement.\n\nThis essay explores the philosophy of intentional void in automotive design environments. Empty floor space as composition. A single car under a single cone of light. The drama of isolation. We visit spaces that use absence to amplify presence, and speak with the architects, owners, and philosophers who believe that to truly see something, you must remove everything else.",
  },
  {
    num: 97,
    image:
      "https://images.unsplash.com/photo-1762028768745-f701dce6aa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMGRyaXZlJTIwbmVvbiUyMGNpdHklMjByYWluJTIwZGFyayUyMHN0cmVldHxlbnwxfHx8fDE3NzgwNzQxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    section: "Nightside",
    headline: "Night\nRunners",
    body: "The city after midnight belongs to a different kind of driver. Not the commuter, not the weekend enthusiast — but those for whom the road is only truly alive when it is empty, slick with rain, and lit by the amber blur of passing streetlights.\n\nWe follow three drivers across three cities — Tokyo, Geneva, Los Angeles — on unsanctioned night runs that blur the line between sport and meditation. These are not races. They are rituals. Speed becomes a way of thinking. The car becomes a way of feeling present in a world that moves too fast to feel.",
  },
];

const TOTAL_PAGES = 140;

export function Reader() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [direction, setDirection] = useState(1);
  const [showContents, setShowContents] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentPage = MAGAZINE_PAGES[pageIndex];

  const goNext = useCallback(() => {
    if (pageIndex < MAGAZINE_PAGES.length - 1) {
      setDirection(1);
      setPageIndex((i) => i + 1);
    }
  }, [pageIndex]);

  const goPrev = useCallback(() => {
    if (pageIndex > 0) {
      setDirection(-1);
      setPageIndex((i) => i - 1);
    }
  }, [pageIndex]);

  const pageVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 50 : -50,
      scale: 0.97,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -50 : 50,
      scale: 0.97,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="flex-1 flex flex-col min-h-0 bg-[#080808] relative overflow-hidden"
    >

      {/* ── TOP BAR ── */}
      <div className="flex items-start justify-between px-5 pt-10 pb-5 shrink-0 relative z-20">
        {/* Left — issue label */}
        <div>
          <div className="text-[9px] text-white/35 uppercase tracking-[0.25em] mb-1">
            Vol 04
          </div>
          <div className="text-[18px] font-bold text-white uppercase tracking-[0.15em] leading-none">
            Silence
          </div>
        </div>

        {/* Right — action buttons */}
        <div className="flex items-center gap-2.5 mt-1">
          {/* Table of contents */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowContents((v) => !v)}
            className="w-10 h-10 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center"
          >
            <AlignJustify size={14} className="text-white/70" />
          </motion.button>

          {/* Close */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center"
          >
            <X size={14} className="text-white/70" />
          </motion.button>
        </div>
      </div>

      {/* ── MAGAZINE MOCKUP ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6 relative z-10 min-h-0">
        <div className="relative w-full" style={{ maxWidth: 320 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={pageIndex}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full"
              style={{ aspectRatio: "3/4.2" }}
            >
              {/* Magazine page card */}
              <div
                className="absolute inset-0 rounded-[22px] overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.07), 0 30px 80px -10px rgba(0,0,0,0.95), 0 0 60px -20px rgba(255,255,255,0.04)",
                }}
              >
                {/* Full-bleed editorial photo */}
                <img
                  src={currentPage.image}
                  alt={currentPage.headline}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.88 }}
                />

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                {/* Top magazine header strip */}
                <div className="absolute top-0 left-0 right-0 px-5 pt-5 flex justify-between items-center">
                  <div className="text-[7px] text-white/50 uppercase tracking-[0.3em] font-medium">
                    Air &amp; Steel
                  </div>
                  <div className="text-[7px] text-white/35 uppercase tracking-[0.25em]">
                    {String(currentPage.num).padStart(3, "0")}
                  </div>
                </div>

                {/* Section label */}
                <div className="absolute top-12 left-5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1 h-1 rounded-full bg-white/60" />
                    <span className="text-[7px] text-white/60 uppercase tracking-[0.25em]">
                      {currentPage.section}
                    </span>
                  </div>
                </div>

                {/* Center decorative element */}
                <div className="absolute top-1/2 left-5 right-5 -translate-y-1/2 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/8" />
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="h-px flex-1 bg-white/8" />
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                  <h3
                    className="text-[22px] font-bold text-white uppercase tracking-wider leading-tight mb-3 whitespace-pre-line"
                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
                  >
                    {currentPage.headline}
                  </h3>
                  <div className="h-px w-8 bg-white/40 rounded-full mb-2" />
                  <div className="text-[8px] text-white/40 uppercase tracking-[0.22em]">
                    Vol 04 · Silence
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Page tap zones */}
          <button
            onClick={goPrev}
            disabled={pageIndex === 0}
            className="absolute left-0 top-0 bottom-0 w-1/4 z-20 opacity-0"
            aria-label="Previous page"
          />
          <button
            onClick={goNext}
            disabled={pageIndex === MAGAZINE_PAGES.length - 1}
            className="absolute right-0 top-0 bottom-0 w-1/4 z-20 opacity-0"
            aria-label="Next page"
          />
        </div>

        {/* Page navigation hints */}
        <div className="flex items-center gap-6 mt-5">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={goPrev}
            disabled={pageIndex === 0}
            className="flex items-center gap-1.5 text-white/25 disabled:opacity-0 transition-opacity duration-300 hover:text-white/50"
          >
            <ChevronLeft size={12} />
            <span className="text-[8px] uppercase tracking-widest">Prev</span>
          </motion.button>

          {/* Dot progress */}
          <div className="flex items-center gap-1.5">
            {MAGAZINE_PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > pageIndex ? 1 : -1);
                  setPageIndex(i);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === pageIndex
                    ? "w-5 h-1 bg-white"
                    : "w-1 h-1 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={goNext}
            disabled={pageIndex === MAGAZINE_PAGES.length - 1}
            className="flex items-center gap-1.5 text-white/25 disabled:opacity-0 transition-opacity duration-300 hover:text-white/50"
          >
            <span className="text-[8px] uppercase tracking-widest">Next</span>
            <ChevronRight size={12} />
          </motion.button>
        </div>
      </div>

      {/* ── BOTTOM PILL BAR ── */}
      <div className="flex justify-center pb-10 pt-2 shrink-0 relative z-20">
        <div
          className="flex items-center gap-0 rounded-full border border-[#2A2A2A] overflow-hidden reader-pill-bg"
        >
          {/* Page counter */}
          <div className="flex items-center gap-2 px-5 py-3.5">
            <span className="text-[14px] font-bold text-white tracking-wide tabular-nums">
              {String(currentPage.num).padStart(3, "0")}
            </span>
            <span className="text-[12px] text-white/30 tracking-wide">
              / {TOTAL_PAGES}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/12 mx-1" />

          {/* Bookmark */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setBookmarked((b) => !b)}
            className="px-4 py-3.5 flex items-center justify-center"
          >
            <Bookmark
              size={16}
              className={`transition-colors duration-200 ${
                bookmarked ? "text-white fill-white" : "text-white/40"
              }`}
            />
          </motion.button>

          {/* Expand / fullscreen */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setIsExpanded(true)}
            className="px-4 py-3.5 flex items-center justify-center"
          >
            <Maximize2 size={16} className="text-white/40 hover:text-white transition-colors duration-200" />
          </motion.button>
        </div>
      </div>

      {/* ── TABLE OF CONTENTS OVERLAY ── */}
      <AnimatePresence>
        {showContents && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-30"
              onClick={() => setShowContents(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-[#0D0D0D] border-l border-[#1E1E1E] z-40 flex flex-col"
            >
              {/* Header */}
              <div className="px-5 pt-12 pb-5 border-b border-[#1A1A1A] flex items-center justify-between">
                <div>
                  <div className="text-[8px] text-white/50 uppercase tracking-[0.25em] mb-1">
                    Contents
                  </div>
                  <div className="text-[14px] font-bold text-white uppercase tracking-wider">
                    Vol 04 · Silence
                  </div>
                </div>
                <button
                  onClick={() => setShowContents(false)}
                  className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center"
                >
                  <X size={12} className="text-white/60" />
                </button>
              </div>

              {/* Pages list */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {MAGAZINE_PAGES.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > pageIndex ? 1 : -1);
                      setPageIndex(i);
                      setShowContents(false);
                    }}
                    className={`w-full flex items-center gap-4 px-5 py-4 border-b border-[#141414] text-left transition-colors duration-200 ${
                      i === pageIndex
                        ? "bg-white/[0.04]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-12 rounded-lg overflow-hidden shrink-0 relative">
                      <img
                        src={p.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[7px] text-white/30 uppercase tracking-widest mb-0.5">
                        {p.section}
                      </div>
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider leading-tight whitespace-pre-line ${
                          i === pageIndex ? "text-white" : "text-white/60"
                        }`}
                      >
                        {p.headline}
                      </div>
                    </div>

                    <div className="text-[9px] text-white/20 tabular-nums shrink-0">
                      {String(p.num).padStart(3, "0")}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── EXPANDED FULL-SCREEN PAGE VIEW ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            className="absolute inset-0 z-50 bg-[#080808] overflow-hidden"
          >
            {/* Full-screen page image */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={`exp-${pageIndex}`}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                src={currentPage.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Subtle bottom gradient for nav bar legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

            {/* Collapse button — top right */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-12">
              <div className="text-[8px] text-white/40 uppercase tracking-[0.3em]">
                Air &amp; Steel · Vol 04
              </div>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setIsExpanded(false)}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center"
              >
                <Minimize2 size={13} className="text-white/80" />
              </motion.button>
            </div>

            {/* Page number */}
            <div className="absolute top-14 left-5 text-[9px] text-white/30 uppercase tracking-widest tabular-nums">
              {String(currentPage.num).padStart(3, "0")} / {TOTAL_PAGES}
            </div>

            {/* Bottom navigation bar */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-12 pt-4 flex items-center justify-between">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={goPrev}
                disabled={pageIndex === 0}
                className="flex items-center gap-2 text-white/50 disabled:opacity-20"
              >
                <ChevronLeft size={14} />
                <span className="text-[9px] uppercase tracking-widest">Prev</span>
              </motion.button>

              <div className="flex items-center gap-1.5">
                {MAGAZINE_PAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > pageIndex ? 1 : -1);
                      setPageIndex(i);
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      i === pageIndex
                        ? "w-5 h-1 bg-white"
                        : "w-1 h-1 bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={goNext}
                disabled={pageIndex === MAGAZINE_PAGES.length - 1}
                className="flex items-center gap-2 text-white/50 disabled:opacity-20"
              >
                <span className="text-[9px] uppercase tracking-widest">Next</span>
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}