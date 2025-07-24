import { motion } from "framer-motion";

const sectionVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 1.2,
      ease: "easeOut",
    },
  }),
};

const imageVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: "easeOut" },
  },
};

export default function About() {
  return (
    <section className="w-full py-20 px-4 md:px-12 bg-[#001f45] text-white">
      {/* Centered Title */}
      <motion.h2
        className="text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text drop-shadow mb-20 text-center"
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
          className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg"
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
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/60 via-transparent to-yellow-900/60"></div>
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
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-yellow-400 mb-2">
              Our History
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">
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
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-yellow-400 mb-2">
              Our Mission
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">
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
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-yellow-400 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">
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
