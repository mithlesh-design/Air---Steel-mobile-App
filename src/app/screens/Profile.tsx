import { motion } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router";
import {
  LogOut,
  ChevronRight,
  Shield,
  CreditCard,
  MapPin,
  Clock,
  User,
  Bell,
  Fingerprint,
  Sun,
  Moon,
  Package,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
};

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-px flex-1 bg-white/6" />
      <span
        className="text-[8px] text-white/30 uppercase tracking-[0.25em]"
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
      >
        {label}
      </span>
      <div className="h-px flex-1 bg-white/6" />
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  right,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-4 cursor-pointer group ${onClick ? "active:bg-white/[0.02]" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={13}
          className={danger ? "text-red-400/60" : "text-white/30"}
        />
        <span
          className={`text-[10px] uppercase tracking-wider ${danger ? "text-red-400/80" : "text-white"}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
        >
          {label}
        </span>
      </div>
      {right}
    </div>
  );
}

export function Profile() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
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
              Account Layer
            </div>
            <h1
              className="text-[40px] text-white uppercase leading-[0.92] tracking-[-0.01em] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Profile
            </h1>
            <div className="h-px w-10 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 mb-8"
        >
          <div className="bg-[#141414] border-2 border-[#2A2A2A] rounded-3xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#2A2A2A] border-2 border-[#333] flex items-center justify-center shrink-0">
              <span
                className="text-white/60 text-sm uppercase tracking-wider"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
              >
                AS
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-white text-sm uppercase tracking-wider truncate"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
              >
                Alex S.
              </div>
              <div
                className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                Founding Member
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                <span
                  className="text-[8px] text-white/70 uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                >
                  Active Subscription
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-[8px] text-white/40 uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                >
                  Member Since Jan 2025
                </span>
              </div>
            </div>
            <Shield size={16} className="text-white/30 shrink-0" />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 space-y-8"
        >

          {/* ── 1. PERSONAL INFORMATION ── */}
          <motion.div variants={itemVariants}>
            <SectionLabel label="Personal Information" />
            <div className="bg-[#141414] border-2 border-[#2A2A2A] rounded-2xl overflow-hidden divide-y divide-[#1E1E1E]">
              <SettingRow
                icon={User}
                label="Full Name"
                right={
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/50">Alex S.</span>
                    <ChevronRight size={11} className="text-white/20" />
                  </div>
                }
              />
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-[13px]" style={{ opacity: 0.3 }}>@</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-white/50">alex@air…</span>
                  <ChevronRight size={11} className="text-white/20" />
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-white/30">✆</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Phone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-white/50">+1 (555) 019…</span>
                  <ChevronRight size={11} className="text-white/20" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── 2. ADDRESSES ── */}
          <motion.div variants={itemVariants}>
            <SectionLabel label="Addresses" />
            <div className="space-y-2.5">
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/8 border-2 border-white/12 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={12} className="text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] text-white/50 uppercase tracking-wider mb-1">
                    Primary Address
                  </div>
                  <div className="text-[10px] text-white leading-relaxed">
                    1234 Industrial Loft<br />
                    District 9, Neo-Tokyo 101
                  </div>
                </div>
                <ChevronRight size={11} className="text-white/20 self-center shrink-0" />
              </div>
              <button className="w-full border-2 border-dashed border-[#2A2A2A] rounded-2xl py-4 text-[9px] text-white/30 uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2">
                + Add Address
              </button>
            </div>
          </motion.div>

          {/* ── 3. PAYMENT METHODS ── */}
          <motion.div variants={itemVariants}>
            <SectionLabel label="Payment Methods" />
            <div className="space-y-2.5">
              <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1E1E1E] flex items-center justify-center shrink-0">
                  <CreditCard size={13} className="text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-white uppercase tracking-wider">
                    VISA •••• 4242
                  </div>
                  <div className="text-[8px] text-white/35 uppercase tracking-widest mt-0.5">
                    Expires 09/27
                  </div>
                </div>
                <span className="text-[7px] text-white/60 uppercase tracking-wider bg-white/8 border-2 border-white/15 rounded-full px-2.5 py-1 shrink-0">
                  Default
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="w-full border-2 border-dashed border-[#2A2A2A] rounded-2xl py-4 text-[9px] text-white/30 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                + Add Payment Method
              </motion.button>
            </div>
          </motion.div>

          {/* ── 4. PURCHASE HISTORY ── */}
          <motion.div variants={itemVariants}>
            <SectionLabel label="Purchase History" />
            <div className="bg-[#141414] border-2 border-[#2A2A2A] rounded-2xl overflow-hidden divide-y divide-[#1E1E1E]">
              {[
                { item: "Volume 04 — Hardcover", date: "Oct 12, 2025", price: "$42.00", icon: Package },
                { item: "Digital Subscription", date: "Aug 01, 2025", price: "$12.99/mo", icon: Package },
                { item: "Volume 03 — Hardcover", date: "May 08, 2025", price: "$38.00", icon: Package },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1E1E1E] flex items-center justify-center shrink-0">
                      <tx.icon size={12} className="text-white/40" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5">
                        {tx.item}
                      </div>
                      <div className="flex items-center gap-1.5 text-[8px] text-white/30 uppercase tracking-widest">
                        <Clock size={8} />
                        {tx.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-white font-medium shrink-0 ml-3">{tx.price}</div>
                </div>
              ))}
              <div className="px-5 py-3.5">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="text-[8px] text-white/50 uppercase tracking-widest flex items-center gap-1.5"
                >
                  View All Transactions <ChevronRight size={9} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── 5. APP SETTINGS ── */}
          <motion.div variants={itemVariants}>
            <SectionLabel label="App Settings" />
            <div className="bg-[#141414] border-2 border-[#2A2A2A] rounded-2xl overflow-hidden divide-y divide-[#1A1A1A]">
              {/* Theme */}
              <div className="flex justify-between items-center px-5 py-4">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon size={13} className="text-white/30" />
                  ) : (
                    <Sun size={13} className="text-white/30" />
                  )}
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    App Theme
                  </span>
                </div>

                {/* Sliding pill toggle */}
                <div
                  onClick={toggleTheme}
                  className="relative flex cursor-pointer bg-[#1A1A1A] border border-[#2A2A2A] rounded-full select-none"
                  style={{ padding: 3 }}
                >
                  {/* Animated sliding pill */}
                  <motion.div
                    className="absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] rounded-full pointer-events-none"
                    style={{ backgroundColor: theme === "dark" ? "#FFFFFF" : "#111111" }}
                    animate={{ x: theme === "dark" ? "0%" : "100%" }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.6 }}
                  />

                  {/* Dark option */}
                  <span className="relative z-10 flex items-center gap-1.5 px-3 py-[7px] w-1/2 justify-center">
                    <Moon
                      size={9}
                      strokeWidth={1.8}
                      style={{ color: theme === "dark" ? "#0A0A0A" : undefined }}
                      className={theme !== "dark" ? "text-white/30" : ""}
                    />
                    <span
                      className={`text-[8px] font-bold uppercase tracking-widest ${theme !== "dark" ? "text-white/30" : ""}`}
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: theme === "dark" ? "#0A0A0A" : undefined,
                      }}
                    >
                      Dark
                    </span>
                  </span>

                  {/* Light option */}
                  <span className="relative z-10 flex items-center gap-1.5 px-3 py-[7px] w-1/2 justify-center">
                    <Sun
                      size={9}
                      strokeWidth={1.8}
                      style={{ color: theme === "light" ? "#FFFFFF" : undefined }}
                      className={theme !== "light" ? "text-white/30" : ""}
                    />
                    <span
                      className={`text-[8px] font-bold uppercase tracking-widest ${theme !== "light" ? "text-white/30" : ""}`}
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: theme === "light" ? "#FFFFFF" : undefined,
                      }}
                    >
                      Light
                    </span>
                  </span>
                </div>
              </div>

              {/* Biometric */}
              <div className="flex justify-between items-center px-5 py-4">
                <div className="flex items-center gap-3">
                  <Fingerprint size={13} className="text-white/30" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Biometric Lock
                  </span>
                </div>
                <span className="text-[8px] text-white/60 uppercase tracking-widest">
                  Enabled
                </span>
              </div>

              {/* Notifications */}
              <div className="flex justify-between items-center px-5 py-4">
                <div className="flex items-center gap-3">
                  <Bell size={13} className="text-white/30" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Notifications
                  </span>
                </div>
                <ChevronRight size={12} className="text-white/25" />
              </div>

              {/* Support */}
              <div className="flex justify-between items-center px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-white/20 text-[13px]">?</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Support &amp; Help
                  </span>
                </div>
                <ChevronRight size={12} className="text-white/25" />
              </div>

              {/* Legal */}
              <div className="flex justify-between items-center px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-white/20 text-[11px]">§</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Legal &amp; Privacy
                  </span>
                </div>
                <ChevronRight size={12} className="text-white/25" />
              </div>
            </div>
          </motion.div>

          {/* Sign Out */}
          <motion.div variants={itemVariants} className="pb-4">
            <motion.button
              onClick={() => navigate("/login")}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="w-full py-4 border-2 border-[#2A2A2A] rounded-full text-[9px] text-white/50 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <LogOut size={12} />
              Sign Out
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}