import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-bold text-brand-800">
            QuizMaster
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-700">
            <Link to="/">Dashboard</Link>
            {user?.role === "admin" && <Link to="/admin">Admin</Link>}
            <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-800">
              {user?.name}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

