import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiClock, FiTag, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

export default function PendingBookings() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [cancelingId, setCancelingId] = useState(null);

  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["pendingBookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings?userEmail=${user.email}&status=pending`
      );
      return res.data;
    },
  });

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "This will remove your booking request permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        setCancelingId(id);
        await axiosSecure.delete(`/bookings/${id}`);
        await refetch();
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
      } catch (err) {
        Swal.fire("Error", "Something went wrong!", "error");
      } finally {
        setCancelingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner w-12 h-12 text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center font-medium">
        Failed to load pending bookings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-900">
        Pending Bookings
      </h2>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-600 bg-gray-50 p-8 rounded-xl shadow">
          <p className="text-lg">No pending bookings at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const bookingDate = booking.date || "";
            const slot =
              Array.isArray(booking.slots) && booking.slots.length > 0
                ? booking.slots.join(", ")
                : "No slot";

            return (
              <div
                key={booking._id}
                className="rounded-xl bg-white border border-gray-200 p-5 shadow hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                  {booking.courtName}
                  <span className="ml-2 text-sm text-gray-500">
                    ({booking.courtType})
                  </span>
                </h3>

                <div className="text-gray-800 space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" />
                    {new Date(bookingDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiClock className="text-teal-500" />
                    {slot}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiTag className="text-green-600" />
                    ${booking.price?.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="badge bg-yellow-100 text-yellow-800 border-0">
                    Pending
                  </span>

                  <button
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancelingId === booking._id}
                    className={`btn btn-sm flex gap-1 items-center text-white ${
                      cancelingId === booking._id
                        ? "btn-disabled"
                        : "btn-error hover:scale-105"
                    }`}
                  >
                    <FiTrash2 />
                    {cancelingId === booking._id ? "Cancelling..." : "Cancel"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
