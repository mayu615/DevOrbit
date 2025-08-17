import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function Header() {
  const { user, logout, loading } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-teal-600 text-white"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  if (loading) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-app flex items-center justify-between h-16">
          <Link to="/" className="text-lg font-semibold text-teal-700">
            DevHire
          </Link>
          <nav className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">Loading...</span>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-app flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold text-teal-700">
          DevHire
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>

          {user && (
            <>
              <NavLink to="/post-job" className={navLinkClass}>
                Post Job
              </NavLink>
              <NavLink to="/messaging" className={navLinkClass}>
                Messages
              </NavLink>
              <NavLink to="/notifications" className={navLinkClass}>
                Notifications
              </NavLink>
              <NavLink to={`/profile/${user._id}`} className={navLinkClass}>
                Profile
              </NavLink>
            </>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
