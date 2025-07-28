// components/BecomeMemberButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import Swal from "sweetalert2";

const BecomeMemberButton = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { refetchRole } = useUserRole();
  const navigate = useNavigate();

  const handleBecomeMember = async () => {
    try {
      const response = await axiosSecure.post("/members", {
        email: user.email,
        name: user.displayName,
        joinedAt: new Date().toISOString(),
      });

      if (response.status === 200 || response.status === 201) {
        await refetchRole(); // ✅ Force role update from server
        navigate("/dashboard/member"); // ✅ Navigate to correct dashboard
      } else {
        throw new Error("Membership creation failed");
      }
    } catch (err) {
      console.error("Error becoming member:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while becoming a member.",
      });
    }
  };

  return (
    <button
      onClick={handleBecomeMember}
      className="btn btn-success w-full mt-4"
    >
      Become a Member
    </button>
  );
};

export default BecomeMemberButton;
