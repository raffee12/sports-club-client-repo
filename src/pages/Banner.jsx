import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    img: "/images/banner1.jpg",
    tagline: "Exclusive Community",
    title: "Welcome to Our Club",
    subtitle: "Where Enthusiasm Meets Excellence.",
    info: "Join a family of champions who push boundaries, train hard, and thrive together.",
  },
  {
    img: "/images/banner2.jpg",
    tagline: "Elite Facilities",
    title: "Premier Courts Await",
    subtitle: "Book your personalized playing experience.",
    info: "Experience world-class courts designed for professionals and enthusiasts alike.",
  },
  {
    img: "/images/banner3.jpg",
    tagline: "Professional Training",
    title: "Coaching by Experts",
    subtitle: "Learn from the best to become the best.",
    info: "Our certified coaches help refine your skills and build your confidence.",
  },
];

const Banner = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        loop
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[100vh]">
              {/* Background Image with zoom effect */}
              <motion.img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover object-top"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "easeOut" }}
              />

              {/* Subtle Black Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Content */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-center items-start px-4 md:px-12 max-w-7xl mx-auto text-white"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.2, duration: 1.2 },
                  },
                }}
              >
                <motion.p
                  className="uppercase tracking-wide text-sm md:text-lg text-[#f97316] font-urbanist font-bold"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  {slide.tagline}
                </motion.p>
                <motion.h1
                  className="text-3xl md:text-5xl lg:text-6xl font-urbanist font-extrabold mb-2 drop-shadow-lg"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  {slide.title}
                </motion.h1>
                <motion.h2
                  className="text-lg md:text-2xl mb-4 font-urbanist font-semibold"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Typewriter
                    words={[slide.subtitle]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={60}
                    deleteSpeed={40}
                    delaySpeed={2000}
                  />
                </motion.h2>
                <motion.p
                  className="max-w-xl text-sm md:text-lg text-gray-200 font-poppins mb-6"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  {slide.info}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="mt-6 flex gap-4"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 bg-[#001f45] hover:bg-[#5883b8] transition duration-300 text-white font-poppins font-semibold rounded-lg shadow-lg"
                  >
                    Join Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 border-2 border-[#f97316] hover:bg-[#f97316] hover:text-white transition duration-300 text-[#f97316] font-poppins font-semibold rounded-lg shadow-lg"
                  >
                    Explore Courts
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Bullets */}
      <style>
        {`
          .swiper-pagination-bullet {
            background: #fff;
            opacity: 0.4;
            width: 14px;
            height: 14px;
            border-radius: 9999px;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
            background: #f97316;
            transform: scale(1.3);
          }
        `}
      </style>
    </div>
  );
};

export default Banner;
