import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    switch(user.role) {
      case 'teacher':
        return <Navigate to="/dashboard" />;
      case 'admin':
        return <Navigate to="/admin/dashboard" />;
      case 'writer':
        return <Navigate to="/writer/dashboard" />;
      default:
        return <Navigate to="/dashboard" />;
    }
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
