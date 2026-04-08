import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-brand-800 p-10 text-white">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-brand-100">Multi-user quiz platform</p>
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            Track quizzes, scores, and performance from one clean dashboard.
          </h1>
          <p className="max-w-md text-brand-100">
            Students can take quizzes at the same time while admins monitor attempts, top performers, and platform-wide results.
          </p>
        </div>
        <div className="p-10">
          <h2 className="text-3xl font-semibold text-slate-900">Login</h2>
          <p className="mt-2 text-slate-600">Use your account to continue.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-600">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-brand-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

