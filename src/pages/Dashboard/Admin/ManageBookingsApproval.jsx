import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageBookingsApproval = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", page],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings?status=pending");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/bookings/${id}`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      const message = data.promotedToMember
        ? "Booking approved and user promoted to member!"
        : `Booking ${variables.status} successfully!`;
      Swal.fire("Success", message, "success");
      queryClient.invalidateQueries(["bookings", page]);
    },
    onError: (err) => {
      console.error("Mutation error:", err);
      Swal.fire("Error", "Failed to update booking", "error");
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/bookings/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Booking has been rejected and removed.", "success");
      queryClient.invalidateQueries(["bookings", page]);
    },
    onError: (err) => {
      console.error("Delete error:", err);
      Swal.fire("Error", "Failed to delete booking", "error");
    },
  });

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#001f45] dark:text-white tracking-wide">
          Manage Booking Approvals
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-auto text-sm text-left text-gray-700 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-800 text-sm font-semibold">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">User Email</th>
                <th className="px-4 py-3">Court</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Slots</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6">
                    No bookings found.
                  </td>
                </tr>
              )}

              {bookings.map((booking, idx) => (
                <tr
                  key={booking._id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{booking.userEmail}</td>
                  <td className="px-4 py-3">{booking.courtType || booking.courtName}</td>
                  <td className="px-4 py-3">{booking.date}</td>
                  <td className="px-4 py-3">{booking.slots?.join(", ")}</td>
                  <td className="px-4 py-3 capitalize">{booking.status}</td>
                  <td className="px-4 py-3 space-x-2 text-center">
                    <button
                      onClick={() =>
                        updateBookingMutation.mutate({
                          id: booking._id,
                          status: "approved",
                        })
                      }
                      disabled={
                        booking.status !== "pending" || updateBookingMutation.isLoading
                      }
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Are you sure?",
                          text: "This will permanently reject the booking.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#d33",
                          cancelButtonColor: "#3085d6",
                          confirmButtonText: "Yes, reject it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteBookingMutation.mutate(booking._id);
                          }
                        })
                      }
                      disabled={
                        booking.status !== "pending" || deleteBookingMutation.isLoading
                      }
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBookingsApproval;
