import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const sectionVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" },
  }),
};

export default function ContactUs() {
  return (
    <section className="w-full py-20 px-4 md:px-12 bg-[#001f45] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-orange-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse-slower pointer-events-none"></div>

      {/* Title */}
      <motion.h2
        className="text-4xl sm:text-5xl font-urbanist font-extrabold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 drop-shadow-[0_0_15px_rgba(255,165,0,0.7)]"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
      >
        Contact Us
      </motion.h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 items-center">
        {/* Contact Info Card */}
        <motion.div
          className="bg-white text-[#001f45] rounded-2xl p-8 shadow-2xl flex flex-col gap-6 col-span-1"
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          <h3 className="text-2xl font-bold mb-4 text-orange-500">
            Get in Touch
          </h3>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-orange-500 text-xl" />
            <p>250 Front Street West, Toronto, ON M5V 3G5, Canada</p>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-orange-500 text-xl" />
            <p>+1 416-123-4567</p>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-orange-500 text-xl" />
            <p>info@sportsclub.com</p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          className="bg-white text-[#001f45] rounded-2xl p-8 shadow-2xl flex flex-col gap-6 col-span-2"
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
        >
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
          <button
            type="submit"
            className="px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            Send Message
          </button>
        </motion.form>
      </div>

      {/* Optional SVG Illustration */}
      <div className="absolute top-0 right-0 w-1/3 h-full hidden md:block pointer-events-none">
        <svg
          className="w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 600 600"
        >
          <circle cx="300" cy="300" r="300" fill="url(#grad)" />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FF4500" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
