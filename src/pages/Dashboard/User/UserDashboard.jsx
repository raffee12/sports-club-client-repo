import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineNotification,
} from "react-icons/ai";
import useUserRole from "../../../hooks/useUserRole";

const UserDashboard = () => {
  const { role, isAdmin, isRoleLoading } = useUserRole();
  const navigate = useNavigate();

  // ✅ Redirect to admin dashboard if user becomes admin
  useEffect(() => {
    if (!isRoleLoading && isAdmin) {
      navigate("/dashboard/admin/profile", { replace: true });
    }
  }, [isAdmin, isRoleLoading, navigate]);

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold shadow transition-all"
      : "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-yellow-400 hover:text-black transition-all duration-200";

  if (isRoleLoading) {
    return (
      <div className="text-center text-yellow-400 font-medium animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white px-4 pt-2 capitalize">
        {role} Dashboard
      </h2>

      <ul className="menu space-y-2 text-base font-medium">
        <li>
          <NavLink to="/" className={linkClass}>
            <AiOutlineHome size={20} />
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/user/bookings" className={linkClass}>
            <AiOutlineHome size={20} />
            Pending Bookings
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/user/profile" className={linkClass}>
            <AiOutlineUser size={20} />
            My Profile
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/user/announcements" className={linkClass}>
            <AiOutlineNotification size={20} />
            Announcements
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default UserDashboard;
