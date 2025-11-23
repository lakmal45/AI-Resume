import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ? "text-primary-500" : "text-base-subt";

  return (
    <header className="sticky top-0 z-20 bg-base-card/95 backdrop-blur border-b border-base-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
            AI
          </div>
          <Link to="/" className="font-semibold text-base-text">
            AI Resume Builder
          </Link>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          {token && (
            <>
              <Link to="/dashboard" className={isActive("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/profile" className={isActive("/profile")}>
                Profile
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 text-sm">
          {!token ? (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded-lg border border-base-border text-base-subt hover:bg-base-bg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-hover"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={onLogout}
              className="px-3 py-1 rounded-lg border border-base-border text-base-subt hover:bg-base-bg"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
