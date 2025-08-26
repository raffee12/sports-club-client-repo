import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { gsap } from "gsap";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const userActionsRef = useRef(null);

  const effectiveRole = role || "user";
  const dashboardPath =
    effectiveRole === "admin"
      ? "/dashboard/admin/profile"
      : effectiveRole === "member"
      ? "/dashboard/member/pending"
      : "/dashboard/user/bookings";

  const additionalRoutes = [
    { name: "Blog", path: "/BlogPage" },
    { name: "Training", path: "/training" },
  ];

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
        logOut().then(() => {
          Swal.fire({
            title: "Logged Out",
            text: "You have been logged out successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          navigate("/login");
          setMenuOpen(false);
        });
      }
    });
  };

  // Animate mobile menu
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        menuRef.current,
        { x: "-100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
      );

      // Animate links staggered
      gsap.fromTo(
        linksRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.2,
          ease: "power3.out",
        }
      );

      // Animate user actions
      if (userActionsRef.current) {
        gsap.fromTo(
          userActionsRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, delay: 0.4, ease: "power3.out" }
        );
      }
    }
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#001f45] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide hover:text-[#f97316] transition-colors duration-300"
        >
          🏆 Sports Club
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-lg font-medium items-center">
          <li>
            <Link
              to="/"
              className="hover:text-[#f97316] transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/courts"
              className="hover:text-[#f97316] transition-colors duration-200"
            >
              Courts
            </Link>
          </li>
          {user &&
            additionalRoutes.map((route) => (
              <li key={route.name}>
                <Link
                  to={route.path}
                  className="hover:text-[#f97316] transition-colors duration-200"
                >
                  {route.name}
                </Link>
              </li>
            ))}
          <li>
            <Link
              to={dashboardPath}
              className="hover:text-[#f97316] transition-colors duration-200"
            >
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <img
                src={user.photoURL || "https://i.ibb.co/MBtjqXQ/no-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <button
                onClick={handleLogout}
                className="px-5 py-1.5 border-2 border-[#f97316] text-[#f97316] rounded-md font-medium hover:bg-[#f97316] hover:text-white transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-1.5 border-2 border-[#f97316] text-[#f97316] rounded-md font-medium hover:bg-[#f97316] hover:text-white transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 focus:outline-none"
        >
          <span
            className={`h-1 w-6 rounded bg-white transition-all ${
              menuOpen ? "rotate-45 translate-y-2 bg-[#f97316]" : ""
            }`}
          />
          <span
            className={`h-1 w-6 rounded bg-white transition-all ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-1 w-6 rounded bg-white transition-all ${
              menuOpen ? "-rotate-45 -translate-y-2 bg-[#f97316]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <>
          {/* Background Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Dropdown Menu */}
          <div
            ref={menuRef}
            className="fixed top-0 left-0 z-50 w-3/5 h-full bg-white/20 backdrop-blur-md flex flex-col justify-center items-center gap-10 text-xl font-semibold text-white shadow-lg p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-orange-500 transition-colors"
            >
              &times;
            </button>

            {/* Menu Links */}
            <ul className="flex flex-col gap-6 text-center w-full">
              {[
                { name: "Home", path: "/" },
                { name: "Courts", path: "/courts" },
                ...(user ? additionalRoutes : []),
                ...(user ? [{ name: "Dashboard", path: dashboardPath }] : []),
              ].map((link, i) => (
                <li
                  key={link.name}
                  ref={(el) => (linksRef.current[i] = el)}
                  className="hover:text-orange-500 transition-colors"
                >
                  <Link to={link.path} onClick={() => setMenuOpen(false)}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* User Actions */}
            <div
              ref={userActionsRef}
              className="flex flex-col gap-4 items-center mt-10"
            >
              {user ? (
                <>
                  <img
                    src={
                      user.photoURL || "https://i.ibb.co/MBtjqXQ/no-avatar.png"
                    }
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full border-2 border-white object-cover"
                  />
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-md font-medium hover:bg-orange-500 hover:text-white transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-md font-medium hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
