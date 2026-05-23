import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

function FloatingLabelInput({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div
      className={`relative bg-[#141414] border-2 rounded-2xl px-5 pt-6 pb-3 transition-all duration-300 ${
        focused ? "border-brand-orange/60" : "border-[#2A2A2A]"
      }`}
    >
      <label
        className={`absolute left-5 transition-all duration-300 pointer-events-none ${
          lifted
            ? "top-2.5 text-[9px] tracking-[0.2em] text-brand-orange"
            : "top-1/2 -translate-y-1/2 text-[11px] text-white/30 tracking-widest"
        } uppercase`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent text-white text-sm outline-none mt-1 tracking-wide"
        autoComplete="off"
      />
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col bg-[#0A0A0A] relative overflow-hidden"
    >
      {/* Background ambient */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/5 blur-3xl rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <div
            className="text-white text-xs font-bold tracking-[0.25em] uppercase mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
          >
            Air & Steel
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <div
              className="text-white/35 text-[9px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Secure Entry
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <FloatingLabelInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingLabelInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="pt-6 space-y-4">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="w-full bg-white text-[#0A0A0A] rounded-full py-4 text-[11px] font-bold tracking-[0.18em] uppercase shadow-lg flex items-center justify-center"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Enter
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate("/signup")}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="w-full flex items-center justify-center text-[10px] uppercase tracking-widest text-white/30 py-2"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Create Account
            </motion.button>
          </div>
        </motion.form>

        {/* Forgot link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="text-[9px] text-white/20 uppercase tracking-widest"
          >
            Forgot access credentials
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom brand mark */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="text-[8px] text-white/10 uppercase tracking-[0.35em]">
          Member Access Portal
        </div>
      </div>
    </motion.div>
  );
}