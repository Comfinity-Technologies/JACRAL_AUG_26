import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ListOrdered,
  Tag,
  Tags,
  LogOut,
  BarChart3,
} from "lucide-react";

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "manager" && user.role !== "staff")) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Orders", path: "/admin/orders", icon: ListOrdered },
    { name: "Products", path: "/admin/products", icon: ShoppingBag },
    { name: "Categories", path: "/admin/categories", icon: Tags },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  if (user.role === "admin" || user.role === "manager") {
    navItems.push({ name: "Users", path: "/admin/users", icon: Users });
  }

  if (user.role === "admin") {
    navItems.push({ name: "Coupons", path: "/admin/coupons", icon: Tag });
  }

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#17382B] text-white flex-shrink-0 flex flex-col min-h-screen">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-wide">JACRAL</h1>
          <p className="text-xs text-white/50 mt-1">Admin Panel</p>
        </div>

        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C98B4A] flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-white/50 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive(item.path)
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
