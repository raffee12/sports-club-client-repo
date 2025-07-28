import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FiCalendar,
  FiClock,
  FiTag,
  FiTrash2,
  FiDollarSign,
} from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

export default function ApprovedBookings() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["approvedBookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?userEmail=${user.email}`);
      return res.data.filter((b) => b.status === "approved");
    },
  });

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this approved booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        setProcessingId(id);
        await axiosSecure.delete(`/bookings/${id}`);
        await refetch();
        Swal.fire("Cancelled", "Booking has been cancelled.", "success");
      } catch (err) {
        Swal.fire("Error", "Could not cancel booking.", "error");
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handlePayment = (booking) => {
    navigate("/dashboard/member/pay", { state: { booking } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner text-primary w-12 h-12"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 font-semibold">
        <p>Failed to load approved bookings.</p>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold text-center text-green-700">
        Approved Bookings
      </h2>

      {bookings.length === 0 ? (
        <div className="bg-white text-gray-700 rounded-xl p-6 shadow-md max-w-md mx-auto text-center space-y-4">
          <h3 className="text-2xl font-semibold">No Approved Bookings</h3>
          <p className="text-gray-500">
            You currently have no approved bookings awaiting payment.
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center max-w-7xl">
            {bookings.map((booking) => {
              const bookingDate = booking.date
                ? new Date(booking.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "No date";

              const slots = Array.isArray(booking.slots)
                ? booking.slots.join(", ")
                : "No slot";

              return (
                <div
                  key={booking._id}
                  className="rounded-xl bg-gradient-to-br from-white via-green-50 to-white border border-green-200 p-5 shadow hover:shadow-xl transition flex flex-col justify-center items-center text-center w-full max-w-sm"
                >
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    {booking.courtName}
                    <span className="ml-1 text-sm text-gray-500">
                      ({booking.courtType})
                    </span>
                  </h3>

                  <div className="text-gray-700 space-y-1 text-sm">
                    <p className="flex items-center justify-center gap-2">
                      <FiCalendar className="text-green-600" />
                      {bookingDate}
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <FiClock className="text-green-500" />
                      {slots}
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <FiTag className="text-green-400" />$
                      {booking.price?.toFixed(2) || "N/A"}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-center items-center flex-wrap gap-4">
                    <button
                      onClick={() => handlePayment(booking)}
                      className="btn btn-sm btn-success text-white flex items-center gap-2"
                    >
                      <FiDollarSign />
                      Pay Now
                    </button>

                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={processingId === booking._id}
                      className={`btn btn-sm btn-error text-white flex items-center gap-2 ${
                        processingId === booking._id ? "btn-disabled" : ""
                      }`}
                    >
                      <FiTrash2 />
                      {processingId === booking._id
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
