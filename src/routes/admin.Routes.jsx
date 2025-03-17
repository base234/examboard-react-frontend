// Admin Routes (Accessible only if role is "admin")

import { Navigate } from "react-router-dom";

import AdminLayout from "@/layouts/AdminLayout";

import AdminIndex from "@/pages/admin/AdminIndex.jsx";
import Dashboard from "@/pages/admin/AdminIndex/Dashboard.jsx";

import ProtectedRoute from "@/ProtectedRoute";

const AuthRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <AdminIndex />,
        children: [
          {
            path: "/admin/dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
];

export default AuthRoutes;
