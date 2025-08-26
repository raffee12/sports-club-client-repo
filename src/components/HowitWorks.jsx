import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

export default function HowItWorks() {
  return (
    <section className="w-full py-24 px-4 md:px-12 bg-[#f7f7f7] dark:bg-gray-900 relative transition-colors duration-500">
      {/* Section Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-orange-500 drop-shadow-lg">
        How It Works – Join Our Club
      </h2>

      {/* Card */}
      <motion.div
        className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 relative z-10 transition-colors duration-500"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Left SVG Illustration */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/how.svg"
            alt="Join Club Illustration"
            className="w-80 md:w-96 drop-shadow-xl"
          />
        </motion.div>

        {/* Right Steps */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ul className="space-y-6">
            {[
              "Checkout the available courts",
              "Register/Login if you’re interested",
              "Book your favorite court at your time",
              "Wait for Admin approval",
              "Become a proud member",
              "Complete payment & join the committee",
            ].map((step, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-4"
                whileHover={{ scale: 1.05 }}
              >
                <span className="bg-orange-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                  {index + 1}
                </span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors duration-500">
                  <FaCheckCircle className="text-orange-500" />
                  {step}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Background Glow Circles */}
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-orange-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}
