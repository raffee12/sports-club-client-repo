import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEnvelope, FaUser, FaCalendarAlt } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: memberData, isLoading } = useQuery({
    queryKey: ["member", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/members?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner w-12 h-12 text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 rounded-2xl shadow-xl bg-base-100 border border-base-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        My Profile
      </h2>

      <div className="space-y-5 text-lg">
        <p className="flex items-center gap-3">
          <FaUser className="text-primary" />
          <span className="font-semibold">Name:</span>{" "}
          {user?.displayName || "N/A"}
        </p>
        <p className="flex items-center gap-3">
          <FaEnvelope className="text-secondary" />
          <span className="font-semibold">Email:</span> {user?.email}
        </p>
        <p className="flex items-center gap-3">
          <FaCalendarAlt className="text-accent" />
          <span className="font-semibold">Joined As Member On:</span>{" "}
          {memberData?.joinedAt
            ? new Date(memberData.joinedAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MyProfile;
