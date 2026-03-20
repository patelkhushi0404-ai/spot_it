import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useNotifications from "../../hooks/useNotifications";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isLanding = location.pathname === "/";
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => await logout();

  const navBg =
    isLanding && !scrolled
      ? "bg-transparent"
      : "bg-navy-700 border-b border-slate-700 shadow-lg";

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 via-green-500 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              SpotIT
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Public */}
            {!user && (
              <>
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors ${isActive("/") ? "text-orange-400" : "text-slate-300 hover:text-orange-400"}`}
                >
                  Home
                </Link>
                <a
                  href="/#about"
                  className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
                >
                  About
                </a>
                <a
                  href="/#flow"
                  className="text-sm font-medium text-slate-300 hover:text-green-400 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="/#rewards"
                  className="text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors"
                >
                  Rewards
                </a>
                <a
                  href="/#recent"
                  className="text-sm font-medium text-slate-300 hover:text-green-400 transition-colors"
                >
                  Recent Reports
                </a>
              </>
            )}

            {/* User */}
            {user && user.role === "user" && (
              <>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors ${isActive("/profile") ? "text-orange-400" : "text-slate-300 hover:text-orange-400"}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/spot-now"
                  className={`text-sm font-medium transition-colors ${isActive("/spot-now") ? "text-green-400" : "text-slate-300 hover:text-green-400"}`}
                >
                  Spot Now
                </Link>
                <Link
                  to="/rewards"
                  className={`text-sm font-medium transition-colors ${isActive("/rewards") ? "text-orange-400" : "text-slate-300 hover:text-orange-400"}`}
                >
                  Rewards
                </Link>

                <Link
                  to="/query"
                  className={`text-sm font-medium transition-colors ${isActive("/query") ? "text-blue-400" : "text-slate-300 hover:text-blue-400"}`}
                >
                  Query
                </Link>
              </>
            )}

            {/* Admin */}
            {user && user.role === "admin" && (
              <>
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors ${isActive("/admin") ? "text-orange-400" : "text-slate-300 hover:text-orange-400"}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/reports"
                  className={`text-sm font-medium transition-colors ${isActive("/admin/reports") ? "text-green-400" : "text-slate-300 hover:text-green-400"}`}
                >
                  Reports
                </Link>
                <Link
                  to="/admin/workers"
                  className={`text-sm font-medium transition-colors ${isActive("/admin/workers") ? "text-blue-400" : "text-slate-300 hover:text-blue-400"}`}
                >
                  Workers
                </Link>
                <Link
                  to="/admin/users"
                  className={`text-sm font-medium transition-colors ${isActive("/admin/users") ? "text-orange-400" : "text-slate-300 hover:text-orange-400"}`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/rewards"
                  className={`text-sm font-medium transition-colors ${isActive("/admin/rewards") ? "text-green-400" : "text-slate-300 hover:text-green-400"}`}
                >
                  Rewards
                </Link>
                <Link
                  to="/admin/queries"
                  className={`text-sm font-medium transition-colors ${isActive("/admin/queries") ? "text-blue-400" : "text-slate-300 hover:text-blue-400"}`}
                >
                  Queries
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Not logged in */}
            {!user && (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-1.5 px-4"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Logged in */}
            {user && (
              <div className="flex items-center gap-3">
                {/* Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      const opening = !showNotifications;
                      setShowNotifications(opening);
                      if (opening) {
                        notifications.forEach((n) => {
                          if (!n.read) markRead(n._id);
                        });
                      }
                    }}
                    className="relative p-2 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-navy-700 rounded-xl shadow-xl border border-slate-700 z-50">
                      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="font-semibold text-white">
                          Notifications
                        </h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-sm">
                            🔔 No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => markRead(n._id)}
                              className={`p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors ${!n.read ? "border-l-4 border-l-orange-400" : ""}`}
                            >
                              <p className="text-sm text-slate-200">
                                {n.message}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1 text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg
                className="w-5 h-5 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {showMobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-navy-700 border-t border-slate-700 py-4 space-y-1">
            {!user && (
              <>
                <Link
                  to="/"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700 rounded-lg"
                >
                  Home
                </Link>
                <a
                  href="/#flow"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-green-400 hover:bg-slate-700 rounded-lg"
                >
                  How It Works
                </a>
                <a
                  href="/#about"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg"
                >
                  About
                </a>
                <a
                  href="/#rewards"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700 rounded-lg"
                >
                  Rewards
                </a>
                <a
                  href="/#recent"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-green-400 hover:bg-slate-700 rounded-lg"
                >
                  Recent Reports
                </a>

                <div className="px-4 pt-3 flex gap-2">
                  <Link
                    to="/login"
                    className="btn-secondary text-sm py-1.5 px-4 flex-1 text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm py-1.5 px-4 flex-1 text-center"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}

            {user && user.role === "user" && (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  to="/spot-now"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-green-400 hover:bg-slate-700 rounded-lg"
                >
                  Spot Now
                </Link>
                <Link
                  to="/rewards"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700 rounded-lg"
                >
                  Rewards
                </Link>
                
                <Link
                  to="/query"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg"
                >
                  Query
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}

            {user && user.role === "admin" && (
              <>
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/reports"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-green-400 hover:bg-slate-700 rounded-lg"
                >
                  Reports
                </Link>
                <Link
                  to="/admin/workers"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg"
                >
                  Workers
                </Link>
                <Link
                  to="/admin/users"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700 rounded-lg"
                >
                  Users
                </Link>
                <Link
                  to="/admin/rewards"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-green-400 hover:bg-slate-700 rounded-lg"
                >
                  Rewards
                </Link>
                <Link
                  to="/admin/queries"
                  className="block px-4 py-2 text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg"
                >
                  Queries
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
