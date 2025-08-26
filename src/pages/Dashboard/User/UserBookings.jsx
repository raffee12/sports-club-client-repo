import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FiCalendar, FiClock, FiTag, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";

gsap.registerPlugin(ScrollTrigger);

export default function UserBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const cardRefs = useRef([]);
  const [cancelingId, setCancelingId] = useState(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  const { role, isRoleLoading, refetch: refetchRole } = useUserRole();

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userBookings"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?userEmail=${user.email}`);
      return res.data;
    },
  });

  // 🔁 Role change alert & redirect
  useEffect(() => {
    if (!isRoleLoading && role === "member" && !hasRedirected) {
      Swal.fire({
        icon: "success",
        title: "Welcome to the Club!",
        text: "You are now a member. Member features are unlocked!",
        timer: 2500,
        showConfirmButton: false,
        background: "#001f45",
        color: "#fff",
      });
      setHasRedirected(true);
      setTimeout(() => navigate("/dashboard/member/profile"), 2600);
    }
  }, [role, isRoleLoading, hasRedirected, navigate]);

  // 🔹 Cancel booking
  const handleCancel = async (bookingId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently cancelled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#ff6b00",
      cancelButtonColor: "#001f45",
      background: "#001f45",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        setCancelingId(bookingId);
        const response = await axiosSecure.delete(`/bookings/${bookingId}`);
        if (response.status === 200 || response.data?.deletedCount === 1) {
          queryClient.setQueryData(["userBookings"], (old) =>
            old ? old.filter((b) => b._id !== bookingId) : []
          );
          await refetchRole();
          Swal.fire({
            icon: "success",
            title: "Cancelled!",
            text: "Your booking has been cancelled.",
            timer: 2000,
            showConfirmButton: false,
            background: "#001f45",
            color: "#fff",
          });
        } else {
          throw new Error("Cancellation not confirmed by server.");
        }
      } catch (error) {
        console.error("Cancel booking failed:", error);
      } finally {
        setCancelingId(null);
      }
    }
  };

  // 🔹 GSAP scroll animation
  useEffect(() => {
    if (cardRefs.current.length) {
      cardRefs.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -100 : 100 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            },
          }
        );
      });
    }
  }, [bookings]);

  if (!user || isLoading || isRoleLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner text-orange-500 w-12 h-12"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-orange-500 font-semibold">
        <p>Failed to load bookings.</p>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-10 px-4 py-6 md:px-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-orange-500 mb-8">
        My Court Bookings
      </h2>

      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-black text-orange-500 rounded-3xl p-10 shadow-2xl max-w-md mx-auto text-center space-y-4">
          <h3 className="text-2xl font-semibold">No Bookings Found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            You haven’t booked any courts yet. Book a court to see it listed
            here!
          </p>
          <button
            onClick={() => navigate("/courts")}
            className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            Book a Court
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
          <AnimatePresence>
            {bookings.map((booking, index) => {
              const bookingDate = booking.date || "";
              const slot =
                Array.isArray(booking.slots) && booking.slots.length > 0
                  ? booking.slots.join(", ")
                  : "No slot";

              return (
                <motion.div
                  key={booking._id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 30px rgba(255,165,0,0.6)",
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full max-w-md bg-white dark:bg-[#001f45] text-orange-400 border border-orange-500 rounded-3xl p-8 transition-all"
                >
                  <h3 className="text-2xl font-bold mb-4">
                    {booking.courtName}{" "}
                    <span className="text-lg text-orange-200">
                      ({booking.courtType})
                    </span>
                  </h3>

                  <div className="space-y-3 text-lg">
                    <p className="flex items-center gap-3">
                      <FiCalendar className="text-orange-400" size={20} />
                      {bookingDate
                        ? new Date(bookingDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No date"}
                    </p>
                    <p className="flex items-center gap-3">
                      <FiClock className="text-orange-400" size={20} />
                      {slot}
                    </p>
                    <p className="flex items-center gap-3">
                      <FiTag className="text-orange-400" size={20} />$
                      {booking.price?.toFixed(2) || "N/A"}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <span
                      className={`px-5 py-2 rounded-full text-sm font-semibold ${
                        booking.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {booking.status || "unknown"}
                    </span>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancelingId === booking._id}
                      className={`flex items-center gap-2 text-white px-4 py-2 rounded-xl font-semibold ${
                        cancelingId === booking._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700"
                      }`}
                    >
                      <FiTrash2 />
                      {cancelingId === booking._id ? "Cancelling..." : "Cancel"}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
