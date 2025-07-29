import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const ManageBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["confirmedBookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings?userEmail=${user.email}&status=confirmed`
      );
      return res.data;
    },
  });

  const filteredBookings = bookings.filter((booking) =>
    booking.courtName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-base-100 border border-base-300 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-success">
        Manage Bookings
      </h2>

      <div className="flex items-center gap-3 mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by court title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />
        <FaSearch className="text-xl text-gray-500" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner w-12 h-12 text-success"></span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center text-gray-600 p-10 bg-gray-50 rounded-xl">
          No confirmed bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra table-lg">
            <thead className="bg-base-200 text-base font-semibold">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Date</th>
                <th>Slot</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr key={booking._id}>
                  <th>{index + 1}</th>
                  <td>{booking.courtName}</td>
                  <td>
                    {new Date(booking.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    {Array.isArray(booking.slots)
                      ? booking.slots.join(", ")
                      : "-"}
                  </td>
                  <td>${booking.price?.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-success flex items-center gap-1">
                      <FaCheckCircle /> Confirmed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
