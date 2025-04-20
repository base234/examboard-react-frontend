import React from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import ExamLayout from "@/layouts/ExamLayout";
import ExamLogin from "@/pages/exams/ExamLogin";
import ExamDashboard from "@/pages/exams/ExamDashboard";

const ExamRoutes = [
  {
    path: "/exams",
    element: (
      <AuthProvider>
        <ExamLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/exams/login" replace />,
      },
      {
        path: "login",
        element: <ExamLogin />,
      },
      {
        path: "dashboard",
        element: <ExamDashboard />,
      },
    ],
  },
];

export default ExamRoutes;
