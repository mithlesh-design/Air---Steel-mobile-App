import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import imgLogo from "../../imports/AllScreens/799a4c4258f135fe583a1c66fdc10b8fd21a5591.png";

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0A0A] relative overflow-hidden select-none">
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-80 h-80 rounded-full bg-brand-orange blur-[80px]"
        />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-orange/5 blur-3xl rounded-full pointer-events-none" />

      {/* Brand content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="w-[220px] h-[72px] relative"
        >
          <img
            src={imgLogo}
            alt="Air & Steel"
            className="w-full h-full object-contain"
            style={{ filter: "brightness(1.1)" }}
          />
        </motion.div>

        {/* Edition tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-px h-8 bg-white/10" />
          <div className="text-white/25 text-[8px] tracking-[0.4em] uppercase">
            Est. IN · 2026.3
          </div>
        </motion.div>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 left-0 right-0 flex justify-center"
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-1 h-1 rounded-full bg-brand-orange"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
