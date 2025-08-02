import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserRole from "../../../hooks/useUserRole";

const UserDashboard = () => {
  const { role, isAdmin, isMember, isRoleLoading } = useUserRole();
  const navigate = useNavigate();

  // Redirect to admin dashboard
  useEffect(() => {
    if (!isRoleLoading && isAdmin) {
      navigate("/dashboard/admin/profile", { replace: true });
    }
  }, [isAdmin, isRoleLoading, navigate]);

  // Redirect to member dashboard
  useEffect(() => {
    if (!isRoleLoading && isMember) {
      navigate("/dashboard/member/profile", { replace: true });
    }
  }, [isMember, isRoleLoading, navigate]);

  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p className="mb-4 text-gray-700">
        You are currently logged in as a <strong>{role}</strong>.
      </p>
    </div>
  );
};

export default UserDashboard;
