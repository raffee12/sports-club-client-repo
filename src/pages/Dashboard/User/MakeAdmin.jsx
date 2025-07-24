import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaSearch, FaUserShield, FaUserTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emailQuery, setEmailQuery] = useState("");

  const {
    data: users = [],
    refetch,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchedUsers", emailQuery],
    enabled: !!emailQuery,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${emailQuery}`);
      return res.data;
    },
  });

  const { mutateAsync: updateRole } = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axiosSecure.patch(`/users/${id}/role`, { role });
      return res.data;
    },
    onSuccess: async (data) => {
      await refetch();
      if (user?.email === data?.email && data?.role === "admin") {
        navigate("/dashboard/admin/profile", { replace: true });
      }
    },
  });

  const handleRoleChange = async (id, currentRole, email) => {
    const isSelf = user?.email === email;
    const newRole = currentRole === "admin" ? "user" : "admin";
    const action = currentRole === "admin" ? "Remove Admin" : "Make Admin";

    if (isSelf && newRole === "user") {
      return Swal.fire({
        icon: "error",
        title: "Denied",
        text: "You cannot remove your own admin access.",
        background: "#0f172a",
        color: "#f87171",
      });
    }

    const confirm = await Swal.fire({
      title: `${action}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      background: "#0f172a",
      color: "#f8fafc",
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateRole({ id, role: newRole });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `${action} successful`,
        background: "#0f172a",
        color: "#a3e635",
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user role",
        background: "#0f172a",
        color: "#f87171",
      });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl shadow-xl border border-gray-700">
      <h2 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">
        Make Admin
      </h2>

      <div className="flex items-center max-w-md mx-auto mb-10 relative">
        <FaSearch className="absolute left-4 text-yellow-400 text-xl" />
        <input
          type="text"
          className="w-full pl-12 pr-5 py-3 rounded-full bg-gray-900 border border-yellow-400 text-yellow-200 placeholder-yellow-400 focus:ring-4 focus:ring-yellow-400/40 outline-none shadow-md"
          placeholder="Search user by email..."
          value={emailQuery}
          onChange={(e) => setEmailQuery(e.target.value)}
        />
      </div>

      {isFetching && (
        <p className="text-center text-yellow-400 font-semibold animate-pulse mb-6">
          Loading users...
        </p>
      )}
      {isError && (
        <p className="text-center text-red-500 font-semibold mb-6">
          Error: {error?.message || "Failed to fetch users."}
        </p>
      )}
      {!isFetching && users.length === 0 && emailQuery && (
        <p className="text-center text-yellow-300 italic mb-6">
          No users found.
        </p>
      )}

      {users.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-yellow-500/40 shadow-lg">
          <table className="min-w-full text-yellow-200">
            <thead className="bg-yellow-900/90 text-yellow-300 uppercase tracking-wider text-sm">
              <tr>
                <th className="px-6 py-3 border-r border-yellow-600/50">
                  Email
                </th>
                <th className="px-6 py-3 border-r border-yellow-600/50">
                  Created At
                </th>
                <th className="px-6 py-3 border-r border-yellow-600/50">
                  Role
                </th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u._id}
                  className={`${
                    idx % 2 === 0 ? "bg-yellow-900/20" : "bg-yellow-900/10"
                  } hover:bg-yellow-700/40 transition-colors`}
                >
                  <td className="px-6 py-4 border-r border-yellow-600/30 truncate max-w-xs">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 border-r border-yellow-600/30">
                    {new Date(u.createdAt || u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-r border-yellow-600/30">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        u.role === "admin"
                          ? "bg-green-600 text-white"
                          : "bg-yellow-700 text-yellow-200"
                      }`}
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleRoleChange(u._id, u.role || "user", u.email)
                      }
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-md transition ${
                        u.role === "admin"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-yellow-400 hover:bg-yellow-500 text-black"
                      }`}
                    >
                      {u.role === "admin" ? <FaUserTimes /> : <FaUserShield />}
                      {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </button>
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

export default MakeAdmin;
