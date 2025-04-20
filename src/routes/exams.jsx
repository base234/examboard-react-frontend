import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ExamLogin from "@/pages/exams/ExamLogin";
import { useAuth } from "@/contexts/AuthContext";

const ExamRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/exams/dashboard" replace /> : <ExamLogin />
        }
      />
      {/* Add more exam-related routes here */}
    </Routes>
  );
};

export default ExamRoutes;
