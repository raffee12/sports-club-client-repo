import { motion } from "framer-motion";
import { FaTags } from "react-icons/fa";

const coupons = [
  { code: "ABC", discount: "5%" },
  { code: "SPORTS10", discount: "10%" },
  { code: "VIP20", discount: "20%" },
];

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

export default function Promotions() {
  return (
    <section className="relative py-16 px-4 bg-gradient-to-r from-[#001f45] to-[#003366] text-white overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-orange-500 opacity-20 rounded-full blur-3xl animate-pulse-slow -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-400 opacity-15 rounded-full blur-3xl animate-pulse-slower -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-urbanist font-bold mb-12 text-orange-500 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <FaTags className="text-orange-500 text-3xl animate-bounce-slow" />
          Exciting Promotions!
        </motion.h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
          {coupons.map((coupon, index) => (
            <motion.div
              key={coupon.code}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariant}
              className="bg-[#002b5c] border border-yellow-500 rounded-2xl p-8 text-center shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-yellow-400/60"
            >
              <motion.h3
                className="text-3xl md:text-4xl font-bold text-orange-400 mb-3 font-urbanist"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {coupon.discount} OFF
              </motion.h3>
              <p className="text-white text-lg font-poppins mb-3">Use Code:</p>
              <motion.div
                className="bg-orange-500 text-[#001f45] font-bold text-xl md:text-2xl px-5 py-2 inline-block rounded-md tracking-widest shadow-inner hover:scale-105 transition-transform duration-300"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {coupon.code}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
