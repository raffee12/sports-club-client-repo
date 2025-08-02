import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";

// Public Pages
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import CourtsPage from "../pages/CourtsPage.jsx";
import ForbiddenPage from "../pages/forbidden/forbiddenPage.jsx";
import ErrorPage from "../pages/Error/ErrorPage.jsx";

// Route Guards
import PrivateRoute from "./PrivateRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import MemberRoute from "./MemberRoute.jsx";
import DashboardRedirect from "../components/DashboardRedirect.jsx";

// ✅ User Dashboard Pages
import UserDashboard from "../pages/Dashboard/User/UserDashboard.jsx"; // ✅ ADDED
import UserProfile from "../pages/Dashboard/User/UserProfile.jsx";
import UserBookings from "../pages/Dashboard/User/UserBookings.jsx";
import UserAnnouncements from "../pages/Dashboard/User/UserAnnouncements.jsx";

// ✅ Admin Dashboard Pages
import AdminProfile from "../pages/Dashboard/Admin/AdminProfile.jsx";
import MakeAdmin from "../pages/Dashboard/Admin/MakeAdmin.jsx";
import MakeAnnouncement from "../pages/Dashboard/Admin/MakeAnnouncement.jsx";
import ManageBookings from "../pages/Dashboard/Admin/ManageBookings.jsx";
import ManageCoupons from "../pages/Dashboard/Admin/ManageCoupons.jsx";
import ManageCourts from "../pages/Dashboard/Admin/ManageCourts.jsx";
import ManageMembers from "../pages/Dashboard/Admin/ManageMembers.jsx";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers.jsx";
import ManageBookingsApproval from "../pages/Dashboard/Admin/ManageBookingsApproval.jsx";

// ✅ Member Dashboard Pages
import MemberProfile from "../pages/Dashboard/Member/MemberProfile.jsx";
import PendingBookings from "../pages/Dashboard/Member/PendingBookings.jsx";
import ApprovedBookings from "../pages/Dashboard/Member/ApprovedBookings.jsx";
import ConfirmedBookings from "../pages/Dashboard/Member/ConfirmedBookings.jsx";
import PaymentPage from "../pages/Dashboard/Member/PaymentPage.jsx";
import PaymentHistory from "../pages/Dashboard/Member/PaymentHistory.jsx";

const router = createBrowserRouter([
  // 🌐 Public Site
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/courts", element: <CourtsPage /> },
      { path: "/forbidden", element: <ForbiddenPage /> },
    ],
  },

  // 🧭 Dashboard (protected layout)
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // 🔁 Smart redirect to role-specific dashboard
      { index: true, element: <DashboardRedirect /> },

      // ✅ User Routes
      {
        path: "user",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "user/profile",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "user/bookings",
        element: (
          <PrivateRoute>
            <UserBookings />
          </PrivateRoute>
        ),
      },
      {
        path: "user/announcements",
        element: (
          <PrivateRoute>
            <UserAnnouncements />
          </PrivateRoute>
        ),
      },

      // ✅ Admin Routes
      {
        path: "admin/profile",
        element: (
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        ),
      },
      {
        path: "admin/make-admin",
        element: (
          <AdminRoute>
            <MakeAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "admin/announcement",
        element: (
          <AdminRoute>
            <MakeAnnouncement />
          </AdminRoute>
        ),
      },
      {
        path: "admin/approvals",
        element: (
          <AdminRoute>
            <ManageBookingsApproval />
          </AdminRoute>
        ),
      },
      {
        path: "admin/bookings",
        element: (
          <AdminRoute>
            <ManageBookings />
          </AdminRoute>
        ),
      },
      {
        path: "admin/coupons",
        element: (
          <AdminRoute>
            <ManageCoupons />
          </AdminRoute>
        ),
      },
      {
        path: "admin/courts",
        element: (
          <AdminRoute>
            <ManageCourts />
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-members",
        element: (
          <AdminRoute>
            <ManageMembers />
          </AdminRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },

      // ✅ Member Routes
      {
        path: "member/profile",
        element: (
          <MemberRoute>
            <MemberProfile />
          </MemberRoute>
        ),
      },
      {
        path: "member/pending",
        element: (
          <MemberRoute>
            <PendingBookings />
          </MemberRoute>
        ),
      },
      {
        path: "member/approved",
        element: (
          <MemberRoute>
            <ApprovedBookings />
          </MemberRoute>
        ),
      },
      {
        path: "member/confirmed",
        element: (
          <MemberRoute>
            <ConfirmedBookings />
          </MemberRoute>
        ),
      },
      {
        path: "member/pay",
        element: (
          <MemberRoute>
            <PaymentPage />
          </MemberRoute>
        ),
      },
      {
        path: "member/payments",
        element: (
          <MemberRoute>
            <PaymentHistory />
          </MemberRoute>
        ),
      },
      {
        path: "member/announcements",
        element: (
          <MemberRoute>
            <UserAnnouncements />
          </MemberRoute>
        ),
      },
    ],
  },
]);

export default router;
