import { NavLink } from "react-router-dom";
import { ShoppingBag, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E0D6] bg-[#FCFAF4]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-xl font-bold tracking-[1.35em] text-[#17382B]"
        >
          JACRAL
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive
                ? "text-[#17382B]"
                : "text-[#52645D] hover:text-[#17382B]"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive
                ? "text-[#17382B]"
                : "text-[#52645D] hover:text-[#17382B]"
              }`
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium transition-colors ${isActive
                ? "text-[#17382B]"
                : "text-[#52645D] hover:text-[#17382B]"
              }`
            }
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
            <span>Cart</span>
          </NavLink>

          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium transition-colors ${isActive
                ? "text-[#17382B]"
                : "text-[#52645D] hover:text-[#17382B]"
              }`
            }
          >
            <User size={18} strokeWidth={1.8} />
            <span>Account</span>
          </NavLink>
        </nav>

        {/* Mobile Navigation */}
        <nav className="flex items-center gap-4 md:hidden">
          <NavLink
            to="/shop"
            className="text-[#17382B]"
            aria-label="Shop"
          >
            Shop
          </NavLink>

          <NavLink
            to="/cart"
            className="text-[#17382B]"
            aria-label="Cart"
          >
            <ShoppingBag size={21} strokeWidth={1.8} />
          </NavLink>

          <NavLink
            to="/account"
            className="text-[#17382B]"
            aria-label="Account"
          >
            <User size={21} strokeWidth={1.8} />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}