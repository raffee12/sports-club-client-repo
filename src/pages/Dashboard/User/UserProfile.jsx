import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

export default function UserProfile() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/${user.email}`)
        .then((res) => {
          setUserData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user?.email, axiosSecure]);

  if (!user) {
    return (
      <p className="text-center text-red-300 italic mt-20 text-lg">
        User not logged in.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-center text-gray-400 italic mt-20 text-lg">
        Loading profile...
      </p>
    );
  }

  const photo =
    userData?.photo || user.photoURL || "/images/default-profile.png";
  const name = userData?.name || user.displayName || "Anonymous";
  const email = userData?.email || user.email || "Unknown";
  const phone = userData?.phone || "Not Provided";
  const address = userData?.address || "Not Provided";
  const createdAt = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-gradient-to-tr from-[#001f45] via-[#002d6a] to-[#003f90] px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white dark:bg-[#0a1a3b] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border-t-4 border-orange-500 p-8 md:p-10"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Image */}
          <img
            src={photo}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-orange-500 shadow-lg object-cover transition-transform hover:scale-105"
          />

          {/* Name */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#001f45] dark:text-white tracking-wide">
            {name}
          </h2>

          {/* Email, Phone, Address */}
          <div className="w-full mt-4 space-y-3">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <FaEnvelope className="text-orange-500" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <FaPhoneAlt className="text-orange-500" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <FaMapMarkerAlt className="text-orange-500" />
              <span>{address}</span>
            </div>
          </div>

          {/* Registered Date */}
          <p className="mt-4 text-sm italic text-gray-500 dark:text-gray-400">
            Registered on: <span className="font-medium">{createdAt}</span>
          </p>

          {/* Optional Button for Edit Profile */}
          {/* <button className="btn bg-orange-500 text-white hover:bg-orange-600 mt-4 w-full">
            Edit Profile
          </button> */}
        </div>
      </motion.div>
    </div>
  );
}
