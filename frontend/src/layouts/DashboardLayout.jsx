import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false); // mobile sidebar

  const menuItems = [
    { label: "Resumes", icon: "📄", path: "/dashboard" },
    { label: "LinkedIn Import", icon: "👤", path: "/linkedin-import" },
    { label: "Settings", icon: "⚙️", path: "#" },
    { label: "Billing", icon: "💳", path: "#" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-white">
      {/* ====================== MOBILE TOP BAR ====================== */}
      <div className="md:hidden w-full flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => setOpen(!open)} className="text-xl">
          ☰
        </button>

        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* ====================== LEFT SIDEBAR ======================= */}
      <aside
        className={`
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          fixed md:static top-0 left-0 z-40
          w-60 h-full
          bg-white border-r border-gray-200
          p-6 md:block
          transition-transform
          min-h-screen
        `}
      >
        <div className="flex items-center justify-between md:block">
          <h1 className="text-xl font-bold mb-6 tracking-tight">Dashboard</h1>

          <button className="md:hidden text-xl" onClick={() => setOpen(false)}>
            ✖
          </button>
        </div>

        <nav className="space-y-2 text-sm">
          {menuItems.map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 transition
                ${
                  isActive(item.path)
                    ? "bg-purple-500 text-white"
                    : "hover:bg-purple-100"
                }
              `}
            >
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                {item.icon}
              </motion.span>
              {item.label}
            </motion.button>
          ))}

          {/* LOGOUT 
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/login")}
            className="w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-red-500 hover:bg-red-50"
          >
            🚪 Logout
          </motion.button>*/}
        </nav>
      </aside>

      {/* ====================== MAIN CONTENT ====================== */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

//min-h-screen
