import React, { useEffect, useState } from "react";
import { FaUsers, FaDoorOpen, FaUserShield, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const COLORS = ["#6366F1", "#4F46E5", "#3B82F6", "#818CF8", "#A5B4FC"];

const AdminOverview = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [counts, setCounts] = useState({
    totalCourts: 0,
    totalUsers: 0,
    totalMembers: 0,
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    bookingsByStatus: [],
    revenueByMonth: [],
    mostBookedCourts: [],
  });

  // Fetch admin role
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/role/${user.email}`)
        .then((res) => setRole(res.data.role))
        .catch(() => setRole("unauthorized"));
    }
  }, [user, axiosSecure]);

  // Fetch counts and stats
  useEffect(() => {
    if (role === "admin") {
      const fetchData = async () => {
        try {
          const [courtsRes, usersRes, membersRes, statsRes] = await Promise.all([
            axiosSecure.get("/courts/count"),
            axiosSecure.get("/users/count"),
            axiosSecure.get("/members/count"),
            axiosSecure.get("/dashboard/stats"), // New endpoint from server
          ]);

          setCounts({
            totalCourts: courtsRes.data.count || 0,
            totalUsers: usersRes.data.count || 0,
            totalMembers: membersRes.data.count || 0,
          });

          setStats(statsRes.data || {});
        } catch (err) {
          console.error("Failed to fetch admin stats:", err);
        }
      };

      fetchData();
    }
  }, [role, axiosSecure]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <p className="text-lg font-semibold">Access Denied: Admins only</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-12 px-4 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side: Admin Info */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center"
        >
          <img
            src={user.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
            alt="Admin Avatar"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-md object-cover mb-4"
          />
          <h2 className="text-3xl font-bold tracking-wide">{user.displayName || "Admin"}</h2>
          <p className="text-indigo-300 text-lg">{user.email}</p>
        </motion.div>

        {/* Right Side: Stats Overview */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-8"
        >
          {/* Top Counts */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            <div className="bg-white/20 rounded-xl p-4 shadow-lg border border-white/30">
              <FaDoorOpen size={36} className="mx-auto text-indigo-400 mb-2" />
              <p className="text-2xl font-bold"><CountUp end={counts.totalCourts} duration={1.5} /></p>
              <p>Total Courts</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 shadow-lg border border-white/30">
              <FaUsers size={36} className="mx-auto text-indigo-400 mb-2" />
              <p className="text-2xl font-bold"><CountUp end={counts.totalUsers} duration={1.5} /></p>
              <p>Total Users</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 shadow-lg border border-white/30">
              <FaUserShield size={36} className="mx-auto text-indigo-400 mb-2" />
              <p className="text-2xl font-bold"><CountUp end={counts.totalMembers} duration={1.5} /></p>
              <p>Total Members</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 shadow-lg border border-white/30">
              <FaMoneyBillWave size={36} className="mx-auto text-indigo-400 mb-2" />
              <p className="text-2xl font-bold"><CountUp end={stats.totalRevenue} duration={1.5} prefix="$" /></p>
              <p>Total Revenue</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bookings By Status Pie */}
            <div className="bg-white/20 p-4 rounded-xl shadow-lg border border-white/30">
              <h3 className="text-lg font-semibold mb-2 text-indigo-200">Bookings By Status</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.bookingsByStatus || []}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {(stats.bookingsByStatus || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue By Month Bar */}
            <div className="bg-white/20 p-4 rounded-xl shadow-lg border border-white/30">
              <h3 className="text-lg font-semibold mb-2 text-indigo-200">Revenue By Month</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.revenueByMonth || []}>
                  <XAxis dataKey="month" stroke="#A5B4FC" />
                  <YAxis stroke="#A5B4FC" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Most Booked Courts Pie */}
            <div className="bg-white/20 p-4 rounded-xl shadow-lg border border-white/30 md:col-span-2">
              <h3 className="text-lg font-semibold mb-2 text-indigo-200">Most Booked Courts</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.mostBookedCourts || []}
                    dataKey="count"
                    nameKey="courtName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {(stats.mostBookedCourts || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;
