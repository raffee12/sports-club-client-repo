import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Professional Player",
    review:
      "Joining this club has completely transformed my game. The facilities are top-notch and the coaching is excellent.",
    img: "/images/img1.jpg",
    rating: 5,
  },
  {
    name: "Brian Lee",
    role: "Member",
    review:
      "A fantastic community for sports enthusiasts. Everyone is welcoming and supportive, and I’ve learned so much here!",
    img: "/images/img2.jpg",
    rating: 4,
  },
  {
    name: "Clara Smith",
    role: "Coach",
    review:
      "I enjoy coaching here because the members are motivated and the environment is inspiring.",
    img: "/images/img3.jpg",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Amateur Player",
    review:
      "The courts are amazing and the events are always fun. Highly recommend this club for anyone serious about sports.",
    img: "/images/img4.jpg",
    rating: 4,
  },
  {
    name: "Eva Martinez",
    role: "Member",
    review:
      "From training to social events, this club offers a perfect balance. I feel part of a real community here.",
    img: "/images/img5.jpg",
    rating: 5,
  },
  {
    name: "Frank Wilson",
    role: "Member",
    review:
      "Friendly staff and excellent environment. It's easy to improve your skills here.",
    img: "/images/img6.jpg",
    rating: 5,
  },
  {
    name: "Grace Chen",
    role: "Member",
    review:
      "I love the coaching and friendly environment. The events make it fun to join every week.",
    img: "/images/img7.jpg",
    rating: 5,
  },
  {
    name: "Henry Adams",
    role: "Professional Player",
    review:
      "The training programs are excellent and the staff are always supportive.",
    img: "/images/img8.jpg",
    rating: 4,
  },
  {
    name: "Isabella Green",
    role: "Member",
    review:
      "Great community and amazing facilities. I’ve improved so much since joining.",
    img: "/images/img9.jpg",
    rating: 5,
  },
  {
    name: "Jackie Liu",
    role: "Coach",
    review:
      "Coaching here is inspiring, and members are always eager to learn and improve.",
    img: "/images/img10.jpg",
    rating: 5,
  },
  {
    name: "Kevin Brown",
    role: "Amateur Player",
    review:
      "The courts and training programs are amazing. Fun and professional!",
    img: "/images/img3.jpg",
    rating: 4,
  },
  {
    name: "Laura White",
    role: "Member",
    review:
      "I enjoy every session here. Great people, fun games, and excellent coaching.",
    img: "/images/img5.jpg",
    rating: 5,
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
};

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const currentTestimonials = testimonials.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <section className="w-full py-20 px-4 md:px-12 bg-white dark:bg-black transition-colors duration-500">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-orange-500 dark:text-orange-400 transition-colors duration-500">
        What Our Members Say
      </h2>

      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {currentTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariant}
              className="bg-[#001f45] dark:bg-gray-800 text-white dark:text-gray-200 rounded-2xl p-6 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 hover:-translate-y-3"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-16 h-16 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-orange-500"
                />
                <div>
                  <h3 className="text-xl font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-200 dark:text-gray-300">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-200 dark:text-gray-300 mb-4">
                {testimonial.review}
              </p>

              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <FaStar key={i} className="text-orange-500" />
                ))}
                {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                  <FaStar
                    key={i}
                    className="text-gray-400 dark:text-gray-500"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-12 gap-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <motion.div
            key={i}
            onClick={() => setPage(i)}
            className="cursor-pointer rounded-full bg-orange-500 dark:bg-orange-400"
            animate={{ width: page === i ? 24 : 12, height: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        ))}
      </div>
    </section>
  );
}
