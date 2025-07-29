import React from "react";
import { NavLink } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineNotification,
  AiOutlineSetting,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { MdOutlineDiscount, MdOutlineSportsTennis } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import { FaUserShield } from "react-icons/fa";

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold shadow transition-all"
      : "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-yellow-400 hover:text-black transition-all duration-200";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white px-4 pt-2">Admin Panel</h2>

      <ul className="menu space-y-2 text-base font-medium">
        <li>
          <NavLink to="/" className={linkClass}>
            <AiOutlineHome size={20} />
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/admin/profile" className={linkClass}>
            <AiOutlineUser size={20} />
            Admin Profile
          </NavLink>
        </li>
        {/* ✅ Make Admin — only shown in AdminSidebar */}
        <li>
          <NavLink to="/dashboard/admin/make-admin" className={linkClass}>
            <AiOutlineUserAdd size={20} />
            Make Admin
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/admin/approvals" className={linkClass}>
            <AiOutlineUser size={20} />
            Bookings Approval
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/admin/announcement" className={linkClass}>
            <AiOutlineNotification size={20} />
            Make Announcement
          </NavLink>
        </li>

        {/* <li>
          <NavLink to="/dashboard/admin/bookings" className={linkClass}>
            <AiOutlineSetting size={20} />
            Manage Bookings
          </NavLink>
        </li> */}

        <li>
          <NavLink to="/dashboard/admin/coupons" className={linkClass}>
            <MdOutlineDiscount size={20} />
            Manage Coupons
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/admin/courts" className={linkClass}>
            <MdOutlineSportsTennis size={20} />
            Manage Courts
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/admin/manage-members" className={linkClass}>
            <HiOutlineUsers size={20} />
            Manage Members
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/admin/users" className={linkClass}>
            <FaUserShield size={20} />
            Manage Users
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
