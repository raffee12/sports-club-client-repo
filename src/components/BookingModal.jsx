import React, { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

function BookingModal({ court, onClose }) {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
          }</strong> for <span style="color:#f97316;">${bookingDate}</span></p>
          <p>Slots: <strong>${selectedSlots.join(", ")}</strong></p>
          <p>Total Price: <strong style="color:#facc15;">$${totalPrice}</strong></p>
          <p>Status: <strong style="color:#f43f5e;">Pending Approval</strong></p>
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#001f45] rounded-lg max-w-lg w-full p-6 text-gray-200 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-orange-400">
          {court.name} Booking
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Court Type */}
          <div>
            <label className="block font-semibold text-teal-300">
              Court Type
            </label>
            <input
              type="text"
              value={court.type}
              readOnly
              className="w-full rounded px-3 py-2 bg-gray-700 text-gray-300 cursor-not-allowed"
            />
          </div>

          {/* Booking Date */}
          <div>
            <label
              className="block font-semibold text-teal-300"
              htmlFor="booking-date"
            >
              Booking Date
            </label>
            <input
              id="booking-date"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full rounded px-3 py-2 bg-white text-black focus:ring-2 focus:ring-orange-400 outline-none"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Slots */}
          <div>
            <label className="block font-semibold mb-1 text-teal-300">
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
                    className={`px-3 py-1 rounded border transition-all duration-150 ${
                      selected
                        ? "bg-orange-600 border-orange-600 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
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
            <span className="text-yellow-400 font-bold">${totalPrice}</span>
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded bg-orange-600 hover:bg-orange-700 text-white font-semibold transition"
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
