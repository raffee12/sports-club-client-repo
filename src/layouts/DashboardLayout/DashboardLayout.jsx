import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

// Sidebar components
import UserSidebar from "../../layouts/DashboardLayout/UserSidebar";
import MemberSidebar from "../../layouts/DashboardLayout/MemberSidebar";
import AdminSidebar from "../../layouts/DashboardLayout/AdminSidebar";
import useUserRole from "../../hooks/useUserRole";

const DashboardLayout = () => {
  const { role, isRoleLoading } = useUserRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  const renderSidebar = () => {
    if (role === "admin") return <AdminSidebar />;
    if (role === "member") return <MemberSidebar />;
    return <UserSidebar />;
  };

  // GSAP animation for drawer
  useEffect(() => {
    if (drawerRef.current) {
      if (isDrawerOpen) {
        gsap.to(drawerRef.current, {
          x: 0,
          duration: 0.5,
          ease: "power3.out",
        });
      } else {
        gsap.to(drawerRef.current, {
          x: "-100%",
          duration: 0.5,
          ease: "power3.in",
        });
      }
    }
  }, [isDrawerOpen]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="lg:block hidden w-64 bg-[#001f45] text-white p-4">
        {renderSidebar()}
      </div>

      {/* Mobile Drawer */}
      <div className="lg:hidden flex-1">
        {/* Hamburger toggle */}
        <div className="p-4">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 bg-[#001f45] text-white px-4 py-2 rounded shadow-md hover:bg-orange-500 hover:text-white transition-all duration-200"
          >
            <HiOutlineMenuAlt3 size={22} />
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>

        <Outlet />

        {/* Drawer overlay */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
              ></motion.div>

              <aside
                ref={drawerRef}
                className="fixed top-0 left-0 h-screen w-[40vw] max-w-xs bg-[#001f45] text-white p-4 z-50 flex flex-col space-y-4"
                style={{ transform: "translateX(-100%)" }}
              >
                {/* Close button */}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="self-end text-orange-500 hover:text-white mb-4"
                >
                  ✕
                </button>

                {/* Sidebar links */}
                <div className="flex flex-col gap-3 text-white hover:text-orange-500 transition-colors">
                  {renderSidebar()}
                </div>
              </aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main content (desktop) */}
      <div className="flex-1 bg-gray-50 hidden lg:block">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
