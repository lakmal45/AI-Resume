import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  UserCircle,
} from "lucide-react";
import Button from "./ui/Button";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ FIX 1: Check token whenever location changes (navigating from Login -> Dashboard)
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
  }, [location]);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Click Outside Dropdown
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
    setToken(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Templates", href: "/#templates" },
    { name: "Pricing", href: "/#pricing" },
  ];

  // ✅ FIX 2: Identify if user is on the dashboard to hide nav links
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-card/80 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <FileText className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="font-bold text-xl text-foreground">ResumeAI</span>
          </Link>

          {/* Desktop Navigation - Hidden on Dashboard */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          {/* Right Side: Auth Logic */}
          <div className="hidden md:flex items-center gap-4">
            {!token ? (
              // --- LOGGED OUT STATE ---
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero">Get Started Free</Button>
                </Link>
              </>
            ) : (
              // --- LOGGED IN STATE (User Dropdown) ---
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  <User className="h-5 w-5" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-border mb-2">
                      <p className="text-sm font-medium text-foreground">
                        My Account
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/settings");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>

                    <div className="h-px bg-border my-2" />

                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur-lg rounded-lg mb-4 p-4 shadow-xl border border-border animate-in slide-in-from-top-5">
            <div className="flex flex-col gap-4">
              {/* ✅ Hide links on mobile dashboard as well */}
              {!isDashboard &&
                navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}

              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {!token ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="hero" className="w-full">
                        Get Started Free
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                    >
                      <UserCircle className="h-4 w-4" /> Profile
                    </button>
                    <button
                      onClick={onLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
