import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FiCalendar, FiClock, FiTag, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";

export default function UserBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [cancelingId, setCancelingId] = useState(null);

  const { role, isRoleLoading, refetch: refetchRole } = useUserRole();

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userBookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?userEmail=${user.email}`);
      return res.data;
    },
  });

  // Show welcome SweetAlert for members
  useEffect(() => {
    if (role === "member") {
      Swal.fire({
        icon: "success",
        title: "Welcome to the Club!",
        text: "You are now a member. Member features are unlocked!",
        timer: 2500,
        showConfirmButton: false,
      });
    }
  }, [role]);

  // Cancel handler
  const handleCancel = async (bookingId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently cancelled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        setCancelingId(bookingId);
        await axiosSecure.delete(`/bookings/${bookingId}`);

        // Immediately update cache without waiting for full refetch
        queryClient.setQueryData(["userBookings", user.email], (old) =>
          old ? old.filter((b) => b._id !== bookingId) : []
        );

        await refetchRole(); // In case this was the last approved booking
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
      } catch {
        Swal.fire("Error", "Failed to cancel booking.", "error");
      } finally {
        setCancelingId(null);
      }
    }
  };

  if (!user || isLoading || isRoleLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner text-primary w-12 h-12"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 font-semibold">
        <p>Failed to load bookings.</p>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4">
      <h2 className="text-4xl font-bold text-center text-indigo-800">
        My Court Bookings
      </h2>

      {bookings.some((b) => b.status === "approved") && role === "user" && (
        <div className="text-center">
          <button
            onClick={async () => {
              try {
                const res = await axiosSecure.post("/members", {
                  email: user.email,
                  name: user.displayName,
                  image: user.photoURL,
                  joinDate: new Date(),
                });

                if (res.data.insertedId || res.data.success) {
                  await refetchRole();
                  Swal.fire({
                    icon: "success",
                    title: "Membership Confirmed!",
                    text: "You're now a club member.",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                }
              } catch {
                Swal.fire("Error", "Could not update membership.", "error");
              }
            }}
            className="btn btn-success text-white mt-2 hover:scale-105 transition-all duration-300"
          >
            🎉 Join the Club Now
          </button>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-gray-900 text-white rounded-xl p-6 shadow-md max-w-md mx-auto text-center space-y-4">
          <h3 className="text-2xl font-semibold">No Bookings Found</h3>
          <p className="text-gray-300">
            You haven’t booked any courts yet. Book a court to see it listed
            here!
          </p>
          <button
            onClick={() => navigate("/courts")}
            className="btn btn-primary mt-4"
          >
            Book a Court
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-screen-xl">
            {bookings.map((booking) => {
              const bookingDate = booking.date || "";
              const slot =
                Array.isArray(booking.slots) && booking.slots.length > 0
                  ? booking.slots.join(", ")
                  : "No slot";

              return (
                <div
                  key={booking._id}
                  className="relative rounded-xl bg-gradient-to-tr from-white via-teal-50 to-white border border-teal-200 p-5 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                    {booking.courtName}{" "}
                    <span className="text-sm text-gray-500">
                      ({booking.courtType})
                    </span>
                  </h3>

                  <div className="text-gray-800 space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <FiCalendar className="text-indigo-500" />
                      <span>
                        {bookingDate
                          ? new Date(bookingDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No date"}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FiClock className="text-teal-500" />
                      <span>{slot}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FiTag className="text-green-500" />
                      <span>${booking.price?.toFixed(2) || "N/A"}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span
                      className={`badge px-4 py-1 rounded-full text-sm border-0 font-medium ${
                        booking.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {booking.status || "unknown"}
                    </span>

                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancelingId === booking._id}
                      className={`btn btn-xs text-white flex items-center gap-1 ${
                        cancelingId === booking._id
                          ? "btn-disabled"
                          : "btn-error"
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
        </div>
      )}
    </div>
  );
}
