import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [token]);

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path ? "text-purple-500" : "text-base-subt";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-base-card/95 backdrop-blur border-b border-base-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* LEFT LOGO */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-lg">
            🧾
          </div>
          <h1 className="text-lg font-semibold">
            <Link to="/">AI Resume Builder</Link>
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 text-sm relative">
          {/* ================= LOGGED OUT ================= */}
          {!token ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-black">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {/* PROFILE ICON + DROPDOWN WRAPPER */}
              <div ref={dropdownRef} className="relative">
                {/* PROFILE ICON */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center"
                >
                  🧑
                </button>

                {/* DROPDOWN */}
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-44 bg-white border border-base-border rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/settings");
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                    >
                      Settings
                    </button>

                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
