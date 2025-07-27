import React, { useEffect, useState } from "react";
import { FaUsers, FaDoorOpen, FaUserShield } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminProfile = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [counts, setCounts] = useState({
    totalCourts: 0,
    totalUsers: 0,
    totalMembers: 0,
  });

  // ✅ Fetch admin role
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/role/${user.email}`) // <-- fixed typo here
        .then((res) => setRole(res.data.role))
        .catch((err) => {
          console.error("Role fetch failed", err);
          setRole("unauthorized");
        });
    }
  }, [user, axiosSecure]);

  // ✅ Fetch dashboard stats
  useEffect(() => {
    if (role === "admin") {
      const fetchCounts = async () => {
        try {
          const [courtsRes, usersRes, membersRes] = await Promise.all([
            axiosSecure.get("/courts/count"),
            axiosSecure.get("/users/count"),
            axiosSecure.get("/members/count"),
          ]);
          setCounts({
            totalCourts: courtsRes.data.count || 0,
            totalUsers: usersRes.data.count || 0,
            totalMembers: membersRes.data.count || 0,
          });
        } catch (error) {
          console.error("Failed to fetch counts:", error);
        }
      };
      fetchCounts();
    }
  }, [role, axiosSecure]);

  // ✅ Loading State
  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  // ❌ Unauthorized role fallback
  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <p className="text-lg font-semibold">Access Denied: Admins only</p>
      </div>
    );
  }

  // ✅ Render Admin Profile
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-12 px-4 flex justify-center items-start text-white">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl space-y-10">
        {/* Admin Info */}
        <div className="flex flex-col items-center text-center">
          <img
            src={user.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
            alt="Admin Avatar"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-md object-cover mb-4"
          />
          <h2 className="text-3xl font-bold tracking-wide">
            {user.displayName || "Admin"}
          </h2>
          <p className="text-indigo-300 text-lg">{user.email}</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-white/20 rounded-xl p-6 flex flex-col items-center shadow-lg border border-white/30">
            <FaDoorOpen size={48} className="mb-3 text-indigo-400" />
            <p className="text-3xl font-extrabold">{counts.totalCourts}</p>
            <p className="text-lg mt-1">Total Courts</p>
          </div>

          <div className="bg-white/20 rounded-xl p-6 flex flex-col items-center shadow-lg border border-white/30">
            <FaUsers size={48} className="mb-3 text-indigo-400" />
            <p className="text-3xl font-extrabold">{counts.totalUsers}</p>
            <p className="text-lg mt-1">Total Users</p>
          </div>

          <div className="bg-white/20 rounded-xl p-6 flex flex-col items-center shadow-lg border border-white/30">
            <FaUserShield size={48} className="mb-3 text-indigo-400" />
            <p className="text-3xl font-extrabold">{counts.totalMembers}</p>
            <p className="text-lg mt-1">Total Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
