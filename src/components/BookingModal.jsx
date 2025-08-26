import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { gsap } from "gsap";

function BookingModal({ court, onClose }) {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const modalRef = useRef(null);

  // GSAP Entry Animation
  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: -50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, []);

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const totalPrice = selectedSlots.length * court.pricePerSession;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingDate) {
      return Swal.fire(
        "Missing Date",
        "Please select a booking date.",
        "warning"
      );
    }
    if (selectedSlots.length === 0) {
      return Swal.fire(
        "No Slot Selected",
        "Please select at least one session slot.",
        "warning"
      );
    }

    setSubmitting(true);

    const bookingData = {
      userEmail: user?.email,
      userName: user?.displayName,
      userImage: user?.photoURL,
      courtId: court.id,
      courtName: court.name,
      courtType: court.type,
      date: bookingDate,
      slots: selectedSlots,
      price: totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await axiosSecure.post("/bookings", bookingData);

      Swal.fire({
        icon: "success",
        title: "Booking Submitted",
        html: `
          <p><strong>${
            court.name
          }</strong> for <span style="color:#ff7b00;">${bookingDate}</span></p>
          <p>Slots: <strong>${selectedSlots.join(", ")}</strong></p>
          <p>Total Price: <strong style="color:#ff7b00;">$${totalPrice}</strong></p>
          <p>Status: <strong style="color:#ff7b00;">Pending Approval</strong></p>
        `,
      }).then(() => onClose());
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      Swal.fire(
        "Error",
        "Booking submission failed. Try again later.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div
        ref={modalRef}
        className="bg-[#001f45] rounded-xl max-w-md w-full p-6 text-gray-200 relative shadow-2xl border border-orange-500"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold transition"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-3xl font-extrabold mb-5 text-orange-400 flex items-center gap-2">
          {court.name} Booking
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Court Type */}
          <div>
            <label className="block font-semibold text-gray-200 mb-1">
              Court Type
            </label>
            <input
              type="text"
              value={court.type}
              readOnly
              className="w-full rounded-lg px-3 py-2 bg-[#001f45] text-gray-200 cursor-not-allowed border border-gray-600"
            />
          </div>

          {/* Booking Date */}
          <div>
            <label
              className="block font-semibold text-gray-200 mb-1"
              htmlFor="booking-date"
            >
              Booking Date
            </label>
            <input
              id="booking-date"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full rounded-lg px-3 py-2 bg-white text-black focus:ring-2 focus:ring-orange-400 outline-none border border-gray-300"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Slots */}
          <div>
            <label className="block font-semibold mb-2 text-gray-200">
              Select Slots
            </label>
            <div className="flex flex-wrap gap-2">
              {court.slots.map((slot) => {
                const selected = selectedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    className={`px-4 py-2 rounded-lg font-medium border transition-all duration-200 ${
                      selected
                        ? "bg-orange-600 border-orange-600 text-white shadow-md hover:bg-orange-700"
                        : "bg-transparent border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total Price */}
          <p className="font-semibold text-lg">
            Total Price:{" "}
            <span className="text-orange-400 font-bold">${totalPrice}</span>
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg font-semibold border border-orange-500 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-lg font-bold bg-orange-600 text-white hover:bg-orange-700 transition-all"
            >
              {submitting ? "Booking..." : "Submit Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
