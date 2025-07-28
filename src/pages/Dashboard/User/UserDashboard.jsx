// src/pages/Dashboard/User/UserDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserRole from "../../../hooks/useUserRole";
import BecomeMemberButton from "../../../components/BecomeMemberButton";

const UserDashboard = () => {
  const { role, isAdmin, isMember, isRoleLoading } = useUserRole();
  const navigate = useNavigate();

  // Redirect to admin dashboard if user is admin
  useEffect(() => {
    if (!isRoleLoading && isAdmin) {
      navigate("/dashboard/admin/profile", { replace: true });
    }
  }, [isAdmin, isRoleLoading, navigate]);

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

      {!isMember && (
        <div className="bg-white p-6 shadow rounded max-w-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Become a Club Member
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            As a member, you get priority court bookings, member-only deals, and
            more.
          </p>
          <BecomeMemberButton />
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
