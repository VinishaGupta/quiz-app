import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg rounded-[32px] bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Create account</h1>
        <p className="mt-2 text-slate-600">Start taking quizzes and tracking your scores.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
            required
          />
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
            className="w-full rounded-2xl bg-brand-700 px-4 py-3 font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

