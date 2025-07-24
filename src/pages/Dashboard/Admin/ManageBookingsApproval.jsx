import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import { FiCheck, FiX } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

function ManageBookingsApproval() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
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
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Booking status changed.",
        timer: 1500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Could not update booking.",
      });
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-48 text-gray-600 text-lg font-medium">
        Loading bookings...
      </div>
    );

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 bg-white rounded-xl border border-gray-200 shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900 border-b border-gray-300 pb-3 tracking-wide uppercase select-none">
        Manage Bookings Approval
      </h2>

      {/* Table for md+ screens */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-left text-gray-800">
          <thead className="bg-gray-100">
            <tr>
              {[
                "User",
                "Court",
                "Date",
                "Slots",
                "Price",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-5 font-semibold uppercase tracking-wider whitespace-nowrap select-none text-sm sm:text-base"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentBookings.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-16 text-center text-gray-400 font-semibold"
                >
                  No booking requests found.
                </td>
              </tr>
            ) : (
              currentBookings.map((booking, idx) => (
                <tr
                  key={booking._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-4 px-5 flex items-center gap-4 max-w-[200px] whitespace-nowrap">
                    <img
                      src={booking.userImage}
                      alt={booking.userName || booking.userEmail}
                      className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {booking.userName || booking.userEmail}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        {booking.userEmail}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5 font-semibold max-w-[160px] truncate text-sm sm:text-base">
                    {booking.courtName}
                  </td>

                  <td className="py-4 px-5 whitespace-nowrap text-gray-700 font-medium text-sm sm:text-base">
                    {booking.date}
                  </td>

                  <td className="py-4 px-5 max-w-[180px] truncate text-gray-600 text-sm sm:text-base">
                    {booking.slots.join(", ")}
                  </td>

                  <td className="py-4 px-5 whitespace-nowrap font-semibold text-gray-800 text-sm sm:text-base">
                    ${booking.price}
                  </td>

                  <td className="py-4 px-5 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs sm:text-sm font-semibold ${
                        booking.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : booking.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="py-4 px-5 flex gap-3 whitespace-nowrap">
                    <button
                      onClick={() =>
                        updateBookingMutation.mutate({
                          id: booking._id,
                          status: "approved",
                        })
                      }
                      disabled={updateBookingMutation.isLoading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 text-sm sm:text-base"
                      title="Approve booking"
                    >
                      <FiCheck size={18} />
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateBookingMutation.mutate({
                          id: booking._id,
                          status: "rejected",
                        })
                      }
                      disabled={updateBookingMutation.isLoading}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 text-sm sm:text-base"
                      title="Reject booking"
                    >
                      <FiX size={18} />
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List for smaller screens */}
      <div className="md:hidden space-y-6">
        {currentBookings.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-semibold">
            No booking requests found.
          </div>
        ) : (
          currentBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-50 rounded-lg p-4 shadow border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={booking.userImage}
                  alt={booking.userName || booking.userEmail}
                  className="w-12 h-12 rounded-full border border-gray-300 object-cover flex-shrink-0"
                />
                <div>
                  <div className="font-semibold text-gray-900 text-base truncate">
                    {booking.userName || booking.userEmail}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {booking.userEmail}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 text-sm">
                <div>
                  <span className="font-semibold">Court:</span>{" "}
                  {booking.courtName}
                </div>
                <div>
                  <span className="font-semibold">Date:</span> {booking.date}
                </div>
                <div className="col-span-2 truncate">
                  <span className="font-semibold">Slots:</span>{" "}
                  {booking.slots.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Price:</span> ${booking.price}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      booking.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : booking.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  onClick={() =>
                    updateBookingMutation.mutate({
                      id: booking._id,
                      status: "approved",
                    })
                  }
                  disabled={updateBookingMutation.isLoading}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
                  title="Approve booking"
                >
                  <FiCheck size={18} />
                  <span className="hidden sm:inline">Approve</span>
                </button>

                <button
                  onClick={() =>
                    updateBookingMutation.mutate({
                      id: booking._id,
                      status: "rejected",
                    })
                  }
                  disabled={updateBookingMutation.isLoading}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
                  title="Reject booking"
                >
                  <FiX size={18} />
                  <span className="hidden sm:inline">Reject</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-8 select-none">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:text-gray-400 disabled:bg-gray-50 transition"
            aria-label="Previous Page"
          >
            &lt; Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded-md px-4 py-2 font-semibold transition ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-md px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:text-gray-400 disabled:bg-gray-50 transition"
            aria-label="Next Page"
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageBookingsApproval;
