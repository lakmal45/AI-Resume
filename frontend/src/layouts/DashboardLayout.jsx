import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Sparkles,
  Settings,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  SquareKanban,
  Menu,
  X,
  MessageCircleQuestion,
  FileScan,
  FilePlusCorner,
  ChevronLeft,
  ChevronRight,
  Bell,
  Zap,
  Crown,
  Moon,
  Sun,
  PenTool,
  Briefcase,
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const sidebarLinks = [
    { name: "Dashboard",       href: "/dashboard",       icon: LayoutDashboard },
    { name: "My Resumes",      href: "/my-resumes",      icon: FileText },
    { name: "LinkedIn Import", href: "/linkedin-import", icon: FilePlusCorner },
    { name: "Job Scanner",     href: "/jobscanner",      icon: FileScan },
    { name: "ATS Analyzer",    href: "/atsanalyzer",     icon: SquareKanban },
    { name: "Interview Guide", href: "/interview-guide", icon: MessageCircleQuestion },
    { name: "Cover Letter",    href: "/cover-letter",    icon: PenTool },
    { name: "Job Tracker",     href: "/job-tracker",     icon: Briefcase },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    setUserMenuOpen(false);
    navigate("/");
  };

  const currentPage =
    sidebarLinks.find((l) => l.href === location.pathname)?.name ||
    "Dashboard";

  return (
    <>
      <style>{`
        /* ─── Dashboard Layout Styles ─────────────────────────────────── */
        .dl-root {
          min-height: 100vh;
          display: flex;
          width: 100%;
          background: var(--c-bg);
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: var(--c-dark);
        }

        /* Ambient background blobs */
        .dl-root::before {
          content: '';
          position: fixed;
          top: -20%;
          left: -10%;
          width: 60vw;
          height: 60vh;
          background: radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .dl-root::after {
          content: '';
          position: fixed;
          bottom: -20%;
          right: -10%;
          width: 50vw;
          height: 50vh;
          background: radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ─── SIDEBAR ─────────────────────────────────────────────────── */
        .dl-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 260px;
          background: var(--c-card);
          border-right: 1px solid var(--c-border);
          display: flex;
          flex-direction: column;
          z-index: 40;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1);
          overflow: visible;
          box-shadow: 4px 0 24px rgba(0,0,0,0.04);
        }
        .dl-sidebar.collapsed {
          width: 72px;
        }
        @media (max-width: 768px) {
          .dl-sidebar {
            transform: translateX(-100%);
            width: 260px !important;
          }
          .dl-sidebar.mobile-open {
            transform: translateX(0);
          }
        }

        /* Logo area */
        .dl-logo-area {
          height: 68px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          border-bottom: 1px solid var(--c-border);
          gap: 12px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .collapsed .dl-logo-area {
          justify-content: center;
          padding: 0 16px;
        }
        .dl-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(99,102,241,0.3);
        }
        .dl-logo-text {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.2s, width 0.3s;
        }
        .collapsed .dl-logo-text {
          opacity: 0;
          width: 0;
        }

        /* ── Floating edge toggle ──────────────────────── */
        .dl-edge-toggle {
          position: absolute;
          top: 22px;
          right: -14px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--c-card);
          border: 1.5px solid var(--c-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--c-muted-txt);
          z-index: 50;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .dl-edge-toggle:hover {
          background: #6366f1;
          color: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 3px 12px rgba(99,102,241,0.35);
          transform: scale(1.1);
        }
        .dl-edge-toggle svg {
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        @media (max-width: 768px) {
          .dl-edge-toggle { display: none; }
        }

        /* Nav section label */
        .dl-nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-muted-txt);
          padding: 20px 20px 8px;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.2s;
        }
        .collapsed .dl-nav-label { opacity: 0; }

        /* Nav */
        .dl-nav {
          flex: 1;
          padding: 8px 12px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .dl-nav::-webkit-scrollbar { width: 4px; }
        .dl-nav::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .dl-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: 10px;
          margin-bottom: 2px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: var(--c-muted-txt);
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          white-space: nowrap;
          overflow: hidden;
        }
        .dl-nav-item:hover {
          color: var(--c-dark);
          background: var(--c-bg);
        }
        .dl-nav-item.active {
          color: #6366f1;
          background: linear-gradient(135deg, rgba(99,102,241,0.09), rgba(6,182,212,0.06));
          border: 1px solid rgba(99,102,241,0.18);
          box-shadow: 0 2px 8px rgba(99,102,241,0.08);
        }
        .dl-nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          border-radius: 0 3px 3px 0;
          background: linear-gradient(to bottom, #6366f1, #06b6d4);
        }
        .dl-nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        .dl-nav-text {
          transition: opacity 0.2s;
          overflow: hidden;
        }
        .collapsed .dl-nav-text { opacity: 0; width: 0; }

        /* Tooltip for collapsed state */
        .dl-nav-item:hover .dl-nav-tooltip {
          opacity: 1;
          transform: translateX(0);
        }
        .dl-nav-tooltip {
          display: none;
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%) translateX(-8px);
          background: #1e293b;
          color: #f8fafc;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 13px;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.2s;
          border: 1px solid rgba(99,102,241,0.2);
          pointer-events: none;
          z-index: 100;
        }
        .collapsed .dl-nav-item:hover .dl-nav-tooltip { display: block; }

        /* Upgrade card */
        .dl-upgrade-card {
          margin: 12px;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(99,102,241,0.07), rgba(6,182,212,0.05));
          border: 1px solid rgba(99,102,241,0.15);
          transition: opacity 0.2s, max-height 0.3s;
          overflow: hidden;
        }
        .collapsed .dl-upgrade-card {
          opacity: 0;
          max-height: 0;
          margin: 0;
          padding: 0;
          border: none;
        }
        .dl-upgrade-title {
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .dl-upgrade-desc {
          font-size: 12px;
          color: var(--c-muted-txt);
          margin-bottom: 12px;
        }
        .dl-upgrade-bar {
          height: 4px;
          border-radius: 4px;
          background: #e2e8f0;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .dl-upgrade-bar-fill {
          height: 100%;
          width: 33%;
          border-radius: 4px;
          background: linear-gradient(to right, #6366f1, #06b6d4);
        }
        .dl-upgrade-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          color: white;
          font-size: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .dl-upgrade-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ─── TOPBAR ──────────────────────────────────────────────────── */
        .dl-topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          height: 68px;
          background: var(--c-card);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--c-border);
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 16px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
        }
        .dl-topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }
        .dl-mobile-menu-btn {
          display: none;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--c-muted-txt);
        }
        @media (max-width: 768px) {
          .dl-mobile-menu-btn { display: flex; }
        }
        .dl-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dl-breadcrumb-home {
          font-size: 13px;
          color: var(--c-muted-txt);
        }
        .dl-breadcrumb-sep {
          color: #cbd5e1;
          font-size: 14px;
        }
        .dl-breadcrumb-current {
          font-size: 15px;
          font-weight: 600;
          color: var(--c-dark);
        }
        @media (max-width: 480px) {
          .dl-breadcrumb-home, .dl-breadcrumb-sep { display: none; }
        }

        .dl-topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Icon button */
        .dl-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--c-muted-txt);
          transition: all 0.2s;
          position: relative;
          text-decoration: none;
        }
        .dl-icon-btn:hover { background: #ede9fe; color: #6366f1; border-color: #c7d2fe; }

        .dl-notif-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f43f5e;
          border: 2px solid #ffffff;
        }

        /* Avatar button */
        .dl-avatar-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 10px 5px 5px;
          border-radius: 12px;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          cursor: pointer;
          transition: all 0.2s;
        }
        .dl-avatar-btn:hover { background: #ede9fe; border-color: #c7d2fe; }
        .dl-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .dl-avatar-name {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }
        @media (max-width: 480px) {
          .dl-avatar-name { display: none; }
        }
        .dl-avatar-chevron {
          color: var(--c-muted-txt);
          transition: transform 0.2s;
        }
        .dl-avatar-btn:hover .dl-avatar-chevron { color: #6366f1; }

        /* User dropdown */
        .dl-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 220px;
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(99,102,241,0.06);
          z-index: 100;
          overflow: hidden;
          animation: dropdownIn 0.18s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dl-dropdown-header {
          padding: 14px 16px;
          border-bottom: 1px solid var(--c-border);
          background: linear-gradient(135deg, rgba(99,102,241,0.04), rgba(6,182,212,0.03));
        }
        .dl-dropdown-user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--c-dark);
        }
        .dl-dropdown-user-email {
          font-size: 12px;
          color: var(--c-muted-txt);
          margin-top: 2px;
        }
        .dl-dropdown-body { padding: 6px; }
        .dl-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          color: var(--c-muted-txt);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .dl-dropdown-item:hover { background: var(--c-bg); color: var(--c-dark); }
        .dl-dropdown-item.danger:hover { background: rgba(239,68,68,0.06); color: #ef4444; }
        .dl-dropdown-divider { height: 1px; background: var(--c-bg); margin: 4px 0; }

        /* ─── MAIN CONTENT ────────────────────────────────────────────── */
        .dl-content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 260px;
          transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }
        .dl-content-wrapper.collapsed { margin-left: 72px; }
        @media (max-width: 768px) {
          .dl-content-wrapper { margin-left: 0 !important; }
        }

        .dl-main {
          flex: 1;
          padding: 28px;
          overflow-y: auto;
        }
        @media (max-width: 640px) {
          .dl-main { padding: 16px; }
        }

        /* Mobile overlay */
        .dl-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 39;
          display: none;
        }
        @media (max-width: 768px) {
          .dl-mobile-overlay { display: block; }
        }
      `}</style>

      <div className="dl-root">
        {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────── */}
        <aside className={`dl-sidebar ${isCollapsed ? "collapsed" : ""}`}>
          {/* Floating edge toggle */}
          <button
            className="dl-edge-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>

          {/* Logo */}
          <div className="dl-logo-area">
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
              }}
            >
              <div className="dl-logo-icon">
                <FileText size={18} color="white" />
              </div>
              <span className="dl-logo-text">ResumeAI</span>
            </Link>
          </div>

          {/* Navigation */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            <div className="dl-nav-label">Navigation</div>
            <nav className="dl-nav">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`dl-nav-item ${isActive ? "active" : ""}`}
                    title={isCollapsed ? link.name : ""}
                  >
                    <Icon className="dl-nav-icon" />
                    <span className="dl-nav-text">{link.name}</span>
                    {isCollapsed && (
                      <span className="dl-nav-tooltip">{link.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Upgrade card */}
          <div className="dl-upgrade-card">
            <div className="dl-upgrade-title">
              <Crown size={14} /> Free Plan
            </div>
            <div className="dl-upgrade-desc">1 of 3 resumes used</div>
            <div className="dl-upgrade-bar">
              <div className="dl-upgrade-bar-fill" />
            </div>
            <button className="dl-upgrade-btn">
              <Zap size={13} /> Upgrade to Pro
            </button>
          </div>
        </aside>

        {/* ── MOBILE SIDEBAR ──────────────────────────────────────────── */}
        {isSidebarOpen && (
          <>
            <div
              className="dl-mobile-overlay"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="dl-sidebar mobile-open">
              <div className="dl-logo-area">
                <div className="dl-logo-icon">
                  <FileText size={18} color="white" />
                </div>
                <span className="dl-logo-text">ResumeAI</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                <div className="dl-nav-label">Navigation</div>
                <nav className="dl-nav">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`dl-nav-item ${isActive ? "active" : ""}`}
                      >
                        <Icon className="dl-nav-icon" />
                        <span className="dl-nav-text">{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="dl-upgrade-card">
                <div className="dl-upgrade-title">
                  <Crown size={14} /> Free Plan
                </div>
                <div className="dl-upgrade-desc">1 of 3 resumes used</div>
                <div className="dl-upgrade-bar">
                  <div className="dl-upgrade-bar-fill" />
                </div>
                <button className="dl-upgrade-btn">
                  <Zap size={13} /> Upgrade to Pro
                </button>
              </div>
            </aside>
          </>
        )}

        {/* ── MAIN WRAPPER ────────────────────────────────────────────── */}
        <div className={`dl-content-wrapper ${isCollapsed ? "collapsed" : ""}`}>
          {/* Top Bar */}
          <header className="dl-topbar">
            <div className="dl-topbar-left">
              <button
                className="dl-mobile-menu-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>
              <div className="dl-breadcrumb">
                <span className="dl-breadcrumb-home">ResumeAI</span>
                <span className="dl-breadcrumb-sep">/</span>
                <span className="dl-breadcrumb-current">{currentPage}</span>
              </div>
            </div>

            <div className="dl-topbar-right">
              {/* Theme Toggle */}
              <button
                className="dl-icon-btn"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Notification */}
              <Link to="/dashboard/settings" className="dl-icon-btn">
                <Bell size={17} />
                <span className="dl-notif-dot" />
              </Link>

              {/* Settings */}
              <Link to="/dashboard/settings" className="dl-icon-btn">
                <Settings size={17} />
              </Link>

              {/* User menu */}
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  className="dl-avatar-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="dl-avatar">
                    <User size={16} color="white" />
                  </div>
                  <span className="dl-avatar-name">My Account</span>
                  <ChevronLeft
                    size={14}
                    className="dl-avatar-chevron"
                    style={{
                      transform: userMenuOpen
                        ? "rotate(90deg)"
                        : "rotate(-90deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                {userMenuOpen && (
                  <div className="dl-dropdown">
                    <div className="dl-dropdown-header">
                      <div className="dl-dropdown-user-name">
                        Welcome back 👋
                      </div>
                      <div className="dl-dropdown-user-email">
                        Free Plan · 1 resume
                      </div>
                    </div>
                    <div className="dl-dropdown-body">
                      <Link
                        to="/profile"
                        className="dl-dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={15} />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="dl-dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={15} />
                        Settings
                      </Link>
                      <div className="dl-dropdown-divider" />
                      <button
                        className="dl-dropdown-item danger"
                        onClick={onLogout}
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="dl-main">
            {/* Subtle grid overlay */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
