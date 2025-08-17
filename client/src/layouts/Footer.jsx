import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-8">
      <div className="container-app py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-sm">
          © {new Date().getFullYear()} DevOrbit. All rights reserved.
        </p>
        <nav className="flex gap-4 text-sm">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/jobs" className="hover:underline">
            Jobs
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
        </nav>
      </div>
    </footer>
  );
}
