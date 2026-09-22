import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAutoLogout from "../hooks/useAutoLogout";

const ProtectedAdminRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  useAutoLogout();

  if (authLoading) return null;

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/alumni/profile" replace />;
  }

  if (user.isApproved !== true) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
