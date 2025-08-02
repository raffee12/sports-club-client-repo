import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaSearch } from "react-icons/fa";

const ManageBookings = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["confirmedBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings", {
        params: { status: "confirmed" },
      });
      return res.data;
    },
  });

  const filtered = bookings.filter((booking) =>
    booking?.courtName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-6 min-h-screen bg-black text-gray-200">
      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by court name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs bg-black text-white border-gray-500 placeholder-gray-400"
        />
        <button className="btn btn-accent text-white">
          <FaSearch />
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-600">
        <table className="table table-zebra w-full text-white">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Court</th>
              <th>Date</th>
              <th>Slots</th>
              <th>Price ($)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-red-400">
                  No confirmed bookings found.
                </td>
              </tr>
            ) : (
              filtered.map((booking, index) => (
                <tr key={booking._id} className="hover:bg-gray-800">
                  <td>{index + 1}</td>
                  <td>{booking.userName}</td>
                  <td className="break-all">{booking.userEmail}</td>
                  <td>{booking.courtName}</td>
                  <td className="text-blue-400 font-medium">{booking.date}</td>
                  <td className="flex flex-wrap gap-1">
                    {booking.slots?.map((slot, i) => (
                      <span
                        key={i}
                        className="badge badge-outline border-blue-300 text-blue-300"
                      >
                        {slot}
                      </span>
                    ))}
                  </td>
                  <td className="text-green-400 font-semibold">
                    ${booking.price}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
