import React from "react";
import { Navigate } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";

const DashboardRedirect = () => {
  const { isRoleLoading, isAdmin, isMember } = useUserRole();

  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-yellow-400 font-medium animate-pulse">
        Redirecting...
      </div>
    );
  }

  if (isAdmin) return <Navigate to="/dashboard/admin/profile" replace />;
  if (isMember) return <Navigate to="/dashboard/member/profile" replace />;

  return <Navigate to="/dashboard/user/bookings" replace />;
};

export default DashboardRedirect;
