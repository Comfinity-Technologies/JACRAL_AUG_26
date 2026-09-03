import { Link } from "react-router-dom";
import { Leaf, Mail, MapPin, Phone, Share2, Globe } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2C221E] text-white">

      {/* ── NEWSLETTER STRIP ── */}
      <div className="border-b border-white/8 px-6 py-12">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3
              className="text-2xl md:text-3xl text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Stay in the loop.
            </h3>
            <p className="text-white/55 text-sm mt-1">
              New arrivals, recipes & seasonal offers — direct to you.
            </p>
          </div>
          <form
            className="flex gap-3 w-full md:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 md:w-72 rounded-full bg-white/10 border border-white/15 px-5 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-[#E88D36] transition"
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              className="btn-cta rounded-full px-6 py-3 text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B6E4C]">
                <Leaf size={16} className="text-white" strokeWidth={1.8} />
              </div>
              <span
                className="text-xl tracking-[0.2em] font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                JACRAL
              </span>
            </div>
            <p
              className="text-[#E88D36] text-lg leading-relaxed mb-3"
              style={{ fontFamily: "var(--font-script)" }}
            >
              From nature, to your table.
            </p>
            <p className="text-sm text-white/50 leading-[1.8]">
              JACRAL brings quality jackfruit products and wholesome cereals,
              naturally prepared for everyday living.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-2.5">
              {[
                { icon: <Globe size={16} />, href: "#", label: "Website" },
                { icon: <Share2 size={16} />, href: "#", label: "Share" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/60 hover:bg-[#E88D36] hover:text-white transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-white/40">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop All" },
                { to: "/shop?category=Jackfruit", label: "Jackfruit Products" },
                { to: "/shop?category=Cereals", label: "Cereals & Grains" },
                { to: "/account", label: "My Account" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-[#E88D36] transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-white/40">
              Policies
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/policy/privacy", label: "Privacy Policy" },
                { to: "/policy/terms", label: "Terms of Service" },
                { to: "/policy/shipping", label: "Shipping Policy" },
                { to: "/policy/return", label: "Return & Refund Policy" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-[#E88D36] transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-white/40">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/account", label: "Track Order" },
                { to: "/cart", label: "Shopping Cart" },
                { to: "/checkout", label: "Checkout" },
                { to: "/login", label: "Login / Register" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-[#E88D36] transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-white/40">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-[#E88D36]" />
                Kerala, India
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={15} className="flex-shrink-0 text-[#E88D36]" />
                +91 00000 00000
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={15} className="flex-shrink-0 text-[#E88D36]" />
                hello@jacral.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/8 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs text-white/30 sm:flex-row">
          <p>© {year} JACRAL. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/policy/privacy" className="hover:text-white/60 transition">Privacy Policy</Link>
            <Link to="/policy/terms" className="hover:text-white/60 transition">Terms of Service</Link>
            <Link to="/policy/shipping" className="hover:text-white/60 transition">Shipping Policy</Link>
            <Link to="/policy/return" className="hover:text-white/60 transition">Return & Refund</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}