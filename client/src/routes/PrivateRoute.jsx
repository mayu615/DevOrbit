import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    // login ke baad wapas iss page par aane ke liye "state.from" set kar rahe hain
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
