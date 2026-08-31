import { useState, useEffect, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect admins to admin panel automatically
      if (user.role === "admin" || user.role === "manager" || user.role === "staff") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/account", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) { setError("Please enter your email."); return; }
    if (!password) { setError("Please enter your password."); return; }

    try {
      const loggedInUser = await login({ email: cleanEmail, password });
      const from = (location.state as { from?: string } | null)?.from;

      if (loggedInUser.role === "admin" || loggedInUser.role === "manager" || loggedInUser.role === "staff") {
        navigate(from || "/admin", { replace: true });
      } else {
        navigate(from || "/account", { replace: true });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Check your credentials.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FCFAF4] px-6 py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C98B4A]">
            WELCOME BACK
          </p>
          <h1 className="mt-3 font-serif text-5xl text-[#17382B]">
            Sign in to Jacral
          </h1>
          <p className="mt-4 text-[#718078]">
            Access your account, orders and checkout.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-[#E5E0D5] bg-white p-7 shadow-sm md:p-9"
        >
          <label className="block text-sm font-medium text-[#17382B]">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#DCD7CB] px-4 py-3 outline-none focus:border-[#17382B]"
              placeholder="you@example.com"
            />
          </label>

          <label className="mt-5 block text-sm font-medium text-[#17382B]">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#DCD7CB] px-4 py-3 outline-none focus:border-[#17382B]"
              placeholder="Your password"
            />
          </label>

          {error && (
            <div role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="mt-7 w-full rounded-full bg-[#17382B] px-6 py-4 font-semibold text-white transition hover:bg-[#285642] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm text-[#718078]">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[#17382B]">
              Create one
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-gray-400">
            Admin?{" "}
            <Link to="/admin/login" className="text-[#17382B] font-medium hover:underline">
              Go to Admin Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}