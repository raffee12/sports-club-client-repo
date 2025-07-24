import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { Typewriter } from "react-simple-typewriter";

const slides = [
  {
    img: "/images/club.jpg",
    title: "Welcome to Our Exclusive Club",
    subtitle: "Where Champions Train and Thrive.",
  },
  {
    img: "/images/court.jpg",
    title: "Premier Courts Await",
    subtitle: "Book Your Elite Playing Experience.",
  },
  {
    img: "/images/activities.jpg",
    title: "Dynamic Activities",
    subtitle: "Join Luxurious Tournaments & Events.",
  },
];

const Banner = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000 }}
        loop
        className="rounded-2xl shadow-xl"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-80 md:h-[450px] overflow-hidden rounded-2xl">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover brightness-[0.6]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <motion.h2
                  className="text-3xl md:text-5xl font-bold mb-2"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  className="text-md md:text-xl font-light max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  <Typewriter
                    words={[slide.subtitle]}
                    loop={false}
                    cursor
                    cursorStyle="_"
                    typeSpeed={60}
                    deleteSpeed={40}
                    delaySpeed={2000}
                  />
                </motion.p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Swiper Pagination Bullets */}
      <style>
        {`
          .swiper-pagination-bullet {
            background: #facc15;
            opacity: 0.5;
            width: 14px;
            height: 14px;
            border-radius: 9999px;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
            background: #f59e0b;
            transform: scale(1.2);
          }
        `}
      </style>
    </div>
  );
};

export default Banner;
