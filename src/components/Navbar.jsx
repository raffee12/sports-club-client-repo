import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const { role, isRoleLoading } = useUserRole(); // ✅ properly destructure role and loading
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const effectiveRole = role || "user";

  const dashboardPath =
    effectiveRole === "admin"
      ? "/dashboard/admin/profile"
      : effectiveRole === "member"
      ? "/dashboard/member/pending"
      : "/dashboard/user/bookings";

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            Swal.fire({
              title: "Logged Out",
              text: "You have been logged out successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            navigate("/login");
            setMenuOpen(false);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.message,
            });
          });
      }
    });
  };

  return (
    <nav className="w-full bg-[#001f45] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between h-16">
        {/* Left: Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide hover:text-orange-400 transition-colors duration-300"
        >
          🏆 Sports Club
        </Link>

        {/* Center: Navigation links (desktop only) */}
        {user && (
          <ul className="hidden md:flex gap-10 text-lg font-medium items-center">
            <li>
              <Link
                to="/"
                className="hover:text-orange-400 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/courts"
                className="hover:text-orange-400 transition-colors duration-200"
              >
                Courts
              </Link>
            </li>
            <li>
              <Link
                to={dashboardPath}
                className="hover:text-orange-400 transition-colors duration-200"
              >
                {isRoleLoading ? "Dashboard..." : "Dashboard"}
              </Link>
            </li>
          </ul>
        )}

        {/* Right: Avatar + Logout (desktop) OR Hamburger (mobile) */}
        <div className="flex items-center gap-4">
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div
                  className="tooltip tooltip-left"
                  data-tip={user.displayName || user.email}
                >
                  <img
                    src={
                      user.photoURL || "https://i.ibb.co/MBtjqXQ/no-avatar.png"
                    }
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-white object-cover"
                  />
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm bg-orange-500 hover:bg-orange-600 border-none text-white px-4 py-1.5 rounded-md shadow transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-orange-400 transition-colors duration-200 text-lg font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded hover:bg-[#002d72]"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 bg-[#001f45]/95 backdrop-blur-sm shadow-lg">
          <ul className="flex flex-col gap-5 pt-5 border-t border-[#003a7a]">
            <li>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-orange-400 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/courts"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-orange-400 transition duration-300"
              >
                Courts
              </Link>
            </li>
            <li>
              <Link
                to={dashboardPath}
                onClick={() => setMenuOpen(false)}
                className="block hover:text-orange-400 transition duration-300"
              >
                {isRoleLoading ? "Dashboard..." : "Dashboard"}
              </Link>
            </li>
          </ul>

          {/* User Section (mobile) */}
          <div className="mt-6 border-t border-[#003a7a] pt-4 flex items-center gap-4">
            {user ? (
              <>
                <img
                  src={
                    user.photoURL || "https://i.ibb.co/MBtjqXQ/no-avatar.png"
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-md shadow"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-orange-400 transition duration-300 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
