import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const ConfirmedBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchConfirmedBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosSecure.get(`/bookings?userEmail=${user.email}`);
        const confirmed = res.data.filter(
          (b) => b.status === "confirmed" || b.isPaid === true
        );
        setBookings(confirmed);
      } catch (err) {
        console.error("Failed to fetch confirmed bookings:", err);
        setError("Failed to load confirmed bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedBookings();
  }, [user, axiosSecure]);

  if (loading)
    return (
      <div className="text-center text-white mt-10">Loading confirmed bookings...</div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-medium mt-4">{error}</p>
    );

  if (!bookings.length)
    return (
      <p className="text-center text-gray-300 mt-6">No confirmed bookings found.</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f45] to-[#0a2647] p-4 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-[#002b60] text-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-3xl font-semibold text-center mb-6">Confirmed Bookings</h2>
        <div className="overflow-x-auto rounded-lg border border-[#0151ad]">
          <table className="min-w-full">
            <thead className="bg-[#014c8c] text-white uppercase text-sm">
              <tr>
                <th className="p-3 text-left">Booking ID</th>
                <th className="p-3 text-left">Court</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Slots</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-[#01447f] transition duration-200">
                  <td className="p-3 font-mono text-xs">{booking._id}</td>
                  <td className="p-3">{booking.courtName || booking.courtId}</td>
                  <td className="p-3">
                    {booking.date
                      ? new Date(booking.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3 text-sm">
                    {Array.isArray(booking.slots)
                      ? booking.slots.join(", ")
                      : booking.slots || "N/A"}
                  </td>
                  <td className="p-3 text-green-300 font-semibold">
                    ${booking.price?.toFixed(2) || "0.00"}
                  </td>
                  <td className="p-3 capitalize font-medium text-yellow-300">
                    {booking.status || (booking.isPaid ? "paid" : "pending")}
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

export default ConfirmedBookings;
