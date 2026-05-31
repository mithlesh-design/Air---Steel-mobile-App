import { motion } from "motion/react";
import { TopBar } from "../components/layout/TopBar";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

export function Cart() {
  const navigate = useNavigate();
  const { cartItems: items, removeFromCart: removeItem } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

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
          className="px-6 pt-1 pb-8"
        >
          <motion.div variants={itemVariants}>
            <div
              className="text-[9px] text-white/30 uppercase tracking-[0.28em] mb-3"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Purchase
            </div>
            <h1
              className="text-[40px] text-white uppercase leading-[0.92] tracking-[-0.01em]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Cart
            </h1>
          </motion.div>
        </motion.div>

        {items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-6 flex flex-col items-center text-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-[#141414] border-2 border-[#2A2A2A] flex items-center justify-center mb-5">
              <ShoppingBag size={22} className="text-white/25" />
            </div>
            <div
              className="text-[14px] text-white/60 uppercase tracking-wider mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              Your cart is empty
            </div>
            <p
              className="text-[11px] text-white/30 mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Browse the Archives to find issues to add.
            </p>
            <motion.button
              onClick={() => navigate("/archives")}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex items-center gap-2 text-[9px] text-brand-orange uppercase tracking-widest border border-brand-orange/30 rounded-full px-6 py-3"
            >
              Browse Archives <ArrowRight size={10} />
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Cart items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="px-6 mb-6"
            >
              <div className="space-y-3">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="bg-[#141414] border-2 border-[#2A2A2A] rounded-2xl overflow-hidden"
                  >
                    <div className="flex gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 relative">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div
                            className="text-[8px] text-white/30 uppercase tracking-widest mb-0.5"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {item.vol}
                          </div>
                          <div
                            className="text-[13px] text-white uppercase leading-tight mb-1"
                            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                          >
                            {item.title}
                          </div>
                          <div
                            className="text-[8px] text-white/40 uppercase tracking-wider"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {item.format}
                          </div>
                        </div>
                        <div
                          className="text-[14px] text-white font-medium"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          ₹{item.price.toLocaleString()}
                        </div>
                      </div>

                      {/* Remove button */}
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => removeItem(item.id)}
                        className="self-start mt-1 p-1.5 text-white/25 hover:text-white/60 transition-colors"
                      >
                        <Trash2 size={13} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Order summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-6 mb-6"
            >
              <div className="bg-[#141414] border-2 border-[#2A2A2A] rounded-2xl p-5">
                <div
                  className="text-[9px] text-white/40 uppercase tracking-widest mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Order Summary
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">Subtotal</span>
                  <span className="text-[12px] text-white font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">Shipping</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">Calculated at checkout</span>
                </div>
                <div className="h-px bg-[#2A2A2A] mb-4" />
                <div className="flex justify-between items-center">
                  <span
                    className="text-[11px] text-white uppercase tracking-wider"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
                  >
                    Total
                  </span>
                  <span
                    className="text-[16px] text-white font-bold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Checkout CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-6"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="w-full py-4 bg-white text-[#0A0A0A] text-[11px] uppercase tracking-widest font-bold rounded-full flex items-center justify-center gap-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Proceed to Checkout <ArrowRight size={13} />
              </motion.button>

              <motion.button
                onClick={() => navigate("/archives")}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="w-full mt-3 py-3.5 text-[9px] text-white/40 uppercase tracking-widest flex items-center justify-center"
              >
                Continue Browsing
              </motion.button>
            </motion.div>
          </>
        )}
      </main>
    </motion.div>
  );
}
