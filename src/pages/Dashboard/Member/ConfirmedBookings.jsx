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
        const confirmed = res.data.filter((b) => b.status === "confirmed");
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

  if (loading) return <p>Loading confirmed bookings...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!bookings.length) return <p>No confirmed bookings found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-green-700 text-center">
        Confirmed Bookings
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-100 text-green-800 uppercase text-sm">
            <tr>
              <th className="p-2 border border-gray-300 text-left">
                Booking ID
              </th>
              <th className="p-2 border border-gray-300 text-left">Court</th>
              <th className="p-2 border border-gray-300 text-left">Date</th>
              <th className="p-2 border border-gray-300 text-left">Slots</th>
              <th className="p-2 border border-gray-300 text-left">Price</th>
              <th className="p-2 border border-gray-300 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-green-50">
                <td className="p-2 border border-gray-300">{booking._id}</td>
                <td className="p-2 border border-gray-300">
                  {booking.courtName || booking.courtId}
                </td>
                <td className="p-2 border border-gray-300">
                  {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="p-2 border border-gray-300">
                  {Array.isArray(booking.slots)
                    ? booking.slots.join(", ")
                    : booking.slots}
                </td>
                <td className="p-2 border border-gray-300">
                  ${booking.price?.toFixed(2) || "N/A"}
                </td>
                <td className="p-2 border border-gray-300 capitalize text-green-600 font-semibold">
                  {booking.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfirmedBookings;
