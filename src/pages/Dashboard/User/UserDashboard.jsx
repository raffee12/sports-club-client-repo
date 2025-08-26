import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import gsap from "gsap";
import useUserRole from "../../../hooks/useUserRole";

// Sidebar components
import UserSidebar from "../../../layouts/DashboardLayout/UserSidebar";
import MemberSidebar from "../../../layouts/DashboardLayout/MemberSidebar";
import AdminSidebar from "../../../layouts/DashboardLayout/AdminSidebar";

const DashboardLayout = () => {
  const { role, isRoleLoading } = useUserRole();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  // Prevent rendering until role is loaded
  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  // Determine sidebar component safely
  const SidebarComponent =
    role === "admin"
      ? AdminSidebar
      : role === "member"
      ? MemberSidebar
      : UserSidebar;

  // GSAP drawer animation
  const toggleDrawer = (open) => {
    if (!drawerRef.current || !overlayRef.current) return;

    const tl = gsap.timeline();
    if (open) {
      // Show drawer
      tl.set(overlayRef.current, { display: "block" })
        .to(drawerRef.current, {
          x: 0,
          duration: 0.5,
          ease: "power3.out",
        })
        .to(
          overlayRef.current,
          { autoAlpha: 1, duration: 0.3, ease: "power3.out" },
          "<"
        );
    } else {
      // Hide drawer
      tl.to(drawerRef.current, {
        x: "-100%",
        duration: 0.5,
        ease: "power3.in",
      }).to(
        overlayRef.current,
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => (overlayRef.current.style.display = "none"),
        },
        "<"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-[#001f45] text-white p-4">
        <SidebarComponent />
      </div>

      {/* Mobile Drawer */}
      <div className="lg:hidden relative flex-1">
        {/* Overlay */}
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/40 opacity-0 z-30 hidden"
          onClick={() => toggleDrawer(false)}
        ></div>

        {/* Drawer */}
        <aside
          ref={drawerRef}
          className="fixed top-0 left-0 h-screen w-[90vw] max-w-[400px] bg-[#001f45] text-white z-40 transform -translate-x-full"
        >
          <div className="p-8">
            <SidebarComponent />
          </div>
        </aside>

        {/* Hamburger */}
        <div className="p-4">
          <button
            onClick={() => toggleDrawer(true)}
            className="inline-flex items-center gap-2 bg-[#001f45] text-white px-4 py-2 rounded shadow-md hover:bg-orange-500 transition-all duration-200"
          >
            <HiOutlineMenuAlt3 size={22} />
            <span className="font-medium">Menu</span>
          </button>
        </div>

        {/* Outlet for content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Main content for desktop */}
      <div className="flex-1 hidden lg:block p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
