import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";
import { Menu, X, Home, Briefcase, MessageCircle, Bell, User } from "lucide-react";

export default function Header() {
  const { user, logout, loading } = useAuthContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
     ${isActive ? "bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-md" 
     : "text-slate-700 hover:text-teal-600 hover:bg-teal-50"}`;

  if (loading) {
    return (
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full bg-white shadow-sm z-50"
      >
        <div className="container-app flex items-center justify-between h-16">
          <Link to="/" className="text-lg font-bold text-teal-700">
            DevHire
          </Link>
          <span className="text-slate-500 text-sm">Loading...</span>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200"
    >
      <div className="container-app flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-teal-600 to-green-500 bg-clip-text text-transparent">
          DevHire
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLink to="/" className={navLinkClass}>
            <Home size={18} /> Home
          </NavLink>
          <NavLink to="/jobs" className={navLinkClass}>
            <Briefcase size={18} /> Jobs
          </NavLink>

          {user && (
            <>
              <NavLink to="/messaging" className={navLinkClass}>
                <MessageCircle size={18} /> Messages
              </NavLink>
              <NavLink to="/notifications" className={navLinkClass}>
                <Bell size={18} /> Notifications
              </NavLink>
              <NavLink to={`/profile/${user._id}`} className={navLinkClass}>
                <User size={18} /> Profile
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg"
            >
              Logout
            </motion.button>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl text-slate-700"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white border-t border-gray-200 shadow-md flex flex-col px-4 py-3 space-y-2"
        >
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            <Home size={18} /> Home
          </NavLink>
          <NavLink to="/jobs" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            <Briefcase size={18} /> Jobs
          </NavLink>
          {user && (
            <>
              <NavLink to="/messaging" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                <MessageCircle size={18} /> Messages
              </NavLink>
              <NavLink to="/notifications" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                <Bell size={18} /> Notifications
              </NavLink>
              <NavLink to={`/profile/${user._id}`} onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                <User size={18} /> Profile
              </NavLink>
            </>
          )}
          {!user ? (
            <>
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg"
            >
              Logout
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}
