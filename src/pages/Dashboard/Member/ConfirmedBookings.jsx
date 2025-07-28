import React, { useEffect, useState } from "react";
// your auth hook to get user and token
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const ConfirmedBookings = () => {
  const { user, token } = useAuth(); // Assuming your useAuth returns token
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchConfirmedBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch bookings with status approved (meaning confirmed)
        const response = await axios.get(
          "https://your-backend-url/bookings?status=approved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data);
      } catch (err) {
        console.error("Failed to fetch confirmed bookings:", err);
        setError("Failed to load confirmed bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedBookings();
  }, [token]);

  if (loading) return <p>Loading confirmed bookings...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!bookings.length) return <p>No confirmed bookings found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Confirmed Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300 text-left">
                Booking ID
              </th>
              <th className="p-2 border border-gray-300 text-left">
                User Email
              </th>
              <th className="p-2 border border-gray-300 text-left">Court</th>
              <th className="p-2 border border-gray-300 text-left">Date</th>
              <th className="p-2 border border-gray-300 text-left">
                Time Slot(s)
              </th>
              <th className="p-2 border border-gray-300 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300">{booking._id}</td>
                <td className="p-2 border border-gray-300">
                  {booking.userEmail}
                </td>
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
                <td className="p-2 border border-gray-300 capitalize text-green-700 font-semibold">
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
