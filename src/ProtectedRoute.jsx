import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    console.log("User role:", user);

    // Redirect to user's dashboard if they try to access an unauthorized role's route
    if (user.role === "teacher") {
      return <Navigate to="/dashboard" />;
    }

    if(user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
