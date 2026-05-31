import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Moon, Sun, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

/* ── TopBar Component ─────────────────────────────────────────── */

interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

export function TopBar({ title = "AIR & STEEL", showBack = false }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-6 py-5 z-40 relative">
      {/* Left — back button (optional) + brand */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-2.5"
      >
        {showBack && (
          <motion.button
            onClick={() => navigate(-1)}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="flex items-center justify-center -ml-1 mr-0.5"
            aria-label="Go back"
          >
            <ChevronLeft size={20} strokeWidth={1.8} className="text-white/60" />
          </motion.button>
        )}
        <span className="w-1 h-1 rounded-full bg-brand-orange" />
        <span
          className="font-bold tracking-[0.22em] text-[10px] uppercase text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
        >
          {title}
        </span>
      </motion.div>

      {/* Right side — cart + theme toggle */}
      <div className="flex items-center gap-3">
        {/* Cart icon */}
        <motion.button
          onClick={() => navigate("/cart")}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
          aria-label="Cart"
        >
          <ShoppingBag size={17} className="text-white/50" />
        </motion.button>

        {/* Theme toggle — animated moon / sun */}
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.88 }}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center w-7 h-7"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.span
                key="moon"
                initial={{ opacity: 0, rotate: -25, scale: 0.75 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 25, scale: 0.75 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="flex"
              >
                <Moon size={15} strokeWidth={1.4} className="text-white/55" />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: 25, scale: 0.75 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -25, scale: 0.75 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="flex"
              >
                <Sun size={15} strokeWidth={1.4} className="text-white/55" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </header>
  );
}
