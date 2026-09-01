import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminCouponsPage from "./pages/admin/AdminCouponsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminMFASetupPage from "./pages/admin/AdminMFASetupPage";

const router = createBrowserRouter([
  { path: "/login", element: <AdminLoginPage /> },
  { path: "/admin/login", element: <Navigate to="/login" replace /> },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "analytics", element: <AdminAnalyticsPage /> },
      { path: "clients", element: <div className="p-8"><h1 className="text-2xl font-bold">Clients</h1></div> },
      { path: "integrations", element: <div className="p-8"><h1 className="text-2xl font-bold">Integrations</h1></div> },
      { path: "services", element: <div className="p-8"><h1 className="text-2xl font-bold">Services</h1></div> },
      { path: "security", element: <div className="p-8"><h1 className="text-2xl font-bold">Security</h1></div> },
      { path: "audit-logs", element: <div className="p-8"><h1 className="text-2xl font-bold">Audit Logs</h1></div> },
      { path: "settings", element: <AdminMFASetupPage /> },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}