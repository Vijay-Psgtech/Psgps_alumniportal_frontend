import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAutoLogout from "../hooks/useAutoLogout";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  useAutoLogout();

  if (authLoading) return null;

  if (!user) return <Navigate to="/alumni/login" replace />;

  if (user.isApproved !== true)
    return <Navigate to="/alumni/register" replace />;

  return children;
};

export default ProtectedRoute;
