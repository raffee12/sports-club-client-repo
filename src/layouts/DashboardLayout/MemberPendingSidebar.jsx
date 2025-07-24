import React from "react";
import { Link } from "react-router-dom";

export default function MemberPendingSidebar() {
  return (
    <nav className="flex flex-col gap-4">
      <div className="font-semibold text-lg mb-4">Membership Pending</div>
      <p>Your membership application is under review.</p>
      <Link
        to="/dashboard/user/profile"
        className="text-blue-400 hover:underline mt-4"
      >
        Back to Profile
      </Link>
    </nav>
  );
}
