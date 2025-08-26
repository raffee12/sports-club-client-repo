import { motion } from "framer-motion";
import { FaHistory, FaBullseye, FaEye } from "react-icons/fa";

const sectionVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 1, ease: "easeOut" },
  }),
};

const imageVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: "easeOut" },
  },
};

export default function About() {
  return (
    <section className="w-full py-20 px-4 md:px-12 bg-[#001f45] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-orange-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse-slower pointer-events-none"></div>

      {/* Section Title */}
      <motion.h2
        className="text-4xl sm:text-5xl font-urbanist font-extrabold mb-20 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 drop-shadow-[0_0_15px_rgba(255,165,0,0.7)]"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
      >
        About Our Club
      </motion.h2>

      {/* Grid Content */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Animated Image */}
        <motion.div
          className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={imageVariant}
        >
          <img
            src="/images/about.jpg"
            alt="About Club"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40"></div>
        </motion.div>

        {/* Right: Text Content */}
        <div className="space-y-16">
          {/* History */}
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3 text-orange-400 text-2xl md:text-3xl font-bold">
              <FaHistory />
              Our History
            </div>
            <p className="text-gray-200 text-lg font-poppins leading-relaxed">
              Founded in 1995, our club started as a small community initiative
              with big dreams. Today, it’s a thriving hub for athletes of all
              levels, equipped with top-notch facilities and a strong
              sports-loving community.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3 text-orange-400 text-2xl md:text-3xl font-bold">
              <FaBullseye />
              Our Mission
            </div>
            <p className="text-gray-200 text-lg font-poppins leading-relaxed">
              We aim to inspire and nurture sportsmanship by offering inclusive
              programs, expert coaching, and a welcoming environment for
              everyone — from beginners to pros.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3 text-orange-400 text-2xl md:text-3xl font-bold">
              <FaEye />
              Our Vision
            </div>
            <p className="text-gray-200 text-lg font-poppins leading-relaxed">
              Our vision is to be the leading sports and wellness destination —
              where every individual feels empowered to pursue a healthier,
              active lifestyle in a vibrant community.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
