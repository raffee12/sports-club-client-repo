import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MemberProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: member = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["memberProfile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/members?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner text-primary w-12 h-12"></span>
      </div>
    );
  }

  if (isError || !member?.email) {
    return (
      <div className="text-center text-red-600 font-semibold">
        Failed to load member profile.
      </div>
    );
  }

  return (
    <div className="mt-5 min-h-[400px] bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white p-8 rounded-xl max-w-3xl mx-auto shadow-lg">
      <h2 className="text-4xl font-bold mb-8 text-center">Member Profile</h2>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        <img
          src={member.image || user.photoURL}
          alt="Profile"
          className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg"
        />
        <div className="space-y-4 text-lg">
          <p>
            <span className="font-semibold text-gray-300">Name:</span>{" "}
            {member.name || user.displayName}
          </p>
          <p>
            <span className="font-semibold text-gray-300">Email:</span>{" "}
            {member.email}
          </p>
          <p>
            <span className="font-semibold text-gray-300">Joined:</span>{" "}
            {new Date(member.joinDate || member.joinedAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold text-gray-300">Role:</span> Member
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
