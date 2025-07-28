import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState("");

  // React Query fetch with v5+ syntax (single object param)
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Filter users client-side by email
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase().trim())
  );

  if (isLoading) {
    return <div className="text-center text-white py-10">Loading users...</div>;
  }

  if (isError) {
    Swal.fire("Error", "Failed to load users", "error");
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load users.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-center tracking-wide drop-shadow-lg">
          Manage Users
        </h2>

        {/* Search */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="input input-bordered w-full pl-12 bg-blue-50 text-blue-900 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-blue-400/30 shadow-lg">
          <table className="table w-full text-white">
            <thead className="bg-blue-800 text-white uppercase tracking-wide">
              <tr>
                <th className="py-3">#</th>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-600/40 transition-colors cursor-pointer"
                  >
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{user.name || "N/A"}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">
                      <span className="badge badge-outline border-orange-400 text-orange-400">
                        {user.role || "user"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-blue-200 italic"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;

/* [
  {
    "courtNumber": "101",
    "courtType": "Tennis",
    "courtName": "Center Court",
    "indoorOutdoor": "Outdoor",
    "description": "Main tennis court with night lighting",
    "maxPlayers": 4,
    "available": true,
    "sessionDuration": 60,
    "pricePerSession": 30,
    "slots": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"]
  },
  {
    "courtNumber": "102",
    "courtType": "Badminton",
    "courtName": "Court A",
    "indoorOutdoor": "Indoor",
    "description": "Indoor badminton court with synthetic flooring",
    "maxPlayers": 4,
    "available": true,
    "sessionDuration": 45,
    "pricePerSession": 20,
    "slots": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"]
  },
  {
    "courtNumber": "103",
    "courtType": "Squash",
    "courtName": "Squash Room 1",
    "indoorOutdoor": "Indoor",
    "description": "Professional squash court with glass walls",
    "maxPlayers": 2,
    "available": false,
    "sessionDuration": 30,
    "pricePerSession": 25,
    "slots": ["7:00 AM", "8:00 AM", "9:00 AM"]
  },
  {
    "courtNumber": "104",
    "courtType": "Tennis",
    "courtName": "Practice Court",
    "indoorOutdoor": "Outdoor",
    "description": "",
    "maxPlayers": 2,
    "available": true,
    "sessionDuration": 60,
    "pricePerSession": 15,
    "slots": ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"]
  },
  {
    "courtNumber": "105",
    "courtType": "Basketball",
    "courtName": "Main Basketball Court",
    "indoorOutdoor": "Indoor",
    "description": "Full size indoor basketball court",
    "maxPlayers": 10,
    "available": true,
    "sessionDuration": 90,
    "pricePerSession": 40,
    "slots": ["5:00 PM", "6:30 PM", "8:00 PM"]
  }
// ]*/