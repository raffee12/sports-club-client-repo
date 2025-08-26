// src/layouts/DashboardLayout/UserSidebar.jsx
import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineNotification,
  AiOutlineDashboard,
} from "react-icons/ai";
import gsap from "gsap";

const UserSidebar = () => {
  const linkRefs = useRef([]);

  // GSAP hover animation
  useEffect(() => {
    linkRefs.current.forEach((link) => {
      if (link) {
        gsap.set(link, { color: "#ffffff" }); // default white
        link.addEventListener("mouseenter", () => {
          gsap.to(link, { color: "#ff6b00", duration: 0.3 });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, { color: "#ffffff", duration: 0.3 });
        });
      }
    });
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-2 rounded-lg bg-orange-400 text-black font-semibold shadow transition-all duration-300"
      : "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300";

  const links = [
    { to: "/", icon: <AiOutlineHome size={20} />, label: "Home" },
    {
      to: "/dashboard/user/overview",
      icon: <AiOutlineDashboard size={20} />,
      label: "Overview",
    },
    {
      to: "/dashboard/user/bookings",
      icon: <AiOutlineHome size={20} />,
      label: "Pending Bookings",
    },
    {
      to: "/dashboard/user/profile",
      icon: <AiOutlineUser size={20} />,
      label: "My Profile",
    },
    {
      to: "/dashboard/user/announcements",
      icon: <AiOutlineNotification size={20} />,
      label: "Announcements",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white px-4 pt-2 capitalize">
        User Dashboard
      </h2>

      <ul className="menu space-y-2 text-base font-medium">
        {links.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.to}
              className={linkClass}
              ref={(el) => (linkRefs.current[index] = el)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSidebar;
