import { useLocation } from "react-router";
import { useMenu } from "../../context/MenuContext";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "motion/react";

const HIDDEN_PATHS = ["/", "/login", "/signup", "/reader", "/pdf-reader"];

export function FloatingNav() {
  const location = useLocation();
  const { toggleMenu, isMenuOpen } = useMenu();
  const { theme } = useTheme();

  const shouldHide =
    HIDDEN_PATHS.includes(location.pathname) ||
    location.pathname.startsWith("/read/");

  if (shouldHide) return null;

  return (
    <AnimatePresence>
      {!isMenuOpen && (
        <motion.div
          key="floating-menu-btn"
          initial={{ y: 20, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none"
        >
          <motion.button
            onClick={toggleMenu}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="pointer-events-auto flex items-center gap-2.5 bg-[#141414] border-2 border-[#282828] text-white px-5 py-3.5 rounded-full backdrop-blur-xl"
            style={{
              boxShadow: theme === "light"
                ? "0 2px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.07)"
                : "0 12px 40px -4px rgba(0,0,0,0.6)",
            }}
          >
            {/* Dot indicator */}
            <span className="w-1 h-1 rounded-full bg-brand-orange" />

            {/* Hamburger */}
            <svg
              width="13"
              height="9"
              viewBox="0 0 13 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            >
              <line x1="0" y1="0.5" x2="13" y2="0.5" />
              <line x1="0" y1="4.5" x2="9" y2="4.5" />
              <line x1="0" y1="8.5" x2="13" y2="8.5" />
            </svg>

            <span
              className="text-[9px] uppercase tracking-[0.2em] font-medium text-white/80"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Menu
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}