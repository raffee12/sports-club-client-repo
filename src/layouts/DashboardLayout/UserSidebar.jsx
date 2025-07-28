// src/layouts/DashboardLayout/UserSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineNotification,
} from "react-icons/ai";

const UserSidebar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold shadow transition-all"
      : "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-yellow-400 hover:text-black transition-all duration-200";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white px-4 pt-2 capitalize">
        User Dashboard
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

export default UserSidebar;
