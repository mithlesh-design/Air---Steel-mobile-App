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
      className={`relative bg-[#141414] border rounded-2xl px-5 pt-6 pb-3 transition-all duration-300 ${
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

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
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
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/5 blur-3xl rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <div className="text-white text-xs font-bold tracking-[0.25em] uppercase mb-3">
            Air & Steel
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase">
              New Member
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSignup}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <FloatingLabelInput
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

          {/* Member access type */}
          <div className="pt-2">
            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-3">
              Membership tier
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["Digital", "Print + Digital"].map((tier, i) => (
                <button
                  key={tier}
                  type="button"
                  className={`w-full py-3 rounded-xl border text-[9px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center ${
                    i === 0
                      ? "border-white bg-white text-[#0A0A0A] font-bold"
                      : "border-[#2A2A2A] text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              className="w-full bg-white text-[#0A0A0A] rounded-full py-4 text-[11px] font-bold tracking-[0.18em] uppercase shadow-lg hover:bg-white/90 transition-colors duration-200 flex items-center justify-center"
            >
              Join
            </motion.button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center text-[10px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors duration-300 py-2"
            >
              Return to Login
            </button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}