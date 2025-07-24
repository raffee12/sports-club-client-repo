import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";

// Pages
import ErrorPage from "../pages/Error/ErrorPage.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import CourtsPage from "../pages/CourtsPage.jsx";
import ForbiddenPage from "../pages/forbidden/forbiddenPage.jsx";

// User Pages
import UserBookings from "../pages/Dashboard/User/UserBookings.jsx";
import UserAnnouncements from "../pages/Dashboard/User/UserAnnouncements.jsx";
import UserProfile from "../pages/Dashboard/User/UserProfile.jsx";
import MakeAdmin from "../pages/Dashboard/User/MakeAdmin.jsx";

// Admin Pages
import AdminProfile from "../pages/Dashboard/Admin/AdminProfile.jsx";
import MakeAnnouncement from "../pages/Dashboard/Admin/MakeAnnouncement.jsx";
import ManageBookings from "../pages/Dashboard/Admin/ManageBookings.jsx";
import ManageCoupons from "../pages/Dashboard/Admin/ManageCoupons.jsx";
import ManageCourts from "../pages/Dashboard/Admin/ManageCourts.jsx";
import ManageMembers from "../pages/Dashboard/Admin/ManageMembers.jsx";
import ManageUser from "../pages/Dashboard/Admin/ManageUsers.jsx";
import ManageBookingsApproval from "../pages/Dashboard/Admin/ManageBookingsApproval.jsx";

// Member Pages
import MemberProfile from "../pages/Dashboard/Member/MemberProfile.jsx";
import PendingBookings from "../pages/Dashboard/Member/PendingBookings.jsx";
import ApprovedBookings from "../pages/Dashboard/Member/ApprovedBookings.jsx";
import ConfirmedBookings from "../pages/Dashboard/Member/ConfirmedBookings.jsx";
import PaymentPage from "../pages/Dashboard/Member/PaymentPage.jsx";
import PaymentHistory from "../pages/Dashboard/Member/PaymentHistory.jsx";
import MemberAnnouncements from "../pages/Dashboard/Member/MemberAnnouncements.jsx";

// Routes and protection
import AdminRoute from "./AdminRoute.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import MemberRoute from "./MemberRoute.jsx";
import DashboardRedirect from "../components/DashboardRedirect.jsx"; // smart role-based redirect

const router = createBrowserRouter([
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
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardRedirect />,
      },

      // 🟡 User Routes
      { path: "user/profile", element: <UserProfile /> },
      { path: "user/bookings", element: <UserBookings /> },
      { path: "user/announcements", element: <UserAnnouncements /> },
      {
        path: "user/make-admin",
        element: (
          <PrivateRoute>
            <MakeAdmin />
          </PrivateRoute>
        ),
      },

      // 🔒 Admin Protected Routes
      {
        path: "admin/profile",
        element: (
          <AdminRoute>
            <AdminProfile />
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
        path: "admin/members",
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
            <ManageUser />
          </AdminRoute>
        ),
      },

      // 🟢 Member Protected Routes
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
            <MemberAnnouncements />
          </MemberRoute>
        ),
      },
    ],
  },
]);

export default router;
