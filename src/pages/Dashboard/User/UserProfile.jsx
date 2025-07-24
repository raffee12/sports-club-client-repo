import React from "react";
import useAuth from "../../../hooks/useAuth";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <p className="text-center text-red-300 italic mt-20 text-lg">
        User not logged in.
      </p>
    );
  }

  // ✅ Use displayName and photoURL instead of user.name and user.photo
  const photo = user.photoURL || "/images/default-profile.png";
  const name = user.displayName || "Anonymous";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-tr from-[#001f45] via-[#002d6a] to-[#003f90] px-6 py-10">
      <div className="max-w-md w-full bg-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border-t-4 border-[#001f45] p-10 animate-fade-in">
        <h2 className="text-4xl font-extrabold text-[#001f45] mb-10 text-center tracking-wide drop-shadow-sm">
          My Profile
        </h2>

        <div className="flex flex-col items-center space-y-8">
          <img
            src={photo}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-[#001f45] shadow-xl object-cover transition-transform hover:scale-105"
          />
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-[#001f45] tracking-wide">
              {name}
            </p>
            <p className="text-gray-700 text-md">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeInUp 0.6s ease-out both;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
