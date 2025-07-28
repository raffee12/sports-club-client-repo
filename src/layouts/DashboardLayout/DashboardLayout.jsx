import React from "react";
import { Outlet } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

// Sidebar components
import UserDashboard from "../../pages/Dashboard/User/UserDashboard";
import MemberSidebar from "../../layouts/DashboardLayout/MemberSidebar";
import AdminSidebar from "../../layouts/DashboardLayout/AdminSidebar";
import useUserRole from "../../hooks/useUserRole";

const DashboardLayout = () => {
  const { role, isRoleLoading } = useUserRole();

  // Show loading spinner while role is being determined
  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  // Determine the correct sidebar based on role
  const renderSidebar = () => {
    if (role === "admin") return <AdminSidebar />;
    if (role === "member") return <MemberSidebar />;
    return <UserDashboard />;
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - visible on desktop */}
      <div className="lg:block hidden w-64 bg-[#001f45] text-white p-4">
        {renderSidebar()}
      </div>

      {/* Mobile Drawer */}
      <div className="drawer drawer-mobile lg:hidden">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex flex-col bg-gray-50 p-4">
          {/* Hamburger toggle */}
          <label
            htmlFor="dashboard-drawer"
            className="inline-flex items-center gap-2 bg-[#001f45] text-white px-4 py-2 rounded shadow-md hover:bg-yellow-400 hover:text-black transition-all duration-200 w-max mb-4"
          >
            <HiOutlineMenuAlt3 size={22} />
            <span className="text-sm font-medium">Menu</span>
          </label>

          <Outlet />
        </div>

        <div className="drawer-side z-40">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <aside className="w-64 bg-[#001f45] text-white p-4">
            {renderSidebar()}
          </aside>
        </div>
      </div>

      {/* Main content (desktop) */}
      <div className="flex-1 bg-gray-50  hidden lg:block">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
