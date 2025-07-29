import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUserCircle,
  FaClock,
  FaCheckCircle,
  FaHistory,
  FaWallet,
  FaBullhorn,
  FaClipboardList,
} from "react-icons/fa";

export default function MemberSidebar() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content overlay for mobile */}
      <div className="drawer-content lg:hidden p-4">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-sm btn-outline drawer-button"
        >
          ☰ Menu
        </label>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-[#001f45] text-white space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }
            >
              <FaUserCircle /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/member/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }
            >
              <FaUserCircle /> My Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/member/pending"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }
            >
              <FaClock /> Pending Bookings
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/member/approved"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }
            >
              <FaClipboardList /> Approved Bookings
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/member/confirmed"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }
            >
              <FaCheckCircle /> Confirmed Bookings
            </NavLink>
          </li>

          {/* <li>
            <NavLink
              to="/dashboard/member/pay"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }
            >
              <FaWallet /> Make Payment
            </NavLink>
          </li> */}

          <li>
            <NavLink
              to="/dashboard/member/payments"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }
            >
              <FaHistory /> Payment History
            </NavLink>
          </li>

          {/* <li>
            <NavLink
              to="/dashboard/member/announcements"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-400 font-semibold"
                  : "text-white hover:text-orange-300"
              }
            >
              <FaBullhorn /> Announcements
            </NavLink>
          </li> */}
        </ul>
      </div>
    </div>
  );
}
