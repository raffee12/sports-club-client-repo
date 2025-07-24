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
    <div className="min-h-screen bg-[#001f45] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>

        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="input input-bordered w-full pl-10 bg-white text-black rounded-lg"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-white/20">
          <table className="table w-full text-white">
            <thead className="bg-[#002b66] text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-white/10 transition">
                    <td>{index + 1}</td>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-outline border-orange-400 text-orange-400">
                        {user.role || "user"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-300">
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
