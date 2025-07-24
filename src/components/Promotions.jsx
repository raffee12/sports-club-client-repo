import { motion } from "framer-motion";
import { FaTags } from "react-icons/fa";

const coupons = [
  { code: "ABC", discount: "5%" },
  { code: "SPORTS10", discount: "10%" },
  { code: "VIP20", discount: "20%" },
];

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

export default function Promotions() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-[#001f45] to-[#003366] text-white relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-yellow-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-yellow-300 flex items-center justify-center gap-2">
          <FaTags className="text-yellow-400 text-3xl" />
          Exciting Promotions!
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          {coupons.map((coupon, index) => (
            <motion.div
              key={coupon.code}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariant}
              className="bg-[#002b5c] border border-yellow-500 rounded-xl p-6 text-center shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-yellow-500/50"
            >
              <h3 className="text-3xl font-bold text-yellow-300 mb-2">
                {coupon.discount} OFF
              </h3>
              <p className="text-white text-lg font-medium mb-2">Use Code:</p>
              <div className="bg-yellow-400 text-[#001f45] font-bold text-xl px-4 py-1 inline-block rounded-md tracking-widest shadow-inner">
                {coupon.code}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
